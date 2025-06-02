const express = require('express');
const reviewController = require('../controllers/review.controller');
const { verifyToken, checkRole } = require('../middlewares/auth');

const router = express.Router();

router.use(verifyToken);

router.get('/for-review', checkRole('REVIEWER_PENELITIAN', 'REVIEWER_PENGABDIAN'), reviewController.getForReview);
router.post('/assign', checkRole('ADMIN'), reviewController.assignReviewer);
router.post('/:proposalId', checkRole('REVIEWER_PENELITIAN', 'REVIEWER_PENGABDIAN'), reviewController.submitReview);

module.exports = router;
