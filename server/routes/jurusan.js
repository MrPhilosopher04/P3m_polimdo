// server/routes/jurusan.js
const express = require('express');
const router = express.Router();
const jurusanController = require('../controllers/jurusanController');

// Route publik untuk registrasi (tanpa auth)
router.get('/public', jurusanController.getAllJurusan);

// Route publik untuk mendapatkan prodi berdasarkan jurusan (untuk registrasi)
router.get('/:id/prodi', jurusanController.getProdiByJurusan);

// Semua route di bawah ini sekarang juga publik (tidak ada auth/checkRole)
router.get('/', jurusanController.getAllJurusan);
router.get('/:id', jurusanController.getJurusanById);
router.post('/', jurusanController.createJurusan);
router.put('/:id', jurusanController.updateJurusan);
router.delete('/:id', jurusanController.deleteJurusan);

module.exports = router;
