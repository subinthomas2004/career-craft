import express from 'express';
import { submitScore, getTopScores } from '../controllers/scoreController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, submitScore);
router.get('/top', getTopScores);

export default router;
