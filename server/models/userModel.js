// models/userModel.js

const { prisma } = require('../config/database');

/**
 * Temukan user berdasarkan ID
 */
const findUserById = async (id) => {
  return await prisma.user.findUnique({
    where: { id },
  });
};

/**
 * Temukan user berdasarkan email
 */
const findUserByEmail = async (email) => {
  return await prisma.user.findUnique({
    where: { email },
  });
};

/**
 * Buat user baru
 */
const createUser = async (userData) => {
  return await prisma.user.create({
    data: userData,
  });
};

/**
 * Perbarui user berdasarkan ID
 */
const updateUser = async (id, updateData) => {
  return await prisma.user.update({
    where: { id },
    data: updateData,
  });
};

/**
 * Hapus user berdasarkan ID
 */
const deleteUser = async (id) => {
  return await prisma.user.delete({
    where: { id },
  });
};

/**
 * Cari semua user (dengan pagination opsional)
 */
const findAllUsers = async ({ page = 1, limit = 10 } = {}) => {
  const skip = (page - 1) * limit;
  const [users, total] = await Promise.all([
    prisma.user.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.user.count(),
  ]);

  return {
    users,
    total,
    page,
    limit,
  };
};

module.exports = {
  findUserById,
  findUserByEmail,
  createUser,
  updateUser,
  deleteUser,
  findAllUsers,
};
