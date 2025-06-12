const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { prisma } = require('../config/database');
const { sendResponse, sendError } = require('../utils/response');
const { validateEmail, validatePhoneNumber } = require('../utils/validator');
const { USER_ROLES, STATUS } = require('../utils/constants');

const authController = {
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return sendError(res, 'Email dan password wajib diisi', 400);
      }

      if (!validateEmail(email)) {
        return sendError(res, 'Format email tidak valid', 400);
      }

      const user = await prisma.user.findUnique({ where: { email } });

      if (!user || !(await bcrypt.compare(password, user.password))) {
        return sendError(res, 'Email atau password salah', 401);
      }

      if (user.status !== STATUS.AKTIF) {
        return sendError(res, 'Akun tidak aktif', 403);
      }

      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role,
          nama: user.nama
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      const { password: _, ...safeUser } = user;

      sendResponse(res, 'Login berhasil', { user: safeUser, token });
    } catch (error) {
      console.error('Login error:', error);
      sendError(res, 'Terjadi kesalahan server', 500);
    }
  },

  profile: async (req, res) => {
    try {
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
          id_sinta: true,
          status: true,
          bidang_keahlian: true,
          jurusan: true,
          createdAt: true,
          updatedAt: true
        }
      });

      if (!user) {
        return sendError(res, 'User tidak ditemukan', 404);
      }

      sendResponse(res, 'Profil berhasil diambil', { user });
    } catch (error) {
      console.error('Profile error:', error);
      sendError(res, 'Terjadi kesalahan server', 500);
    }
  },

  updateProfile: async (req, res) => {
    try {
      const {
        nama,
        no_telp,
        id_sinta,
        bidang_keahlian,
        jurusan
      } = req.body;

      if (!nama) {
        return sendError(res, 'Nama wajib diisi', 400);
      }

      if (no_telp && !validatePhoneNumber(no_telp)) {
        return sendError(res, 'Format nomor telepon tidak valid', 400);
      }

      const updateData = {
        nama,
        no_telp: no_telp || null,
        id_sinta: id_sinta || null,
        bidang_keahlian: bidang_keahlian || null,
        
        jurusanId: jurusan || null
      };

      const updatedUser = await prisma.user.update({
        where: { id: req.user.id },
        data: updateData,
        select: {
          id: true,
          nip: true,
          nim: true,
          nama: true,
          email: true,
          role: true,
          no_telp: true,
          id_sinta: true,
          status: true,
          bidang_keahlian: true,
          
          jurusan: true
        }
      });

      sendResponse(res, 'Profil berhasil diperbarui', { user: updatedUser });
    } catch (error) {
      console.error('Update profile error:', error);
      if (error.code === 'P2025') {
        return sendError(res, 'User tidak ditemukan', 404);
      }
      sendError(res, 'Terjadi kesalahan server', 500);
    }
  },

  changePassword: async (req, res) => {
    try {
      const { currentPassword, newPassword, confirmPassword } = req.body;

      if (!currentPassword || !newPassword || !confirmPassword) {
        return sendError(res, 'Semua field password wajib diisi', 400);
      }

      if (newPassword !== confirmPassword) {
        return sendError(res, 'Password baru dan konfirmasi password tidak cocok', 400);
      }

      if (newPassword.length < 8) {
        return sendError(res, 'Password minimal 8 karakter', 400);
      }

      const user = await prisma.user.findUnique({ where: { id: req.user.id } });

      if (!user) {
        return sendError(res, 'User tidak ditemukan', 404);
      }

      const isValidPassword = await bcrypt.compare(currentPassword, user.password);
      if (!isValidPassword) {
        return sendError(res, 'Password saat ini salah', 400);
      }

      const hashedNewPassword = await bcrypt.hash(newPassword, 10);

      await prisma.user.update({
        where: { id: req.user.id },
        data: { password: hashedNewPassword }
      });

      sendResponse(res, 'Password berhasil diubah');
    } catch (error) {
      console.error('Change password error:', error);
      if (error.code === 'P2025') {
        return sendError(res, 'User tidak ditemukan', 404);
      }
      sendError(res, 'Terjadi kesalahan server', 500);
    }
  },

  deactivateAccount: async (req, res) => {
    try {
      const { password } = req.body;

      if (!password) {
        return sendError(res, 'Password wajib diisi', 400);
      }

      const user = await prisma.user.findUnique({ where: { id: req.user.id } });

      if (!user) {
        return sendError(res, 'User tidak ditemukan', 404);
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return sendError(res, 'Password salah', 400);
      }

      await prisma.user.update({
        where: { id: req.user.id },
        data: { status: STATUS.NONAKTIF }
      });

      sendResponse(res, 'Akun berhasil dinonaktifkan');
    } catch (error) {
      console.error('Deactivate account error:', error);
      if (error.code === 'P2025') {
        return sendError(res, 'User tidak ditemukan', 404);
      }
      sendError(res, 'Terjadi kesalahan server', 500);
    }
  }
};

module.exports = authController;
