import Score from '../models/Score.js';
import User from '../models/User.js';

// @desc    Submit a new score
// @route   POST /api/scores
// @access  Private
const submitScore = async (req, res) => {
    const { score, totalQuestions, timeTaken, quizType } = req.body;

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
            title: quizType === 'aptitude' ? 'Aptitude Exam' : 'Technical Quiz',
            activityType: 'quiz',
            score: `${Math.round((score / totalQuestions) * 100)}%`,
            timestamp: Date.now()
        });

        // Handle Streak
        // ... (streak logic remains)
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (!user.lastActiveDate) {
            user.streak = 1;
        } else {
            const lastActive = new Date(user.lastActiveDate);
            lastActive.setHours(0, 0, 0, 0);

            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);

            if (lastActive.getTime() === yesterday.getTime()) {
                user.streak += 1;
            } else if (lastActive.getTime() < yesterday.getTime()) {
                user.streak = 1;
            }
        }
        user.lastActiveDate = today;

        // Keep only the last 20 activities
        if (user.recentActivities.length > 20) {
            user.recentActivities = user.recentActivities.slice(0, 20);
        }

        // Update stats
        user.stats.quizzesTaken += 1;
        
        if (quizType === 'aptitude') {
            if (totalQuestions === 40) {
                user.stats.aptitudeExamCount += 1;
            }
        } else if (quizType === 'technical') {
            if (totalQuestions === 40) {
                user.stats.technicalQuizCount += 1;
            }
        }

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
