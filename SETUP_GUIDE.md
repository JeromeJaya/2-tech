# 🚀 Complete Setup Guide - TechVaseeGrahHub

## Step-by-Step Installation Guide

### Prerequisites Installation

#### 1. Install Node.js
- Download from: https://nodejs.org/
- Choose LTS version (v18 or higher)
- Verify installation:
  ```bash
  node --version
  npm --version
  ```

#### 2. Install MongoDB
- **Windows:**
  - Download from: https://www.mongodb.com/try/download/community
  - Install MongoDB Community Server
  - During installation, select "Install MongoDB as a Service"
  
- **Verify MongoDB:**
  ```bash
  mongod --version
  ```

#### 3. Install MongoDB Compass (Optional but Recommended)
- Download from: https://www.mongodb.com/try/download/compass
- This provides a GUI to view your database

---

## Backend Setup

### Step 1: Navigate to Project Directory
```bash
cd "C:\Users\HP\Desktop\tech vaseegara\server"
```

### Step 2: Install Dependencies
```bash
npm install
```

This will install all required packages:
- express
- mongoose
- jsonwebtoken
- bcryptjs
- cors
- helmet
- multer
- winston
- express-validator
- And more...

### Step 3: Configure Environment Variables

The `.env` file is already created. Update these important values:

```env
# Change this to a strong secret key
JWT_SECRET=your-super-secret-jwt-key-change-this-to-random-string

# If MongoDB is not running on default port, update this
MONGODB_URI=mongodb://localhost:27017/techvaseegrahhub

# Email configuration (if you want to send emails)
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-specific-password
```

**To generate a strong JWT_SECRET:**
```bash
# Run this in Node.js console
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 4: Start MongoDB Service

**Windows:**
```bash
# Check if MongoDB service is running
net start | findstr MongoDB

# If not running, start it
net start MongoDB
```

**Manual start:**
```bash
mongod --dbpath="C:\data\db"
```

### Step 5: Seed the Database (Important!)
```bash
npm run seed
```

This creates:
- ✅ Admin user
- ✅ Sample plans (Basic, Standard, Premium)
- ✅ Sample addons
- ✅ Available time slots for next 7 days

**Admin Credentials Created:**
- Email: admin@techvaseegrahhub.com
- Password: admin123456

### Step 6: Start the Server

**Development Mode (with auto-reload):**
```bash
npm run dev
```

**Production Mode:**
```bash
npm run build
npm start
```

### Step 7: Verify Backend is Running

Open your browser and visit:
- Health Check: http://localhost:5000/health
- API Root: http://localhost:5000/

You should see a JSON response.

---

## Testing the API

### Option 1: Using Browser (GET requests only)

Visit these URLs:
- http://localhost:5000/api/plans
- http://localhost:5000/api/addons
- http://localhost:5000/api/slots

### Option 2: Using cURL

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"admin@techvaseegrahhub.com\",\"password\":\"admin123456\"}"
```

**Get Plans:**
```bash
curl http://localhost:5000/api/plans
```

### Option 3: Using Postman (Recommended)

1. **Download Postman:** https://www.postman.com/downloads/
2. **Import Collection:** Create a new collection
3. **Set Base URL:** http://localhost:5000/api

**Sample Requests:**

#### Login Request
```
POST http://localhost:5000/api/auth/login
Headers:
  Content-Type: application/json
Body (JSON):
{
  "email": "admin@techvaseegrahhub.com",
  "password": "admin123456"
}
```

#### Get All Plans
```
GET http://localhost:5000/api/plans
```

#### Create Booking (No Auth Required)
```
POST http://localhost:5000/api/bookings
Headers:
  Content-Type: application/json
Body (JSON):
{
  "customerName": "Test User",
  "email": "test@example.com",
  "phone": "+919876543210",
  "date": "2025-11-15",
  "slotId": "GET_FROM_SLOTS_API",
  "planId": "GET_FROM_PLANS_API",
  "addons": [],
  "totalAmount": 2999
}
```

#### Get All Bookings (Admin Only)
```
GET http://localhost:5000/api/bookings
Headers:
  Content-Type: application/json
  Authorization: Bearer YOUR_JWT_TOKEN_FROM_LOGIN
```

---

## Frontend Setup (Next Step)

### Option 1: Copy Your Existing Frontend

If you have an existing React app:
```bash
# Copy your existing frontend to client folder
xcopy "C:\path\to\your\existing\app" "C:\Users\HP\Desktop\tech vaseegara\client" /E /I
```

### Option 2: Create New React App

```bash
cd "C:\Users\HP\Desktop\tech vaseegara"

# Create new Vite + React + TypeScript app
npm create vite@latest client -- --template react-ts

cd client
npm install

# Install additional dependencies
npm install axios
npm install react-router-dom
npm install @tanstack/react-query
```

### Update Frontend to Use Backend API

Create `client/src/services/api.ts`:
```typescript
import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

---

## Common Issues & Solutions

### Issue 1: MongoDB Connection Failed
**Error:** `MongoServerError: connect ECONNREFUSED`

**Solution:**
1. Check if MongoDB is running:
   ```bash
   net start MongoDB
   ```
2. Verify MongoDB URI in `.env` file
3. Check if port 27017 is available

### Issue 2: Port 5000 Already in Use
**Error:** `EADDRINUSE: address already in use :::5000`

**Solution:**
1. Find process using port 5000:
   ```bash
   netstat -ano | findstr :5000
   ```
2. Kill the process:
   ```bash
   taskkill /PID <process_id> /F
   ```
3. Or change PORT in `.env` file

### Issue 3: Module Not Found Errors
**Error:** `Cannot find module 'express'`

**Solution:**
```bash
# Delete node_modules and reinstall
rmdir /s /q node_modules
del package-lock.json
npm install
```

### Issue 4: TypeScript Compilation Errors
**Solution:**
```bash
# Rebuild TypeScript
npm run build
```

### Issue 5: JWT Secret Not Set
**Error:** Token generation fails

**Solution:**
- Set JWT_SECRET in `.env` file to a strong random string

---

## Database Management

### View Database Using MongoDB Compass

1. Open MongoDB Compass
2. Connect to: `mongodb://localhost:27017`
3. Select database: `techvaseegrahhub`
4. Browse collections:
   - users
   - bookings
   - slots
   - plans
   - addons
   - photos

### MongoDB Shell Commands

```bash
# Connect to MongoDB
mongo

# Switch to database
use techvaseegrahhub

# View all collections
show collections

# View users
db.users.find().pretty()

# View bookings
db.bookings.find().pretty()

# Count documents
db.bookings.countDocuments()

# Delete all bookings (careful!)
db.bookings.deleteMany({})
```

---

## Production Deployment Checklist

Before deploying to production:

### 1. Environment Variables
- [ ] Change JWT_SECRET to a strong random string
- [ ] Update MONGODB_URI to production database
- [ ] Set NODE_ENV=production
- [ ] Configure email credentials
- [ ] Update CORS_ORIGIN to production URL

### 2. Security
- [ ] Change default admin password
- [ ] Enable rate limiting
- [ ] Set up HTTPS
- [ ] Configure firewall rules
- [ ] Enable MongoDB authentication

### 3. Database
- [ ] Create database backup strategy
- [ ] Set up MongoDB Atlas or managed database
- [ ] Configure database indexes
- [ ] Set up monitoring

### 4. Server
- [ ] Use PM2 or similar process manager
- [ ] Set up logging and monitoring
- [ ] Configure automatic restarts
- [ ] Set up SSL certificates

---

## Useful Commands

### Development
```bash
# Start backend
cd server
npm run dev

# Start frontend
cd client
npm run dev

# Seed database
cd server
npm run seed

# View logs
cd server
type logs\combined.log
```

### Production
```bash
# Build backend
cd server
npm run build

# Start production server
npm start

# Build frontend
cd client
npm run build
```

### Database
```bash
# Start MongoDB
net start MongoDB

# Stop MongoDB
net stop MongoDB

# MongoDB Shell
mongo

# Backup database
mongodump --db techvaseegrahhub --out backup/

# Restore database
mongorestore --db techvaseegrahhub backup/techvaseegrahhub/
```

---

## Next Steps After Setup

1. ✅ Backend API is running
2. ✅ Database is seeded with sample data
3. ✅ Admin credentials are ready
4. ⏳ Test all API endpoints
5. ⏳ Setup frontend application
6. ⏳ Connect frontend to backend
7. ⏳ Test complete booking flow
8. ⏳ Deploy to production

---

## Support & Resources

### Documentation
- Express.js: https://expressjs.com/
- MongoDB: https://docs.mongodb.com/
- Mongoose: https://mongoosejs.com/
- JWT: https://jwt.io/

### Tools
- Postman: https://www.postman.com/
- MongoDB Compass: https://www.mongodb.com/products/compass
- VS Code: https://code.visualstudio.com/

### Community
- Stack Overflow: https://stackoverflow.com/
- MongoDB Community: https://community.mongodb.com/

---

## Congratulations! 🎉

Your backend is now set up and running. You can now:
- Create bookings via API
- Manage slots, plans, and addons
- Upload photos
- View analytics and dashboard stats

Next step: Set up the frontend to interact with this API!
