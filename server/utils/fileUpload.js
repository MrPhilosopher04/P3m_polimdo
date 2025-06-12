const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Tentukan base upload directory pakai path absolut
const baseUploadDir = path.resolve(__dirname, '../../uploads');
const proposalDir = path.join(baseUploadDir, 'proposals');
const documentDir = path.join(baseUploadDir, 'documents');
const profileDir = path.join(baseUploadDir, 'profile');

// Pastikan direktori upload ada
const createUploadDirs = () => {
  [baseUploadDir, proposalDir, documentDir, profileDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Created directory: ${dir}`);
    }
  });
};

// Inisialisasi folder upload saat server start
createUploadDirs();

// Storage configuration untuk proposal
const proposalStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, proposalDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    // Sanitasi nama file agar aman
    const name = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9-_]/g, '_');
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${name}-${uniqueSuffix}${ext}`);
  }
});

// Storage configuration untuk dokumen
const documentStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, documentDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9-_]/g, '_');
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${name}-${uniqueSuffix}${ext}`);
  }
});

// Storage configuration untuk gambar profil
const profileStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, profileDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `profile-${uniqueSuffix}${ext}`);
  }
});

// Filter file dokumen yang diperbolehkan
const documentFileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('File type not allowed. Only PDF, Word, Excel, and PowerPoint files are allowed.'));
  }
};

// Filter file gambar yang diperbolehkan
const imageFileFilter = (req, file, cb) => {
  const allowedTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif'
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('File type not allowed. Only JPEG, JPG, PNG, and GIF images are allowed.'));
  }
};

// Multer upload untuk proposal
const uploadProposal = multer({
  storage: proposalStorage,
  fileFilter: documentFileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

// Multer upload untuk dokumen
const uploadDocument = multer({
  storage: documentStorage,
  fileFilter: documentFileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

// Multer upload untuk gambar profil
const uploadImage = multer({
  storage: profileStorage,
  fileFilter: imageFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// Helper hapus file dengan pengecekan
const deleteFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`Deleted file: ${filePath}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
};

// Mendapatkan info file yang diupload
const getFileInfo = (file) => ({
  originalName: file.originalname,
  filename: file.filename,
  path: file.path,
  size: file.size,
  mimetype: file.mimetype
});

// Format ukuran file supaya mudah dibaca
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Middleware untuk handle error multer di route (gunakan di Express route setelah upload)
const multerErrorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Error dari multer, misal file size limit
    return res.status(400).json({ success: false, message: err.message });
  } else if (err) {
    // Error lain dari fileFilter atau lainnya
    return res.status(400).json({ success: false, message: err.message });
  }
  next();
};

module.exports = {
  uploadProposal,
  uploadDocument,
  uploadImage,
  deleteFile,
  getFileInfo,
  formatFileSize,
  createUploadDirs,
  multerErrorHandler
};
