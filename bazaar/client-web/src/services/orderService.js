import api from './api';

export const orderService = {
  // Create new order
  async createOrder(orderData) {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  // Get user orders
  async getMyOrders(params = {}) {
    const response = await api.get('/orders', { params });
    return response.data;
  },

  // Get single order by ID
  async getOrder(id) {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  // Update order status (vendor/admin only)
  async updateOrderStatus(id, statusData) {
    const response = await api.put(`/orders/${id}/status`, statusData);
    return response.data;
  },

  // Cancel order
  async cancelOrder(id, reason) {
    const response = await api.put(`/orders/${id}/cancel`, { reason });
    return response.data;
  },

  // Get all orders (admin only)
  async getAllOrders(params = {}) {
    const response = await api.get('/orders/admin/all', { params });
    return response.data;
  }
}; 