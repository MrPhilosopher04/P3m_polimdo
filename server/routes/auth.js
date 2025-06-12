const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const { sendSuccess, sendError } = require('../utils/response');
const { verifyToken } = require('../middlewares/auth');
const { USER_ROLES } = require('../utils/constants');
const { validateEmail, validatePhoneNumber } = require('../utils/validation');

// === LOGIN ===
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendError(res, 'Email dan password wajib diisi', 400);
    }

    if (!validateEmail(email)) {
      return sendError(res, 'Format email tidak valid', 400);
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !user.password) {
      return sendError(res, 'Email atau password salah', 401);
    }

    if (user.status !== 'AKTIF') {
      return sendError(res, 'Akun tidak aktif', 403);
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return sendError(res, 'Email atau password salah', 401);
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role, nama: user.nama },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    const { password: _, ...userWithoutPassword } = user;
    sendSuccess(res, 'Login berhasil', { user: userWithoutPassword, token });

  } catch (error) {
    console.error('Login error:', error);
    if (error.code === 'P1001') {
      return sendError(res, 'Koneksi database gagal', 503);
    }
    sendError(res, 'Login gagal', 500);
  }
});

// === REGISTER ===
router.post('/register', async (req, res) => {
  try {
    const {
      nama, email, password, role = USER_ROLES.DOSEN,
      nip, nim, no_telp, bidang_keahlian,
      jurusanId, prodiId
    } = req.body;

    if (!nama || !email || !password) {
      return sendError(res, 'Nama, email, dan password wajib diisi', 400);
    }

    if (!validateEmail(email)) {
      return sendError(res, 'Format email tidak valid', 400);
    }

    if ((role === USER_ROLES.DOSEN || role === USER_ROLES.REVIEWER) && !nip) {
      return sendError(res, 'NIP wajib diisi untuk dosen dan reviewer', 400);
    }

    if (role === USER_ROLES.MAHASISWA && !nim) {
      return sendError(res, 'NIM wajib diisi untuk mahasiswa', 400);
    }

    const whereClause = {
      OR: [{ email }]
    };
    if (role === USER_ROLES.MAHASISWA && nim) {
      whereClause.OR.push({ nim });
    } else if (nip) {
      whereClause.OR.push({ nip });
    }

    const existingUser = await prisma.user.findFirst({ where: whereClause });
    if (existingUser) {
      let conflictField = 'Email';
      if (existingUser.nip && existingUser.nip === nip) conflictField = 'NIP';
      if (existingUser.nim && existingUser.nim === nim) conflictField = 'NIM';
      return sendError(res, `${conflictField} sudah terdaftar`, 400);
    }

    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const userData = {
      nama,
      email,
      password: hashedPassword,
      role,
      status: 'AKTIF',
      no_telp: no_telp || null,
      bidang_keahlian: bidang_keahlian || null,
      jurusanId: jurusanId || null,
      prodiId: prodiId || null,
    };

    if (role === USER_ROLES.MAHASISWA) {
      userData.nim = nim;
    } else {
      userData.nip = nip;
    }

    const user = await prisma.user.create({ data: userData });
    const { password: _, ...userWithoutPassword } = user;

    sendSuccess(res, 'Registrasi berhasil', userWithoutPassword, 201);

  } catch (error) {
    console.error('Register error:', error);

    if (error.code === 'P2002') {
      return sendError(res, 'Email atau NIP/NIM sudah digunakan', 400);
    }

    sendError(res, 'Registrasi gagal', 500);
  }
});

// === PROFILE ===
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        jurusan: true,
        prodi: true
      }
    });

    if (!user) {
      return sendError(res, 'User tidak ditemukan', 404);
    }

    const { password: _, ...userWithoutPassword } = user;
    sendSuccess(res, 'Profil berhasil diambil', { user: userWithoutPassword });
  } catch (error) {
    console.error('Profile error:', error);
    sendError(res, 'Terjadi kesalahan server', 500);
  }
});

// === LOGOUT ===
router.post('/logout', verifyToken, (req, res) => {
  try {
    // Token deletion handled by client (e.g., remove from storage)
    sendSuccess(res, 'Logout berhasil');
  } catch (error) {
    console.error('Logout error:', error);
    sendError(res, 'Logout gagal', 500);
  }
});

module.exports = router;
