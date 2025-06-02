// server/controllers/review.controller.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { sendResponse, sendError } = require('../utils/response');
const { PROPOSAL_STATUS, REKOMENDASI } = require('../utils/constants');

const reviewController = {
  // Get proposals for review
  getForReview: async (req, res) => {
    try {
      const { status = 'SUBMITTED' } = req.query;

      const proposals = await prisma.proposal.findMany({
        where: {
          OR: [
            { reviewerId: req.user.id },
            {
              AND: [
                { reviewerId: null },
                { status: status }
              ]
            }
          ],
          NOT: {
            reviews: {
              some: {
                reviewerId: req.user.id
              }
            }
          }
        },
        include: {
          skema: true,
          ketua: {
            select: { id: true, nama: true, email: true }
          },
          members: {
            include: {
              user: {
                select: { id: true, nama: true, email: true }
              }
            }
          },
          reviews: {
            where: { reviewerId: req.user.id }
          }
        },
        orderBy: { tanggal_submit: 'asc' }
      });

      sendResponse(res, 'Berhasil mendapatkan proposal untuk review', { proposals });

    } catch (error) {
      console.error('Get proposals for review error:', error);
      sendError(res, 'Terjadi kesalahan server', 500);
    }
  },

  // Assign reviewer (Admin only)
  assignReviewer: async (req, res) => {
    try {
      const { proposalId, reviewerId } = req.body;

      const proposal = await prisma.proposal.findUnique({
        where: { id: parseInt(proposalId) }
      });

      if (!proposal) {
        return sendError(res, 'Proposal tidak ditemukan', 404);
      }

      const reviewer = await prisma.user.findUnique({
        where: { id: parseInt(reviewerId) }
      });

      if (!reviewer || !reviewer.role.includes('REVIEWER')) {
        return sendError(res, 'Reviewer tidak valid', 400);
      }

      const updatedProposal = await prisma.proposal.update({
        where: { id: parseInt(proposalId) },
        data: {
          reviewerId: parseInt(reviewerId),
          status: PROPOSAL_STATUS.REVIEW
        },
        include: {
          skema: true,
          ketua: {
            select: { id: true, nama: true, email: true }
          },
          reviewer: {
            select: { id: true, nama: true, email: true }
          }
        }
      });

      sendResponse(res, 'Reviewer berhasil ditugaskan', { proposal: updatedProposal });

    } catch (error) {
      console.error('Assign reviewer error:', error);
      sendError(res, 'Terjadi kesalahan server', 500);
    }
  },

  // Submit review
  submitReview: async (req, res) => {
    try {
      const { proposalId } = req.params;
      const { criteria, catatan, rekomendasi, is_final = false } = req.body;

      const proposal = await prisma.proposal.findUnique({
        where: { id: parseInt(proposalId) }
      });

      if (!proposal) {
        return sendError(res, 'Proposal tidak ditemukan', 404);
      }

      if (proposal.reviewerId !== req.user.id) {
        return sendError(res, 'Anda tidak ditugaskan untuk me-review proposal ini', 403);
      }

      if (!Object.values(REKOMENDASI).includes(rekomendasi)) {
        return sendError(res, 'Rekomendasi tidak valid', 400);
      }

      const totalScore = criteria.reduce((sum, c) => {
        const skor = parseFloat(c.skor) || 0;
        const bobot = parseFloat(c.bobot) || 0;
        return sum + (skor * (bobot / 100));
      }, 0);

      const review = await prisma.review.upsert({
        where: {
          proposalId_reviewerId: {
            proposalId: parseInt(proposalId),
            reviewerId: req.user.id
          }
        },
        update: {
          skor_total: totalScore,
          catatan,
          rekomendasi,
          is_final,
          tanggal_review: new Date(),
          criteria: {
            deleteMany: {},
            create: criteria.map(c => ({
              kriteria: c.kriteria,
              skor: parseFloat(c.skor),
              bobot: parseFloat(c.bobot),
              keterangan: c.keterangan
            }))
          }
        },
        create: {
          proposalId: parseInt(proposalId),
          reviewerId: req.user.id,
          skor_total: totalScore,
          catatan,
          rekomendasi,
          is_final,
          criteria: {
            create: criteria.map(c => ({
              kriteria: c.kriteria,
              skor: parseFloat(c.skor),
              bobot: parseFloat(c.bobot),
              keterangan: c.keterangan
            }))
          }
        },
        include: {
          criteria: true,
          reviewer: {
            select: { id: true, nama: true, email: true }
          }
        }
      });

      if (is_final) {
        const proposalStatus =
          rekomendasi === REKOMENDASI.LAYAK ? PROPOSAL_STATUS.APPROVED :
          rekomendasi === REKOMENDASI.TIDAK_LAYAK ? PROPOSAL_STATUS.REJECTED :
          PROPOSAL_STATUS.REVISION;

        await prisma.proposal.update({
          where: { id: parseInt(proposalId) },
          data: {
            status: proposalStatus,
            skor_akhir: totalScore,
            catatan_reviewer: catatan
          }
        });
      }

      sendResponse(res, 'Review berhasil disubmit', { review });

    } catch (error) {
      console.error('Submit review error:', error);
      sendError(res, 'Terjadi kesalahan server', 500);
    }
  }
};

module.exports = reviewController;
