//server/controllers/prodiController.js
const { PrismaClient } = require('@prisma/client');
const { successResponse, errorResponse } = require('../utils/response');

const prisma = new PrismaClient();

// Get all prodi
const getAllProdi = async (req, res) => {
  try {
    const prodi = await prisma.prodi.findMany({
      include: {
        jurusan: {
          select: {
            id: true,
            nama: true
          }
        },
        _count: {
          select: {
            users: true
          }
        }
      },
      orderBy: {
        nama: 'asc'
      }
    });

    return successResponse(res, 'Data prodi berhasil diambil', prodi);
  } catch (error) {
    console.error('Error getting prodi:', error);
    return errorResponse(res, 'Gagal mengambil data prodi', 500);
  }
};

// Get prodi by ID
const getProdiById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const prodi = await prisma.prodi.findUnique({
      where: { id: parseInt(id) },
      include: {
        jurusan: {
          select: {
            id: true,
            nama: true
          }
        },
        users: {
          select: {
            id: true,
            nama: true,
            role: true
          }
        }
      }
    });

    if (!prodi) {
      return errorResponse(res, 'Prodi tidak ditemukan', 404);
    }

    return successResponse(res, 'Data prodi berhasil diambil', prodi);
  } catch (error) {
    console.error('Error getting prodi by ID:', error);
    return errorResponse(res, 'Gagal mengambil data prodi', 500);
  }
};

// Create new prodi
const createProdi = async (req, res) => {
  try {
    const { nama, jurusanId } = req.body;

    // Validation
    if (!nama || !jurusanId) {
      return errorResponse(res, 'Nama prodi dan jurusan harus diisi', 400);
    }

    // Check if jurusan exists
    const jurusan = await prisma.jurusan.findUnique({
      where: { id: parseInt(jurusanId) }
    });

    if (!jurusan) {
      return errorResponse(res, 'Jurusan tidak ditemukan', 404);
    }

    // Check if prodi already exists in the same jurusan
    const existingProdi = await prisma.prodi.findFirst({
      where: {
        nama: nama.trim(),
        jurusanId: parseInt(jurusanId)
      }
    });

    if (existingProdi) {
      return errorResponse(res, 'Prodi sudah ada di jurusan ini', 400);
    }

    const newProdi = await prisma.prodi.create({
      data: {
        nama: nama.trim(),
        jurusanId: parseInt(jurusanId)
      },
      include: {
        jurusan: {
          select: {
            id: true,
            nama: true
          }
        }
      }
    });

    return successResponse(res, 'Prodi berhasil dibuat', newProdi, 201);
  } catch (error) {
    console.error('Error creating prodi:', error);
    return errorResponse(res, 'Gagal membuat prodi', 500);
  }
};

// Update prodi
const updateProdi = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama, jurusanId } = req.body;

    // Check if prodi exists
    const existingProdi = await prisma.prodi.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingProdi) {
      return errorResponse(res, 'Prodi tidak ditemukan', 404);
    }

    // Validation
    if (!nama || !jurusanId) {
      return errorResponse(res, 'Nama prodi dan jurusan harus diisi', 400);
    }

    // Check if jurusan exists
    const jurusan = await prisma.jurusan.findUnique({
      where: { id: parseInt(jurusanId) }
    });

    if (!jurusan) {
      return errorResponse(res, 'Jurusan tidak ditemukan', 404);
    }

    // Check if prodi name already exists in the same jurusan (excluding current prodi)
    const duplicateProdi = await prisma.prodi.findFirst({
      where: {
        nama: nama.trim(),
        jurusanId: parseInt(jurusanId),
        id: { not: parseInt(id) }
      }
    });

    if (duplicateProdi) {
      return errorResponse(res, 'Prodi sudah ada di jurusan ini', 400);
    }

    const updatedProdi = await prisma.prodi.update({
      where: { id: parseInt(id) },
      data: {
        nama: nama.trim(),
        jurusanId: parseInt(jurusanId)
      },
      include: {
        jurusan: {
          select: {
            id: true,
            nama: true
          }
        }
      }
    });

    return successResponse(res, 'Prodi berhasil diupdate', updatedProdi);
  } catch (error) {
    console.error('Error updating prodi:', error);
    return errorResponse(res, 'Gagal mengupdate prodi', 500);
  }
};

// Delete prodi
const deleteProdi = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if prodi exists
    const existingProdi = await prisma.prodi.findUnique({
      where: { id: parseInt(id) },
      include: {
        _count: {
          select: {
            users: true
          }
        }
      }
    });

    if (!existingProdi) {
      return errorResponse(res, 'Prodi tidak ditemukan', 404);
    }

    // Check if prodi has users
    if (existingProdi._count.users > 0) {
      return errorResponse(res, 'Tidak dapat menghapus prodi yang masih memiliki pengguna', 400);
    }

    await prisma.prodi.delete({
      where: { id: parseInt(id) }
    });

    return successResponse(res, 'Prodi berhasil dihapus');
  } catch (error) {
    console.error('Error deleting prodi:', error);
    return errorResponse(res, 'Gagal menghapus prodi', 500);
  }
};

// Get prodi by jurusan
const getProdiByJurusan = async (req, res) => {
  try {
    const { jurusanId } = req.params;

    const prodi = await prisma.prodi.findMany({
      where: { jurusanId: parseInt(jurusanId) },
      include: {
        jurusan: {
          select: {
            id: true,
            nama: true
          }
        },
        _count: {
          select: {
            users: true
          }
        }
      },
      orderBy: {
        nama: 'asc'
      }
    });

    return successResponse(res, 'Data prodi berhasil diambil', prodi);
  } catch (error) {
    console.error('Error getting prodi by jurusan:', error);
    return errorResponse(res, 'Gagal mengambil data prodi', 500);
  }
};

module.exports = {
  getAllProdi,
  getProdiById,
  createProdi,
  updateProdi,
  deleteProdi,
  getProdiByJurusan
};