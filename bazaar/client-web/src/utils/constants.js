// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// User Roles
export const USER_ROLES = {
  CUSTOMER: 'customer',
  VENDOR: 'vendor',
  ADMIN: 'admin'
};

// Order Status
export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded'
};

// Payment Methods
export const PAYMENT_METHODS = {
  CREDIT_CARD: 'credit_card',
  DEBIT_CARD: 'debit_card',
  PAYPAL: 'paypal',
  STRIPE: 'stripe',
  CASH_ON_DELIVERY: 'cash_on_delivery'
};

// Product Categories
export const PRODUCT_CATEGORIES = [
  'Electronics',
  'Clothing',
  'Home & Garden',
  'Books',
  'Sports & Outdoors',
  'Beauty & Health',
  'Toys & Games',
  'Automotive',
  'Food & Beverages',
  'Jewelry',
  'Art & Crafts',
  'Pet Supplies'
];

// Navigation Items
export const NAV_ITEMS = {
  CUSTOMER: [
    { name: 'Home', path: '/', icon: 'Home' },
    { name: 'Products', path: '/products', icon: 'Package' },
    { name: 'Cart', path: '/cart', icon: 'ShoppingCart' },
    { name: 'Orders', path: '/orders', icon: 'PackageCheck' },
    { name: 'Profile', path: '/profile', icon: 'User' }
  ],
  VENDOR: [
    { name: 'Dashboard', path: '/dashboard', icon: 'LayoutDashboard' },
    { name: 'Products', path: '/dashboard/products', icon: 'Package' },
    { name: 'Orders', path: '/dashboard/orders', icon: 'PackageCheck' },
    { name: 'Analytics', path: '/dashboard/analytics', icon: 'BarChart3' },
    { name: 'Profile', path: '/profile', icon: 'User' }
  ],
  ADMIN: [
    { name: 'Dashboard', path: '/admin', icon: 'LayoutDashboard' },
    { name: 'Users', path: '/admin/users', icon: 'Users' },
    { name: 'Products', path: '/admin/products', icon: 'Package' },
    { name: 'Orders', path: '/admin/orders', icon: 'PackageCheck' },
    { name: 'Analytics', path: '/admin/analytics', icon: 'BarChart3' }
  ]
};

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'bazaar_token',
  USER: 'bazaar_user',
  CART: 'bazaar_cart',
  THEME: 'bazaar_theme'
};

// Theme
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark'
};

// Toast Types
export const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

// Pagination
export const DEFAULT_PAGE_SIZE = 12;

// Image Placeholder
export const IMAGE_PLACEHOLDER = 'https://via.placeholder.com/400x300?text=Product+Image';

// Currency
export const CURRENCY = {
  SYMBOL: '$',
  CODE: 'USD'
}; 