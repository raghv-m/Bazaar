import React, { useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { createOrder, capturePayment } from '../services/paymentService';
import { createOrder as createOrderAPI } from '../services/orderService';
import { toast } from '../utils/toast';

const PayPalPayment = ({ onSuccess, onError, orderData }) => {
  const { user } = useAuth();
  const { clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);

  const paypalOptions = {
    'client-id': import.meta.env.VITE_PAYPAL_CLIENT_ID || 'test',
    currency: 'USD',
    intent: 'capture'
  };

  const handleCreateOrder = async (data, actions) => {
    try {
      setIsProcessing(true);
      
      // Create order in our backend
      const orderResponse = await createOrderAPI({
        items: orderData.items,
        shippingAddress: orderData.shippingAddress,
        billingAddress: orderData.billingAddress,
        paymentMethod: 'paypal',
        notes: orderData.notes
      });

      if (!orderResponse.success) {
        throw new Error(orderResponse.message);
      }

      const order = orderResponse.data.order;

      // Create PayPal order
      const paypalResponse = await createOrder({
        orderId: order._id
      });

      if (!paypalResponse.success) {
        throw new Error(paypalResponse.message);
      }

      return paypalResponse.data.orderID;
    } catch (error) {
      console.error('Create order error:', error);
      toast.error(error.message || 'Failed to create order');
      onError && onError(error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApprove = async (data, actions) => {
    try {
      setIsProcessing(true);
      
      // Capture payment
      const captureResponse = await capturePayment({
        orderID: data.orderID
      });

      if (!captureResponse.success) {
        throw new Error(captureResponse.message);
      }

      // Clear cart
      clearCart();

      // Show success message
      toast.success('Payment successful! Your order has been confirmed.');

      // Call success callback
      onSuccess && onSuccess(captureResponse.data);

    } catch (error) {
      console.error('Payment capture error:', error);
      toast.error(error.message || 'Payment failed');
      onError && onError(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleError = (err) => {
    console.error('PayPal error:', err);
    toast.error('Payment failed. Please try again.');
    onError && onError(err);
  };

  const handleCancel = () => {
    toast.info('Payment cancelled');
    onError && onError(new Error('Payment cancelled by user'));
  };

  if (!user) {
    return (
      <div className="text-center p-6">
        <p className="text-gray-600">Please log in to proceed with payment.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Complete Payment with PayPal
        </h3>
        
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Subtotal:</span>
            <span>${orderData.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Tax:</span>
            <span>${orderData.tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Shipping:</span>
            <span>${orderData.shipping.toFixed(2)}</span>
          </div>
          <div className="border-t pt-2">
            <div className="flex justify-between font-semibold text-lg">
              <span>Total:</span>
              <span>${orderData.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {isProcessing && (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-sm text-gray-600 mt-2">Processing payment...</p>
          </div>
        )}

        <PayPalScriptProvider options={paypalOptions}>
          <PayPalButtons
            createOrder={handleCreateOrder}
            onApprove={handleApprove}
            onError={handleError}
            onCancel={handleCancel}
            style={{
              layout: 'vertical',
              color: 'blue',
              shape: 'rect',
              label: 'pay'
            }}
          />
        </PayPalScriptProvider>

        <div className="mt-4 text-xs text-gray-500 text-center">
          <p>Your payment is secure and encrypted.</p>
          <p>You will receive an email confirmation once payment is processed.</p>
        </div>
      </div>
    </div>
  );
};

export default PayPalPayment; 