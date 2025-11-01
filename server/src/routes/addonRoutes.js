import express from 'express';
import {
  createAddon,
  getAddons,
  getAddonById,
  updateAddon,
  deleteAddon,
  getAddonsByCategory,
} from '../controllers/addonController.js'; // <-- Added .js
import { authenticate, authorize } from '../middleware/auth.js'; // <-- Added .js
import { validateAddon } from '../middleware/validation.js'; // <-- Added .js

const router = express.Router();

// Public routes
router.get('/', getAddons);
router.get('/category/:category', getAddonsByCategory);
router.get('/:id', getAddonById);

// Protected routes (Admin only)
router.post('/', authenticate, authorize('admin'), validateAddon, createAddon);
router.put('/:id', authenticate, authorize('admin'), updateAddon);
router.delete('/:id', authenticate, authorize('admin'), deleteAddon);

export default router; // <-- Changed from module.exports
