const express = require('express');
const router = express.Router();
const {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  addReview,
  getVendorProducts
} = require('../controllers/productController');
const auth = require('../middlewares/auth');
const { isVendor, isAdmin } = require('../middlewares/roles');

// Public routes - specific routes first
router.get('/', getProducts);
router.get('/vendor/:vendorId', getVendorProducts);
router.get('/:id', getProduct);

// Protected routes
router.post('/:id/reviews', auth, addReview);

// Vendor/Admin only routes
router.post('/', auth, isVendor, createProduct);
router.put('/:id', auth, isVendor, updateProduct);
router.delete('/:id', auth, isVendor, deleteProduct);

module.exports = router; 