# Bazaar Backend API

A comprehensive marketplace backend API built with Node.js, Express, and MongoDB. Supports both React Native (mobile) and React (web) applications.

## 🚀 Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **User Management**: Customer, Vendor, and Admin roles
- **Product Management**: Full CRUD operations with reviews and ratings
- **Order Management**: Complete order lifecycle with status tracking
- **Security**: Password hashing, input validation, and error handling
- **Scalable**: Modular architecture with proper separation of concerns

## 🛠 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **CORS**: Cross-origin resource sharing enabled

## 📁 Project Structure

```
backend/
├── config/
│   └── db.js                 # MongoDB connection
├── controllers/
│   ├── authController.js     # Authentication logic
│   ├── productController.js  # Product CRUD operations
│   └── orderController.js    # Order management
├── middlewares/
│   ├── auth.js              # JWT authentication
│   └── roles.js             # Role-based access control
├── models/
│   ├── User.js              # User schema
│   ├── Product.js           # Product schema
│   └── Order.js             # Order schema
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── products.js          # Product routes
│   └── orders.js            # Order routes
├── utils/
│   └── generateToken.js     # JWT token utilities
├── server.js                # Main application file
├── package.json
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   cd bazaar/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/bazaar?retryWrites=true&w=majority
   JWT_SECRET=your_super_secure_jwt_secret_key_here_make_it_long_and_random
   OPEN_AI_API_KEY=your_openai_api_key_here
   NODE_ENV=development
   ```

4. **Start the server**
   ```bash
   # Development mode (with nodemon)
   npm run dev
   
   # Production mode
   npm start
   ```

5. **Verify the server is running**
   ```bash
   curl http://localhost:5000/health
   ```

## 📚 API Endpoints

### Authentication Routes
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update user profile (protected)
- `PUT /api/auth/change-password` - Change password (protected)

### Product Routes
- `GET /api/products` - Get all products (with filtering)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (vendor/admin only)
- `PUT /api/products/:id` - Update product (vendor/admin only)
- `DELETE /api/products/:id` - Delete product (vendor/admin only)
- `POST /api/products/:id/reviews` - Add product review (authenticated)
- `GET /api/products/vendor/:vendorId` - Get vendor products

### Order Routes
- `POST /api/orders` - Create new order (authenticated)
- `GET /api/orders` - Get user orders (authenticated)
- `GET /api/orders/:id` - Get single order (authenticated)
- `PUT /api/orders/:id/status` - Update order status (vendor/admin)
- `PUT /api/orders/:id/cancel` - Cancel order (authenticated)
- `GET /api/orders/admin/all` - Get all orders (admin only)

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## 👥 User Roles

- **Customer**: Can browse products, place orders, write reviews
- **Vendor**: Can manage their products, view their orders
- **Admin**: Full access to all features and data

## 📝 Example API Usage

### Register a new user
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "customer"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Create a product (vendor only)
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_token>" \
  -d '{
    "name": "Sample Product",
    "description": "A great product",
    "price": 29.99,
    "category": "Electronics",
    "stock": 100,
    "images": ["image1.jpg", "image2.jpg"]
  }'
```

## 🛡️ Security Features

- Password hashing with bcryptjs
- JWT token authentication
- Role-based access control
- Input validation and sanitization
- CORS protection
- Error handling without exposing sensitive information

## 🔧 Development

### Running in Development Mode
```bash
npm run dev
```

### Environment Variables
- `PORT`: Server port (default: 5000)
- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `OPEN_AI_API_KEY`: OpenAI API key for future features
- `NODE_ENV`: Environment (development/production)

## 📊 Database Schema

### User Schema
- name, email, password (hashed)
- role (customer/vendor/admin)
- phone, address, avatar
- isVerified, isActive
- timestamps

### Product Schema
- name, description, price, originalPrice
- category, subcategory, brand
- images, vendor (reference to User)
- stock, sku, tags
- specifications, dimensions
- rating, reviews
- isActive, isFeatured
- timestamps

### Order Schema
- orderNumber (auto-generated)
- customer (reference to User)
- items (array of order items)
- subtotal, tax, shipping, discount, total
- status, paymentStatus, paymentMethod
- shippingAddress, billingAddress
- trackingNumber, estimatedDelivery
- cancelledBy (user, reason, timestamp)
- timestamps

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions, please open an issue in the repository. 