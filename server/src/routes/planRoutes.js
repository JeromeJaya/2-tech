import express from 'express';
import {
  createPlan,
  getPlans,
  getPlanById,
  updatePlan,
  deletePlan,
} from '../controllers/planController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validatePlan } from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.get('/', getPlans);
router.get('/:id', getPlanById);

// Protected routes (Admin only)
router.post('/', authenticate, authorize('admin'), validatePlan, createPlan);
router.put('/:id', authenticate, authorize('admin'), updatePlan);
router.delete('/:id', authenticate, authorize('admin'), deletePlan);

export default router;
