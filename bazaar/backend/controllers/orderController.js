const Order = require('../models/Order');
const Product = require('../models/Product');
const emailService = require('../services/emailService');

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, billingAddress, paymentMethod, notes } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order must contain at least one item'
      });
    }

    // Validate and calculate order items
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product with ID ${item.product} not found`
        });
      }

      if (!product.isActive) {
        return res.status(400).json({
          success: false,
          message: `Product ${product.name} is not available`
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}`
        });
      }

      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
        total: itemTotal
      });

      // Update product stock
      product.stock -= item.quantity;
      await product.save();
    }

    // Calculate totals
    const tax = subtotal * 0.1; // 10% tax
    const shipping = subtotal > 100 ? 0 : 10; // Free shipping over $100
    const total = subtotal + tax + shipping;

    const order = new Order({
      customer: req.user._id,
      items: orderItems,
      subtotal,
      tax,
      shipping,
      total,
      paymentMethod,
      shippingAddress,
      billingAddress,
      notes
    });

    await order.save();

    const populatedOrder = await Order.findById(order._id)
      .populate('customer', 'name email')
      .populate('items.product', 'name price images');

    // Send order confirmation email
    try {
      await emailService.sendOrderConfirmation(populatedOrder, populatedOrder.customer);
    } catch (emailError) {
      console.error('Failed to send order confirmation email:', emailError);
      // Don't fail the order creation if email fails
    }

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: {
        order: populatedOrder
      }
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating order',
      error: error.message
    });
  }
};

// @desc    Get all orders for current user
// @route   GET /api/orders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const filter = { customer: req.user._id };
    if (status) filter.status = status;

    const orders = await Order.find(filter)
      .populate('items.product', 'name price images')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Order.countDocuments(filter);

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalOrders: total
        }
      }
    });
  } catch (error) {
    console.error('Get my orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching orders',
      error: error.message
    });
  }
};

// @desc    Get single order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customer', 'name email phone')
      .populate('items.product', 'name price images vendor')
      .populate('cancelledBy.user', 'name');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user is authorized to view this order
    if (order.customer._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order'
      });
    }

    res.json({
      success: true,
      data: {
        order
      }
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching order',
      error: error.message
    });
  }
};

// @desc    Update order status (Admin/Vendor only)
// @route   PUT /api/orders/:id/status
// @access  Private (Admin/Vendor)
const updateOrderStatus = async (req, res) => {
  try {
    const { status, trackingNumber, estimatedDelivery, notes } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user is authorized to update this order
    const isVendorForOrder = order.items.some(item => 
      item.product.vendor && item.product.vendor.toString() === req.user._id.toString()
    );

    if (!isVendorForOrder && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this order'
      });
    }

    // Update fields
    if (status) order.status = status;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (estimatedDelivery) order.estimatedDelivery = estimatedDelivery;
    if (notes) order.notes = notes;

    await order.save();

    const updatedOrder = await Order.findById(req.params.id)
      .populate('customer', 'name email phone')
      .populate('items.product', 'name price images vendor');

    // Send status update email
    if (status) {
      try {
        await emailService.sendOrderStatusUpdate(updatedOrder, updatedOrder.customer, status);
        
        // Send shipping notification if status is shipped
        if (status === 'shipped' && trackingNumber) {
          await emailService.sendShippingNotification(updatedOrder, updatedOrder.customer, trackingNumber);
        }
        
        // Send delivery confirmation if status is delivered
        if (status === 'delivered') {
          await emailService.sendDeliveryConfirmation(updatedOrder, updatedOrder.customer);
        }
      } catch (emailError) {
        console.error('Failed to send status update email:', emailError);
        // Don't fail the status update if email fails
      }
    }

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: {
        order: updatedOrder
      }
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating order status',
      error: error.message
    });
  }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
const cancelOrder = async (req, res) => {
  try {
    const { reason } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user is authorized to cancel this order
    if (order.customer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this order'
      });
    }

    // Check if order can be cancelled
    if (['shipped', 'delivered'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: 'Order cannot be cancelled at this stage'
      });
    }

    // Cancel order
    order.status = 'cancelled';
    order.cancelledBy = {
      user: req.user._id,
      reason,
      cancelledAt: new Date()
    };

    // Restore product stock
    for (const item of order.items) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock += item.quantity;
        await product.save();
      }
    }

    await order.save();

    const updatedOrder = await Order.findById(req.params.id)
      .populate('customer', 'name email phone')
      .populate('items.product', 'name price images vendor')
      .populate('cancelledBy.user', 'name');

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      data: {
        order: updatedOrder
      }
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while cancelling order',
      error: error.message
    });
  }
};

// @desc    Get all orders (Admin only)
// @route   GET /api/orders/admin/all
// @access  Private (Admin)
const getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, customer } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const filter = {};
    if (status) filter.status = status;
    if (customer) filter.customer = customer;

    const orders = await Order.find(filter)
      .populate('customer', 'name email')
      .populate('items.product', 'name price vendor')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Order.countDocuments(filter);

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalOrders: total
        }
      }
    });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching orders',
      error: error.message
    });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrder,
  updateOrderStatus,
  cancelOrder,
  getAllOrders
}; 