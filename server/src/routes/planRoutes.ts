import express from 'express';
import {
  createPlan,
  getPlans,
  getPlanById,
  updatePlan,
  deletePlan,
} from '../controllers/planController';
import { authenticate, authorize } from '../middleware/auth';
import { validatePlan } from '../middleware/validation';

const router = express.Router();

// Public routes
router.get('/', getPlans);
router.get('/:id', getPlanById);

// Protected routes (Admin only)
router.post('/', authenticate, authorize('admin'), validatePlan, createPlan);
router.put('/:id', authenticate, authorize('admin'), updatePlan);
router.delete('/:id', authenticate, authorize('admin'), deletePlan);

export default router;
