import Resume from '../models/Resume.js';
import { parseResume, analyzeResumeText } from '../services/resumeService.js';

export const uploadResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // 1. Parse PDF
        // multer with memoryStorage gives us req.file.buffer
        const text = await parseResume(req.file.buffer);

        if (!text || text.trim().length === 0) {
            return res.status(422).json({ message: 'Could not extract text from PDF. It might be image-based.' });
        }

        // 2. Analyze Text
        const analysisResult = analyzeResumeText(text);

        // 3. Save to Database
        const newResume = new Resume({
            fileName: req.file.originalname,
            fileType: req.file.mimetype,
            score: analysisResult.score,
            analysis: analysisResult.analysis
            // userId: req.user?._id // Add this when auth is ready
        });

        await newResume.save();

        // 4. Return Result
        res.status(201).json({
            message: 'Resume analyzed successfully',
            data: {
                id: newResume._id,
                ...analysisResult
            }
        });

    } catch (error) {
        console.error("Upload Error:", error);
        res.status(500).json({ message: 'Server error during analysis', error: error.message });
    }
};

export const getResume = async (req, res) => {
    try {
        const resume = await Resume.findById(req.params.id);
        if (!resume) return res.status(404).json({ message: 'Resume not found' });
        res.json(resume);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
