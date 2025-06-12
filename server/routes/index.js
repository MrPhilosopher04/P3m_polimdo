// server/routes/index.js
const express = require('express');
const authRoutes = require('./auth');
const userRoutes = require('./users');
const proposalRoutes = require('./proposals');
const skemaRoutes = require('./skema');
const reviewRoutes = require('./reviews');
const dashboardRoutes = require('./dashboard');
const fileRoutes = require('./fileRoutes');
const jurusanRoutes = require('./jurusan');
const prodiRoutes = require('./prodi');

const router = express.Router();

// Register all routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/proposals', proposalRoutes);
router.use('/skema', skemaRoutes);
router.use('/reviews', reviewRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/files', fileRoutes);
router.use('/jurusan', jurusanRoutes);
router.use('/prodi', prodiRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;