import Score from '../models/Score.js';
import User from '../models/User.js';

// @desc    Submit a new score
// @route   POST /api/scores
// @access  Private
const submitScore = async (req, res) => {
    const { score, totalQuestions, timeTaken } = req.body;

    if (score === undefined || totalQuestions === undefined || timeTaken === undefined) {
        return res.status(400).json({ message: 'Please provide all fields' });
    }

    try {
        const user = await User.findById(req.user._id);

        const newScore = await Score.create({
            user: req.user._id,
            username: user.name,
            score,
            totalQuestions,
            timeTaken
        });

        // Add to Recent Activity
        user.recentActivities.unshift({
            title: `Quiz Completion`, // You might want to pass the quiz topic from frontend locally if available, or just generic
            activityType: 'quiz',
            score: `${Math.round((score / totalQuestions) * 100)}%`,
            timestamp: Date.now()
        });

        // Limit to 20
        if (user.recentActivities.length > 20) {
            user.recentActivities = user.recentActivities.slice(0, 20);
        }

        // Update stats
        user.stats.quizzesTaken += 1;
        // Simple average calculation (approximate)
        const currentTotal = user.stats.averageScore * (user.stats.quizzesTaken - 1);
        const newAvg = (currentTotal + ((score / totalQuestions) * 100)) / user.stats.quizzesTaken;
        user.stats.averageScore = Math.round(newAvg);

        await user.save();

        res.status(201).json(newScore);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get top 5 scores
// @route   GET /api/scores/top
// @access  Public
const getTopScores = async (req, res) => {
    try {
        // Sort by score (descending) and timeTaken (ascending) for tie-breaking
        const scores = await Score.find({})
            .sort({ score: -1, timeTaken: 1 })
            .limit(5);

        res.json(scores);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

export { submitScore, getTopScores };
