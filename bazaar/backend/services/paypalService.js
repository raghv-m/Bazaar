const axios = require('axios');

class PayPalService {
  constructor() {
    this.baseURL = process.env.NODE_ENV === 'production' 
      ? 'https://api-m.paypal.com' 
      : 'https://api-m.sandbox.paypal.com';
    
    this.clientId = process.env.PAYPAL_CLIENT_ID;
    this.clientSecret = process.env.PAYPAL_CLIENT_SECRET;
    this.accessToken = null;
    this.tokenExpiry = null;
  }

  // Get PayPal access token
  async getAccessToken() {
    if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    try {
      const auth = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');
      const response = await axios.post(`${this.baseURL}/v1/oauth2/token`, 
        'grant_type=client_credentials',
        {
          headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      this.accessToken = response.data.access_token;
      this.tokenExpiry = Date.now() + (response.data.expires_in * 1000);
      
      return this.accessToken;
    } catch (error) {
      console.error('PayPal access token error:', error.response?.data || error.message);
      throw new Error('Failed to get PayPal access token');
    }
  }

  // Create PayPal order
  async createOrder(orderData) {
    try {
      const accessToken = await this.getAccessToken();
      
      const payload = {
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: 'USD',
            value: orderData.total.toString()
          },
          description: `Order ${orderData.orderNumber}`,
          custom_id: orderData.orderId,
          items: orderData.items.map(item => ({
            name: item.product.name,
            unit_amount: {
              currency_code: 'USD',
              value: item.price.toString()
            },
            quantity: item.quantity.toString(),
            category: 'PHYSICAL_GOODS'
          })),
          shipping: {
            address: {
              address_line_1: orderData.shippingAddress.street,
              admin_area_2: orderData.shippingAddress.city,
              admin_area_1: orderData.shippingAddress.state,
              postal_code: orderData.shippingAddress.zipCode,
              country_code: orderData.shippingAddress.country
            }
          }
        }],
        application_context: {
          return_url: `${process.env.FRONTEND_URL}/payment/success`,
          cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`,
          shipping_preference: 'SET_PROVIDED_ADDRESS'
        }
      };

      const response = await axios.post(`${this.baseURL}/v2/checkout/orders`, payload, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      return {
        success: true,
        data: {
          orderID: response.data.id,
          approvalURL: response.data.links.find(link => link.rel === 'approve').href
        }
      };
    } catch (error) {
      console.error('PayPal create order error:', error.response?.data || error.message);
      return {
        success: false,
        message: 'Failed to create PayPal order',
        error: error.response?.data || error.message
      };
    }
  }

  // Capture PayPal payment
  async capturePayment(orderID) {
    try {
      const accessToken = await this.getAccessToken();
      
      const response = await axios.post(`${this.baseURL}/v2/checkout/orders/${orderID}/capture`, {}, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      const capture = response.data.purchase_units[0].payments.captures[0];
      
      return {
        success: true,
        data: {
          captureID: capture.id,
          status: capture.status,
          amount: capture.amount.value,
          currency: capture.amount.currency_code,
          transactionID: capture.id
        }
      };
    } catch (error) {
      console.error('PayPal capture payment error:', error.response?.data || error.message);
      return {
        success: false,
        message: 'Failed to capture PayPal payment',
        error: error.response?.data || error.message
      };
    }
  }

  // Get PayPal order details
  async getOrderDetails(orderID) {
    try {
      const accessToken = await this.getAccessToken();
      
      const response = await axios.get(`${this.baseURL}/v2/checkout/orders/${orderID}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('PayPal get order details error:', error.response?.data || error.message);
      return {
        success: false,
        message: 'Failed to get PayPal order details',
        error: error.response?.data || error.message
      };
    }
  }

  // Refund PayPal payment
  async refundPayment(captureID, amount = null) {
    try {
      const accessToken = await this.getAccessToken();
      
      const payload = amount ? {
        amount: {
          value: amount.toString(),
          currency_code: 'USD'
        }
      } : {};

      const response = await axios.post(`${this.baseURL}/v2/payments/captures/${captureID}/refund`, payload, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      return {
        success: true,
        data: {
          refundID: response.data.id,
          status: response.data.status,
          amount: response.data.amount.value
        }
      };
    } catch (error) {
      console.error('PayPal refund error:', error.response?.data || error.message);
      return {
        success: false,
        message: 'Failed to refund PayPal payment',
        error: error.response?.data || error.message
      };
    }
  }
}

module.exports = new PayPalService(); 