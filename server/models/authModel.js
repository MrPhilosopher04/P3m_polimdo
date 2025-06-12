//server/models/authModel.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Cari user berdasarkan email
 * @param {string} email 
 * @returns {Promise<Object|null>}
 */
const findUserByEmail = async (email) => {
  return await prisma.user.findUnique({
    where: { email },
  });
};

/**
 * Cari user berdasarkan ID
 * @param {number} id 
 * @returns {Promise<Object|null>}
 */
const findUserById = async (id) => {
  return await prisma.user.findUnique({
    where: { id },
  });
};

/**
 * Buat user baru
 * @param {Object} userData 
 * @returns {Promise<Object>}
 */
const createUser = async (userData) => {
  return await prisma.user.create({
    data: userData,
  });
};

/**
 * Update password user (digunakan saat reset)
 * @param {number} userId 
 * @param {string} newPassword 
 * @returns {Promise<Object>}
 */
const updatePassword = async (userId, newPassword) => {
  return await prisma.user.update({
    where: { id: userId },
    data: { password: newPassword },
  });
};

module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
  updatePassword,
};
