//server/controllers/review.controller.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all reviews with pagination and filters
const getAllReviews = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status = 'all',
      search = '',
      reviewer = 'all'
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);
    const user = req.user;

    const allowedRekomendasi = ['LAYAK', 'TIDAK_LAYAK', 'REVISI'];
    let whereClause = {};

    // ✅ PERBAIKAN: Filter berdasarkan role
    if (user.role === 'MAHASISWA') {
      // Mahasiswa hanya bisa lihat review dari proposal miliknya
      whereClause.proposal = {
        ketuaId: user.id
      };
    } else if (user.role === 'REVIEWER') {
      // Reviewer bisa lihat semua proposal untuk review, tapi hanya edit review sendiri
      // Tidak ada filter tambahan, reviewer bisa akses semua
    } else if (user.role === 'DOSEN') {
      // Dosen hanya bisa lihat review dari proposal mahasiswa bimbingannya
      // Asumsi ada relasi dosen-mahasiswa atau proposal memiliki dosenPembimbingId
      whereClause.proposal = {
        dosenPembimbingId: user.id // Sesuaikan dengan schema Anda
      };
    }
    // Admin bisa akses semua, tidak perlu filter tambahan

    // Filter status rekomendasi
    if (status !== 'all' && allowedRekomendasi.includes(status.toUpperCase())) {
      whereClause.rekomendasi = status.toUpperCase();
    }

    // Filter reviewer tertentu (hanya untuk admin)
    if (reviewer !== 'all' && user.role === 'ADMIN') {
      whereClause.reviewerId = parseInt(reviewer);
    }

    // Search judul atau nama reviewer
    if (search) {
      whereClause.OR = [
        {
          proposal: {
            judul: {
              contains: search,
              mode: 'insensitive'
            }
          }
        },
        {
          reviewer: {
            nama: {
              contains: search,
              mode: 'insensitive'
            }
          }
        }
      ];
    }

    // Ambil review
    const reviews = await prisma.review.findMany({
      where: whereClause,
      include: {
        proposal: {
          select: {
            id: true,
            judul: true,
            status: true,
            tahun: true,
            ketua: {
              select: {
                nama: true,
                email: true
              }
            }
          }
        },
        reviewer: {
          select: {
            id: true,
            nama: true,
            email: true,
            bidang_keahlian: true
          }
        }
      },
      skip,
      take,
      orderBy: {
        tanggal_review: 'desc'
      }
    });

    const totalReviews = await prisma.review.count({
      where: whereClause
    });

    // Statistik rekomendasi dengan filter role
    const stats = await prisma.review.groupBy({
      by: ['rekomendasi'],
      _count: {
        id: true
      },
      where: whereClause
    });

    const reviewStats = {
      total: totalReviews,
      layak: stats.find(s => s.rekomendasi === 'LAYAK')?._count.id || 0,
      tidak_layak: stats.find(s => s.rekomendasi === 'TIDAK_LAYAK')?._count.id || 0,
      revisi: stats.find(s => s.rekomendasi === 'REVISI')?._count.id || 0
    };

    res.status(200).json({
      success: true,
      data: {
        reviews,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalReviews / take),
          totalItems: totalReviews,
          itemsPerPage: take
        },
        stats: reviewStats
      }
    });

  } catch (error) {
    console.error('Error getting reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data review',
      error: error.message
    });
  }
};

// Get review by ID
const getReviewById = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await prisma.review.findUnique({
      where: { id: parseInt(id) },
      include: {
        proposal: {
          include: {
            ketua: {
              select: {
                id: true,
                nama: true,
                email: true,
                nim: true,
                jurusan: true
              }
            },
            skema: {
              select: {
                nama: true,
                kategori: true
              }
            }
          }
        },
        reviewer: {
          select: {
            id: true,
            nama: true,
            email: true,
            bidang_keahlian: true
          }
        }
      }
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review tidak ditemukan'
      });
    }

    const user = req.user;

    // ✅ PERBAIKAN: Role-based access control
    if (user.role === 'MAHASISWA') {
      // Mahasiswa hanya bisa lihat review proposal yang dia ketuai
      if (review.proposal.ketua.id !== user.id) {
        return res.status(403).json({
          success: false,
          message: 'Anda tidak diizinkan mengakses review ini'
        });
      }
    }

    if (user.role === 'DOSEN') {
      // Dosen hanya bisa lihat review dari proposal yang dia bimbing
      if (review.proposal.dosenPembimbingId !== user.id) {
        return res.status(403).json({
          success: false,
          message: 'Anda hanya bisa mengakses review proposal bimbingan Anda'
        });
      }
    }

    // ADMIN dan REVIEWER bisa akses semua review

    res.status(200).json({
      success: true,
      data: review
    });

  } catch (error) {
    console.error('Error getting review:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data review',
      error: error.message
    });
  }
};

// Update review (admin dan reviewer)
const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { skor_total, catatan, rekomendasi } = req.body;
    const user = req.user;

    if (!rekomendasi) {
      return res.status(400).json({
        success: false,
        message: 'Rekomendasi wajib diisi'
      });
    }

    const existingReview = await prisma.review.findUnique({
      where: { id: parseInt(id) },
      include: { 
        reviewer: true,
        proposal: true 
      }
    });

    if (!existingReview) {
      return res.status(404).json({
        success: false,
        message: 'Review tidak ditemukan'
      });
    }

    // ✅ PERBAIKAN: Access control
    if (user.role === 'REVIEWER') {
      // Reviewer hanya bisa edit review sendiri
      if (existingReview.reviewer.id !== user.id) {
        return res.status(403).json({
          success: false,
          message: 'Anda hanya bisa mengedit review sendiri'
        });
      }
      
      // ✅ TAMBAHAN: Cek apakah review sudah final/submitted
      // Jika proposal sudah bukan status REVIEW, berarti review sudah final
      if (existingReview.proposal.status !== 'REVIEW' && existingReview.proposal.status !== 'SUBMITTED') {
        return res.status(403).json({
          success: false,
          message: 'Review sudah final dan tidak dapat diedit lagi'
        });
      }
    }
    // Admin bisa edit semua review kapan saja

    const updatedReview = await prisma.review.update({
      where: { id: parseInt(id) },
      data: {
        skor_total: skor_total ? parseFloat(skor_total) : null,
        catatan,
        rekomendasi,
        tanggal_review: new Date()
      },
      include: {
        proposal: {
          select: {
            judul: true,
            ketua: {
              select: {
                nama: true
              }
            }
          }
        },
        reviewer: {
          select: {
            nama: true
          }
        }
      }
    });

    // Update status proposal berdasarkan rekomendasi
     let proposalStatus = existingReview.proposal.status;
    if (rekomendasi === 'LAYAK') {
      proposalStatus = 'APPROVED';
    } else if (rekomendasi === 'TIDAK_LAYAK') {
      proposalStatus = 'REJECTED';
    } else if (rekomendasi === 'REVISI') {
      proposalStatus = 'REVISION';
    }

    await prisma.proposal.update({
      where: { id: existingReview.proposalId },
      data: { status: proposalStatus }
    });

    res.status(200).json({
      success: true,
      message: 'Review berhasil diperbarui',
      data: updatedReview
    });

  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal memperbarui review',
      error: error.message
    });
  }
};

// ✅ TAMBAHAN: Fungsi helper untuk cek apakah review bisa diedit
const canEditReview = (review, user) => {
  // Admin selalu bisa edit
  if (user.role === 'ADMIN') return true;
  
  // Reviewer hanya bisa edit milik sendiri dan belum final
  if (user.role === 'REVIEWER') {
    if (review.reviewer.id !== user.id) return false;
    
    // Cek status proposal - jika masih REVIEW atau SUBMITTED berarti masih bisa diedit
    const editableStatuses = ['REVIEW', 'SUBMITTED'];
    return editableStatuses.includes(review.proposal.status);
  }
  
  return false;
};

// Get proposals untuk reviewer
const getProposalsForReview = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      status = 'all'
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);
    const user = req.user;

    let whereClause = {};

    // Filter untuk proposal yang perlu direview
    if (status !== 'all') {
      whereClause.status = status;
    } else {
      // Default: tampilkan proposal yang submitted atau dalam review
      whereClause.status = {
        in: ['SUBMITTED', 'REVIEW']
      };
    }

    // Search
    if (search) {
      whereClause.OR = [
        {
          judul: {
            contains: search,
            mode: 'insensitive'
          }
        },
        {
          ketua: {
            nama: {
              contains: search,
              mode: 'insensitive'
            }
          }
        }
      ];
    }

    const proposals = await prisma.proposal.findMany({
      where: whereClause,
      include: {
        ketua: {
          select: {
            nama: true,
            email: true,
            nim: true
          }
        },
        skema: {
          select: {
            nama: true,
            kategori: true
          }
        },
        reviews: {
          include: {
            reviewer: {
              select: {
                nama: true
              }
            }
          }
        }
      },
      skip,
      take,
      orderBy: {
        created_at: 'desc'
      }
    });

    const totalProposals = await prisma.proposal.count({
      where: whereClause
    });

    res.status(200).json({
      success: true,
      data: {
        proposals,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalProposals / take),
          totalItems: totalProposals,
          itemsPerPage: take
        }
      }
    });

  } catch (error) {
    console.error('Error getting proposals for review:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data proposal',
      error: error.message
    });
  }
};

// Create new review untuk proposal (reviewer)
const createReview = async (req, res) => {
  try {
    const { proposalId, skor_total, catatan, rekomendasi } = req.body;
    const user = req.user;

    if (!proposalId || !rekomendasi) {
      return res.status(400).json({
        success: false,
        message: 'Proposal ID dan rekomendasi wajib diisi'
      });
    }

    // Check if proposal exists
    const proposal = await prisma.proposal.findUnique({
      where: { id: parseInt(proposalId) }
    });

    if (!proposal) {
      return res.status(404).json({
        success: false,
        message: 'Proposal tidak ditemukan'
      });
    }

    // Check if reviewer already reviewed this proposal
    const existingReview = await prisma.review.findFirst({
      where: {
        proposalId: parseInt(proposalId),
        reviewerId: user.id
      }
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'Anda sudah memberikan review untuk proposal ini'
      });
    }

    const newReview = await prisma.review.create({
      data: {
        proposalId: parseInt(proposalId),
        reviewerId: user.id,
        skor_total: skor_total ? parseFloat(skor_total) : null,
        catatan,
        rekomendasi,
        tanggal_review: new Date()
      },
      include: {
        proposal: {
          select: {
            judul: true,
            ketua: {
              select: {
                nama: true
              }
            }
          }
        },
        reviewer: {
          select: {
            nama: true
          }
        }
      }
    });

    // Update proposal status
    let proposalStatus = 'REVIEW';
    if (rekomendasi === 'LAYAK') {
      proposalStatus = 'APPROVED';
    } else if (rekomendasi === 'TIDAK_LAYAK') {
      proposalStatus = 'REJECTED';
    } else if (rekomendasi === 'REVISI') {
      proposalStatus = 'REVISION';
    }

    await prisma.proposal.update({
      where: { id: parseInt(proposalId) },
      data: { 
        status: proposalStatus,
        reviewerId: user.id
      }
    });

    res.status(201).json({
      success: true,
      message: 'Review berhasil dibuat',
      data: newReview
    });

  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal membuat review',
      error: error.message
    });
  }
};

// Delete review (hanya admin)
const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    const existingReview = await prisma.review.findUnique({
      where: { id: parseInt(id) },
      include: { proposal: true }
    });

    if (!existingReview) {
      return res.status(404).json({
        success: false,
        message: 'Review tidak ditemukan'
      });
    }

    await prisma.review.delete({
      where: { id: parseInt(id) }
    });

    // Reset proposal status ke SUBMITTED jika diperlukan
    await prisma.proposal.update({
      where: { id: existingReview.proposalId },
      data: { 
        status: 'SUBMITTED',
        reviewerId: null
      }
    });

    res.status(200).json({
      success: true,
      message: 'Review berhasil dihapus'
    });

  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal menghapus review',
      error: error.message
    });
  }
};

// Get reviewers list (hanya admin)
const getReviewers = async (req, res) => {
  try {
    const reviewers = await prisma.user.findMany({
      where: {
        role: 'REVIEWER',
        status: 'AKTIF'
      },
      select: {
        id: true,
        nama: true,
        email: true,
        bidang_keahlian: true,
        _count: {
          select: {
            reviews: true
          }
        }
      },
      orderBy: {
        nama: 'asc'
      }
    });

    res.status(200).json({
      success: true,
      data: reviewers
    });

  } catch (error) {
    console.error('Error getting reviewers:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data reviewer',
      error: error.message
    });
  }
};

// Assign reviewer to proposal (hanya admin)
const assignReviewer = async (req, res) => {
  try {
    const { proposalId, reviewerId } = req.body;

    if (!proposalId || !reviewerId) {
      return res.status(400).json({
        success: false,
        message: 'Proposal ID dan Reviewer ID wajib diisi'
      });
    }

    const proposal = await prisma.proposal.findUnique({
      where: { id: parseInt(proposalId) }
    });

    if (!proposal) {
      return res.status(404).json({
        success: false,
        message: 'Proposal tidak ditemukan'
      });
    }

    const reviewer = await prisma.user.findUnique({
      where: { 
        id: parseInt(reviewerId),
        role: 'REVIEWER'
      }
    });

    if (!reviewer) {
      return res.status(404).json({
        success: false,
        message: 'Reviewer tidak ditemukan'
      });
    }

    const updatedProposal = await prisma.proposal.update({
      where: { id: parseInt(proposalId) },
      data: {
        reviewerId: parseInt(reviewerId),
        status: 'REVIEW'
      }
    });

    res.status(200).json({
      success: true,
      message: 'Reviewer berhasil ditugaskan',
      data: updatedProposal
    });

  } catch (error) {
    console.error('Error assigning reviewer:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal menugaskan reviewer',
      error: error.message
    });
  }
};

module.exports = {
  getAllReviews,
  getReviewById,
  updateReview,
  deleteReview,
  getReviewers,
  assignReviewer,
  getProposalsForReview,
  createReview
};