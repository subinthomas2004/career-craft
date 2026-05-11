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
        
        if (quizType === 'aptitude' && req.body.isExamMode) {
            user.stats.aptitudeExamCount += 1;
        } else if (quizType === 'technical' && req.body.isExamMode) {
            user.stats.technicalQuizCount += 1;
        }

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
        // Fetch more than 5 initially to account for filtered out users
        const allScores = await Score.find({})
            .sort({ score: -1, timeTaken: 1 })
            .populate('user', 'showProgressPublicly');

        // Filter out users who have chosen to hide their progress
        const visibleScores = allScores.filter(score => {
            // If user exists and showProgressPublicly is false, filter them out.
            // If user is null (deleted user) or showProgressPublicly is true/undefined, keep them.
            if (score.user && score.user.showProgressPublicly === false) {
                return false;
            }
            return true;
        });

        // Limit to top 5 after filtering
        const topScores = visibleScores.slice(0, 5);

        // Sanitize the output (don't send populated user object, just send the original schema format)
        const sanitizedScores = topScores.map(score => ({
            _id: score._id,
            user: score.user ? score.user._id : null,
            username: score.username,
            score: score.score,
            totalQuestions: score.totalQuestions,
            timeTaken: score.timeTaken,
            date: score.date
        }));

        res.json(sanitizedScores);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

export { submitScore, getTopScores };
