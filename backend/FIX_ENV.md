# Fix .env File

## Current Problem
Your `.env` file has incorrect syntax:
```
MONGO_URI() = mongodb+srv://sowjanyabodala38:Medicare@cluster0.nlyqqie.mongodb.net/?appName=Cluster0
```

## Correct Format
Open `backend/.env` and replace ALL content with:

```
MONGODB_URI=mongodb+srv://sowjanyabodala38:Medicare@cluster0.nlyqqie.mongodb.net/medicare?retryWrites=true&w=majority
JWT_SECRET=medicare_super_secret_jwt_key_12345
PORT=5000
NODE_ENV=development
```

## Steps to Fix:

1. Open `backend/.env` file in VS Code
2. Delete all existing content
3. Copy and paste the correct format above
4. Save the file
5. Restart your backend server

## Important Notes:
- NO spaces around the `=` sign
- NO parentheses in variable names
- MUST include `/medicare` (database name) before the `?`
- MUST add `?retryWrites=true&w=majority` at the end

## After fixing, restart backend:
```bash
cd backend
npm run dev
```

You should see: "MongoDB Connected: cluster0.nlyqqie.mongodb.net"

