const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const { roles } = require('../middlewares/roles');
const {
  createPayPalOrder,
  capturePayPalPayment,
  getPayPalOrderDetails,
  refundPayPalPayment
} = require('../controllers/paymentController');

// PayPal payment routes
router.post('/paypal/create', protect, createPayPalOrder);
router.post('/paypal/capture', protect, capturePayPalPayment);
router.get('/paypal/order/:orderID', protect, getPayPalOrderDetails);
router.post('/paypal/refund', protect, roles('admin', 'vendor'), refundPayPalPayment);

module.exports = router; 