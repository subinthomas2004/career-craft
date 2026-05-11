import Score from '../models/Score.js';
import CodingScore from '../models/CodingScore.js';
import CommunicationSession from '../models/CommunicationSession.js';
import Debate from '../models/Debate.js';
import { TypingHistory } from '../models/TypingScore.js';
import User from '../models/User.js';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_API_KEY = (process.env.GROQ_API_KEY || "").trim();

const getAIAnalysis = async (data) => {
    if (!GROQ_API_KEY) return "AI Analysis not available (Missing API Key).";

    try {
        const prompt = `You are an expert career guidance and performance analyzer AI. 
Based on the student's usage metrics across various modules below, provide a concise, motivating, and insightful analysis.

User Stats:
- Interviews Attended: ${data.stats?.interviewsAttended || 0}
- Quizzes Taken: ${data.stats?.quizzesTaken || 0}
- Technical Quiz Count: ${data.stats?.technicalQuizCount || 0}
- Aptitude Exam Count: ${data.stats?.aptitudeExamCount || 0}
- Group Discussion Count: ${data.stats?.gdCount || 0}
- Debate Count: ${data.stats?.debateCount || 0}
- Day Streak: ${data.streak || 0}

Recent Data:
- Quiz High Score: ${data.quizSummary?.highestScore || 'N/A'}%
- Coding Progress: ${data.codingSummary?.solvedProblemsCount || 0} problems solved out of ${data.codingSummary?.attemptedProblemsCount || 0} attempted.
- Avg Communication Score: ${data.commSummary?.avgScore || 'N/A'}%
- Avg Typing Speed: ${data.typingSummary?.avgWpm || 'N/A'} WPM with ${data.typingSummary?.avgAccuracy || 'N/A'}% accuracy.
- Highest Debate Score: ${data.debateSummary?.highestScore || 'N/A'}

Instructions:
1. Summarize their strengths.
2. Identify key areas for improvement.
3. Give an overall verdict or rating (e.g., "Ready for Placements", "Gaining Momentum", etc.).
4. Provide 3 specific, highly actionable next steps/recommendations to boost their profile.
5. Keep output focused and helpful.
Format the response as clean JSON with the following fields: {"strengths": ["s1", "s2"], "improvements": ["i1", "i2"], "recommendations": ["Action 1", "Action 2", "Action 3"], "verdict": "string", "detailedAnalysis": "text"}.
`;

        const response = await axios.post(GROQ_API_URL, {
            messages: [{ role: "user", content: prompt }],
            model: "llama-3.3-70b-versatile",
            temperature: 0.5,
            response_format: { type: "json_object" }
        }, {
            headers: {
                "Authorization": `Bearer ${GROQ_API_KEY}`,
                "Content-Type": "application/json"
            }
        });

        return JSON.parse(response.data.choices[0]?.message?.content || "{}");
    } catch (error) {
        console.error("Groq Performance Analysis Error:", error.message);
        return { error: "Failed to generate AI analysis" };
    }
};

export const getPerformanceData = async (req, res) => {
    try {
        const userId = req.user._id;

        // 1. Fetch User and Overall Stats
        const user = await User.findById(userId).select('-password');

        // 2. Fetch Quiz Scores
        const quizScores = await Score.find({ user: userId }).sort({ date: -1 }).limit(10);
        const allQuizScores = await Score.find({ user: userId }).select('score totalQuestions');
        const highestQuizScore = allQuizScores.length > 0 
            ? Math.max(...allQuizScores.map(s => (s.score / s.totalQuestions) * 100)) 
            : 0;
        const avgQuizScore = allQuizScores.length > 0
            ? allQuizScores.reduce((acc, curr) => acc + (curr.score / curr.totalQuestions) * 100, 0) / allQuizScores.length
            : 0;

        // 3. Fetch Coding Progress
        const codingStats = await CodingScore.findOne({ userId });

        // 4. Fetch Communication Sessions
        const commSessions = await CommunicationSession.find({ userId }).sort({ createdAt: -1 }).limit(10);
        const allCommSessions = await CommunicationSession.find({ userId }).select('score wpm');
        const avgCommScore = allCommSessions.length > 0
            ? allCommSessions.reduce((acc, curr) => acc + curr.score, 0) / allCommSessions.length
            : 0;

        // 5. Fetch Typing History
        const typingHistory = await TypingHistory.find({ userId }).sort({ completedAt: -1 }).limit(10);
        const allTyping = await TypingHistory.find({ userId }).select('wpm accuracy');
        const avgWpm = allTyping.length > 0
            ? allTyping.reduce((acc, curr) => acc + curr.wpm, 0) / allTyping.length
            : 0;
        const avgAccuracy = allTyping.length > 0
            ? allTyping.reduce((acc, curr) => acc + curr.accuracy, 0) / allTyping.length
            : 0;

        // 6. Fetch Debate History
        const debateHistory = await Debate.find({ userId }).sort({ createdAt: -1 }).limit(10);
        const allDebates = await Debate.find({ userId }).select('overallScore');
        const highestDebate = allDebates.length > 0 
            ? Math.max(...allDebates.map(d => d.overallScore)) 
            : 0;
        const avgDebateScore = allDebates.length > 0
            ? allDebates.reduce((acc, curr) => acc + curr.overallScore, 0) / allDebates.length
            : 0;

        // Calculate Confidence Score (Composite metric 0-100)
        // Based on: Comm score (30%), Debate (30%), Interviews Attended weight (20%), Quiz average (20%)
        const normalizedInterviews = Math.min(user.stats.interviewsAttended * 10, 100);
        const confidenceScore = Math.round(
            (avgCommScore * 0.3) +
            ((avgDebateScore * 10) * 0.3) +
            (normalizedInterviews * 0.2) +
            (avgQuizScore * 0.2)
        );

        const aggregatedData = {
            stats: user.stats,
            streak: user.streak,
            confidenceScore: confidenceScore || 0,
            recentActivities: user.recentActivities,
            quizSummary: {
                recent: quizScores,
                highestScore: Math.round(highestQuizScore),
                avgScore: Math.round(avgQuizScore),
                count: allQuizScores.length
            },
            codingSummary: {
                solvedProblemsCount: codingStats?.solvedProblems?.length || 0,
                attemptedProblemsCount: codingStats?.attemptedProblems?.length || 0,
                solvedList: codingStats?.solvedProblems || []
            },
            commSummary: {
                recent: commSessions,
                avgScore: Math.round(avgCommScore),
                count: allCommSessions.length
            },
            typingSummary: {
                recent: typingHistory,
                avgWpm: Math.round(avgWpm),
                avgAccuracy: Math.round(avgAccuracy),
                count: allTyping.length
            },
            debateSummary: {
                recent: debateHistory,
                highestScore: highestDebate,
                avgScore: Math.round(avgDebateScore),
                count: allDebates.length
            }
        };

        // 7. Add global Peer leaderboard (aggregation of overall stats)
        // Fetch top 5 users sort by total activities performed (interviews + quizzes + debates + GDs)
        const leaderboard = await User.aggregate([
            {
                $addFields: {
                    totalPoints: { 
                        $add: [
                            { $multiply: [{ $ifNull: ["$stats.interviewsAttended", 0] }, 10] },
                            { $multiply: [{ $ifNull: ["$stats.quizzesTaken", 0] }, 2] },
                            { $multiply: [{ $ifNull: ["$stats.debateCount", 0] }, 5] },
                            { $multiply: [{ $ifNull: ["$stats.gdCount", 0] }, 5] },
                            { $multiply: [{ $ifNull: ["$streak", 0] }, 3] } // streak bonus
                        ] 
                    }
                }
            },
            { $match: { totalPoints: { $gt: 0 } } }, // Filter inactive
            { $sort: { totalPoints: -1 } },
            { $limit: 5 },
            { $project: { name: 1, totalPoints: 1, profilePicture: 1, stats: 1 } }
        ]);

        // Find User Rank explicitly
        const allRankings = await User.aggregate([
            {
                $addFields: {
                    totalPoints: { 
                        $add: [
                            { $multiply: [{ $ifNull: ["$stats.interviewsAttended", 0] }, 10] },
                            { $multiply: [{ $ifNull: ["$stats.quizzesTaken", 0] }, 2] },
                            { $multiply: [{ $ifNull: ["$stats.debateCount", 0] }, 5] },
                            { $multiply: [{ $ifNull: ["$stats.gdCount", 0] }, 5] },
                            { $multiply: [{ $ifNull: ["$streak", 0] }, 3] }
                        ] 
                    }
                }
            },
            { $sort: { totalPoints: -1 } }
        ]);
        const userRank = allRankings.findIndex(r => r._id.toString() === userId.toString()) + 1;

        // 8. Trigger AI generation (only if user has any participation, to save tokens/time)
        let aiAnalysis = null;
        const totalActivities = aggregatedData.quizSummary.count + aggregatedData.codingSummary.attemptedProblemsCount + 
                                aggregatedData.commSummary.count + aggregatedData.debateSummary.count;
                                
        if (totalActivities > 0) {
             aiAnalysis = await getAIAnalysis(aggregatedData);
        } else {
            aiAnalysis = {
                verdict: "Awaiting Participation",
                detailedAnalysis: "Welcome! Start engaging with our modules like Mock Interviews, Quizzes, or Coding Practice to allow us to analyze your performance."
            };
        }

        res.json({
            success: true,
            performance: aggregatedData,
            aiAnalysis,
            leaderboard,
            userRank
        });
    } catch (error) {
        console.error("Get Performance Data Error:", error);
        res.status(500).json({ success: false, error: "Failed to fetch performance analytics." });
    }
};
