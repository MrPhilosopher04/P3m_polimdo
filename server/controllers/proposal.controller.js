const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs').promises;

const {
  uploadProposalDocument,
  handleUploadError,
  processUploadedFiles,
  cleanupUploadedFiles
} = require('../middlewares/upload');

const { sendResponse, sendError } = require('../utils/response');
const { PROPOSAL_STATUS } = require('../utils/constants');
const { proposalSchema } = require('../utils/validation');

const proposalController = {
  // GET ALL
  getAll: async (req, res) => {
    try {
      const { status, skema, tahun, page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;
      const where = {};

      if (status) where.status = status;
      if (skema) where.skemaId = parseInt(skema);
      if (tahun) where.tahun = parseInt(tahun);

      if (req.user.role !== 'ADMIN') {
        if (req.user.role === 'REVIEWER') {
          where.reviewerId = req.user.id;
        } else {
          where.OR = [
            { ketuaId: req.user.id },
            { members: { some: { userId: req.user.id } } }
          ];
        }
      }

      const [proposals, total] = await Promise.all([
        prisma.proposal.findMany({
          where,
          include: {
            skema: true,
            ketua: { select: { id: true, nama: true, email: true } },
            reviewer: { select: { id: true, nama: true, email: true } },
            members: {
              include: {
                user: { select: { id: true, nama: true, email: true } }
              }
            },
            _count: { select: { documents: true, reviews: true } }
          },
          orderBy: { createdAt: 'desc' },
          skip: offset,
          take: parseInt(limit)
        }),
        prisma.proposal.count({ where })
      ]);

      sendResponse(res, 'Berhasil mendapatkan data proposal', {
        proposals,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      console.error('Get proposals error:', error);
      sendError(res, 'Terjadi kesalahan server', 500);
    }
  },

  // GET MINE
  getMine: async (req, res) => {
    try {
      const userId = req.user.id;
      const proposals = await prisma.proposal.findMany({
        where: {
          OR: [
            { ketuaId: userId },
            { members: { some: { userId } } }
          ]
        },
        include: {
          skema: true,
          ketua: { select: { id: true, nama: true } },
          reviewer: { select: { id: true, nama: true } },
          _count: { select: { documents: true } }
        }
      });

      sendResponse(res, 'Proposal berhasil ditemukan', { proposals });
    } catch (error) {
      console.error('Get my proposals error:', error);
      sendError(res, 'Terjadi kesalahan server', 500);
    }
  },

  // GET BY ID
  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const proposal = await prisma.proposal.findUnique({
        where: { id: parseInt(id) },
        include: {
          skema: true,
          ketua: { select: { id: true, nama: true, email: true } },
          reviewer: { select: { id: true, nama: true, email: true } },
          members: {
            include: {
              user: { select: { id: true, nama: true, email: true } }
            }
          },
          documents: true,
          reviews: {
            include: {
              reviewer: { select: { id: true, nama: true, email: true } }
            }
          }
        }
      });

      if (!proposal) return sendError(res, 'Proposal tidak ditemukan', 404);

      const isOwner = proposal.ketuaId === req.user.id;
      const isMember = proposal.members.some(m => m.userId === req.user.id);
      const isReviewer = proposal.reviewerId === req.user.id;
      const isAdmin = req.user.role === 'ADMIN';

      if (!isOwner && !isMember && !isReviewer && !isAdmin) {
        return sendError(res, 'Akses ditolak', 403);
      }

      sendResponse(res, 'Proposal berhasil ditemukan', { proposal });
    } catch (error) {
      console.error('Get proposal by ID error:', error);
      sendError(res, 'Terjadi kesalahan server', 500);
    }
  },

  // CREATE
  create: async (req, res) => {
    try {
      const { error, value } = proposalSchema.validate(req.body);
      if (error) return sendError(res, 'Validasi gagal', 400, error.details);

      const { judul, abstrak, kata_kunci, skemaId, dana_diusulkan, anggota = [] } = value;

      const skema = await prisma.skema.findUnique({ where: { id: parseInt(skemaId) } });
      if (!skema || skema.status !== 'AKTIF') {
        return sendError(res, 'Skema tidak valid atau tidak aktif', 400);
      }

      if (anggota.includes(req.user.id.toString())) {
        return sendError(res, 'Ketua tidak perlu ditambahkan sebagai anggota', 400);
      }

      if (anggota.length > skema.batas_anggota - 1) {
        return sendError(res, `Maksimal ${skema.batas_anggota} anggota termasuk ketua`, 400);
      }

      const proposal = await prisma.proposal.create({
        data: {
          judul,
          abstrak,
          kata_kunci,
          skemaId: parseInt(skemaId),
          ketuaId: req.user.id,
          tahun: new Date().getFullYear(),
          dana_diusulkan: dana_diusulkan ? parseFloat(dana_diusulkan) : null,
          status: PROPOSAL_STATUS.DRAFT,
          members: {
            create: [
              { userId: req.user.id, peran: 'KETUA' },
              ...anggota.map(id => ({ userId: parseInt(id), peran: 'ANGGOTA' }))
            ]
          }
        },
        include: {
          skema: true,
          ketua: { select: { id: true, nama: true, email: true } },
          members: {
            include: { user: { select: { id: true, nama: true, email: true } } }
          }
        }
      });

      sendResponse(res, 'Proposal berhasil dibuat', { proposal }, 201);
    } catch (error) {
      console.error('Create proposal error:', error);
      sendError(res, 'Terjadi kesalahan server', 500);
    }
  },

  // UPDATE
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { error, value } = proposalSchema.validate(req.body);
      if (error) return sendError(res, 'Validasi gagal', 400, error.details);

      const { judul, abstrak, kata_kunci, skemaId, dana_diusulkan, anggota = [] } = value;

      const existing = await prisma.proposal.findUnique({
        where: { id: parseInt(id) },
        include: { skema: true, members: true }
      });

      if (!existing) return sendError(res, 'Proposal tidak ditemukan', 404);
      if (existing.ketuaId !== req.user.id && req.user.role !== 'ADMIN') {
        return sendError(res, 'Akses ditolak', 403);
      }
      if (![PROPOSAL_STATUS.DRAFT, PROPOSAL_STATUS.REVISION].includes(existing.status)) {
        return sendError(res, 'Proposal hanya dapat diubah pada status DRAFT atau REVISION', 400);
      }

      let skema = existing.skema;
      if (skemaId && parseInt(skemaId) !== existing.skemaId) {
        skema = await prisma.skema.findUnique({ where: { id: parseInt(skemaId) } });
        if (!skema || skema.status !== 'AKTIF') {
          return sendError(res, 'Skema tidak valid atau tidak aktif', 400);
        }
      }

      if (anggota.length > skema.batas_anggota - 1) {
        return sendError(res, `Maksimal ${skema.batas_anggota} anggota termasuk ketua`, 400);
      }

      const updated = await prisma.proposal.update({
        where: { id: parseInt(id) },
        data: {
          judul, abstrak, kata_kunci,
          skemaId: skemaId ? parseInt(skemaId) : undefined,
          dana_diusulkan: dana_diusulkan ? parseFloat(dana_diusulkan) : undefined,
          members: {
            deleteMany: {},
            create: [
              { userId: req.user.id, peran: 'KETUA' },
              ...anggota.map(id => ({ userId: parseInt(id), peran: 'ANGGOTA' }))
            ]
          }
        },
        include: {
          skema: true,
          ketua: true,
          members: { include: { user: true } }
        }
      });

      sendResponse(res, 'Proposal berhasil diperbarui', { proposal: updated });
    } catch (error) {
      console.error('Update proposal error:', error);
      sendError(res, 'Terjadi kesalahan server', 500);
    }
  },

  // SUBMIT
  submit: async (req, res) => {
    try {
      const { id } = req.params;
      const proposal = await prisma.proposal.findUnique({
        where: { id: parseInt(id) },
        include: { documents: true }
      });

      if (!proposal) return sendError(res, 'Proposal tidak ditemukan', 404);
      if (proposal.ketuaId !== req.user.id) {
        return sendError(res, 'Hanya ketua proposal yang dapat mengajukan', 403);
      }
      if (![PROPOSAL_STATUS.DRAFT, PROPOSAL_STATUS.REVISION].includes(proposal.status)) {
        return sendError(res, 'Proposal hanya dapat diajukan dari status DRAFT atau REVISION', 400);
      }
      if (proposal.documents.length === 0) {
        return sendError(res, 'Harus mengunggah minimal satu dokumen', 400);
      }

      const updated = await prisma.proposal.update({
        where: { id: parseInt(id) },
        data: { status: PROPOSAL_STATUS.SUBMITTED, tanggal_submit: new Date() }
      });

      sendResponse(res, 'Proposal berhasil diajukan', { proposal: updated });
    } catch (error) {
      console.error('Submit proposal error:', error);
      sendError(res, 'Terjadi kesalahan server', 500);
    }
  },

  // UPLOAD DOCUMENT
  uploadDocument: async (req, res) => {
    try {
      const { id } = req.params;
      const { jenis_dokumen } = req.body;

      uploadProposalDocument(req, res, async (err) => {
        if (err) return handleUploadError(err, req, res);

        if (!req.file) return sendError(res, 'Dokumen wajib diunggah', 400);

        const proposal = await prisma.proposal.findUnique({ where: { id: parseInt(id) } });
        if (!proposal) {
          await fs.unlink(req.file.path);
          return sendError(res, 'Proposal tidak ditemukan', 404);
        }

        if (proposal.ketuaId !== req.user.id && req.user.role !== 'ADMIN') {
          await fs.unlink(req.file.path);
          return sendError(res, 'Akses ditolak', 403);
        }

        const document = await prisma.proposalDocument.create({
          data: {
            proposalId: parseInt(id),
            nama_dokumen: req.file.originalname,
            jenis_dokumen: jenis_dokumen || 'PROPOSAL',
            file_path: req.file.path,
            file_size: req.file.size,
            mime_type: req.file.mimetype,
            uploadedBy: req.user.id
          }
        });

        sendResponse(res, 'Dokumen berhasil diunggah', { document });
      });
    } catch (error) {
      console.error('Upload document error:', error);
      if (req.file?.path) await cleanupUploadedFiles([req.file]);
      sendError(res, 'Terjadi kesalahan saat mengunggah dokumen', 500);
    }
  },

  // DELETE
  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const proposal = await prisma.proposal.findUnique({
        where: { id: parseInt(id) },
        include: { documents: true }
      });

      if (!proposal) return sendError(res, 'Proposal tidak ditemukan', 404);
      if (proposal.ketuaId !== req.user.id && req.user.role !== 'ADMIN') {
        return sendError(res, 'Akses ditolak', 403);
      }
      if (![PROPOSAL_STATUS.DRAFT, PROPOSAL_STATUS.REJECTED].includes(proposal.status)) {
        return sendError(res, 'Proposal hanya dapat dihapus pada status DRAFT atau REJECTED', 400);
      }

      for (const doc of proposal.documents) {
        try {
          await fs.unlink(doc.file_path);
        } catch (err) {
          console.error(`Gagal menghapus file: ${doc.file_path}`, err);
        }
      }

      await prisma.proposal.delete({ where: { id: parseInt(id) } });

      sendResponse(res, 'Proposal berhasil dihapus');
    } catch (error) {
      console.error('Delete proposal error:', error);
      sendError(res, 'Terjadi kesalahan server', 500);
    }
  }
};

// Tambahkan untuk keperluan middleware upload
proposalController.handleUploadError = handleUploadError;

module.exports = proposalController;
