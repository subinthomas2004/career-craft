import express from 'express';
import { getJobs } from '../controllers/jobController.js';

const router = express.Router();

router.get('/', getJobs);

// Temporary debug endpoint to check env var visibility on Vercel
router.get('/debug', (req, res) => {
    const key = process.env.RAPIDAPI_KEY;
    res.json({
        keyPresent: !!key,
        keyLength: key ? key.length : 0,
        keyPreview: key ? key.substring(0, 6) + '...' : 'NOT SET',
        nodeEnv: process.env.NODE_ENV || 'not set'
    });
});

export default router;
