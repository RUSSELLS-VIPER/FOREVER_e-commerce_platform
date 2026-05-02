# E-Commerce Platform

A full-stack e-commerce web application built with React, Node.js, and MongoDB. This platform enables businesses to manage products, process orders, and handle payments while providing customers with a seamless shopping experience.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Usage Guide](#usage-guide)
- [Key Features Explained](#key-features-explained)
- [Contributing](#contributing)

## 🎯 Project Overview

This is a modern, full-stack e-commerce platform consisting of three main applications:

1. **Frontend (Customer Portal)** - React SPA for browsing products, managing cart, and placing orders
2. **Admin Panel** - React dashboard for managing products, orders, and inventory
3. **Backend API** - Express.js REST API with MongoDB database

The platform supports multiple payment gateways (Stripe & Razorpay), image hosting via Cloudinary, and JWT-based authentication.

## ✨ Features

### Customer Frontend
- 🛍️ **Product Browsing** - Browse products by category with filtering and search
- 🔍 **Search Functionality** - Real-time product search across the catalog
- 🛒 **Shopping Cart** - Add/remove items, view cart totals
- 💳 **Payment Processing** - Secure checkout with Stripe and Razorpay integration
- 👤 **User Authentication** - Sign up, login, and order history tracking
- 📦 **Order Management** - View order status and tracking
- 📱 **Responsive Design** - Fully responsive UI using Tailwind CSS
- ⭐ **Featured Products** - Bestseller and latest collection sections

### Admin Dashboard
- 📊 **Product Management** - Add, edit, delete, and list all products
- 📸 **Image Upload** - Multi-image upload support with Cloudinary integration
- 📋 **Order Tracking** - View and manage all customer orders
- 🔐 **Admin Authentication** - Secure admin login with token-based auth
- 📈 **Inventory Control** - Update product details and stock information

### Backend API
- 🔑 **JWT Authentication** - Secure user and admin authentication
- 🔒 **Role-Based Access** - Admin and user role differentiation
- 📱 **RESTful API** - Clean and well-documented endpoints
- 💰 **Payment Integration** - Stripe and Razorpay webhook support
- 📄 **Swagger Documentation** - Interactive API docs at `/api/docs`
- 🖼️ **Image Management** - Cloudinary integration for image hosting

## 🛠️ Tech Stack

### Frontend
- **React 19.2** - UI library
- **Vite 7.2** - Build tool and dev server
- **React Router 7.9** - Client-side routing
- **Tailwind CSS 4.1** - Utility-first CSS framework
- **Axios 1.13** - HTTP client
- **React Toastify 11.0** - Toast notifications

### Admin Panel
- **React 19.2** - UI library
- **Vite 7.2** - Build tool
- **React Router 7.9** - Navigation
- **Tailwind CSS 4.1** - Styling
- **Axios 1.13** - API calls
- **React Toastify 11.0** - Notifications

### Backend
- **Node.js** - JavaScript runtime
- **Express 5.1** - Web framework
- **MongoDB 9.0** - Database (with Mongoose ODM)
- **JWT (jsonwebtoken 9.0)** - Authentication
- **Cloudinary 2.8** - Image hosting
- **Stripe 20.0** - Payment processing
- **Razorpay 2.9** - Payment gateway
- **Bcrypt 6.0** - Password hashing
- **Multer 2.0** - File upload middleware
- **CORS 2.8** - Cross-origin resource sharing
- **Swagger 6.2** - API documentation
- **Dotenv 17.2** - Environment variables

## 📁 Project Structure

```
e-commerce/
├── Frontend/                      # Customer-facing React application
│   ├── src/
│   │   ├── pages/                # Page components (Home, Cart, Product, etc.)
│   │   ├── components/           # Reusable UI components
│   │   ├── context/              # React Context for state management
│   │   ├── assets/               # Static assets and images
│   │   ├── App.jsx               # Main app component with routes
│   │   ├── main.jsx              # React DOM entry point
│   │   └── index.css             # Global styles
│   ├── package.json              # Frontend dependencies
│   ├── vite.config.js            # Vite configuration
│   ├── tailwind.config.js        # Tailwind CSS config
│   └── index.html                # HTML entry point
│
├── admin/                         # Admin dashboard React application
│   ├── src/
│   │   ├── pages/                # Admin pages (Add, List, Orders)
│   │   ├── components/           # Admin UI components (Navbar, Sidebar)
│   │   ├── assets/               # Admin assets
│   │   ├── App.jsx               # Admin app with routes
│   │   ├── main.jsx              # React entry point
│   │   └── index.css             # Styles
│   ├── package.json              # Admin dependencies
│   ├── vite.config.js            # Vite config
│   ├── tailwind.config.cjs       # Tailwind config
│   └── index.html                # HTML entry
│
├── Backend/                       # Express.js REST API server
│   ├── config/                   # Configuration files
│   │   ├── mongodb.js            # MongoDB connection setup
│   │   └── cloudinary.js         # Cloudinary configuration
│   ├── controllers/              # Request handlers
│   │   ├── userController.js     # User registration, login, etc.
│   │   ├── productController.js  # Product CRUD operations
│   │   ├── cartController.js     # Shopping cart operations
│   │   └── orderController.js    # Order processing and payments
│   ├── models/                   # Mongoose schemas
│   │   ├── userModel.js          # User schema
│   │   ├── productModel.js       # Product schema
│   │   └── orderModel.js         # Order schema
│   ├── routes/                   # API route definitions
│   │   ├── userRoute.js          # /api/user routes
│   │   ├── productRoute.js       # /api/product routes
│   │   ├── cartRoute.js          # /api/cart routes
│   │   └── orderRoute.js         # /api/order routes
│   ├── middleware/               # Custom middleware
│   │   ├── auth.js               # User authentication middleware
│   │   ├── adminAuth.js          # Admin authentication middleware
│   │   └── multer.js             # File upload configuration
│   ├── docs/                     # API documentation
│   │   └── swagger.js            # Swagger/OpenAPI specs
│   ├── Server.js                 # Express app initialization
│   ├── package.json              # Backend dependencies
│   └── .env                      # Environment variables (not in repo)

├── assets/                        # Shared assets folder
│   ├── admin_assets/             # Admin-specific assets
│   └── frontend_assets/          # Frontend-specific assets

└── README.md                      # This file
```

## 🚀 Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager
- MongoDB local instance or MongoDB Atlas account
- Cloudinary account (for image hosting)
- Stripe account (for payment processing)
- Razorpay account (for payment gateway)

### Step 1: Clone the Repository

```bash
git clone https://github.com/RUSSELLS-VIPER/e-commerce.git
cd e-commerce
```

### Step 2: Backend Setup

```bash
cd Backend
npm install
```

Create a `.env` file in the Backend directory with the required environment variables (see section below).

### Step 3: Frontend Setup

```bash
cd ../Frontend
npm install
```

Create a `.env` file or `.env.local` with `VITE_BACKEND_URL` pointing to your backend API.

### Step 4: Admin Dashboard Setup

```bash
cd ../admin
npm install
```

Create a `.env` file with `VITE_BACKEND_URL` pointing to your backend.

## 🔐 Environment Variables

### Backend (.env)

```env
# MongoDB Configuration
MONGODB_URI=your_mongodb_connection_string

# JWT
JWT_SECRET=your_secret_key_here

# Cloudinary
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key

# Razorpay
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Server
PORT=4000
ADMIN_EMAIL=admin@example.com
```

### Frontend (.env or .env.local)

```env
VITE_BACKEND_URL=http://localhost:4000
```

### Admin (.env or .env.local)

```env
VITE_BACKEND_URL=http://localhost:4000
```

## 🏃 Running the Application

### Run Backend Server

```bash
cd Backend
npm run server    # Runs with nodemon for auto-reload
# OR
npm start         # Runs with node
```

Backend will be available at `http://localhost:4000`

API Documentation: `http://localhost:4000/api/docs`

### Run Frontend

```bash
cd Frontend
npm run dev
```

Frontend will be available at `http://localhost:5173` (or next available port)

### Run Admin Dashboard

```bash
cd admin
npm run dev
```

Admin panel will be available at `http://localhost:5174` (or next available port)

### Production Build

```bash
# Frontend
npm run build
npm run preview

# Admin
npm run build
npm run preview

# Backend runs directly
npm start
```

## 📚 API Documentation

### Base URL
```
http://localhost:4000/api
```

### Authentication
Most endpoints require a JWT token passed in the `Authorization` header:
```
Authorization: Bearer <token>
```

### Main Endpoints

#### Users
- `POST /user/register` - Register new user
- `POST /user/login` - User login
- `POST /user/logout` - User logout

#### Products
- `GET /product/list` - Get all products
- `POST /product/add` - Add product (Admin only)
- `POST /product/update` - Update product (Admin only)
- `POST /product/remove` - Remove product (Admin only)
- `POST /product/single` - Get single product details

#### Cart
- `POST /cart/add` - Add item to cart
- `POST /cart/remove` - Remove item from cart
- `POST /cart/get` - Get user's cart

#### Orders
- `POST /order/place` - Place new order
- `POST /order/userorders` - Get user's orders
- `POST /order/list` - Get all orders (Admin)
- `POST /order/status` - Update order status (Admin)
- `POST /order/stripe/webhook` - Stripe webhook endpoint

For detailed API documentation, visit `/api/docs` when the backend is running.

## 📖 Usage Guide

### For Customers

1. **Browse Products**
   - Visit the home page to see featured products
   - Use the collection page to filter by category and price
   - Use the search bar to find specific products

2. **Shopping**
   - Click on a product to view details
   - Select size and quantity, then add to cart
   - View and modify cart items

3. **Checkout**
   - Proceed to checkout from cart
   - Enter delivery address
   - Choose payment method (Stripe or Razorpay)
   - Complete payment

4. **Order Tracking**
   - Login to your account
   - View order history and current status

### For Administrators

1. **Login**
   - Access admin panel at the app's admin route
   - Login with admin credentials

2. **Product Management**
   - Go to **List** page to view all products
   - Click **Add** to create new products
   - Click **Edit** on any product to modify details
   - Upload up to 4 product images
   - Set pricing, category, sizes, and bestseller status

3. **Order Management**
   - Go to **Orders** page
   - View all customer orders
   - Update order status (Processing, Shipped, Delivered, etc.)

## 🔑 Key Features Explained

### Shopping Context (Frontend)
The app uses React Context API for state management, storing:
- Product catalog
- User cart items
- Delivery address information
- Order data

### Authentication Flow
1. User registers or logs in
2. Backend returns JWT token
3. Token stored in localStorage
4. Token included in all subsequent API requests
5. Token verified by middleware on protected routes

### Payment Processing
- **Stripe Integration**: One-time payments with Stripe
- **Razorpay Integration**: Alternative payment gateway
- Webhooks for payment confirmation and order status updates

### Image Management
- Products support up to 4 images
- Images uploaded to Cloudinary (cloud storage)
- Cloudinary URLs stored in database
- No local file storage needed

### Admin Authentication
- Separate admin authentication flow
- Admin-only routes protected by `adminAuth` middleware
- Role-based access control for sensitive operations

## 🤝 Contributing

To contribute to this project:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the ISC License.

## 👥 Support

For issues, questions, or suggestions:
- Create an issue on GitHub
- Contact the development team

---

**Last Updated:** May 2, 2026

**Project Status:** Active Development

For more information, visit the [GitHub Repository](https://github.com/RUSSELLS-VIPER/e-commerce)
