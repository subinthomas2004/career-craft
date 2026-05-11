import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import Feedback from '../models/Feedback.js';

const router = express.Router();

// @desc    Create feedback
// @route   POST /api/feedback
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const { title, description, type } = req.body;

        if (!title || !description) {
            return res.status(400).json({ message: 'Title and description are required' });
        }

        const feedback = await Feedback.create({
            userId: req.user._id,
            userName: req.user.name,
            userEmail: req.user.email,
            title,
            description,
            type: type || 'feedback'
        });

        res.status(201).json(feedback);
    } catch (error) {
        console.error('Error creating feedback:', error);
        res.status(500).json({ message: 'Server error creating feedback' });
    }
});

// @desc    Get my feedback history
// @route   GET /api/feedback/my
// @access  Private
router.get('/my', protect, async (req, res) => {
    try {
        const feedbacks = await Feedback.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.json(feedbacks);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching your feedbacks' });
    }
});

export default router;
