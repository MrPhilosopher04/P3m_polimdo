const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const { verifyToken } = require('../middlewares/auth'); // ✅ Perbaikan di sini

// Apply authentication middleware to all routes
router.use(verifyToken); // ✅ Gunakan verifyToken

// Dashboard statistics
router.get('/stats', dashboardController.getDashboardStats);

// Recent data endpoints
router.get('/recent-proposals', dashboardController.getRecentProposals);
router.get('/recent-users', dashboardController.getRecentUsers);
router.get('/recent-reviews', dashboardController.getRecentReviews);

// Announcements
router.get('/announcements', dashboardController.getAnnouncements);

// Admin specific endpoints
router.get('/system-health', dashboardController.getSystemHealth);
router.get('/activity-logs', dashboardController.getActivityLogs);

module.exports = router;
