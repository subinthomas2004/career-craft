import CodingScore from '../models/CodingScore.js';

// @desc    Get user's solved coding problems
// @route   GET /api/coding-scores
// @access  Private
export const getSolvedProblems = async (req, res) => {
    try {
        const userId = req.user._id;
        
        const score = await CodingScore.findOne({ userId });
        
        if (score) {
            res.status(200).json({ success: true, solvedProblems: score.solvedProblems });
        } else {
            // Return empty array if user hasn't solved any problems yet
            res.status(200).json({ success: true, solvedProblems: [] });
        }
    } catch (error) {
        console.error("Get Solved Problems Error:", error);
        res.status(500).json({ success: false, error: "Failed to fetch solved problems" });
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
            // Check if already solved to avoid duplicates
            if (!score.solvedProblems.includes(problemId)) {
                score.solvedProblems.push(problemId);
                await score.save();
            }
        } else {
            // Create new record for user
            score = await CodingScore.create({
                userId,
                solvedProblems: [problemId]
            });
        }

        res.status(200).json({ success: true, solvedProblems: score.solvedProblems });
    } catch (error) {
        console.error("Mark Problem Solved Error:", error);
        res.status(500).json({ success: false, error: "Failed to mark problem as solved" });
    }
};
