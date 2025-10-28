import express from 'express';
import {
  uploadPhotos,
  getPhotosByBooking,
  getPhotoById,
  deletePhoto,
  getAllPhotos,
} from '../controllers/photoController';
import { authenticate, authorize } from '../middleware/auth';
import { uploadMultiple } from '../middleware/upload';

const router = express.Router();

// Public routes
router.get('/booking/:bookingId', getPhotosByBooking);
router.get('/:id', getPhotoById);

// Protected routes (Admin only)
router.post(
  '/',
  authenticate,
  authorize('admin'),
  uploadMultiple,
  uploadPhotos
);
router.get('/', authenticate, authorize('admin'), getAllPhotos);
router.delete('/:id', authenticate, authorize('admin'), deletePhoto);

export default router;
