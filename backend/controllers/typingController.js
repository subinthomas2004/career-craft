import { RankedScore, TypingHistory } from '../models/TypingScore.js';
import User from '../models/User.js';

// @desc    Submit a ranked typing score
// @route   POST /api/typing/ranked
// @access  Private
export const submitRankedScore = async (req, res) => {
    try {
        const { wpm, accuracy, consistency } = req.body;
        const userId = req.user.id;

        // Get user name from profile
        const user = await User.findById(userId).select('name');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if user already has a ranked score
        const existingScore = await RankedScore.findOne({ userId });

        if (existingScore) {
            // Only update if new WPM is better
            if (wpm > existingScore.wpm) {
                existingScore.wpm = wpm;
                existingScore.accuracy = accuracy;
                existingScore.consistency = consistency || 0;
                existingScore.name = user.name;
                existingScore.completedAt = new Date();
                await existingScore.save();
            }
        } else {
            // Create new ranked score
            await RankedScore.create({
                userId,
                name: user.name,
                wpm,
                accuracy,
                consistency: consistency || 0,
                completedAt: new Date()
            });
        }

        // Get all scores sorted by WPM descending
        const allScores = await RankedScore.find().sort({ wpm: -1 });

        // Keep only top 5 — delete the rest
        if (allScores.length > 5) {
            const toDelete = allScores.slice(5);
            const idsToDelete = toDelete.map(s => s._id);
            await RankedScore.deleteMany({ _id: { $in: idsToDelete } });
        }

        // Return updated leaderboard + user's rank
        const leaderboard = await RankedScore.find().sort({ wpm: -1 }).limit(5);
        const userRank = leaderboard.findIndex(s => s.userId.toString() === userId) + 1;

        res.json({
            leaderboard,
            userRank: userRank > 0 ? userRank : null, // null means unranked (not in top 5)
            userWpm: wpm
        });
    } catch (error) {
        console.error('Error in submitRankedScore:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get top 5 leaderboard
// @route   GET /api/typing/leaderboard
// @access  Public
export const getLeaderboard = async (req, res) => {
    try {
        const leaderboard = await RankedScore.find().sort({ wpm: -1 }).limit(5);
        res.json(leaderboard);
    } catch (error) {
        console.error('Error in getLeaderboard:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Save a typing test result to user's history
// @route   POST /api/typing/history
// @access  Private
export const saveTypingHistory = async (req, res) => {
    try {
        const { mode, difficulty, duration, wpm, accuracy, consistency, errors } = req.body;
        const userId = req.user.id;

        const entry = await TypingHistory.create({
            userId,
            mode,
            difficulty,
            duration,
            wpm,
            accuracy,
            consistency: consistency || 0,
            errors: errors || 0,
            completedAt: new Date()
        });

        res.status(201).json(entry);
    } catch (error) {
        console.error('Error in saveTypingHistory:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get user's typing history (last 50)
// @route   GET /api/typing/history
// @access  Private
export const getTypingHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        const history = await TypingHistory.find({ userId })
            .sort({ completedAt: -1 })
            .limit(50);

        res.json(history);
    } catch (error) {
        console.error('Error in getTypingHistory:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get user's personal best WPM
// @route   GET /api/typing/personal-best
// @access  Private
export const getPersonalBest = async (req, res) => {
    try {
        const userId = req.user.id;
        const best = await TypingHistory.findOne({ userId })
            .sort({ wpm: -1 })
            .limit(1);

        res.json({
            bestWpm: best ? best.wpm : 0,
            bestAccuracy: best ? best.accuracy : 0,
            bestMode: best ? best.mode : null,
            bestDate: best ? best.completedAt : null,
            totalTests: await TypingHistory.countDocuments({ userId })
        });
    } catch (error) {
        console.error('Error in getPersonalBest:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
