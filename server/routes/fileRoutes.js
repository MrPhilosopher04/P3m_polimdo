//server/routes/fileRoutes.js
const express = require('express');
const router = express.Router();
const fileController = require('../controllers/file.controller');
const { upload } = require('../middlewares/upload');
const { authMiddleware } = require('../middlewares/auth');

// Dapatkan dokumen berdasarkan proposal
router.get('/proposal/:proposalId', authMiddleware, fileController.getByProposal);

// Download dokumen
router.get('/:id', authMiddleware, fileController.downloadDocument);

// Hapus dokumen
router.delete('/:id', authMiddleware, fileController.deleteDocument);

// Upload dokumen
router.post('/:proposalId', 
  authMiddleware, 
  upload.single('file'), 
  fileController.uploadDocument
);


module.exports = router;