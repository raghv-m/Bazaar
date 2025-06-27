const paypalService = require('../services/paypalService');
const emailService = require('../services/emailService');
const Order = require('../models/Order');
const User = require('../models/User');

// @desc    Create PayPal order
// @route   POST /api/payments/paypal/create
// @access  Private
const createPayPalOrder = async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: 'Order ID is required'
      });
    }

    // Get order details
    const order = await Order.findById(orderId)
      .populate('customer', 'name email')
      .populate('items.product', 'name price');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user owns this order
    if (order.customer._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this order'
      });
    }

    // Check if order is already paid
    if (order.paymentStatus === 'paid') {
      return res.status(400).json({
        success: false,
        message: 'Order is already paid'
      });
    }

    // Prepare order data for PayPal
    const orderData = {
      orderId: order._id,
      orderNumber: order.orderNumber,
      total: order.total,
      items: order.items,
      shippingAddress: order.shippingAddress
    };

    // Create PayPal order
    const paypalResult = await paypalService.createOrder(orderData);

    if (!paypalResult.success) {
      return res.status(500).json({
        success: false,
        message: paypalResult.message,
        error: paypalResult.error
      });
    }

    // Update order with PayPal order ID
    order.paypalOrderId = paypalResult.data.orderID;
    await order.save();

    res.json({
      success: true,
      message: 'PayPal order created successfully',
      data: {
        orderID: paypalResult.data.orderID,
        approvalURL: paypalResult.data.approvalURL
      }
    });
  } catch (error) {
    console.error('Create PayPal order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating PayPal order',
      error: error.message
    });
  }
};

// @desc    Capture PayPal payment
// @route   POST /api/payments/paypal/capture
// @access  Private
const capturePayPalPayment = async (req, res) => {
  try {
    const { orderID } = req.body;

    if (!orderID) {
      return res.status(400).json({
        success: false,
        message: 'PayPal Order ID is required'
      });
    }

    // Find order by PayPal order ID
    const order = await Order.findOne({ paypalOrderId: orderID })
      .populate('customer', 'name email')
      .populate('items.product', 'name price');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user owns this order
    if (order.customer._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this order'
      });
    }

    // Capture payment from PayPal
    const captureResult = await paypalService.capturePayment(orderID);

    if (!captureResult.success) {
      return res.status(500).json({
        success: false,
        message: captureResult.message,
        error: captureResult.error
      });
    }

    // Update order with payment details
    order.paymentStatus = 'paid';
    order.status = 'confirmed';
    order.paymentDetails = {
      method: 'paypal',
      transactionID: captureResult.data.transactionID,
      captureID: captureResult.data.captureID,
      amount: captureResult.data.amount,
      currency: captureResult.data.currency,
      status: captureResult.data.status,
      capturedAt: new Date()
    };

    await order.save();

    // Send payment confirmation email
    await emailService.sendPaymentConfirmation(order, order.customer, captureResult.data);

    // Send order confirmation email
    await emailService.sendOrderConfirmation(order, order.customer);

    res.json({
      success: true,
      message: 'Payment captured successfully',
      data: {
        orderId: order._id,
        orderNumber: order.orderNumber,
        paymentStatus: order.paymentStatus,
        transactionID: captureResult.data.transactionID
      }
    });
  } catch (error) {
    console.error('Capture PayPal payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while capturing payment',
      error: error.message
    });
  }
};

// @desc    Get PayPal order details
// @route   GET /api/payments/paypal/order/:orderID
// @access  Private
const getPayPalOrderDetails = async (req, res) => {
  try {
    const { orderID } = req.params;

    const orderDetails = await paypalService.getOrderDetails(orderID);

    if (!orderDetails.success) {
      return res.status(500).json({
        success: false,
        message: orderDetails.message,
        error: orderDetails.error
      });
    }

    res.json({
      success: true,
      data: orderDetails.data
    });
  } catch (error) {
    console.error('Get PayPal order details error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while getting PayPal order details',
      error: error.message
    });
  }
};

// @desc    Refund PayPal payment
// @route   POST /api/payments/paypal/refund
// @access  Private (Admin/Vendor)
const refundPayPalPayment = async (req, res) => {
  try {
    const { captureID, amount, reason } = req.body;

    if (!captureID) {
      return res.status(400).json({
        success: false,
        message: 'Capture ID is required'
      });
    }

    // Find order by capture ID
    const order = await Order.findOne({ 'paymentDetails.captureID': captureID })
      .populate('customer', 'name email');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user is authorized (admin or vendor)
    if (req.user.role !== 'admin' && order.customer._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to refund this payment'
      });
    }

    // Process refund through PayPal
    const refundResult = await paypalService.refundPayment(captureID, amount);

    if (!refundResult.success) {
      return res.status(500).json({
        success: false,
        message: refundResult.message,
        error: refundResult.error
      });
    }

    // Update order status
    order.paymentStatus = 'refunded';
    order.status = 'refunded';
    order.refundDetails = {
      refundID: refundResult.data.refundID,
      amount: refundResult.data.amount,
      status: refundResult.data.status,
      reason: reason || 'Customer request',
      refundedAt: new Date()
    };

    await order.save();

    // Send refund notification email
    await emailService.sendEmail({
      to: order.customer.email,
      subject: `Payment Refunded - ${order.orderNumber}`,
      html: `
        <h2>Payment Refunded</h2>
        <p>Dear ${order.customer.name},</p>
        <p>Your payment for order #${order.orderNumber} has been refunded.</p>
        <p><strong>Refund Amount:</strong> $${refundResult.data.amount}</p>
        <p><strong>Refund ID:</strong> ${refundResult.data.refundID}</p>
        <p><strong>Reason:</strong> ${reason || 'Customer request'}</p>
        <p>The refund will be processed to your original payment method within 3-5 business days.</p>
      `
    });

    res.json({
      success: true,
      message: 'Payment refunded successfully',
      data: {
        orderId: order._id,
        orderNumber: order.orderNumber,
        refundID: refundResult.data.refundID,
        amount: refundResult.data.amount
      }
    });
  } catch (error) {
    console.error('Refund PayPal payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while processing refund',
      error: error.message
    });
  }
};

module.exports = {
  createPayPalOrder,
  capturePayPalPayment,
  getPayPalOrderDetails,
  refundPayPalPayment
}; 