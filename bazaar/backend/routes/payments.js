const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { roles } = require('../middlewares/roles');
const {
  createPayPalOrder,
  capturePayPalPayment,
  getPayPalOrderDetails,
  refundPayPalPayment
} = require('../controllers/paymentController');

// PayPal payment routes
router.post('/paypal/create', auth, createPayPalOrder);
router.post('/paypal/capture', auth, capturePayPalPayment);
router.get('/paypal/order/:orderID', auth, getPayPalOrderDetails);
router.post('/paypal/refund', auth, roles('admin', 'vendor'), refundPayPalPayment);

module.exports = router; 