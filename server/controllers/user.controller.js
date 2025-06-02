// server/controllers/user.controller.js
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { sendResponse, sendError } = require('../utils/response');
const { USER_ROLES, STATUS } = require('../utils/constants');

const userController = {
  getAll: async (req, res) => {
    try {
      const { role, status, search, page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;

      const where = {};
      if (role) where.role = role;
      if (status) where.status = status;
      if (search) {
        where.OR = [
          { nama: { contains: search } },
          { email: { contains: search } },
          { nip: { contains: search } }
        ];
      }

      const [users, total] = await Promise.all([
        prisma.user.findMany({
          where,
          select: {
            id: true,
            nip: true,
            nama: true,
            email: true,
            role: true,
            no_telp: true,
            id_sinta: true,
            status: true,
            createdAt: true,
            userJurusan: {
              include: { jurusan: true }
            },
            userProdi: {
              include: { prodi: true }
            },
            _count: {
              select: {
                proposals: true,
                reviews: true
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          skip: offset,
          take: parseInt(limit)
        }),
        prisma.user.count({ where })
      ]);

      sendResponse(res, 'Berhasil mendapatkan data pengguna', {
        users,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      });

    } catch (error) {
      console.error('Get users error:', error);
      sendError(res, 'Terjadi kesalahan server', 500);
    }
  },

  getReviewers: async (req, res) => {
    try {
      const reviewers = await prisma.user.findMany({
        where: {
          role: USER_ROLES.REVIEWER,
          status: STATUS.AKTIF
        },
        select: {
          id: true,
          nama: true,
          email: true,
          role: true,
          _count: {
            select: { reviewedProposals: true }
          }
        },
        orderBy: { nama: 'asc' }
      });

      sendResponse(res, 'Berhasil mendapatkan data reviewer', { reviewers });

    } catch (error) {
      console.error('Get reviewers error:', error);
      sendError(res, 'Terjadi kesalahan server', 500);
    }
  },

  create: async (req, res) => {
    try {
      const {
        nip,
        nim,
        nama,
        email,
        password,
        role,
        no_telp,
        no_rek,
        id_sinta,
        jurusanIds = [],
        prodiIds = []
      } = req.body;

      if (!Object.values(USER_ROLES).includes(role)) {
        return sendError(res, 'Role tidak valid', 400);
      }

      if (role === USER_ROLES.MAHASISWA && !nim) {
        return sendError(res, 'NIM wajib diisi untuk mahasiswa', 400);
      }

      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            { email },
            { nip }
          ]
        }
      });

      if (existingUser) {
        return sendError(res, 'Email atau NIP sudah terdaftar', 400);
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: {
          nip,
          nim: role === USER_ROLES.MAHASISWA ? nim : null,
          nama,
          email,
          password: hashedPassword,
          role,
          no_telp,
          no_rek,
          id_sinta,
          userJurusan: {
            create: jurusanIds.map(id => ({ jurusanId: parseInt(id) }))
          },
          userProdi: {
            create: prodiIds.map(id => ({ prodiId: parseInt(id) }))
          }
        },
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
          userJurusan: {
            include: { jurusan: true }
          },
          userProdi: {
            include: { prodi: true }
          }
        }
      });

      sendResponse(res, 'User berhasil dibuat', { user }, 201);

    } catch (error) {
      console.error('Create user error:', error);
      sendError(res, 'Terjadi kesalahan server', 500);
    }
  },

  updateStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!Object.values(STATUS).includes(status)) {
        return sendError(res, 'Status tidak valid', 400);
      }

      const user = await prisma.user.update({
        where: { id: parseInt(id) },
        data: { status },
        select: {
          id: true,
          nama: true,
          email: true,
          status: true
        }
      });

      sendResponse(res, 'Status user berhasil diperbarui', { user });

    } catch (error) {
      console.error('Update user status error:', error);
      sendError(res, 'Terjadi kesalahan server', 500);
    }
  }
};

module.exports = userController;
