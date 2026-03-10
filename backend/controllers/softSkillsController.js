import CommunicationSession from '../models/CommunicationSession.js';
import Debate from '../models/Debate.js';

export const saveCommunicationSession = async (req, res) => {
    try {
        const { score, wpm, grammarErrorCount, fillerWordCount, mode } = req.body;
        const userId = req.user._id;

        const session = new CommunicationSession({
            userId,
            score,
            wpm,
            grammarErrorCount,
            fillerWordCount,
            mode
        });

        const savedSession = await session.save();
        res.status(201).json({ success: true, session: savedSession });
    } catch (error) {
        console.error("Save Communication Session Error:", error);
        res.status(500).json({ success: false, error: "Failed to save communication session" });
    }
};

export const getCommunicationSessions = async (req, res) => {
    try {
        const userId = req.user._id;
        const sessions = await CommunicationSession.find({ userId }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, sessions });
    } catch (error) {
        console.error("Get Communication Sessions Error:", error);
        res.status(500).json({ success: false, error: "Failed to fetch communication sessions" });
    }
};

export const saveDebateSession = async (req, res) => {
    try {
        const { topic, overallScore } = req.body;
        const userId = req.user._id;

        const session = new Debate({
            userId,
            topic,
            overallScore
        });

        const savedSession = await session.save();
        res.status(201).json({ success: true, session: savedSession });
    } catch (error) {
        console.error("Save Debate Session Error:", error);
        res.status(500).json({ success: false, error: "Failed to save debate session" });
    }
};

export const getDebateSessions = async (req, res) => {
    try {
        const userId = req.user._id;
        const sessions = await Debate.find({ userId }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, sessions });
    } catch (error) {
        console.error("Get Debate Sessions Error:", error);
        res.status(500).json({ success: false, error: "Failed to fetch debate sessions" });
    }
};
