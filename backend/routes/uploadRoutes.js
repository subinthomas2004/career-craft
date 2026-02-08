import express from 'express';
import multer from 'multer';
import { parseResume } from '../controllers/uploadController.js';

import path from 'path';

const router = express.Router();
const upload = multer({ dest: path.join(process.cwd(), 'uploads/') }); // Absolute path temp storage

router.post('/resume', upload.single('resume'), parseResume);

export default router;
