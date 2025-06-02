const express = require('express');
const userController = require('../controllers/user.controller');
const { verifyToken, checkRole } = require('../middlewares/auth'); // Perbaiki path (singular)

const router = express.Router();

// Middleware untuk memastikan user sudah login
router.use(verifyToken);

// Routes
router.get('/', checkRole('ADMIN'), userController.getAll);
router.get('/reviewers', checkRole('ADMIN', 'REVIEWER'), userController.getReviewers);
router.post('/', checkRole('ADMIN'), userController.create);
router.put('/:id/status', checkRole('ADMIN'), userController.updateStatus);

module.exports = router;