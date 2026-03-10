import mongoose from 'mongoose';

// Schema for ranked leaderboard entries (top 5 only)
const rankedScoreSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    wpm: {
        type: Number,
        required: true
    },
    accuracy: {
        type: Number,
        required: true
    },
    consistency: {
        type: Number,
        default: 0
    },
    completedAt: {
        type: Date,
        default: Date.now
    }
});

// Schema for personal typing history (per user)
const typingHistorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    mode: {
        type: String,
        enum: ['general', 'technical', 'business', 'interview', 'code', 'ranked'],
        required: true
    },
    difficulty: {
        type: String,
        enum: ['beginner', 'intermediate', 'professional'],
        default: 'intermediate'
    },
    duration: {
        type: Number,
        required: true
    },
    wpm: {
        type: Number,
        required: true
    },
    accuracy: {
        type: Number,
        required: true
    },
    consistency: {
        type: Number,
        default: 0
    },
    errors: {
        type: Number,
        default: 0
    },
    completedAt: {
        type: Date,
        default: Date.now
    }
});

export const RankedScore = mongoose.model('RankedScore', rankedScoreSchema);
export const TypingHistory = mongoose.model('TypingHistory', typingHistorySchema);
