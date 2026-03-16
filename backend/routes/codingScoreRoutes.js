import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getSolvedProblems, markProblemSolved, recordAttempt, getGlobalStats } from '../controllers/codingScoreController.js';

const router = express.Router();

router.get('/stats', getGlobalStats);

router.route('/')
    .get(protect, getSolvedProblems);

router.route('/solve')
    .post(protect, markProblemSolved);

router.route('/attempt')
    .post(protect, recordAttempt);

export default router;
