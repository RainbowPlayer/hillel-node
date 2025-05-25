const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const { authenticateToken } = require('../middleware/auth');

router.get('/:id', authenticateToken, userController.getById);
router.get('/:id/orders/count', authenticateToken, userController.countOrders);

module.exports = router; 