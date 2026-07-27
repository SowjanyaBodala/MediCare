# MediCare+ Authentication Setup Guide

This guide will help you set up the complete authentication system for MediCare+.

## 📋 Prerequisites

Before you start, make sure you have:
- Node.js installed (v14 or higher)
- MongoDB installed locally OR MongoDB Atlas account
- npm or yarn package manager

## 🚀 Step-by-Step Setup

### Step 1: Install MongoDB

**Option A: Local MongoDB**
1. Download MongoDB from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Install it following the installation wizard
3. MongoDB will run on `mongodb://localhost:27017` by default

**Option B: MongoDB Atlas (Cloud - Recommended)**
1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster (free tier)
4. Click "Connect" → "Connect your application"
5. Copy your connection string (looks like: `mongodb+srv://...`)

### Step 2: Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Install backend dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   Create a file named `.env` in the `backend` directory:
   
   ```env
   # For local MongoDB
   MONGODB_URI=mongodb://localhost:27017/medicare
   
   # OR for MongoDB Atlas (use the connection string from Atlas)
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/medicare
   
   # JWT Secret (create a random string)
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   
   # Server Port
   PORT=5000
   
   # Environment
   NODE_ENV=development
   ```

4. **Start the backend server:**
   ```bash
   # Development mode (with auto-reload)
   npm run dev
   
   # OR Production mode
   npm start
   ```

   The server should now be running on `http://localhost:5000`

### Step 3: Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install frontend dependencies (if not already done):**
   ```bash
   npm install
   ```

3. **Start the frontend development server:**
   ```bash
   npm start
   ```

   The app should now be running on `http://localhost:3000`

### Step 4: Test the Authentication

1. **Open your browser and go to:** `http://localhost:3000/register`

2. **Register a new user:**
   - Fill in the registration form
   - Click "Create Account"
   - You should see a success message
   - You'll be redirected to the dashboard

3. **Logout and test login:**
   - Go to `http://localhost:3000/login`
   - Enter your credentials
   - Click "Sign In"
   - You should be logged in successfully

## 📁 Project Structure

```
MediCare/
├── backend/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── models/
│   │   └── User.js              # User schema with password hashing
│   ├── routes/
│   │   └── authRoutes.js        # Authentication endpoints
│   ├── middleware/
│   │   └── auth.js              # JWT authentication middleware
│   ├── server.js                # Main server file
│   ├── package.json             # Backend dependencies
│   └── .env                     # Environment variables (create this)
│
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── Login.jsx        # Updated with API integration
    │   │   └── Register.jsx     # Updated with API integration
    │   ├── services/
    │   │   └── authService.js   # Authentication API calls
    │   └── utils/
    │       └── api.js           # Axios configuration
    └── package.json             # Frontend dependencies
```

## 🔌 API Endpoints

### Backend Endpoints (Base URL: `http://localhost:5000/api`)

#### 1. Register User
- **Endpoint:** `POST /api/auth/register`
- **Body:**
  ```json
  {
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Registration successful",
    "data": {
      "_id": "...",
      "fullName": "John Doe",
      "email": "john@example.com",
      "phone": "1234567890",
      "role": "patient",
      "token": "jwt_token_here"
    }
  }
  ```

#### 2. Login User
- **Endpoint:** `POST /api/auth/login`
- **Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response:** Same as register response

#### 3. Get Current User (Protected)
- **Endpoint:** `GET /api/auth/me`
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "_id": "...",
      "fullName": "John Doe",
      "email": "john@example.com",
      "role": "patient"
    }
  }
  ```

## 🔐 How Authentication Works

1. **Registration Process:**
   - User submits form with email, password, etc.
   - Frontend sends request to `/api/auth/register`
   - Backend validates data and checks if user exists
   - Password is hashed using bcryptjs
   - User is saved to MongoDB
   - JWT token is generated and returned
   - Frontend stores token in localStorage

2. **Login Process:**
   - User submits email and password
   - Frontend sends request to `/api/auth/login`
   - Backend finds user by email
   - Password is compared with hashed password
   - JWT token is generated and returned
   - Frontend stores token in localStorage

3. **Protected Routes:**
   - Frontend includes token in Authorization header
   - Backend verifies token
   - If valid, request continues; if not, returns 401

## 🛠️ Troubleshooting

### MongoDB Connection Issues
- **Error:** "Cannot connect to MongoDB"
- **Solution:** 
  - Check if MongoDB is running: `mongod`
  - Check your `.env` file for correct MONGODB_URI
  - For Atlas, ensure your IP is whitelisted

### Port Already in Use
- **Error:** "Port 5000 already in use"
- **Solution:** Change PORT in `.env` file to another port (e.g., 5001)

### CORS Errors
- **Error:** "CORS policy blocked"
- **Solution:** The backend already has CORS enabled. If issues persist, check firewall settings.

### Token Issues
- **Error:** "Not authorized"
- **Solution:** 
  - Clear localStorage in browser
  - Login again to get a new token

## 🎯 Next Steps

After setting up authentication, you can:
1. Add password reset functionality
2. Implement forgot password feature
3. Add email verification
4. Create protected routes for different user roles
5. Implement session timeout handling

## 📝 Important Notes

- **JWT Secret:** Change the JWT_SECRET in production
- **Password Security:** Passwords are minimum 6 characters
- **Database:** Users are automatically assigned "patient" role by default
- **Token Expiration:** Tokens expire after 30 days

## 🆘 Need Help?

If you encounter any issues:
1. Check the browser console for frontend errors
2. Check the terminal for backend errors
3. Verify MongoDB is running
4. Verify all dependencies are installed
5. Check that the `.env` file is properly configured

---

Happy coding! 🚀

