// server/routes/skema.js
const express = require('express');
const router = express.Router();
const skemaController = require('../controllers/skema.controller');
const { auth } = require('../middlewares/auth');
const { roleMiddleware } = require('../middlewares/roleMiddleware'); // ✅ gunakan destructuring

// Public routes (can be accessed without authentication for viewing)
router.get('/stats', skemaController.getSkemaStats);
router.get('/active', skemaController.getActiveSkema);
router.get('/:id', skemaController.getSkemaById);
router.get('/', skemaController.getAllSkema);

// Protected routes - require authentication
router.use(auth); // Apply authentication to all routes below

// Admin only routes
router.post('/', roleMiddleware(['ADMIN']), skemaController.createSkema);
router.put('/:id', roleMiddleware(['ADMIN']), skemaController.updateSkema);
router.delete('/:id', roleMiddleware(['ADMIN']), skemaController.deleteSkema);

module.exports = router;
