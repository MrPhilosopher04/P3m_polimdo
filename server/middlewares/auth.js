const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { sendError } = require('../utils/response');
const { USER_ROLES } = require('../utils/constants');

// Middleware untuk verifikasi token
const verifyToken = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return sendError(res, 'Akses ditolak. Token tidak tersedia', 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Dapatkan user dari database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
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
        institusi: true,
        jurusan: true
      }
    });

    if (!user) {
      return sendError(res, 'User tidak ditemukan', 404);
    }

    if (user.status !== 'AKTIF') {
      return sendError(res, 'Akun tidak aktif', 403);
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return sendError(res, 'Token telah kadaluarsa', 401);
    }
    if (error.name === 'JsonWebTokenError') {
      return sendError(res, 'Token tidak valid', 401);
    }
    console.error('Authentication error:', error);
    return sendError(res, 'Autentikasi gagal', 401);
  }
};

// Middleware untuk mengecek peran pengguna
const checkRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendError(res, 'Autentikasi diperlukan', 401);
    }

    if (!roles.includes(req.user.role)) {
      return sendError(res, 'Akses ditolak. Izin tidak cukup', 403);
    }

    next();
  };
};

module.exports = {
  verifyToken,
  checkRole
};