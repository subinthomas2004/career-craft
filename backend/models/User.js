import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    password: {
        type: String,
        required: false // Not required for social login users
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    profilePicture: {
        type: String,
        default: ""
    },
    resumeUrl: { type: String, default: "" },
    resumeOriginalName: { type: String, default: "" },
    location: { type: String, default: "" },
    targetRole: { type: String, default: "" },
    education: { type: String, default: "" },
    college: { type: String, default: "" },
    graduationYear: { type: String, default: "" },
    bio: { type: String, default: "" },
    skills: { type: [String], default: [] },
    stats: {
        interviewsAttended: { type: Number, default: 0 },
        quizzesTaken: { type: Number, default: 0 },
        technicalQuizCount: { type: Number, default: 0 },
        aptitudeExamCount: { type: Number, default: 0 },
        gdCount: { type: Number, default: 0 },
        debateCount: { type: Number, default: 0 },
        averageScore: { type: Number, default: 0 },
        resumeScore: { type: Number, default: 0 }
    },
    streak: { type: Number, default: 0 },
    lastActiveDate: { type: Date },
    recentActivities: [{
        title: { type: String, required: true },
        activityType: { type: String, required: true }, // 'interview', 'quiz', 'coding', 'resume', 'learning'
        score: { type: String }, // Optional score or result
        timestamp: { type: Date, default: Date.now }
    }],
    lastActive: {
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model('User', userSchema);

export default User;
