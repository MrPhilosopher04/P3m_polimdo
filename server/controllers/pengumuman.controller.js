const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const pengumumanController = {
  // Get all pengumuman
  getAll: async (req, res) => {
    try {
      const { kategori, status = 'AKTIF', page = 1, limit = 10, search } = req.query;
      const offset = (page - 1) * limit;

      const where = { status };
      if (kategori) where.kategori = kategori;
      if (search) {
        where.OR = [
          { judul: { contains: search } },
          { konten: { contains: search } }
        ];
      }

      const [pengumumans, total] = await Promise.all([
        prisma.pengumuman.findMany({
          where,
          orderBy: [
            { prioritas: 'desc' },
            { createdAt: 'desc' }
          ],
          skip: offset,
          take: parseInt(limit)
        }),
        prisma.pengumuman.count({ where })
      ]);

      res.json({
        success: true,
        data: {
          pengumumans,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / limit)
          }
        }
      });

    } catch (error) {
      console.error('Get pengumuman error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  },

  // Get pengumuman by ID
  getById: async (req, res) => {
    try {
      const { id } = req.params;

      const pengumuman = await prisma.pengumuman.findUnique({
        where: { id: parseInt(id) }
      });

      if (!pengumuman) {
        return res.status(404).json({
          success: false,
          message: 'Pengumuman not found'
        });
      }

      res.json({
        success: true,
        data: { pengumuman }
      });

    } catch (error) {
      console.error('Get pengumuman by ID error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  },

  // Create pengumuman (Admin only)
  create: async (req, res) => {
    try {
      const { judul, konten, kategori, prioritas = 'normal' } = req.body;

      // Validation
      if (!judul || !konten || !kategori) {
        return res.status(400).json({
          success: false,
          message: 'Judul, konten, dan kategori wajib diisi'
        });
      }

      const pengumuman = await prisma.pengumuman.create({
        data: {
          judul,
          konten,
          kategori,
          prioritas,
          createdBy: req.user.id
        }
      });

      res.status(201).json({
        success: true,
        message: 'Pengumuman created successfully',
        data: { pengumuman }
      });

    } catch (error) {
      console.error('Create pengumuman error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  },

  // Update pengumuman (Admin only)
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { judul, konten, kategori, prioritas, status } = req.body;

      const existingPengumuman = await prisma.pengumuman.findUnique({
        where: { id: parseInt(id) }
      });

      if (!existingPengumuman) {
        return res.status(404).json({
          success: false,
          message: 'Pengumuman not found'
        });
      }

      const updateData = {};
      if (judul !== undefined) updateData.judul = judul;
      if (konten !== undefined) updateData.konten = konten;
      if (kategori !== undefined) updateData.kategori = kategori;
      if (prioritas !== undefined) updateData.prioritas = prioritas;
      if (status !== undefined) updateData.status = status;

      const pengumuman = await prisma.pengumuman.update({
        where: { id: parseInt(id) },
        data: updateData
      });

      res.json({
        success: true,
        message: 'Pengumuman updated successfully',
        data: { pengumuman }
      });

    } catch (error) {
      console.error('Update pengumuman error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  },

  // Delete pengumuman (Admin only)
  delete: async (req, res) => {
    try {
      const { id } = req.params;

      const existingPengumuman = await prisma.pengumuman.findUnique({
        where: { id: parseInt(id) }
      });

      if (!existingPengumuman) {
        return res.status(404).json({
          success: false,
          message: 'Pengumuman not found'
        });
      }

      await prisma.pengumuman.delete({
        where: { id: parseInt(id) }
      });

      res.json({
        success: true,
        message: 'Pengumuman deleted successfully'
      });

    } catch (error) {
      console.error('Delete pengumuman error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  },

  // Update status pengumuman (Admin only)
  updateStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!['AKTIF', 'NONAKTIF'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Status harus AKTIF atau NONAKTIF'
        });
      }

      const pengumuman = await prisma.pengumuman.update({
        where: { id: parseInt(id) },
        data: { status }
      });

      res.json({
        success: true,
        message: 'Status pengumuman updated successfully',
        data: { pengumuman }
      });

    } catch (error) {
      if (error.code === 'P2025') {
        return res.status(404).json({
          success: false,
          message: 'Pengumuman not found'
        });
      }
      
      console.error('Update status pengumuman error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
};

module.exports = pengumumanController;