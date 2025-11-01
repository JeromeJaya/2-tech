import express from 'express';
import {
  createSlot,
  getSlots,
  getSlotById,
  updateSlot,
  deleteSlot,
  getAvailableSlots,
} from '../controllers/slotController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validateSlot } from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.get('/', getSlots);
router.get('/available/:date', getAvailableSlots);
router.get('/:id', getSlotById);

// Protected routes (Admin only)
router.post('/', authenticate, authorize('admin'), validateSlot, createSlot);
router.put('/:id', authenticate, authorize('admin'), updateSlot);
router.delete('/:id', authenticate, authorize('admin'), deleteSlot);

export default router;
