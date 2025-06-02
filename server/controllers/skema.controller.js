// server/controllers/skema.controller.js
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const skemaController = {
  // Get all active skema
  getAll: async (req, res) => {
    try {
      const { kategori, status = 'AKTIF' } = req.query;
      
      const where = { status };
      if (kategori) where.kategori = kategori;

      const skemas = await prisma.skema.findMany({
        where,
        include: {
          _count: {
            select: { proposals: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      });

      res.json({
        success: true,
        data: { skemas }
      });

    } catch (error) {
      console.error('Get skemas error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  },

  // Get single skema
  getById: async (req, res) => {
    try {
      const { id } = req.params;

      const skema = await prisma.skema.findUnique({
        where: { id: parseInt(id) },
        include: {
          proposals: {
            include: {
              ketua: {
                select: { id: true, nama: true, email: true }
              }
            },
            orderBy: { createdAt: 'desc' }
          }
        }
      });

      if (!skema) {
        return res.status(404).json({
          success: false,
          message: 'Skema not found'
        });
      }

      res.json({
        success: true,
        data: { skema }
      });

    } catch (error) {
      console.error('Get skema error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  },

  // Create skema (Admin only)
  create: async (req, res) => {
    try {
      const {
        kode,
        nama,
        kategori,
        luaran_wajib,
        luaran_tambahan,
        dana_min,
        dana_max,
        batas_anggota,
        tahun_aktif,
        tanggal_buka,
        tanggal_tutup
      } = req.body;

      // Check if kode already exists
      const existingSkema = await prisma.skema.findUnique({
        where: { kode }
      });

      if (existingSkema) {
        return res.status(400).json({
          success: false,
          message: 'Skema code already exists'
        });
      }

      const skema = await prisma.skema.create({
        data: {
          kode,
          nama,
          kategori,
          luaran_wajib,
          luaran_tambahan,
          dana_min: dana_min ? parseFloat(dana_min) : null,
          dana_max: dana_max ? parseFloat(dana_max) : null,
          batas_anggota: parseInt(batas_anggota) || 5,
          tahun_aktif,
          tanggal_buka: tanggal_buka ? new Date(tanggal_buka) : null,
          tanggal_tutup: tanggal_tutup ? new Date(tanggal_tutup) : null
        }
      });

      res.status(201).json({
        success: true,
        message: 'Skema created successfully',
        data: { skema }
      });

    } catch (error) {
      console.error('Create skema error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  },

  // Update skema (Admin only)
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      // Convert numeric fields
      if (updateData.dana_min) updateData.dana_min = parseFloat(updateData.dana_min);
      if (updateData.dana_max) updateData.dana_max = parseFloat(updateData.dana_max);
      if (updateData.batas_anggota) updateData.batas_anggota = parseInt(updateData.batas_anggota);
      if (updateData.tanggal_buka) updateData.tanggal_buka = new Date(updateData.tanggal_buka);
      if (updateData.tanggal_tutup) updateData.tanggal_tutup = new Date(updateData.tanggal_tutup);

      const skema = await prisma.skema.update({
        where: { id: parseInt(id) },
        data: updateData
      });

      res.json({
        success: true,
        message: 'Skema updated successfully',
        data: { skema }
      });

    } catch (error) {
      console.error('Update skema error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
};

module.exports = skemaController;
