import express from 'express';
import { registerUser, loginUser, forgotPassword, resetPassword, googleLogin, getMe, updateProfile, verifyOtp, addRecentActivity, changePassword, deleteAccount, verifyPassword } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/verify-otp', verifyOtp);
router.post('/login', loginUser);
router.post('/google', googleLogin);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.post('/activity', protect, addRecentActivity);
router.put('/change-password', protect, changePassword);
router.post('/verify-password', protect, verifyPassword);
router.delete('/account', protect, deleteAccount);

export default router;
