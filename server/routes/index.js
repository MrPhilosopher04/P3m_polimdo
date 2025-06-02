// server/routes/index.js
const express = require('express');
const router = express.Router();

// Import all routes
const authRoutes = require('./auth');
const userRoutes = require('./users');
const proposalRoutes = require('./proposals');
const skemaRoutes = require('./skema');
const reviewRoutes = require('./reviews');
const dashboardRoutes = require('./dashboard');

// API Info endpoint
router.get('/', (req, res) => {
  res.json({
    message: 'P3M API Server',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      proposals: '/api/proposals',
      skema: '/api/skema',
      reviews: '/api/reviews',
      dashboard: '/api/dashboard'
    }
  });
});

// Mount routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/proposals', proposalRoutes);
router.use('/skema', skemaRoutes);
router.use('/reviews', reviewRoutes);
router.use('/dashboard', dashboardRoutes);

module.exports = router;