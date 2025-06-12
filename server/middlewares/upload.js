const multer = require('multer');
const path = require('path');
const { sendError } = require('../utils/response');

// Konfigurasi penyimpanan sementara (temporary upload folder)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // folder upload temporary sesuai struktur kamu
    cb(null, path.join(__dirname, '..', 'uploads', 'temp'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// Filter file yang diizinkan
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'image/jpeg',
    'image/png'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Jenis file tidak didukung. Hanya PDF, DOC, DOCX, XLS, XLSX, JPEG, PNG yang diizinkan'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // maksimal 10MB
});

// Middleware untuk handle error multer
const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    
    if (err.code === 'LIMIT_FILE_SIZE') {
      return sendError(res, 'Ukuran file terlalu besar (maks 10MB)', 400);
    }
    return sendError(res, 'Terjadi kesalahan saat mengunggah file', 400);
  } else if (err) {
    return sendError(res, err.message || 'Terjadi kesalahan saat mengunggah file', 400);
  }
  next();
};


module.exports = {
  upload,
  handleUploadError
};
