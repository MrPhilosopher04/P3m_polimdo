const express = require('express');
const proposalController = require('../controllers/proposal.controller');
const { verifyToken, checkRole } = require('../middlewares/auth');

const router = express.Router();

// Semua route wajib verifikasi token dulu
router.use(verifyToken);

router.get('/', proposalController.getAll);
router.get('/mine', proposalController.getMine); // Pastikan fungsi ini ada di controller
router.get('/:id', proposalController.getById);

// Hanya user dengan role DOSEN atau ADMIN yang boleh create, update, submit, delete
router.post('/', checkRole('DOSEN', 'ADMIN'), proposalController.create);
router.put('/:id', checkRole('DOSEN', 'ADMIN'), proposalController.update);
router.post('/:id/submit', checkRole('DOSEN', 'ADMIN'), proposalController.submit);

// Upload dokumen tetap langsung ke controller, karena di controller sudah menangani middleware upload
router.post('/:id/upload', proposalController.uploadDocument);

// Delete juga dibatasi role DOSEN dan ADMIN
router.delete('/:id', checkRole('DOSEN', 'ADMIN'), proposalController.delete);

module.exports = router;
