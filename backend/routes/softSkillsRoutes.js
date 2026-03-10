import express from 'express';
import {
    saveCommunicationSession,
    getCommunicationSessions,
    saveDebateSession,
    getDebateSessions
} from '../controllers/softSkillsController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/communication', protect, saveCommunicationSession);
router.get('/communication', protect, getCommunicationSessions);

router.post('/debate', protect, saveDebateSession);
router.get('/debate', protect, getDebateSessions);

export default router;
