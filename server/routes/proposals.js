const express = require('express');
const proposalController = require('../controllers/proposal.controller');
const { verifyToken, checkRole } = require('../middlewares/auth'); // ✅ Path yang benar
const router = express.Router();

// Semua route memerlukan autentikasi
router.use(verifyToken);

// GET /proposals - Berdasarkan role
router.get('/', proposalController.getAll);

// GET /proposals/:id - Detail proposal
router.get('/:id', proposalController.getById);

// ✅ POST /proposals - Create (DOSEN, MAHASISWA, ADMIN)
router.post(
  '/',
  checkRole('DOSEN', 'MAHASISWA', 'ADMIN'), // ✅ Benar: arguments terpisah
  proposalController.create
);

// PUT /proposals/:id - Update proposal
router.put('/:id', proposalController.update);

// POST /proposals/:id/submit - Submit proposal
router.post('/:id/submit', proposalController.submit);

// ✅ PATCH /proposals/:id/status - Update status (ADMIN, REVIEWER)
router.patch(
  '/:id/status',
  checkRole('ADMIN', 'REVIEWER'), // ✅ Benar: arguments terpisah
  proposalController.updateStatus
);

// DELETE /proposals/:id - Delete proposal
router.delete('/:id', proposalController.delete);

module.exports = router;