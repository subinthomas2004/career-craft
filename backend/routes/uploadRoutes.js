import express from 'express';
import multer from 'multer';
import { parseResume } from '../controllers/uploadController.js';

import path from 'path';

const router = express.Router();
const uploadDir = process.env.VERCEL ? '/tmp/uploads' : path.join(process.cwd(), 'uploads/');
const upload = multer({ dest: uploadDir });

router.post('/resume', upload.single('resume'), parseResume);

export default router;
