import express from 'express';
import {
  register,
  login,
  getMe,
  updatePassword,
  logout,
} from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import { validateLogin, validateRegister } from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);

// Protected routes
router.get('/me', authenticate, getMe);
router.put('/password', authenticate, updatePassword);
router.post('/logout', authenticate, logout);

export default router;
