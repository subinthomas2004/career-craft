import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getSolvedProblems, markProblemSolved } from '../controllers/codingScoreController.js';

const router = express.Router();

router.route('/')
    .get(protect, getSolvedProblems);

router.route('/solve')
    .post(protect, markProblemSolved);

export default router;
