# MediCare+ Backend API

Backend API for MediCare+ healthcare management system.

## Features

- User registration and authentication
- JWT-based authentication
- Password hashing with bcryptjs
- MongoDB database integration
- Protected routes with role-based access control

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the backend directory:
```env
MONGODB_URI=mongodb://localhost:27017/medicare
JWT_SECRET=your_super_secret_jwt_key_here
PORT=5000
NODE_ENV=development
```

3. Start the server:
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Example Request Bodies

**Register:**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "password": "password123"
}
```

**Login:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

## Environment Variables

- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment mode

## Project Structure

```
backend/
├── config/
│   └── database.js      # MongoDB connection
├── models/
│   └── User.js          # User model
├── routes/
│   └── authRoutes.js    # Authentication routes
├── middleware/
│   └── auth.js          # Authentication middleware
├── server.js            # Main server file
└── package.json         # Dependencies
```

