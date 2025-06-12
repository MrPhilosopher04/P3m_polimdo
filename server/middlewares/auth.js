// =====================
// middlewares/auth.js (FIXED)
// =====================
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { errorResponse } = require('../utils/response'); // Fixed import name
const { USER_ROLES, USER_STATUS } = require('../utils/constants');

// Middleware untuk verifikasi token
const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
      return errorResponse(res, 'Akses ditolak. Token tidak tersedia', 401);
    }

    const token = authHeader.replace('Bearer ', '');
   
    if (!token) {
      return errorResponse(res, 'Akses ditolak. Token tidak valid', 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id || decoded.userId;
   
    if (!userId) {
      return errorResponse(res, 'Token tidak valid: ID tidak ditemukan', 401);
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        nama: true,
        email: true,
        role: true,
        status: true,
        nip: true,
        nim: true,
        no_telp: true,
        bidang_keahlian: true,
        jurusanId: true,
        prodiId: true,
        jurusan: {
          select: {
            id: true,
            nama: true
          }
        },
        prodi: {
          select: {
            id: true,
            nama: true
          }
        }
      }
    });

    if (!user) {
      return errorResponse(res, 'User tidak ditemukan', 404);
    }

    if (user.status !== USER_STATUS.AKTIF) {
      return errorResponse(res, 'Akun tidak aktif', 403);
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    
    if (error.name === 'TokenExpiredError') {
      return errorResponse(res, 'Token telah kadaluarsa', 401);
    }
    if (error.name === 'JsonWebTokenError') {
      return errorResponse(res, 'Token tidak valid', 401);
    }
    
    return errorResponse(res, 'Autentikasi gagal', 401);
  }
};

// Middleware untuk mengecek peran pengguna
const checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, 'Autentikasi diperlukan', 401);
    }

    console.log('🔍 User Role:', req.user.role);
    console.log('🔍 Allowed Roles:', allowedRoles);
   
    // Flatten array jika ada nested array
    const roles = allowedRoles.flat();
   
    if (!roles.includes(req.user.role)) {
      console.log('❌ Role check failed:', { userRole: req.user.role, allowedRoles: roles });
      return errorResponse(res, `Akses ditolak. Role ${req.user.role} tidak diizinkan`, 403);
    }
    
    console.log('✅ Role check passed');
    next();
  };
};

module.exports = {
  verifyToken,
  checkRole,
  authMiddleware: verifyToken,
  auth: verifyToken
};