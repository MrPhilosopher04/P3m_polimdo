const { PrismaClient, Status } = require('@prisma/client');
const prisma = new PrismaClient();
const { sendResponse, sendError } = require('../utils/response');

const pengumumanController = {
  // [GET] /api/pengumuman
  getAll: async (req, res) => {
    try {
      const { page = 1, limit = 10, search = '', status, kategori } = req.query;

      const pageInt = Math.max(parseInt(page), 1);
      const limitInt = Math.max(parseInt(limit), 1);
      const skip = (pageInt - 1) * limitInt;

      const where = {
        ...(status ? { status } : {}),
        ...(kategori ? { kategori } : {}),
        ...(search ? {
          OR: [
            { judul: { contains: search, mode: 'insensitive' } },
            { konten: { contains: search, mode: 'insensitive' } }
          ]
        } : {})
      };

      const [items, total] = await Promise.all([
        prisma.pengumuman.findMany({
          where,
          skip,
          take: limitInt,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.pengumuman.count({ where }),
      ]);

      sendResponse(res, 'Data pengumuman berhasil diambil', {
        data: items,
        pagination: {
          page: pageInt,
          limit: limitInt,
          total,
          pages: Math.ceil(total / limitInt),
        }
      });

    } catch (err) {
      console.error(err);
      sendError(res, 'Gagal mengambil data', 500);
    }
  },

  // [GET] /api/pengumuman/:id
  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const pengumuman = await prisma.pengumuman.findUnique({
        where: { id: parseInt(id) }
      });

      if (!pengumuman) return sendError(res, 'Pengumuman tidak ditemukan', 404);

      sendResponse(res, 'Detail pengumuman ditemukan', { pengumuman });
    } catch (err) {
      console.error(err);
      sendError(res, 'Gagal mengambil data', 500);
    }
  },

  // [POST] /api/pengumuman
  create: async (req, res) => {
    try {
      const { judul, konten, kategori } = req.body;

      if (!judul || !konten || !kategori) {
        return sendError(res, 'Semua field wajib diisi', 400);
      }

      const newItem = await prisma.pengumuman.create({
        data: {
          judul,
          konten,
          kategori,
          status: Status.AKTIF,
        }
      });

      sendResponse(res, 'Pengumuman berhasil dibuat', { pengumuman: newItem }, 201);
    } catch (err) {
      console.error(err);
      sendError(res, 'Gagal membuat pengumuman', 500);
    }
  },

  // [PUT] /api/pengumuman/:id
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { judul, konten, kategori, status } = req.body;

      const data = { judul, konten, kategori, status };

      const updated = await prisma.pengumuman.update({
        where: { id: parseInt(id) },
        data,
      });

      sendResponse(res, 'Pengumuman berhasil diupdate', { pengumuman: updated });
    } catch (err) {
      console.error(err);
      if (err.code === 'P2025') return sendError(res, 'Pengumuman tidak ditemukan', 404);
      sendError(res, 'Gagal mengupdate', 500);
    }
  },

  // [DELETE] /api/pengumuman/:id
  delete: async (req, res) => {
    try {
      const { id } = req.params;

      await prisma.pengumuman.delete({ where: { id: parseInt(id) } });

      sendResponse(res, 'Pengumuman berhasil dihapus');
    } catch (err) {
      console.error(err);
      if (err.code === 'P2025') return sendError(res, 'Pengumuman tidak ditemukan', 404);
      sendError(res, 'Gagal menghapus', 500);
    }
  },

  // [PATCH] /api/pengumuman/:id/status
  updateStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!Object.values(Status).includes(status)) {
        return sendError(res, 'Status tidak valid', 400);
      }

      const updated = await prisma.pengumuman.update({
        where: { id: parseInt(id) },
        data: { status },
      });

      sendResponse(res, 'Status berhasil diperbarui', { pengumuman: updated });
    } catch (err) {
      console.error(err);
      if (err.code === 'P2025') return sendError(res, 'Pengumuman tidak ditemukan', 404);
      sendError(res, 'Gagal mengupdate status', 500);
    }
  },
};

module.exports = pengumumanController;
