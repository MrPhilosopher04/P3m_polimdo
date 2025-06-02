const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

const { generateUniqueFilename, ensureDirectoryExists } = require('../utils/helper');

// Allowed MIME types
const allowedMimeTypes = {
  documents: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  ],
  images: [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp'
  ]
};

// File size limits (in bytes)
const fileSizeLimits = {
  document: 10 * 1024 * 1024,
  image: 5 * 1024 * 1024,
  default: 10 * 1024 * 1024
};

// Storage config factory
const createStorage = (destination = 'uploads') => multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      const uploadPath = path.join(__dirname, '..', destination);
      await ensureDirectoryExists(uploadPath);
      cb(null, uploadPath);
    } catch (err) {
      cb(err);
    }
  },
  filename: (req, file, cb) => {
    try {
      const uniqueName = generateUniqueFilename(file.originalname);
      cb(null, uniqueName);
    } catch (err) {
      cb(err);
    }
  }
});

// File filter factory
const createFileFilter = (allowedTypes = []) => (req, file, cb) => {
  const types = allowedTypes.length > 0
    ? allowedTypes
    : [...allowedMimeTypes.documents, ...allowedMimeTypes.images];

  if (types.includes(file.mimetype)) {
    cb(null, true);
  } else {
    const error = new Error(`File type ${file.mimetype} not allowed.`);
    error.code = 'INVALID_FILE_TYPE';
    cb(error, false);
  }
};

// Upload middleware configurations
const uploadDocument = multer({
  storage: createStorage('uploads/documents'),
  limits: { fileSize: fileSizeLimits.document, files: 5 },
  fileFilter: createFileFilter(allowedMimeTypes.documents)
});

const uploadImage = multer({
  storage: createStorage('uploads/images'),
  limits: { fileSize: fileSizeLimits.image, files: 3 },
  fileFilter: createFileFilter(allowedMimeTypes.images)
});

const uploadGeneral = multer({
  storage: createStorage('uploads/general'),
  limits: { fileSize: fileSizeLimits.default, files: 10 },
  fileFilter: createFileFilter()
});

const uploadProposalDocument = multer({
  storage: createStorage('uploads/proposals'),
  limits: { fileSize: fileSizeLimits.document, files: 1 },
  fileFilter: createFileFilter([
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ])
});

// Error handler
const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    let message;
    switch (error.code) {
      case 'LIMIT_FILE_SIZE':
        message = 'File size too large. Max 10MB.';
        break;
      case 'LIMIT_FILE_COUNT':
        message = 'Too many files.';
        break;
      case 'LIMIT_UNEXPECTED_FILE':
        message = 'Unexpected file field.';
        break;
      default:
        message = `Upload error: ${error.message}`;
    }

    return res.status(400).json({ success: false, message });
  }

  if (error?.code === 'INVALID_FILE_TYPE') {
    return res.status(400).json({ success: false, message: error.message });
  }

  next(error);
};

// Uploaded files processor
const processUploadedFiles = (req, res, next) => {
  if (req.files) {
    const filesArray = Array.isArray(req.files) ? req.files : Object.values(req.files).flat();
    req.uploadedFiles = filesArray.map(file => ({
      fieldname: file.fieldname,
      originalname: file.originalname,
      filename: file.filename,
      mimetype: file.mimetype,
      size: file.size,
      path: file.path,
      relativePath: path.relative(path.join(__dirname, '..'), file.path)
    }));
  } else if (req.file) {
    req.uploadedFile = {
      fieldname: req.file.fieldname,
      originalname: req.file.originalname,
      filename: req.file.filename,
      mimetype: req.file.mimetype,
      size: req.file.size,
      path: req.file.path,
      relativePath: path.relative(path.join(__dirname, '..'), req.file.path)
    };
  }

  next();
};

// Cleanup helper
const cleanupUploadedFiles = async (files) => {
  if (!files) return;
  const toDelete = Array.isArray(files) ? files : [files];

  for (const file of toDelete) {
    try {
      await fs.unlink(file.path);
    } catch (err) {
      console.error('Failed to clean up file:', file.path, err);
    }
  }
};

// Validation middleware
const validateFileRequirements = (requirements = {}) => (req, res, next) => {
  const { required = false, maxSize, allowedTypes = [] } = requirements;

  const files = req.files
    ? (Array.isArray(req.files) ? req.files : Object.values(req.files).flat())
    : req.file ? [req.file] : [];

  if (required && files.length === 0) {
    return res.status(400).json({ success: false, message: 'File is required.' });
  }

  if (maxSize) {
    const oversized = files.find(f => f.size > maxSize);
    if (oversized) {
      return res.status(400).json({
        success: false,
        message: `File "${oversized.originalname}" exceeds ${Math.round(maxSize / 1024 / 1024)}MB`
      });
    }
  }

  if (allowedTypes.length > 0) {
    const invalid = files.find(f => !allowedTypes.includes(f.mimetype));
    if (invalid) {
      return res.status(400).json({
        success: false,
        message: `File type "${invalid.mimetype}" not allowed for file "${invalid.originalname}"`
      });
    }
  }

  next();
};

module.exports = {
  uploadDocument: uploadDocument.single('document'),
  uploadImage: uploadImage.single('image'),
  uploadGeneral: uploadGeneral.single('file'),
  uploadProposalDocument: uploadProposalDocument.single('proposalFile'),
  handleUploadError,
  processUploadedFiles,
  cleanupUploadedFiles,
  validateFileRequirements,
  allowedMimeTypes,
  fileSizeLimits
};
