# MediCare+ Authentication Flow

## ✅ Complete Setup Summary

Your authentication system is now fully configured! Here's how it works:

## 📋 User Flow

### 1. **Registration** (`/register`)
- User fills out the registration form
- Clicks "Create Account"
- Account is created in MongoDB
- Success message: "Account created successfully!"
- Automatically redirected to Login page after 2 seconds

### 2. **Login** (`/login`)
- User enters email and password
- Clicks "Sign In"
- Success message: "Login successful!"
- Automatically redirected to Homepage (`/`)

### 3. **Homepage** (`/`)
- Shows welcome message with user's name if logged in
- Displays "Dashboard" button instead of "Login/Get Started"
- User can access their dashboard from there

## 🔧 Backend Configuration

### Files Created:
- `backend/server.js` - Express server
- `backend/config/database.js` - MongoDB connection
- `backend/models/User.js` - User schema with password hashing
- `backend/routes/authRoutes.js` - Authentication endpoints
- `backend/middleware/auth.js` - JWT protection

### API Endpoints:
- `POST /api/auth/register` - Create new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

## ⚠️ IMPORTANT: Fix Your .env File

**Open `backend/.env` and replace with:**

```env
MONGODB_URI=mongodb+srv://sowjanyabodala38:Medicare@cluster0.nlyqqie.mongodb.net/medicare?retryWrites=true&w=majority
JWT_SECRET=medicare_super_secret_jwt_key_12345
PORT=5000
NODE_ENV=development
```

**Key Points:**
- No spaces around `=`
- No parentheses `()` in variable names
- Include `/medicare` (database name)
- Add connection parameters

## 🚀 How to Run

### Terminal 1 - Backend:
```bash
cd backend
npm install
npm run dev
```
**Expected output:** `MongoDB Connected: cluster0.nlyqqie.mongodb.net`

### Terminal 2 - Frontend:
```bash
cd frontend
npm install  # if not done already
npm start
```

## 🧪 Testing the Flow

1. **Go to:** `http://localhost:3000/register`
2. **Fill the form:**
   - Full Name: John Doe
   - Email: john@example.com
   - Phone: 1234567890
   - Password: password123
   - Confirm Password: password123

3. **Click "Create Account"**
   - ✅ Account created successfully!
   - ✅ Redirected to login page

4. **On login page:**
   - Enter email and password
   - Click "Sign In"
   - ✅ Login successful!
   - ✅ Redirected to homepage

5. **On homepage:**
   - You'll see "Welcome, John Doe"
   - Dashboard button appears

## 🗄️ Database Storage

User data stored in MongoDB includes:
- Full Name
- Email (unique)
- Phone Number
- Password (hashed with bcrypt)
- Role (default: "patient")
- Created/Updated timestamps

## 🔒 Security Features

✅ Passwords are hashed using bcryptjs
✅ JWT tokens for authentication
✅ Protected routes with middleware
✅ Token stored in localStorage
✅ Automatic token expiration (30 days)

## 📝 Notes

- User credentials are NOT stored after registration
- User must login separately after registration
- Token is stored only after successful login
- Homepage shows personalized greeting when logged in

---

**Need help?** Check `FIX_ENV.md` for .env troubleshooting or `SETUP_GUIDE.md` for detailed setup.



