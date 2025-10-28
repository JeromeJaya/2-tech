import express from 'express';
import {
  register,
  login,
  getMe,
  updatePassword,
  logout,
} from '../controllers/authController';
import { authenticate } from '../middleware/auth';
import { validateLogin, validateRegister } from '../middleware/validation';

const router = express.Router();

// Public routes
router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);

// Protected routes
router.get('/me', authenticate, getMe);
router.put('/password', authenticate, updatePassword);
router.post('/logout', authenticate, logout);

export default router;
