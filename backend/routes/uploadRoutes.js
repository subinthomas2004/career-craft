import express from 'express';
import multer from 'multer';
import { parseResume } from '../controllers/uploadController.js';

const router = express.Router();

// Fix: Use memory storage instead of disk to prevent ENOENT errors on serverless environments
const upload = multer({ storage: multer.memoryStorage() });

router.post('/resume', upload.single('resume'), parseResume);

export default router;
