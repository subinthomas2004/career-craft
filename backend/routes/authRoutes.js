import express from 'express';
import { registerUser, loginUser, forgotPassword, resetPassword, googleLogin, getMe, updateProfile, verifyOtp, addRecentActivity, changePassword, deleteAccount, verifyPassword, uploadResume, removeResume } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// Multer Storage Configuration
const storage = multer.memoryStorage();

const upload = multer({
    storage,
    fileFilter(req, file, cb) {
        const filetypes = /pdf|doc|docx/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb('Error: Only PDF and Word documents are allowed!');
        }
    }
});

router.post('/register', registerUser);
router.post('/verify-otp', verifyOtp);
router.post('/login', loginUser);
router.post('/google', googleLogin);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.post('/upload-resume', protect, upload.single('resume'), uploadResume);
router.delete('/remove-resume', protect, removeResume);
router.post('/activity', protect, addRecentActivity);
router.put('/change-password', protect, changePassword);
router.post('/verify-password', protect, verifyPassword);
router.delete('/account', protect, deleteAccount);

export default router;
