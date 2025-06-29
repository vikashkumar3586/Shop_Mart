# Shop Mart - E-commerce Platform

A full-stack e-commerce application built with React.js and Node.js.

## 🚀 Features
- User authentication and authorization
- Product management (CRUD operations)
- Shopping cart functionality
- Order management with COD and online payment
- Stripe payment integration
- Address management
- Responsive design with TailwindCSS
- Seller panel for product and order management
- Image upload with Cloudinary
- Real-time cart updates

## 🛠️ Tech Stack
- **Frontend**: React.js, Vite, TailwindCSS, Axios, React Router, React Hot Toast
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Payment**: Stripe
- **File Upload**: Multer, Cloudinary
- **Authentication**: JWT with httpOnly cookies
- **Database**: MongoDB Atlas / Local MongoDB

## 📋 Prerequisites

Before starting, ensure you have:
- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** - [MongoDB Atlas](https://www.mongodb.com/atlas) (cloud) or [Local Installation](https://www.mongodb.com/try/download/community)
- **Git** - [Download here](https://git-scm.com/)
- **Stripe Account** - [Sign up here](https://stripe.com/)
- **Cloudinary Account** - [Sign up here](https://cloudinary.com/)

## 🚀 Installation

### Step 1: Clone the Repository

```bash
# Clone the project
git clone https://github.com/vikashkumar3586/Shop_Mart.git

# Navigate to project directory
cd Shop_Mart
```

### Step 2: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install
```

### Step 3: Configure Backend Environment Variables

Create `backend/.env` file with the following:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/shop_mart
# OR for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/shop_mart

# JWT Secret (use a strong random string)
JWT_SECRET=your_super_secure_jwt_secret_key_here_2024

# Seller Credentials
SELLER_EMAIL=admin@shopmart.com
SELLER_PASSWORD=admin123

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Stripe Configuration
STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
STRIPE_SECRET_KEY=sk_test_your_secret_key
```

### Step 4: Start Backend Server

```bash
# Development mode with auto-reload
npm run dev

# OR production mode
npm start
```

**Backend will run on:** `http://localhost:5000`

### Step 5: Frontend Setup

Open a **new terminal** and navigate to frontend:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install
```

### Step 6: Configure Frontend Environment Variables

Create `frontend/.env` file:

```env
# Backend API URL
VITE_BACKEND_URL=http://localhost:5000
```

### Step 7: Start Frontend Application

```bash
# Development mode
npm run dev
```

**Frontend will run on:** `http://localhost:5173`

## 🗄️ Database Setup

### Option A: MongoDB Atlas (Cloud - Recommended)

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account
3. Create a new cluster
4. Get connection string
5. Update `MONGO_URI` in `backend/.env`

### Option B: Local MongoDB

```bash
# Install MongoDB locally
# Windows: Download from mongodb.com
# macOS: brew install mongodb-community
# Ubuntu: sudo apt install mongodb

# Start MongoDB service
# Windows: Start as Windows Service
# macOS/Linux: sudo systemctl start mongod

# Use local connection string
MONGO_URI=mongodb://localhost:27017/shop_mart
```

## ☁️ Cloudinary Setup

1. Sign up at [Cloudinary](https://cloudinary.com/)
2. Go to Dashboard
3. Copy **Cloud Name**, **API Key**, and **API Secret**
4. Update `backend/.env` with these credentials

## 💳 Stripe Setup

1. Sign up at [Stripe](https://stripe.com/)
2. Go to **Developers → API Keys**
3. Copy **Publishable Key** and **Secret Key** (use test keys for development)
4. Update `backend/.env` with these keys

## 📁 Project Structure

```
Shop_Mart/
├── backend/                 # Node.js API
│   ├── controllers/         # Route handlers
│   ├── models/             # MongoDB schemas
│   ├── routes/             # API routes
│   ├── middlewares/        # Auth & validation
│   ├── config/             # Database config
│   ├── public/images/      # Uploaded images
│   ├── .env                # Environment variables
│   ├── package.json        # Dependencies
│   └── index.js            # Entry point
├── frontend/               # React.js app
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Route components
│   │   ├── context/        # State management
│   │   └── assets/         # Static files
│   ├── .env                # Frontend environment
│   ├── package.json        # Dependencies
│   └── index.html          # Entry HTML
└── README.md               # Documentation
```

## 🔑 Default Seller Access

After setup, access seller panel:
- **URL:** `http://localhost:5173/seller`
- **Email:** `admin@shopmart.com`
- **Password:** `admin123`

## 📚 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout

### Products
- `GET /api/product/get` - Get all products
- `POST /api/product/add` - Add new product (Seller only)

### Orders
- `POST /api/order/cod` - Place COD order
- `POST /api/order/online` - Place online payment order
- `GET /api/order/user` - Get user orders
- `GET /api/order/seller` - Get all orders (Seller only)

### Address
- `POST /api/address/add` - Add new address
- `GET /api/address/get` - Get user addresses
- `PUT /api/address/update/:id` - Update address
- `DELETE /api/address/delete/:id` - Delete address

## 🎨 Available Scripts

### Backend
```bash
npm run dev          # Start development server with nodemon
npm start           # Start production server
npm test            # Run tests
```

### Frontend
```bash
npm run dev         # Start development server
npm run build       # Build for production
npm run preview     # Preview production build
npm run lint        # Run ESLint
```

## 🔐 Security Features

- JWT authentication with httpOnly cookies
- Password hashing with bcrypt
- Input validation and sanitization
- CORS protection
- Environment variable protection
- Secure file upload handling

## 🐛 Troubleshooting

### Common Issues:

**Backend won't start:**
```bash
# Check if MongoDB is running
# Check .env file exists and has correct values
# Check port 5000 is not in use
```

**Frontend won't connect to backend:**
```bash
# Verify VITE_BACKEND_URL in frontend/.env
# Check backend is running on port 5000
# Check for CORS issues
```

**Database connection fails:**
```bash
# Verify MongoDB is running
# Check MONGO_URI format
# For Atlas: Check IP whitelist and credentials
```

**Payment issues:**
```bash
# Verify Stripe keys are correct
# Check if using test keys for development
# Ensure proper currency format
```

## 🚀 Deployment

### Backend (Railway/Heroku/DigitalOcean)
1. Set environment variables on platform
2. Update `MONGO_URI` to production database
3. Use production Stripe keys
4. Set `NODE_ENV=production`

### Frontend (Vercel/Netlify)
1. Update `VITE_BACKEND_URL` to production API URL
2. Build and deploy
3. Set up custom domain (optional)

## 📝 Environment Variables Reference

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
SELLER_EMAIL=admin@shopmart.com
SELLER_PASSWORD=admin123
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
```

### Frontend (.env)
```env
VITE_BACKEND_URL=http://localhost:5000
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Vikash Kumar**
- GitHub: [@vikashkumar3586](https://github.com/vikashkumar3586)
- Email: vikash.kumar3586@gmail.com

## 🙏 Acknowledgments

- React.js community for excellent documentation
- Stripe for payment processing
- Cloudinary for image management
- MongoDB for database services
- All contributors and testers

---

**Happy Coding! 🛒✨**