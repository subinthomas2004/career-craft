import mongoose from 'mongoose';

const mentorProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    personalityMode: {
        type: String,
        enum: ['friendly', 'strict', 'corporate', 'motivational'],
        default: 'friendly'
    },
    dailyGoals: [{
        id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
        title: { type: String, required: true },
        category: { type: String }, // coding, aptitude, typing, quiz, read
        difficulty: { type: String },
        isCompleted: { type: Boolean, default: false },
        date: { type: String, default: () => new Date().toISOString().split('T')[0] }
    }],
    learningRoadmap: [{
        id: { type: String },
        title: { type: String },
        targetDate: { type: Date },
        status: { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending' },
        steps: [{
            title: { type: String },
            isDone: { type: Boolean, default: false }
        }]
    }],
    behavioralMetrics: {
        peakProductiveHours: [String],
        procrastinationPatterns: [String],
        consistencyScore: { type: Number, default: 0 },
        lastAnalysisDate: Date
    },
    skillGapRecommendations: [{
        topic: { type: String },
        gapLevel: { type: String },
        resources: [{
            title: { type: String },
            link: { type: String },
            resourceType: { type: String }, // video, article, quiz
            rank: { type: Number }
        }]
    }],
    progressReflection: {
        weeklyReport: { type: String },
        strengthsImproved: [String],
        areasStillWeak: [String],
        predictedReadiness: { type: Number },
        lastUpdated: Date
    },
    memory: {
        careerGoals: String,
        preferredLearningStyle: String,
        weakTopics: [String],
        pastScores: [{
            topic: String,
            score: Number,
            date: Date
        }]
    },
    chatHistory: [{
        role: { type: String, enum: ['user', 'assistant', 'system'] },
        content: { type: String },
        emotion: { type: String }, // frustrated, motivated, stressed, normal
        timestamp: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

const AIMentorProfile = mongoose.model('AIMentorProfile', mentorProfileSchema);

export default AIMentorProfile;
