const express = require('express');
const pengumumanController = require('../controllers/pengumuman.controller');
const { authMiddleware, authorize } = require('../middlewares/auth');

const router = express.Router();

// Public routes
router.get('/', pengumumanController.getAll);
router.get('/:id', pengumumanController.getById);

// Protected routes - Admin only
router.post('/', authMiddleware, authorize(['ADMIN']), pengumumanController.create);
router.put('/:id', authMiddleware, authorize(['ADMIN']), pengumumanController.update);
router.delete('/:id', authMiddleware, authorize(['ADMIN']), pengumumanController.delete);
router.patch('/:id/status', authMiddleware, authorize(['ADMIN']), pengumumanController.updateStatus);

module.exports = router;