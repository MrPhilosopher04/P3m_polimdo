//server/controllers/jurusanController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const jurusanController = {
  // Get all jurusan
  getAllJurusan: async (req, res) => {
    try {
      console.log('Fetching all jurusan...');
      
      const jurusan = await prisma.jurusan.findMany({
        include: {
          prodis: {
            select: {
              id: true,
              nama: true
            }
          },
          _count: {
            select: {
              users: true,
              prodis: true
            }
          }
        },
        orderBy: {
          nama: 'asc'
        }
      });

      console.log(`Found ${jurusan.length} jurusan records`);
      
      return res.status(200).json({
        success: true,
        message: 'Data jurusan berhasil diambil',
        data: jurusan
      });
    } catch (error) {
      console.error('Error fetching jurusan:', error);
      return res.status(500).json({
        success: false,
        message: 'Gagal mengambil data jurusan',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  // Get jurusan by ID
  getJurusanById: async (req, res) => {
    try {
      const { id } = req.params;
      const jurusanId = parseInt(id);
      
      console.log(`Fetching jurusan with ID: ${jurusanId}`);
      
      if (isNaN(jurusanId) || jurusanId <= 0) {
        return res.status(400).json({
          success: false,
          message: 'ID jurusan tidak valid'
        });
      }
      
      const jurusan = await prisma.jurusan.findUnique({
        where: { id: jurusanId },
        include: {
          prodis: {
            select: {
              id: true,
              nama: true
            },
            orderBy: {
              nama: 'asc'
            }
          },
          users: {
            select: {
              id: true,
              nama: true,
              email: true,
              role: true
            },
            orderBy: {
              nama: 'asc'
            }
          },
          _count: {
            select: {
              users: true,
              prodis: true
            }
          }
        }
      });

      if (!jurusan) {
        return res.status(404).json({
          success: false,
          message: 'Jurusan tidak ditemukan'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Data jurusan berhasil diambil',
        data: jurusan
      });
    } catch (error) {
      console.error('Error fetching jurusan by ID:', error);
      return res.status(500).json({
        success: false,
        message: 'Gagal mengambil data jurusan',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  // Get prodi by jurusan ID
  getProdiByJurusan: async (req, res) => {
    try {
      const { id } = req.params;
      const jurusanId = parseInt(id);
      
      console.log(`Fetching prodi for jurusan ID: ${jurusanId}`);
      
      if (isNaN(jurusanId) || jurusanId <= 0) {
        return res.status(400).json({
          success: false,
          message: 'ID jurusan tidak valid'
        });
      }
      
      // Check if jurusan exists
      const jurusanExists = await prisma.jurusan.findUnique({
        where: { id: jurusanId }
      });

      if (!jurusanExists) {
        return res.status(404).json({
          success: false,
          message: 'Jurusan tidak ditemukan'
        });
      }

      const prodis = await prisma.prodi.findMany({
        where: { jurusanId: jurusanId },
        select: {
          id: true,
          nama: true,
          jurusanId: true,
          jurusan: {
            select: {
              id: true,
              nama: true
            }
          }
        },
        orderBy: {
          nama: 'asc'
        }
      });

      return res.status(200).json({
        success: true,
        message: 'Data prodi berhasil diambil',
        data: prodis
      });
    } catch (error) {
      console.error('Error fetching prodi by jurusan:', error);
      return res.status(500).json({
        success: false,
        message: 'Gagal mengambil data prodi',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  // Create jurusan
  createJurusan: async (req, res) => {
    try {
      const { nama } = req.body;

      if (!nama || !nama.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Nama jurusan harus diisi',
          errors: { nama: 'Nama jurusan harus diisi' }
        });
      }

      const trimmedNama = nama.trim();
      
      if (trimmedNama.length < 3) {
        return res.status(400).json({
          success: false,
          message: 'Nama jurusan minimal 3 karakter',
          errors: { nama: 'Nama jurusan minimal 3 karakter' }
        });
      }

      if (trimmedNama.length > 100) {
        return res.status(400).json({
          success: false,
          message: 'Nama jurusan maksimal 100 karakter',
          errors: { nama: 'Nama jurusan maksimal 100 karakter' }
        });
      }

      // Check if jurusan already exists (case-insensitive)
      const existingJurusan = await prisma.jurusan.findFirst({
        where: { 
          nama: {
            equals: trimmedNama,
            mode: 'insensitive'
          }
        }
      });

      if (existingJurusan) {
        return res.status(400).json({
          success: false,
          message: 'Jurusan sudah ada',
          errors: { nama: 'Jurusan dengan nama ini sudah ada' }
        });
      }

      const jurusan = await prisma.jurusan.create({
        data: { nama: trimmedNama },
        include: {
          prodis: {
            select: {
              id: true,
              nama: true
            }
          },
          _count: {
            select: {
              users: true,
              prodis: true
            }
          }
        }
      });

      return res.status(201).json({
        success: true,
        message: 'Jurusan berhasil dibuat',
        data: jurusan
      });
    } catch (error) {
      console.error('Error creating jurusan:', error);
      return res.status(500).json({
        success: false,
        message: 'Gagal membuat jurusan',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  // Update jurusan
  updateJurusan: async (req, res) => {
    try {
      const { id } = req.params;
      const { nama } = req.body;
      const jurusanId = parseInt(id);

      if (isNaN(jurusanId) || jurusanId <= 0) {
        return res.status(400).json({
          success: false,
          message: 'ID jurusan tidak valid'
        });
      }

      if (!nama || !nama.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Nama jurusan harus diisi',
          errors: { nama: 'Nama jurusan harus diisi' }
        });
      }

      const trimmedNama = nama.trim();
      
      if (trimmedNama.length < 3) {
        return res.status(400).json({
          success: false,
          message: 'Nama jurusan minimal 3 karakter',
          errors: { nama: 'Nama jurusan minimal 3 karakter' }
        });
      }

      if (trimmedNama.length > 100) {
        return res.status(400).json({
          success: false,
          message: 'Nama jurusan maksimal 100 karakter',
          errors: { nama: 'Nama jurusan maksimal 100 karakter' }
        });
      }

      // Check if jurusan exists
      const existingJurusan = await prisma.jurusan.findUnique({
        where: { id: jurusanId }
      });

      if (!existingJurusan) {
        return res.status(404).json({
          success: false,
          message: 'Jurusan tidak ditemukan'
        });
      }

      // PERBAIKAN: Gunakan raw query untuk case-insensitive check
      const duplicateJurusan = await prisma.$queryRaw`
        SELECT * FROM "Jurusan" 
        WHERE LOWER(nama) = LOWER(${trimmedNama})
        AND id != ${jurusanId}
      `;

      if (duplicateJurusan.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Nama jurusan sudah ada',
          errors: { nama: 'Jurusan dengan nama ini sudah ada' }
        });
      }

      const jurusan = await prisma.jurusan.update({
        where: { id: jurusanId },
        data: { nama: trimmedNama },
        include: {
          prodis: {
            select: {
              id: true,
              nama: true
            }
          },
          _count: {
            select: {
              users: true,
              prodis: true
            }
          }
        }
      });

      return res.status(200).json({
        success: true,
        message: 'Jurusan berhasil diperbarui',
        data: jurusan
      });
    } catch (error) {
      console.error('Error updating jurusan:', error);
      return res.status(500).json({
        success: false,
        message: 'Gagal memperbarui jurusan',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  // Delete jurusan
  deleteJurusan: async (req, res) => {
    try {
      const { id } = req.params;
      const jurusanId = parseInt(id);

      if (isNaN(jurusanId) || jurusanId <= 0) {
        return res.status(400).json({
          success: false,
          message: 'ID jurusan tidak valid'
        });
      }

      // Check if jurusan exists
      const existingJurusan = await prisma.jurusan.findUnique({
        where: { id: jurusanId },
        include: {
          _count: {
            select: {
              users: true,
              prodis: true
            }
          }
        }
      });

      if (!existingJurusan) {
        return res.status(404).json({
          success: false,
          message: 'Jurusan tidak ditemukan'
        });
      }

      // Check if jurusan has users or prodis
      if (existingJurusan._count.users > 0 || existingJurusan._count.prodis > 0) {
        return res.status(400).json({
          success: false,
          message: 'Tidak dapat menghapus jurusan yang masih memiliki pengguna atau program studi'
        });
      }

      await prisma.jurusan.delete({
        where: { id: jurusanId }
      });

      return res.status(200).json({
        success: true,
        message: 'Jurusan berhasil dihapus'
      });
    } catch (error) {
      console.error('Error deleting jurusan:', error);
      return res.status(500).json({
        success: false,
        message: 'Gagal menghapus jurusan',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
};

module.exports = jurusanController;