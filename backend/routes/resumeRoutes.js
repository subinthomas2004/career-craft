import express from 'express';
import multer from 'multer';
import { uploadResume, getResume } from '../controllers/resumeController.js';

const router = express.Router();

// Memory storage so we can access buffer immediately for parsing
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed!'), false);
        }
    }
});

// Routes
router.post('/upload', upload.single('resume'), uploadResume);
router.get('/:id', getResume);

export default router;
