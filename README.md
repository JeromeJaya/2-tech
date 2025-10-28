# 🎉 TechVaseeGrahHub - Event Booking Platform

A complete MERN stack application for event venue booking and management.

## 📁 Project Structure

```
tech vaseegara/
├── server/              # Backend API (Node.js + Express + MongoDB)
│   ├── src/
│   │   ├── config/      # Configuration files
│   │   ├── controllers/ # Request handlers
│   │   ├── models/      # MongoDB models
│   │   ├── routes/      # API routes
│   │   ├── middleware/  # Custom middleware
│   │   ├── services/    # Business logic
│   │   ├── utils/       # Utility functions
│   │   ├── scripts/     # Database scripts
│   │   ├── app.ts       # Express app
│   │   └── server.ts    # Entry point
│   ├── uploads/         # File storage
│   ├── logs/            # Log files
│   └── package.json
│
└── client/              # Frontend (React + TypeScript + Vite)
    └── [To be added - Copy your existing frontend]
```

## 🚀 Technology Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens)
- **Language:** TypeScript
- **Validation:** Express Validator
- **File Upload:** Multer
- **Logging:** Winston
- **Security:** Helmet, CORS

### Frontend (To be integrated)
- **Framework:** React 18
- **Language:** TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **HTTP Client:** Axios
- **State Management:** React Context API

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- MongoDB (v6 or higher)
- npm or yarn
- Git

## 🛠️ Installation & Setup

### 1. Clone or Navigate to Project

```bash
cd "C:\Users\HP\Desktop\tech vaseegara"
```

### 2. Setup Backend

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create and configure .env file
# Edit the .env file with your configuration
# Especially: MONGODB_URI, JWT_SECRET
```

### 3. Configure Environment Variables

Edit `server/.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/techvaseegrahhub
JWT_SECRET=your-super-secret-jwt-key-change-this
CORS_ORIGIN=http://localhost:5173
```

### 4. Start MongoDB

Ensure MongoDB is running on your system:
```bash
# Windows (if installed as service)
net start MongoDB

# Or start mongod manually
mongod --dbpath="C:\path\to\your\data"
```

### 5. Seed Database (Optional)

```bash
npm run seed
```

This will create:
- Admin user (admin@techvaseegrahhub.com / admin123456)
- Sample plans (Basic, Standard, Premium)
- Sample addons
- Slots for the next 7 days

### 6. Start Backend Server

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm run build
npm start
```

Server will run on `http://localhost:5000`

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register new user | No |
| POST | `/auth/login` | Login user | No |
| GET | `/auth/me` | Get current user | Yes |
| PUT | `/auth/password` | Update password | Yes |

### Booking Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/bookings` | Create booking | No |
| GET | `/bookings` | Get all bookings | Yes (Admin) |
| GET | `/bookings/:id` | Get booking by ID | Yes |
| PUT | `/bookings/:id` | Update booking | Yes (Admin) |
| DELETE | `/bookings/:id` | Delete booking | Yes (Admin) |
| GET | `/bookings/today` | Today's bookings | Yes (Admin) |
| GET | `/bookings/stats` | Booking statistics | Yes (Admin) |

### Slot Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/slots` | Get all slots | No |
| GET | `/slots/:id` | Get slot by ID | No |
| GET | `/slots/available/:date` | Get available slots | No |
| POST | `/slots` | Create slot | Yes (Admin) |
| PUT | `/slots/:id` | Update slot | Yes (Admin) |
| DELETE | `/slots/:id` | Delete slot | Yes (Admin) |

### Plan Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/plans` | Get all plans | No |
| GET | `/plans/:id` | Get plan by ID | No |
| POST | `/plans` | Create plan | Yes (Admin) |
| PUT | `/plans/:id` | Update plan | Yes (Admin) |
| DELETE | `/plans/:id` | Delete plan | Yes (Admin) |

### Addon Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/addons` | Get all addons | No |
| GET | `/addons/:id` | Get addon by ID | No |
| GET | `/addons/category/:category` | Get by category | No |
| POST | `/addons` | Create addon | Yes (Admin) |
| PUT | `/addons/:id` | Update addon | Yes (Admin) |
| DELETE | `/addons/:id` | Delete addon | Yes (Admin) |

### Photo Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/photos` | Upload photos | Yes (Admin) |
| GET | `/photos/booking/:bookingId` | Get by booking | No |
| GET | `/photos/:id` | Get photo by ID | No |
| DELETE | `/photos/:id` | Delete photo | Yes (Admin) |

### Admin Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/admin/dashboard` | Dashboard stats | Yes (Admin) |
| GET | `/admin/analytics` | Analytics data | Yes (Admin) |
| GET | `/admin/users` | Get all users | Yes (Admin) |
| PUT | `/admin/users/:id/status` | Update user status | Yes (Admin) |

## 🔐 Authentication

Protected endpoints require JWT token in Authorization header:

```javascript
headers: {
  'Authorization': 'Bearer YOUR_JWT_TOKEN'
}
```

## 📝 Example API Requests

### Register User
```javascript
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+911234567890"
}
```

### Login
```javascript
POST /api/auth/login
{
  "email": "admin@techvaseegrahhub.com",
  "password": "admin123456"
}
```

### Create Booking
```javascript
POST /api/bookings
{
  "customerName": "Jane Smith",
  "email": "jane@example.com",
  "phone": "+919876543210",
  "date": "2025-11-01",
  "slotId": "slot_id_here",
  "planId": "plan_id_here",
  "addons": [
    {
      "addonId": "addon_id_here",
      "quantity": 2
    }
  ],
  "totalAmount": 5999,
  "specialRequests": "Need extra chairs"
}
```

## 🗄️ Database Models

### User
- email, password, name, role, phone, isActive

### Booking
- bookingId, customerName, email, phone, date, slotId, planId, addons, totalAmount, status, paymentStatus

### Slot
- name, startTime, endTime, date, isAvailable, maxCapacity, currentBookings

### Plan
- name, description, price, duration, features, includes, isActive, isPopular

### Addon
- name, description, price, category, isAvailable

### Photo
- bookingId, filename, url, uploadedBy

## 🔧 Development Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Seed database
npm run seed
```

## 🚦 Testing the API

### Using cURL
```bash
# Health check
curl http://localhost:5000/health

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@techvaseegrahhub.com","password":"admin123456"}'
```

### Using Postman
1. Import the API endpoints
2. Set base URL: `http://localhost:5000/api`
3. For protected routes, add Authorization header with Bearer token

## 📊 Default Admin Credentials

After seeding the database:
- **Email:** admin@techvaseegrahhub.com
- **Password:** admin123456

⚠️ **Important:** Change the admin password after first login!

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check MONGODB_URI in .env file
- Verify MongoDB service is started

### Port Already in Use
- Change PORT in .env file
- Kill process using port 5000: `netstat -ano | findstr :5000`

### Cannot Find Module Errors
- Delete node_modules and package-lock.json
- Run `npm install` again

## 📄 Next Steps

1. ✅ Backend API is complete
2. ⏳ Setup Frontend React application in `client/` directory
3. ⏳ Connect frontend to backend API
4. ⏳ Deploy to production

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📧 Support

For issues and questions, please contact: support@techvaseegrahhub.com

## 📜 License

ISC License - feel free to use this project for learning and development.
