import express from 'express';
import {
  createBooking,
  getBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
  getTodayBookings,
  getBookingStats,
} from '../controllers/bookingController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validateBooking } from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.post('/', validateBooking, createBooking);

// Protected routes (Admin only)
router.get('/', authenticate, authorize('admin'), getBookings);
router.get('/today', authenticate, authorize('admin'), getTodayBookings);
router.get('/stats', authenticate, authorize('admin'), getBookingStats);
router.get('/:id', authenticate, getBookingById);
router.put('/:id', authenticate, authorize('admin'), updateBooking);
router.delete('/:id', authenticate, authorize('admin'), deleteBooking);

export default router;
