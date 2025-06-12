// models/skemaModel.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const skemaModel = {
  // Buat skema baru
  create: async (data) => {
    return await prisma.skema.create({ data });
  },

  // Cari skema berdasarkan ID
  findById: async (id) => {
    return await prisma.skema.findUnique({
      where: { id },
    });
  },

  // Update skema berdasarkan ID
  update: async (id, data) => {
    return await prisma.skema.update({
      where: { id },
      data,
    });
  },

  // Hapus skema berdasarkan ID
  delete: async (id) => {
    return await prisma.skema.delete({
      where: { id },
    });
  },

  // Ambil semua skema dengan opsi filter, pagination, dan sorting
  findAll: async ({ where = {}, skip = 0, take = 10, orderBy = { createdAt: 'desc' } }) => {
    const [skemas, total] = await Promise.all([
      prisma.skema.findMany({
        where,
        skip,
        take,
        orderBy,
      }),
      prisma.skema.count({ where }),
    ]);
    return { skemas, total };
  },
};

module.exports = skemaModel;
