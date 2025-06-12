// server/controllers/file.controller.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs').promises;
const path = require('path');
const { sendResponse, sendError } = require('../utils/response');
const { DOCUMENT_TYPES } = require('../utils/constants');

const fileController = {
  // Upload document to a proposal
  uploadDocument: async (req, res) => {
    try {
      const { proposalId } = req.params;
      const { name, type } = req.body;
      
    const proposalIdNum = Number(proposalId);
if (!Number.isInteger(proposalIdNum)) {
  return sendError(res, 'ID proposal tidak valid', 400);
}

      if (!req.file) {
        return sendError(res, 'File wajib diunggah', 400);
      }

      // Validasi jenis dokumen
      if (type && !Object.values(DOCUMENT_TYPES).includes(type)) {
        return sendError(res, 'Jenis dokumen tidak valid', 400);
      }

      // Cek proposal
      const proposal = await prisma.proposal.findUnique({
        where: { id: parseInt(proposalId) }
      });
      
      if (!proposal) {
        await fs.unlink(req.file.path);
        return sendError(res, 'Proposal tidak ditemukan', 404);
      }

      // Verifikasi akses
      if (proposal.ketuaId !== req.user.id && req.user.role !== 'ADMIN') {
        await fs.unlink(req.file.path);
        return sendError(res, 'Akses ditolak', 403);
      }

      // Buat nama file unik
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(req.file.originalname);
      const fileName = `doc-${proposal.id}-${uniqueSuffix}${ext}`;
      const filePath = path.join('uploads', 'documents', fileName);

      // Pindahkan file ke lokasi permanen
      await fs.rename(req.file.path, filePath);

      // Simpan ke database
      const document = await prisma.document.create({
        data: {
          proposalId: parseInt(proposalId),
          name: name || req.file.originalname,
          url: `uploads/documents/${fileName}`,
          type: type || DOCUMENT_TYPES.LAINNYA
        }
      });

      sendResponse(res, 'Dokumen berhasil diunggah', { document });

    } catch (error) {
      console.error('Upload document error:', error);
      
      // Bersihkan file yang terunggah jika ada error
      if (req.file?.path) {
        try {
          await fs.unlink(req.file.path);
        } catch (cleanupError) {
          console.error('Gagal membersihkan file:', cleanupError);
        }
      }
      
      // Tangani error spesifik Prisma
      if (error.code === 'P2003') {
        return sendError(res, 'Proposal tidak ditemukan', 404);
      }
      
      sendError(res, 'Terjadi kesalahan saat mengunggah dokumen', 500);
    }
  },

  // Download document
  downloadDocument: async (req, res) => {
    try {
      const { id } = req.params;
      
      // Validasi ID dokumen
      if (isNaN(id)) {
        return sendError(res, 'ID dokumen tidak valid', 400);
      }

      const document = await prisma.document.findUnique({
        where: { id: parseInt(id) },
        include: {
          proposal: {
            select: {
              ketuaId: true,
              reviewerId: true,
              members: {
                select: { userId: true }
              }
            }
          }
        }
      });

      if (!document) {
        return sendError(res, 'Dokumen tidak ditemukan', 404);
      }

      // Verifikasi akses
      const isOwner = document.proposal.ketuaId === req.user.id;
      const isMember = document.proposal.members.some(m => m.userId === req.user.id);
      const isReviewer = document.proposal.reviewerId === req.user.id;
      const isAdmin = req.user.role === 'ADMIN';

      if (!isOwner && !isMember && !isReviewer && !isAdmin) {
        return sendError(res, 'Akses ditolak', 403);
      }

      // Dapatkan path file
      const filePath = path.join(__dirname, '..', document.url);

      // Validasi file
      if (!fs.existsSync(filePath)) {
        return sendError(res, 'File tidak ditemukan', 404);
      }
      
      try {
        // Cek apakah file ada
        await fs.access(filePath, fs.constants.F_OK);
        
        // Download file
        res.download(filePath, document.name, (err) => {
  if (err) {
    console.error('Download error:', err);
            sendError(res, 'Terjadi kesalahan saat mengunduh dokumen', 500);
          }
        });
      } catch (error) {
        return sendError(res, 'File tidak ditemukan', 404);
      }

    } catch (error) {
      console.error('Download document error:', error);
      
      // Tangani error spesifik Prisma
      if (error.code === 'P2025') {
        return sendError(res, 'Dokumen tidak ditemukan', 404);
      }
      
      sendError(res, 'Terjadi kesalahan server', 500);
    }
  },

  // Delete document
  deleteDocument: async (req, res) => {
    try {
      const { id } = req.params;
      
      // Validasi ID dokumen
      if (isNaN(id)) {
        return sendError(res, 'ID dokumen tidak valid', 400);
      }

      const document = await prisma.document.findUnique({
        where: { id: parseInt(id) },
        include: {
          proposal: {
            select: {
              ketuaId: true,
              status: true
            }
          }
        }
      });

      if (!document) {
        return sendError(res, 'Dokumen tidak ditemukan', 404);
      }

      // Verifikasi akses
      if (document.proposal.ketuaId !== req.user.id && req.user.role !== 'ADMIN') {
        return sendError(res, 'Akses ditolak', 403);
      }

      // Validasi status proposal
      const allowedStatus = ['DRAFT', 'REVISION', 'REJECTED'];
      if (!allowedStatus.includes(document.proposal.status)) {
        return sendError(res, 'Dokumen hanya dapat dihapus pada status DRAFT, REVISION, atau REJECTED', 400);
      }

      // Hapus file fisik
      const basePath = path.join(__dirname, '..', 'public');
      const filePath = path.join(basePath, document.url);
      
      try {
        await fs.unlink(filePath);
      } catch (err) {
        console.error(`Gagal menghapus file: ${filePath}`, err);
      }

      // Hapus dari database
      await prisma.document.delete({
        where: { id: parseInt(id) }
      });

      sendResponse(res, 'Dokumen berhasil dihapus');

    } catch (error) {
      console.error('Delete document error:', error);
      
      // Tangani error spesifik Prisma
      if (error.code === 'P2025') {
        return sendError(res, 'Dokumen tidak ditemukan', 404);
      }
      
      sendError(res, 'Terjadi kesalahan server', 500);
    }
  },

  // Get documents by proposal
  getByProposal: async (req, res) => {
    try {
      const { proposalId } = req.params;
      
      // Validasi ID proposal
      if (isNaN(proposalId)) {
        return sendError(res, 'ID proposal tidak valid', 400);
      }

      // Cek proposal
      const proposal = await prisma.proposal.findUnique({
        where: { id: parseInt(proposalId) },
        include: {
          members: {
            select: { userId: true }
          }
        }
      });

      if (!proposal) {
        return sendError(res, 'Proposal tidak ditemukan', 404);
      }

      // Verifikasi akses
      const isOwner = proposal.ketuaId === req.user.id;
      const isMember = proposal.members.some(m => m.userId === req.user.id);
      const isReviewer = proposal.reviewerId === req.user.id;
      const isAdmin = req.user.role === 'ADMIN';

      if (!isOwner && !isMember && !isReviewer && !isAdmin) {
        return sendError(res, 'Akses ditolak', 403);
      }

      // Dapatkan dokumen
      const documents = await prisma.document.findMany({
        where: { proposalId: parseInt(proposalId) },
        orderBy: { uploadedAt: 'desc' }
      });

      sendResponse(res, 'Dokumen berhasil ditemukan', { documents });

    } catch (error) {
      console.error('Get documents by proposal error:', error);
      
      // Tangani error spesifik Prisma
      if (error.code === 'P2025') {
        return sendError(res, 'Proposal tidak ditemukan', 404);
      }
      
      sendError(res, 'Terjadi kesalahan server', 500);
    }
  }
};

module.exports = fileController;