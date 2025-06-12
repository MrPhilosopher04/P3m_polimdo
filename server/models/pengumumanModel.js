const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const pengumumanModel = {
  findAll: async (filter = {}) => {
    return await prisma.pengumuman.findMany({
      where: filter,
      orderBy: { createdAt: 'desc' },
    });
  },

  findById: async (id) => {
    return await prisma.pengumuman.findUnique({
      where: { id: parseInt(id) },
    });
  },

  create: async (data) => {
    return await prisma.pengumuman.create({
      data,
    });
  },

  update: async (id, data) => {
    return await prisma.pengumuman.update({
      where: { id: parseInt(id) },
      data,
    });
  },

  delete: async (id) => {
    return await prisma.pengumuman.delete({
      where: { id: parseInt(id) },
    });
  },
};

module.exports = pengumumanModel;
