import CodingScore from '../models/CodingScore.js';
import ProblemStats from '../models/ProblemStats.js';

// @desc    Get user's solved coding problems
// @route   GET /api/coding-scores
// @access  Private
export const getSolvedProblems = async (req, res) => {
    try {
        const userId = req.user._id;
        
        const score = await CodingScore.findOne({ userId });
        
        if (score) {
            res.status(200).json({ 
                success: true, 
                solvedProblems: score.solvedProblems,
                attemptedProblems: score.attemptedProblems || []
            });
        } else {
            res.status(200).json({ success: true, solvedProblems: [], attemptedProblems: [] });
        }
    } catch (error) {
        console.error("Get Solved Problems Error:", error);
        res.status(500).json({ success: false, error: "Failed to fetch solved problems" });
    }
};

// @desc    Record a problem attempt
// @route   POST /api/coding-scores/attempt
// @access  Private
export const recordAttempt = async (req, res) => {
    try {
        const { problemId } = req.body;
        const userId = req.user._id;

        if (!problemId) {
            return res.status(400).json({ success: false, error: "problemId is required" });
        }

        let score = await CodingScore.findOne({ userId });

        if (!score) {
            score = await CodingScore.create({
                userId,
                solvedProblems: [],
                attemptedProblems: [problemId]
            });
            // First time attempt globally for this user
            await ProblemStats.findOneAndUpdate(
                { problemId },
                { $inc: { attempts: 1 } },
                { upsert: true, new: true }
            );
        } else {
            if (!score.attemptedProblems.includes(problemId)) {
                score.attemptedProblems.push(problemId);
                await score.save();
                // Increment global attempts
                await ProblemStats.findOneAndUpdate(
                    { problemId },
                    { $inc: { attempts: 1 } },
                    { upsert: true, new: true }
                );
            }
        }

        res.status(200).json({ success: true });
    } catch (error) {
        console.error("Record Attempt Error:", error);
        res.status(500).json({ success: false, error: "Failed to record attempt" });
    }
};

// @desc    Mark a coding problem as solved
// @route   POST /api/coding-scores/solve
// @access  Private
export const markProblemSolved = async (req, res) => {
    try {
        const { problemId } = req.body;
        const userId = req.user._id;

        if (!problemId) {
            return res.status(400).json({ success: false, error: "problemId is required" });
        }

        let score = await CodingScore.findOne({ userId });

        if (score) {
            if (!score.solvedProblems.includes(problemId)) {
                score.solvedProblems.push(problemId);
                // Ensure it's also in attempted
                if (!score.attemptedProblems.includes(problemId)) {
                    score.attemptedProblems.push(problemId);
                    await ProblemStats.findOneAndUpdate(
                        { problemId },
                        { $inc: { attempts: 1, successes: 1 } },
                        { upsert: true, new: true }
                    );
                } else {
                    await ProblemStats.findOneAndUpdate(
                        { problemId },
                        { $inc: { successes: 1 } },
                        { upsert: true, new: true }
                    );
                }
                await score.save();
            }
        } else {
            score = await CodingScore.create({
                userId,
                solvedProblems: [problemId],
                attemptedProblems: [problemId]
            });
            await ProblemStats.findOneAndUpdate(
                { problemId },
                { $inc: { attempts: 1, successes: 1 } },
                { upsert: true, new: true }
            );
        }

        res.status(200).json({ success: true, solvedProblems: score.solvedProblems });
    } catch (error) {
        console.error("Mark Problem Solved Error:", error);
        res.status(500).json({ success: false, error: "Failed to mark problem as solved" });
    }
};

// @desc    Get global problem statistics
// @route   GET /api/coding-scores/stats
// @access  Public
export const getGlobalStats = async (req, res) => {
    try {
        const stats = await ProblemStats.find({});
        const statsMap = {};
        stats.forEach(s => {
            statsMap[s.problemId] = {
                attempts: s.attempts,
                successes: s.successes,
                acceptanceRate: s.attempts > 0 ? (s.successes / s.attempts) * 100 : 0
            };
        });
        res.status(200).json({ success: true, stats: statsMap });
    } catch (error) {
        console.error("Get Global Stats Error:", error);
        res.status(500).json({ success: false, error: "Failed to fetch global stats" });
    }
};

// @desc    Get coding leaderboard
// @route   GET /api/coding-scores/leaderboard
// @access  Private/Public
export const getLeaderboard = async (req, res) => {
    try {
        const leaderboard = await CodingScore.aggregate([
            {
                $project: {
                    userId: 1,
                    solvedCount: { $size: "$solvedProblems" }
                }
            },
            {
                $match: {
                    solvedCount: { $gt: 0 }
                }
            },
            {
                $sort: { solvedCount: -1 }
            },
            {
                $lookup: {
                    from: 'users', // Use collection name in plural lowercase
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $unwind: '$user'
            },
            {
                $match: {
                    'user.showProgressPublicly': { $ne: false } // Only keep users where it's true or undefined
                }
            },
            {
                $project: {
                    _id: 0,
                    name: '$user.name',
                    solvedCount: 1,
                    profilePicture: '$user.profilePicture'
                }
            }
        ]);
        
        res.status(200).json({ success: true, leaderboard });
    } catch (error) {
        console.error("Get Leaderboard Error:", error);
        res.status(500).json({ success: false, error: "Failed to fetch leaderboard" });
    }
};
