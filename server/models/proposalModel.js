// models/proposalModel.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const proposalModel = {
  // Buat proposal baru
  create: async (data) => {
    return await prisma.proposal.create({ data });
  },

  // Cari proposal berdasarkan ID dengan relasi lengkap
  findById: async (id) => {
    return await prisma.proposal.findUnique({
      where: { id },
      include: {
        skema: true,
        ketua: true,
        reviewer: true,
        members: {
          include: {
            user: true,
          },
        },
        reviews: true,
        documents: true,
      },
    });
  },

  // Update proposal berdasarkan ID
  update: async (id, data) => {
    return await prisma.proposal.update({
      where: { id },
      data,
    });
  },

  // Hapus proposal berdasarkan ID
  delete: async (id) => {
    return await prisma.proposal.delete({
      where: { id },
    });
  },

  // Ambil daftar proposal dengan filter, pagination, dan sorting
  findAll: async ({ where = {}, skip = 0, take = 10, orderBy = { createdAt: 'desc' } }) => {
    const [proposals, total] = await Promise.all([
      prisma.proposal.findMany({
        where,
        skip,
        take,
        orderBy,
        include: {
          skema: true,
          ketua: true,
          reviewer: true,
        },
      }),
      prisma.proposal.count({ where }),
    ]);
    return { proposals, total };
  },

  // Contoh fungsi untuk update status proposal saja
  updateStatus: async (id, status) => {
    return await prisma.proposal.update({
      where: { id },
      data: { status },
    });
  },
};

module.exports = proposalModel;
