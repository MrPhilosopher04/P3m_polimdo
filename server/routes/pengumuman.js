const express = require('express');
const pengumumanController = require('../controllers/pengumuman.controller');
const { verifyToken, checkRole } = require('../middlewares/auth');

const router = express.Router();

// Public routes
router.get('/', pengumumanController.getAll);
router.get('/:id', pengumumanController.getById);

// Protected routes - Admin only
router.post('/', verifyToken, checkRole('ADMIN'), pengumumanController.create);
router.put('/:id', verifyToken, checkRole('ADMIN'), pengumumanController.update);
router.delete('/:id', verifyToken, checkRole('ADMIN'), pengumumanController.delete);
router.patch('/:id/status', verifyToken, checkRole('ADMIN'), pengumumanController.updateStatus);

module.exports = router;
