import express from 'express';
import { getPerformanceData } from '../controllers/performanceController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/summary', protect, getPerformanceData);

export default router;
