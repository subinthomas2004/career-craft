import mongoose from 'mongoose';

const problemStatsSchema = new mongoose.Schema({
    problemId: {
        type: Number,
        required: true,
        unique: true
    },
    attempts: {
        type: Number,
        default: 0
    },
    successes: {
        type: Number,
        default: 0
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

problemStatsSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const ProblemStats = mongoose.model('ProblemStats', problemStatsSchema);

export default ProblemStats;
