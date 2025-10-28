import express from 'express';
import {
  getDashboardStats,
  getAnalytics,
  getUsers,
  updateUserStatus,
} from '../controllers/adminController';
import { authenticate, authorize } from '../middleware/auth';

const router = express.Router();

// All routes are protected and admin-only
router.use(authenticate);
router.use(authorize('admin'));

router.get('/dashboard', getDashboardStats);
router.get('/analytics', getAnalytics);
router.get('/users', getUsers);
router.put('/users/:id/status', updateUserStatus);

export default router;
