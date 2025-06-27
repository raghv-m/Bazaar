const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrder,
  updateOrderStatus,
  cancelOrder,
  getAllOrders
} = require('../controllers/orderController');
const auth = require('../middlewares/auth');
const { isVendor, isAdmin } = require('../middlewares/roles');

// Customer routes
router.post('/', auth, createOrder);
router.get('/', auth, getMyOrders);

// Admin only routes - specific routes first
router.get('/admin/all', auth, isAdmin, getAllOrders);

// Parameterized routes
router.get('/:id', auth, getOrder);
router.put('/:id/cancel', auth, cancelOrder);

// Vendor/Admin routes
router.put('/:id/status', auth, isVendor, updateOrderStatus);

module.exports = router; 