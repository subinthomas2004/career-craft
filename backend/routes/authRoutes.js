import express from 'express';
import { registerUser, loginUser, forgotPassword, resetPassword, googleLogin, getMe, updateProfile, verifyOtp, addRecentActivity, logoutUser } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/verify-otp', verifyOtp);
router.post('/login', loginUser);
router.post('/google', googleLogin);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/logout', protect, logoutUser);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.post('/activity', protect, addRecentActivity);

export default router;
