# TechVaseeGrahHub - Backend Server

Backend API for TechVaseeGrahHub Event Booking Platform built with Node.js, Express, MongoDB, and TypeScript.

## 🚀 Features

- RESTful API architecture
- MongoDB with Mongoose ODM
- JWT authentication
- Role-based access control (Admin/User)
- File upload with Multer
- Input validation
- Error handling
- Logging with Winston
- TypeScript support

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB (v6 or higher)
- npm or yarn

## 🛠️ Installation

1. Navigate to server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` file with your configuration:
- Set `MONGODB_URI` to your MongoDB connection string
- Set `JWT_SECRET` to a secure random string
- Configure email settings if needed

## 🏃 Running the Server

### Development mode:
```bash
npm run dev
```

### Production build:
```bash
npm run build
npm start
```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/password` - Update password

### Bookings
- `POST /api/bookings` - Create booking (Public)
- `GET /api/bookings` - Get all bookings (Admin)
- `GET /api/bookings/:id` - Get booking by ID
- `PUT /api/bookings/:id` - Update booking (Admin)
- `DELETE /api/bookings/:id` - Delete booking (Admin)
- `GET /api/bookings/today` - Get today's bookings (Admin)
- `GET /api/bookings/stats` - Get booking statistics (Admin)

### Slots
- `GET /api/slots` - Get all slots
- `GET /api/slots/:id` - Get slot by ID
- `POST /api/slots` - Create slot (Admin)
- `PUT /api/slots/:id` - Update slot (Admin)
- `DELETE /api/slots/:id` - Delete slot (Admin)
- `GET /api/slots/available/:date` - Get available slots

### Plans
- `GET /api/plans` - Get all plans
- `GET /api/plans/:id` - Get plan by ID
- `POST /api/plans` - Create plan (Admin)
- `PUT /api/plans/:id` - Update plan (Admin)
- `DELETE /api/plans/:id` - Delete plan (Admin)

### Addons
- `GET /api/addons` - Get all addons
- `GET /api/addons/:id` - Get addon by ID
- `POST /api/addons` - Create addon (Admin)
- `PUT /api/addons/:id` - Update addon (Admin)
- `DELETE /api/addons/:id` - Delete addon (Admin)
- `GET /api/addons/category/:category` - Get addons by category

### Photos
- `POST /api/photos` - Upload photos (Admin)
- `GET /api/photos/booking/:bookingId` - Get photos by booking
- `GET /api/photos/:id` - Get photo by ID
- `DELETE /api/photos/:id` - Delete photo (Admin)

### Admin
- `GET /api/admin/dashboard` - Get dashboard stats (Admin)
- `GET /api/admin/analytics` - Get analytics (Admin)
- `GET /api/admin/users` - Get all users (Admin)
- `PUT /api/admin/users/:id/status` - Update user status (Admin)

## 🔐 Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## 📝 Environment Variables

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/techvaseegrahhub
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:5173
```

## 🗂️ Project Structure

```
server/
├── src/
│   ├── config/          # Configuration files
│   ├── controllers/     # Request handlers
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── middleware/      # Custom middleware
│   ├── services/        # Business logic
│   ├── utils/           # Utility functions
│   ├── types/           # TypeScript types
│   ├── app.ts           # Express app setup
│   └── server.ts        # Entry point
├── uploads/             # File uploads
├── logs/                # Log files
├── .env                 # Environment variables
├── package.json
└── tsconfig.json
```

## 🧪 Testing

```bash
npm test
```

## 📦 Building for Production

```bash
npm run build
```

This will create a `dist` folder with compiled JavaScript files.

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check MONGODB_URI in .env file
- Verify network connectivity

### Port Already in Use
- Change PORT in .env file
- Kill process using the port: `lsof -ti:5000 | xargs kill`

## 📄 License

ISC
