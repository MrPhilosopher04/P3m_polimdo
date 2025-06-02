// server/routes/auth.js - DIPERBAIKI
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { sendSuccess, sendError } = require('../utils/response');
const { verifyToken } = require('../middlewares/auth'); 
const { USER_ROLES } = require('../utils/constants');

// PERBAIKAN: Import validation yang benar
const { validateEmail, validatePhoneNumber } = require('../utils/validation');

// Endpoint login - DIPERBAIKI
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('Login attempt for:', email); // Debug log

    // Validasi input
    if (!email || !password) {
      return sendError(res, 'Email dan password wajib diisi', 400);
    }
    
    if (!validateEmail(email)) {
      return sendError(res, 'Format email tidak valid', 400);
    }

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      console.log('User not found for email:', email); // Debug log
      return sendError(res, 'Email atau password salah', 401);
    }

    if (user.status !== 'AKTIF') {
      console.log('User not active:', email); // Debug log
      return sendError(res, 'Akun tidak aktif', 401);
    }

    if (!user.password) {
      console.log('User has no password:', email); // Debug log
      return sendError(res, 'Akun tidak memiliki password. Silakan gunakan metode login lain.', 401);
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      console.log('Invalid password for:', email); // Debug log
      return sendError(res, 'Email atau password salah', 401);
    }

    // PERBAIKAN: Tambahkan lebih banyak informasi dalam token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role,
        nama: user.nama
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    const { password: _, ...userWithoutPassword } = user;

    console.log('Login successful for:', email, 'Role:', user.role); // Debug log

    // PERBAIKAN: Pastikan response structure konsisten
    sendSuccess(res, 'Login berhasil', {
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    
    if (error.code === 'P1001') {
      return sendError(res, 'Koneksi database gagal. Silakan coba lagi nanti.', 503);
    }
    
    sendError(res, 'Login gagal', 500);
  }
});

// Endpoint registrasi - DIPERBAIKI
router.post('/register', async (req, res) => {
  try {
    const { 
      nama, 
      email, 
      password, 
      role = USER_ROLES.DOSEN, 
      nip, 
      nim, 
      no_telp, 
      bidang_keahlian, 
      institusi, 
      jurusan 
    } = req.body;

    console.log('Register attempt for:', email, 'Role:', role); // Debug log

    // Validasi input dasar
    if (!nama || !email || !password) {
      return sendError(res, 'Nama, email, dan password wajib diisi', 400);
    }

    if (!validateEmail(email)) {
      return sendError(res, 'Format email tidak valid', 400);
    }

    // Validasi berdasarkan role
    if ((role === USER_ROLES.DOSEN || role === USER_ROLES.REVIEWER) && !nip) {
      return sendError(res, 'NIP wajib diisi untuk dosen dan reviewer', 400);
    }
    
    if (role === USER_ROLES.MAHASISWA && !nim) {
      return sendError(res, 'NIM wajib diisi untuk mahasiswa', 400);
    }
    
    // Cek unik email dan identifier
    const whereClause = {
      OR: [{ email }]
    };

    if (role === USER_ROLES.MAHASISWA && nim) {
      whereClause.OR.push({ nim });
    } else if (nip) {
      whereClause.OR.push({ nip });
    }

    const existingUser = await prisma.user.findFirst({
      where: whereClause
    });
    
    if (existingUser) {
      let conflictField = 'Email';
      if (existingUser.nip && existingUser.nip === nip) conflictField = 'NIP';
      if (existingUser.nim && existingUser.nim === nim) conflictField = 'NIM';
      return sendError(res, `${conflictField} sudah terdaftar`, 400);
    }
    
    // Hash password
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Data user berdasarkan role
    const userData = {
      nama,
      email,
      password: hashedPassword,
      role,
      status: 'AKTIF',
      no_telp: no_telp || null,
      bidang_keahlian: bidang_keahlian || null,
      institusi: institusi || null,
      jurusan: jurusan || null
    };
    
    // Tambahkan field spesifik role
    if (role === USER_ROLES.MAHASISWA) {
      userData.nim = nim;
    } else {
      userData.nip = nip;
    }
    
    // Create user
    const user = await prisma.user.create({
      data: userData
    });
    
    // Hapus password dari response
    const { password: _, ...userWithoutPassword } = user;
    
    console.log('Registration successful for:', email); // Debug log
    
    sendSuccess(res, 'Registrasi berhasil', userWithoutPassword, 201);
  } catch (error) {
    console.error('Register error:', error);
    
    if (error.code === 'P2002') {
      return sendError(res, 'Email atau NIP/NIM sudah digunakan', 400);
    }
    
    sendError(res, 'Registrasi gagal', 500);
  }
});

// Endpoint profile - DIPERBAIKI (dengan middleware auth)
router.get('/profile', verifyToken, async (req, res) => {
  try {
    console.log('Profile request from user:', req.user.id); // Debug log
    
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        nip: true,
        nim: true,
        nama: true,
        email: true,
        role: true,
        no_telp: true,
        status: true,
        createdAt: true,
        bidang_keahlian: true,
        institusi: true,
        jurusan: true
      }
    });

    if (!user) {
      return sendError(res, 'User tidak ditemukan', 404);
    }

    sendSuccess(res, 'Profil berhasil diambil', { user });
  } catch (error) {
    console.error('Profile error:', error);
    sendError(res, 'Terjadi kesalahan server', 500);
  }
});

// PERBAIKAN: Tambahkan endpoint logout
router.post('/logout', verifyToken, async (req, res) => {
  try {
    // Untuk stateless JWT, logout hanya perlu response sukses
    // Client akan menghapus token dari localStorage
    sendSuccess(res, 'Logout berhasil');
  } catch (error) {
    console.error('Logout error:', error);
    sendError(res, 'Logout gagal', 500);
  }
});

module.exports = router;