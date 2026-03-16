import mongoose from 'mongoose';

const codingScoreSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    solvedProblems: [{
        type: Number,
        required: true
    }],
    attemptedProblems: [{
        type: Number,
        required: true
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

codingScoreSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const CodingScore = mongoose.model('CodingScore', codingScoreSchema);

export default CodingScore;
