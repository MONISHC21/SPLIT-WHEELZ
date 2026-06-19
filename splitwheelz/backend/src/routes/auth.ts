import { Router } from 'express';
import {
  registerOrLogin, refreshToken, getMe, updateProfile,
  updateFcmToken, logout,
} from '../controllers/authController';
import { authenticate } from '../middleware/auth';
import { authLimiter } from '../middleware/rateLimiter';

const router = Router();

router.post('/register', authLimiter, registerOrLogin);
router.post('/login', authLimiter, registerOrLogin);
router.post('/refresh', authLimiter, refreshToken);
router.get('/me', authenticate, getMe);
router.patch('/profile', authenticate, updateProfile);
router.post('/fcm-token', authenticate, updateFcmToken);
router.post('/logout', authenticate, logout);

export default router;
