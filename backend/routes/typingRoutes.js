import express from 'express';
import {
    submitRankedScore,
    getLeaderboard,
    saveTypingHistory,
    getTypingHistory,
    getPersonalBest
} from '../controllers/typingController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Ranked / Leaderboard
router.post('/ranked', protect, submitRankedScore);
router.get('/leaderboard', getLeaderboard);  // Public

// Personal History & Progress
router.post('/history', protect, saveTypingHistory);
router.get('/history', protect, getTypingHistory);
router.get('/personal-best', protect, getPersonalBest);

export default router;
