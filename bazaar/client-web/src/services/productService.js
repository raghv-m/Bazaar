import api from './api';

export const productService = {
  // Get all products with filters
  async getProducts(params = {}) {
    const response = await api.get('/products', { params });
    return response.data;
  },

  // Get single product by ID
  async getProduct(id) {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // Create new product (vendor/admin only)
  async createProduct(productData) {
    const response = await api.post('/products', productData);
    return response.data;
  },

  // Update product (vendor/admin only)
  async updateProduct(id, productData) {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  },

  // Delete product (vendor/admin only)
  async deleteProduct(id) {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  // Add product review
  async addReview(productId, reviewData) {
    const response = await api.post(`/products/${productId}/reviews`, reviewData);
    return response.data;
  },

  // Get vendor products
  async getVendorProducts(vendorId, params = {}) {
    const response = await api.get(`/products/vendor/${vendorId}`, { params });
    return response.data;
  },

  // Search products
  async searchProducts(query, params = {}) {
    const response = await api.get('/products', { 
      params: { ...params, search: query }
    });
    return response.data;
  }
}; 