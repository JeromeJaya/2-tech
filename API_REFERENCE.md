# 📡 API Quick Reference

Base URL: `http://localhost:5000/api`

## 🔐 Authentication

### Register
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+911234567890"
}
```

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "admin@techvaseegrahhub.com",
  "password": "admin123456"
}

Response:
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { "id": "...", "email": "...", "role": "admin" }
}
```

### Get Current User
```http
GET /auth/me
Authorization: Bearer <token>
```

---

## 📅 Bookings

### Create Booking (Public)
```http
POST /bookings
Content-Type: application/json

{
  "customerName": "Jane Smith",
  "email": "jane@example.com",
  "phone": "+919876543210",
  "date": "2025-11-15",
  "slotId": "672abc123def456789",
  "planId": "672xyz789abc123456",
  "addons": [
    {
      "addonId": "672def456abc789123",
      "name": "Extra Hour",
      "quantity": 1,
      "price": 500
    }
  ],
  "balloonColors": ["Red", "Gold", "White"],
  "totalAmount": 5999,
  "specialRequests": "Please arrange chairs in circle"
}
```

### Get All Bookings (Admin)
```http
GET /bookings?status=pending&page=1&limit=10
Authorization: Bearer <token>
```

### Get Booking by ID
```http
GET /bookings/672abc123def456789
Authorization: Bearer <token>
```

### Update Booking (Admin)
```http
PUT /bookings/672abc123def456789
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "confirmed",
  "paymentStatus": "paid"
}
```

### Get Today's Bookings (Admin)
```http
GET /bookings/today
Authorization: Bearer <token>
```

### Get Booking Statistics (Admin)
```http
GET /bookings/stats
Authorization: Bearer <token>
```

---

## 🎰 Slots

### Get All Slots
```http
GET /slots?date=2025-11-15&isAvailable=true
```

### Get Available Slots for Date
```http
GET /slots/available/2025-11-15
```

### Create Slot (Admin)
```http
POST /slots
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Morning Slot",
  "startTime": "09:00",
  "endTime": "12:00",
  "date": "2025-11-15",
  "isAvailable": true,
  "maxCapacity": 1
}
```

### Update Slot (Admin)
```http
PUT /slots/672abc123def456789
Authorization: Bearer <token>
Content-Type: application/json

{
  "isAvailable": false
}
```

---

## 💎 Plans

### Get All Plans
```http
GET /plans?isActive=true
```

### Get Plan by ID
```http
GET /plans/672abc123def456789
```

### Create Plan (Admin)
```http
POST /plans
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Elite Plan",
  "description": "Ultimate celebration package",
  "price": 9999,
  "duration": 5,
  "features": ["Premium decoration", "Professional photography", "Full catering"],
  "includes": ["5 hours venue", "Theme decoration", "Photographer", "DJ", "Catering for 50"],
  "isActive": true,
  "isPopular": true,
  "displayOrder": 1
}
```

---

## 🎁 Addons

### Get All Addons
```http
GET /addons?category=Food&isAvailable=true
```

### Get Addons by Category
```http
GET /addons/category/Decoration
```

### Create Addon (Admin)
```http
POST /addons
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Photo Album",
  "description": "Premium photo album with 50 prints",
  "price": 1500,
  "category": "Photography",
  "isAvailable": true,
  "displayOrder": 1
}
```

---

## 📸 Photos

### Upload Photos (Admin)
```http
POST /photos
Authorization: Bearer <token>
Content-Type: multipart/form-data

Form Data:
- photos: [file1.jpg, file2.jpg]
- bookingId: 672abc123def456789
```

### Get Photos by Booking
```http
GET /photos/booking/672abc123def456789
```

### Delete Photo (Admin)
```http
DELETE /photos/672abc123def456789
Authorization: Bearer <token>
```

---

## 👨‍💼 Admin

### Get Dashboard Stats
```http
GET /admin/dashboard
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": {
    "stats": {
      "totalBookings": 150,
      "todayBookings": 5,
      "pendingBookings": 12,
      "totalRevenue": 450000,
      "monthlyRevenue": 85000,
      "availableSlots": 8
    },
    "recentBookings": [...],
    "bookingsByStatus": [...]
  }
}
```

### Get Analytics
```http
GET /admin/analytics?startDate=2025-10-01&endDate=2025-10-31
Authorization: Bearer <token>
```

### Get All Users
```http
GET /admin/users
Authorization: Bearer <token>
```

### Update User Status
```http
PUT /admin/users/672abc123def456789/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "isActive": false
}
```

---

## 📊 Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

### Paginated Response
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "total": 150,
    "page": 1,
    "limit": 10,
    "pages": 15
  }
}
```

---

## 🔑 Default Admin Credentials

After running `npm run seed`:

```
Email: admin@techvaseegrahhub.com
Password: admin123456
```

⚠️ **Change this password immediately after first login!**

---

## 📝 Quick Test Workflow

1. **Login as Admin:**
```bash
POST /api/auth/login
Body: {"email":"admin@techvaseegrahhub.com","password":"admin123456"}
```

2. **Get Available Slots:**
```bash
GET /api/slots/available/2025-11-15
```

3. **Get Plans:**
```bash
GET /api/plans
```

4. **Create Booking:**
```bash
POST /api/bookings
Body: {
  "customerName": "Test User",
  "email": "test@example.com",
  "phone": "+919876543210",
  "date": "2025-11-15",
  "slotId": "<from step 2>",
  "planId": "<from step 3>",
  "totalAmount": 2999
}
```

5. **View Today's Bookings:**
```bash
GET /api/bookings/today
Authorization: Bearer <token from step 1>
```

---

## 🛠️ Testing Tools

### cURL Examples

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

**Create Booking:**
```bash
curl -X POST http://localhost:5000/api/bookings ^
  -H "Content-Type: application/json" ^
  -d "{\"customerName\":\"Test\",\"email\":\"test@test.com\",\"phone\":\"+919999999999\",\"date\":\"2025-11-15\",\"slotId\":\"...\",\"planId\":\"...\",\"totalAmount\":2999}"
```

### Postman Collection

Import this URL structure in Postman:
- Base URL: `http://localhost:5000/api`
- Environment Variable: `{{baseUrl}}`
- Token Variable: `{{authToken}}`

---

## 🎯 Status Codes

- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

---

## 📞 Support

For issues or questions, check the main README.md or SETUP_GUIDE.md files.
