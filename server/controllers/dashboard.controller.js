// server/controllers/dashboard.controller.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const dashboardController = {
  // Endpoint: GET /dashboard/stats
  getStats: async (req, res) => {
    try {
      const userId = req.user.id;
      const userRole = req.user.role;

      let stats = {};

      if (userRole === 'ADMIN') {
        const [
          totalProposals,
          pendingReviews,
          approvedProposals,
          rejectedProposals,
          totalUsers,
          activeSkemas,
          recentProposals
        ] = await Promise.all([
          prisma.proposal.count(),
          prisma.proposal.count({ where: { status: 'SUBMITTED' } }),
          prisma.proposal.count({ where: { status: 'APPROVED' } }),
          prisma.proposal.count({ where: { status: 'REJECTED' } }),
          prisma.user.count({ where: { status: 'AKTIF' } }),
          prisma.skema.count({ where: { status: 'AKTIF' } }),
          prisma.proposal.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: {
              ketua: { select: { nama: true } },
              skema: { select: { nama: true } }
            }
          })
        ]);

        stats = {
          totalProposals,
          pendingReviews,
          approvedProposals,
          rejectedProposals,
          totalUsers,
          activeSkemas,
          recentProposals
        };

      } else if (userRole.includes('REVIEWER')) {
        const [
          assignedProposals,
          completedReviews,
          pendingReviews,
          recentAssignments
        ] = await Promise.all([
          prisma.proposal.count({ where: { reviewerId: userId } }),
          prisma.review.count({
            where: {
              reviewerId: userId,
              is_final: true
            }
          }),
          prisma.proposal.count({
            where: {
              reviewerId: userId,
              status: 'REVIEW'
            }
          }),
          prisma.proposal.findMany({
            where: { reviewerId: userId },
            take: 5,
            orderBy: { tanggal_submit: 'desc' },
            include: {
              ketua: { select: { nama: true } },
              skema: { select: { nama: true } }
            }
          })
        ]);

        stats = {
          assignedProposals,
          completedReviews,
          pendingReviews,
          recentAssignments
        };

      } else {
        const [
          myProposals,
          draftProposals,
          submittedProposals,
          approvedProposals,
          recentProposals
        ] = await Promise.all([
          prisma.proposal.count({
            where: {
              OR: [
                { ketuaId: userId },
                { members: { some: { userId } } }
              ]
            }
          }),
          prisma.proposal.count({
            where: {
              ketuaId: userId,
              status: 'DRAFT'
            }
          }),
          prisma.proposal.count({
            where: {
              OR: [
                { ketuaId: userId },
                { members: { some: { userId } } }
              ],
              status: { in: ['SUBMITTED', 'REVIEW'] }
            }
          }),
          prisma.proposal.count({
            where: {
              OR: [
                { ketuaId: userId },
                { members: { some: { userId } } }
              ],
              status: 'APPROVED'
            }
          }),
          prisma.proposal.findMany({
            where: {
              OR: [
                { ketuaId: userId },
                { members: { some: { userId } } }
              ]
            },
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: {
              skema: { select: { nama: true } },
              ketua: { select: { nama: true } }
            }
          })
        ]);

        stats = {
          myProposals,
          draftProposals,
          submittedProposals,
          approvedProposals,
          recentProposals
        };
      }

      res.json({
        success: true,
        data: { stats }
      });

    } catch (error) {
      console.error('Get dashboard stats error:', error.message);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  },

  // Endpoint: GET /dashboard/charts
  getCharts: async (req, res) => {
    try {
      let { year } = req.query;
      year = parseInt(year) || new Date().getFullYear();

      if (isNaN(year)) {
        return res.status(400).json({ success: false, message: 'Invalid year parameter' });
      }

      const proposalsByMonth = await prisma.$queryRaw`
        SELECT 
          MONTH(createdAt) as month,
          COUNT(*) as count
        FROM proposals 
        WHERE YEAR(createdAt) = ${year}
        GROUP BY MONTH(createdAt)
        ORDER BY month
      `;

      const proposalsByStatus = await prisma.proposal.groupBy({
        by: ['status'],
        _count: { status: true },
        where: {
          createdAt: {
            gte: new Date(`${year}-01-01`),
            lt: new Date(`${year + 1}-01-01`)
          }
        }
      });

      const proposalsBySkema = await prisma.proposal.groupBy({
        by: ['skemaId'],
        _count: { skemaId: true },
        where: {
          createdAt: {
            gte: new Date(`${year}-01-01`),
            lt: new Date(`${year + 1}-01-01`)
          }
        }
      });

      const skemas = await prisma.skema.findMany({
        select: { id: true, nama: true }
      });

      const skemaMap = skemas.reduce((acc, skema) => {
        acc[skema.id] = skema.nama;
        return acc;
      }, {});

      res.json({
        success: true,
        data: {
          proposalsByMonth: proposalsByMonth.map(item => ({
            month: item.month,
            count: Number(item.count)
          })),
          proposalsByStatus: proposalsByStatus.map(item => ({
            status: item.status,
            count: item._count.status
          })),
          proposalsBySkema: proposalsBySkema.map(item => ({
            skema: skemaMap[item.skemaId] || 'Unknown',
            count: item._count.skemaId
          }))
        }
      });

    } catch (error) {
      console.error('Get charts data error:', error.message);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
};

module.exports = dashboardController;
