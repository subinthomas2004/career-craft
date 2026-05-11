import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getSolvedProblems, markProblemSolved, recordAttempt, getGlobalStats, getLeaderboard } from '../controllers/codingScoreController.js';

const router = express.Router();

router.get('/stats', getGlobalStats);
router.get('/leaderboard', getLeaderboard);

router.route('/')
    .get(protect, getSolvedProblems);

router.route('/solve')
    .post(protect, markProblemSolved);

router.route('/attempt')
    .post(protect, recordAttempt);

export default router;
