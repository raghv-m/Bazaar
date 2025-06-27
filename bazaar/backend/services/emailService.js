const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = null;
  }

  async initializeTransporter() {
    // Use Ethereal for testing, or real SMTP for production
    if (process.env.NODE_ENV === 'production') {
      this.transporter = nodemailer.createTransporter({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });
    } else {
      // Create test account for development
      const testAccount = await nodemailer.createTestAccount();
      this.transporter = nodemailer.createTransporter({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass
        }
      });
    }
  }

  // Send order confirmation email
  async sendOrderConfirmation(order, user) {
    try {
      const subject = `Order Confirmation - ${order.orderNumber}`;
      const html = this.generateOrderConfirmationEmail(order, user);
      
      await this.sendEmail({
        to: user.email,
        subject,
        html
      });

      return { success: true, message: 'Order confirmation email sent' };
    } catch (error) {
      console.error('Send order confirmation error:', error);
      return { success: false, message: 'Failed to send order confirmation email' };
    }
  }

  // Send order status update email
  async sendOrderStatusUpdate(order, user, status) {
    try {
      const subject = `Order Status Update - ${order.orderNumber}`;
      const html = this.generateOrderStatusEmail(order, user, status);
      
      await this.sendEmail({
        to: user.email,
        subject,
        html
      });

      return { success: true, message: 'Order status update email sent' };
    } catch (error) {
      console.error('Send order status update error:', error);
      return { success: false, message: 'Failed to send order status update email' };
    }
  }

  // Send payment confirmation email
  async sendPaymentConfirmation(order, user, paymentDetails) {
    try {
      const subject = `Payment Confirmed - ${order.orderNumber}`;
      const html = this.generatePaymentConfirmationEmail(order, user, paymentDetails);
      
      await this.sendEmail({
        to: user.email,
        subject,
        html
      });

      return { success: true, message: 'Payment confirmation email sent' };
    } catch (error) {
      console.error('Send payment confirmation error:', error);
      return { success: false, message: 'Failed to send payment confirmation email' };
    }
  }

  // Send shipping notification email
  async sendShippingNotification(order, user, trackingNumber) {
    try {
      const subject = `Your Order Has Been Shipped - ${order.orderNumber}`;
      const html = this.generateShippingEmail(order, user, trackingNumber);
      
      await this.sendEmail({
        to: user.email,
        subject,
        html
      });

      return { success: true, message: 'Shipping notification email sent' };
    } catch (error) {
      console.error('Send shipping notification error:', error);
      return { success: false, message: 'Failed to send shipping notification email' };
    }
  }

  // Send delivery confirmation email
  async sendDeliveryConfirmation(order, user) {
    try {
      const subject = `Your Order Has Been Delivered - ${order.orderNumber}`;
      const html = this.generateDeliveryEmail(order, user);
      
      await this.sendEmail({
        to: user.email,
        subject,
        html
      });

      return { success: true, message: 'Delivery confirmation email sent' };
    } catch (error) {
      console.error('Send delivery confirmation error:', error);
      return { success: false, message: 'Failed to send delivery confirmation email' };
    }
  }

  // Generic email sending method
  async sendEmail({ to, subject, html, text }) {
    if (!this.transporter) {
      await this.initializeTransporter();
    }

    const mailOptions = {
      from: process.env.FROM_EMAIL || 'noreply@bazaar.com',
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, '') // Strip HTML for text version
    };

    const info = await this.transporter.sendMail(mailOptions);
    
    if (process.env.NODE_ENV !== 'production') {
      console.log('Email sent:', nodemailer.getTestMessageUrl(info));
    }
    
    return info;
  }

  // Generate order confirmation email HTML
  generateOrderConfirmationEmail(order, user) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Order Confirmation</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .order-details { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; }
          .item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
          .total { font-weight: bold; font-size: 18px; text-align: right; margin-top: 20px; }
          .footer { text-align: center; padding: 20px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Order Confirmation</h1>
            <p>Thank you for your order!</p>
          </div>
          
          <div class="content">
            <p>Dear ${user.name},</p>
            <p>We've received your order and it's being processed. Here are your order details:</p>
            
            <div class="order-details">
              <h3>Order #${order.orderNumber}</h3>
              <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
              <p><strong>Status:</strong> ${order.status}</p>
              
              <h4>Items:</h4>
              ${order.items.map(item => `
                <div class="item">
                  <span>${item.product.name} x ${item.quantity}</span>
                  <span>$${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              `).join('')}
              
              <div class="total">
                <p>Subtotal: $${order.subtotal.toFixed(2)}</p>
                <p>Tax: $${order.tax.toFixed(2)}</p>
                <p>Shipping: $${order.shipping.toFixed(2)}</p>
                <p>Total: $${order.total.toFixed(2)}</p>
              </div>
            </div>
            
            <p>We'll send you updates as your order progresses.</p>
          </div>
          
          <div class="footer">
            <p>Thank you for shopping with Bazaar!</p>
            <p>If you have any questions, please contact our support team.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Generate order status update email HTML
  generateOrderStatusEmail(order, user, status) {
    const statusMessages = {
      'confirmed': 'Your order has been confirmed and is being prepared.',
      'processing': 'Your order is being processed and will be shipped soon.',
      'shipped': 'Your order has been shipped and is on its way to you.',
      'delivered': 'Your order has been delivered successfully!'
    };

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Order Status Update</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .status { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; text-align: center; }
          .footer { text-align: center; padding: 20px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Order Status Update</h1>
          </div>
          
          <div class="content">
            <p>Dear ${user.name},</p>
            
            <div class="status">
              <h3>Order #${order.orderNumber}</h3>
              <p><strong>New Status:</strong> ${status.charAt(0).toUpperCase() + status.slice(1)}</p>
              <p>${statusMessages[status] || 'Your order status has been updated.'}</p>
            </div>
            
            <p>You can track your order status in your account dashboard.</p>
          </div>
          
          <div class="footer">
            <p>Thank you for shopping with Bazaar!</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Generate payment confirmation email HTML
  generatePaymentConfirmationEmail(order, user, paymentDetails) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Payment Confirmed</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .payment-details { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; }
          .footer { text-align: center; padding: 20px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Payment Confirmed</h1>
            <p>Your payment has been processed successfully!</p>
          </div>
          
          <div class="content">
            <p>Dear ${user.name},</p>
            <p>We've received your payment for order #${order.orderNumber}.</p>
            
            <div class="payment-details">
              <h3>Payment Details</h3>
              <p><strong>Transaction ID:</strong> ${paymentDetails.transactionID}</p>
              <p><strong>Amount:</strong> $${paymentDetails.amount}</p>
              <p><strong>Payment Method:</strong> PayPal</p>
              <p><strong>Status:</strong> ${paymentDetails.status}</p>
            </div>
            
            <p>Your order is now being processed and will be shipped soon.</p>
          </div>
          
          <div class="footer">
            <p>Thank you for your payment!</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Generate shipping notification email HTML
  generateShippingEmail(order, user, trackingNumber) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Order Shipped</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #007bff 0%, #0056b3 100%); color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .shipping-details { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; }
          .footer { text-align: center; padding: 20px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Your Order Has Been Shipped!</h1>
            <p>Order #${order.orderNumber} is on its way to you</p>
          </div>
          
          <div class="content">
            <p>Dear ${user.name},</p>
            <p>Great news! Your order has been shipped and is on its way to you.</p>
            
            <div class="shipping-details">
              <h3>Shipping Information</h3>
              <p><strong>Order Number:</strong> ${order.orderNumber}</p>
              <p><strong>Tracking Number:</strong> ${trackingNumber}</p>
              <p><strong>Estimated Delivery:</strong> ${order.estimatedDelivery ? new Date(order.estimatedDelivery).toLocaleDateString() : '3-5 business days'}</p>
            </div>
            
            <p>You can track your package using the tracking number above.</p>
          </div>
          
          <div class="footer">
            <p>Thank you for shopping with Bazaar!</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Generate delivery confirmation email HTML
  generateDeliveryEmail(order, user) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Order Delivered</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .delivery-details { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; }
          .footer { text-align: center; padding: 20px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Your Order Has Been Delivered!</h1>
            <p>Order #${order.orderNumber} has arrived</p>
          </div>
          
          <div class="content">
            <p>Dear ${user.name},</p>
            <p>Your order has been successfully delivered!</p>
            
            <div class="delivery-details">
              <h3>Delivery Information</h3>
              <p><strong>Order Number:</strong> ${order.orderNumber}</p>
              <p><strong>Delivery Date:</strong> ${new Date().toLocaleDateString()}</p>
            </div>
            
            <p>We hope you enjoy your purchase! If you have any questions or need assistance, please don't hesitate to contact us.</p>
            
            <p>Please consider leaving a review for the products you purchased.</p>
          </div>
          
          <div class="footer">
            <p>Thank you for shopping with Bazaar!</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

module.exports = new EmailService(); 