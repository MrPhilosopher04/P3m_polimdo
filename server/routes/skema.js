const express = require('express');
const skemaController = require('../controllers/skema.controller');
const { verifyToken, checkRole } = require('../middlewares/auth');

const router = express.Router();

router.get('/', skemaController.getAll);
router.get('/:id', skemaController.getById);
router.post('/', verifyToken, checkRole('ADMIN'), skemaController.create);
router.put('/:id', verifyToken, checkRole('ADMIN'), skemaController.update);

module.exports = router;
