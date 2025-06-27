import api from './api';

export const createOrder = async ({ orderId }) => {
  try {
    const res = await api.post('/payments/paypal/create', { orderId });
    return res.data;
  } catch (error) {
    return error.response?.data || { success: false, message: error.message };
  }
};

export const capturePayment = async ({ orderID }) => {
  try {
    const res = await api.post('/payments/paypal/capture', { orderID });
    return res.data;
  } catch (error) {
    return error.response?.data || { success: false, message: error.message };
  }
}; 