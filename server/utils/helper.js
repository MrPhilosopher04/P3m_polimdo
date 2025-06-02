//server/utils/helper.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs').promises;
const path = require('path');
const { USER_ROLES } = require('./constants');

/**
 * Hash password using bcrypt
 */
const hashPassword = async (password) => {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
};

/**
 * Compare password with hash
 */
const comparePassword = async (password, hash) => {
  return bcrypt.compare(password, hash);
};

/**
 * Generate JWT token
 */
const generateToken = (payload, expiresIn = '24h') => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
};

/**
 * Verify JWT token
 */
const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

/**
 * Pagination helper
 */
const getPagination = (page = 1, limit = 10, total = 0) => {
  const currentPage = parseInt(page);
  const pageSize = parseInt(limit);
  const totalPages = Math.ceil(total / pageSize);
  const offset = (currentPage - 1) * pageSize;

  return {
    page: currentPage,
    limit: pageSize,
    total,
    pages: totalPages,
    offset,
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1,
  };
};

/**
 * Format standardized API response
 */
const formatResponse = (success = true, message = '', data = null, meta = null) => {
  const response = { success, message };
  if (data !== null) response.data = data;
  if (meta !== null) response.meta = meta;
  return response;
};

/**
 * Generate unique filename
 */
const generateUniqueFilename = (originalname) => {
  const ext = path.extname(originalname);
  const name = path.basename(originalname, ext).replace(/[^a-zA-Z0-9]/g, '_');
  const timestamp = Date.now();
  const random = Math.round(Math.random() * 1e9);
  return `${timestamp}-${random}-${name}${ext}`;
};

/**
 * Ensure directory exists
 */
const ensureDirectoryExists = async (dirPath) => {
  try {
    await fs.access(dirPath);
  } catch (error) {
    await fs.mkdir(dirPath, { recursive: true });
  }
};

/**
 * Delete file safely
 */
const deleteFile = async (filePath) => {
  try {
    await fs.unlink(filePath);
    return true;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
};

/**
 * Format file size
 */
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Validate mimetype
 */
const isValidFileType = (mimetype, allowedTypes = []) => {
  if (allowedTypes.length === 0) return true;
  return allowedTypes.includes(mimetype);
};

/**
 * Generate NIP/username by role
 */
const generateNIP = (role, year = new Date().getFullYear()) => {
  const roleCode = {
    [USER_ROLES.ADMIN]: '00',
    [USER_ROLES.DOSEN]: '01',
    [USER_ROLES.MAHASISWA]: '02',
    [USER_ROLES.REVIEWER]: '03'
  };
  const timestamp = Date.now().toString().slice(-6);
  return `${year}${roleCode[role] || '99'}${timestamp}`;
};

/**
 * Validate Indonesian phone number
 */
const isValidPhoneNumber = (phoneNumber) => {
  const phoneRegex = /^(\+62|62|0)8[1-9][0-9]{6,9}$/;
  return phoneRegex.test(phoneNumber);
};

/**
 * Format date to Indonesian format
 */
const formatDateIndonesian = (date) => {
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  const d = new Date(date);
  const day = d.getDate();
  const month = months[d.getMonth()];
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
};

/**
 * Calculate deadline status
 */
const getDeadlineStatus = (deadline) => {
  const now = new Date();
  const deadlineDate = new Date(deadline);
  const diffTime = deadlineDate - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return 'EXPIRED';
  if (diffDays === 0) return 'TODAY';
  if (diffDays <= 3) return 'URGENT';
  if (diffDays <= 7) return 'SOON';
  return 'NORMAL';
};

/**
 * Clean and sanitize text input
 */
const cleanText = (text) => {
  if (!text) return '';
  return text.trim().replace(/\s+/g, ' ').replace(/<[^>]*>/g, '');
};

/**
 * Generate random string
 */
const generateRandomString = (length = 10) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Ensure upload-related directories exist
 */
const ensureUploadDirs = async () => {
  const dirs = [
    process.env.UPLOAD_DIR,
    process.env.PROPOSAL_UPLOAD_PATH,
    process.env.DOCUMENT_UPLOAD_PATH,
    process.env.IMAGE_UPLOAD_PATH,
    process.env.TEMP_UPLOAD_PATH
  ].filter(Boolean);

  for (const dir of dirs) {
    try {
      await ensureDirectoryExists(dir);
      console.log(`Directory ensured: ${dir}`);
    } catch (error) {
      console.error(`Error creating directory ${dir}:`, error);
    }
  }
};

module.exports = {
  hashPassword,
  comparePassword,
  generateToken,
  verifyToken,
  getPagination,
  formatResponse,
  generateUniqueFilename,
  ensureDirectoryExists,
  deleteFile,
  formatFileSize,
  isValidFileType,
  generateNIP,
  isValidPhoneNumber,
  formatDateIndonesian,
  getDeadlineStatus,
  cleanText,
  generateRandomString,
  ensureUploadDirs
};
