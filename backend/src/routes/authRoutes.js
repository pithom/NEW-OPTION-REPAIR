import { Router } from 'express';
import {
  changePassword,
  forgotPassword,
  getProfile,
  login,
  logout,
  resetPassword,
  updateProfile,
  verifyOtp
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import {
  authLimiter,
  forgotPasswordLimiter,
  resetPasswordLimiter,
  verifyOtpLimiter
} from '../middleware/rateLimiters.js';

const router = Router();

router.post('/login', authLimiter, login);
router.post('/logout', logout);
router.post('/forgot-password', forgotPasswordLimiter, forgotPassword);
router.post('/verify-otp', verifyOtpLimiter, verifyOtp);
router.post('/reset-password', resetPasswordLimiter, resetPassword);
router.get('/me', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);

export default router;
