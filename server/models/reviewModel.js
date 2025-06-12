// models/reviewModel.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const reviewModel = {
  // Buat review baru
  create: async (data) => {
    return await prisma.review.create({ data });
  },

  // Cari review berdasarkan ID lengkap dengan relasi
  findById: async (id) => {
    return await prisma.review.findUnique({
      where: { id },
      include: {
        proposal: true,
        reviewer: true,
      },
    });
  },

  // Update review berdasarkan ID
  update: async (id, data) => {
    return await prisma.review.update({
      where: { id },
      data,
    });
  },

  // Hapus review berdasarkan ID
  delete: async (id) => {
    return await prisma.review.delete({
      where: { id },
    });
  },

  // Cari semua review dengan opsi filter, pagination dan sorting
  findAll: async ({ where = {}, skip = 0, take = 10, orderBy = { tanggal_review: 'desc' } }) => {
    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        skip,
        take,
        orderBy,
        include: {
          proposal: true,
          reviewer: true,
        },
      }),
      prisma.review.count({ where }),
    ]);
    return { reviews, total };
  },

  // Cari review berdasarkan proposalId dan reviewerId (unik)
  findByProposalAndReviewer: async (proposalId, reviewerId) => {
    return await prisma.review.findUnique({
      where: {
        proposalId_reviewerId: {
          proposalId,
          reviewerId,
        },
      },
    });
  },
};

module.exports = reviewModel;
