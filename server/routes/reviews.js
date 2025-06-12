const express = require('express');
const router = express.Router();

const {
  getAllReviews,
  getReviewById,
  updateReview,
  deleteReview,
  getReviewers,
  assignReviewer,
  getProposalsForReview,
  createReview
} = require('../controllers/review.controller');

const { verifyToken } = require('../middlewares/auth');
const { roleMiddleware } = require('../middlewares/roleMiddleware');

// ✅ Middleware: Semua route di bawah ini butuh login
router.use(verifyToken);

// ✅ GET all reviews (admin, reviewer, dosen, mahasiswa)
router.get('/', roleMiddleware(['ADMIN', 'REVIEWER', 'DOSEN', 'MAHASISWA']), getAllReviews);

// ✅ GET proposals untuk direview (reviewer dan admin)
router.get('/proposals', roleMiddleware(['REVIEWER', 'ADMIN']), getProposalsForReview);

// ✅ GET reviewers (admin only)
router.get('/reviewers', roleMiddleware(['ADMIN']), getReviewers);

// ✅ POST create new review (reviewer dan admin)
router.post('/', roleMiddleware(['REVIEWER', 'ADMIN']), createReview);

// ✅ POST assign reviewer ke proposal (admin only)
router.post('/assign', roleMiddleware(['ADMIN']), assignReviewer);

// ✅ GET review by ID (accessible by semua role, pembatasan detail di controller)
router.get('/:id', roleMiddleware(['ADMIN', 'REVIEWER', 'DOSEN', 'MAHASISWA']), getReviewById);

// ✅ PUT update review (admin dan reviewer only)
router.put('/:id', roleMiddleware(['ADMIN', 'REVIEWER']), updateReview);

// ✅ DELETE review (admin only)
router.delete('/:id', roleMiddleware(['ADMIN']), deleteReview);

module.exports = router;