const express = require('express');
const dashboardController = require('../controllers/dashboard.controller');
const { verifyToken } = require('../middlewares/auth');

const router = express.Router();

// Gunakan middleware otentikasi
router.use(verifyToken);

// Endpoint dashboard
router.get('/stats', dashboardController.getStats);
router.get('/charts', dashboardController.getCharts);

module.exports = router;
