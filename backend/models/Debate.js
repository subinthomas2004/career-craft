import mongoose from 'mongoose';

const debateSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    topic: {
        type: String,
        required: true
    },
    overallScore: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Debate = mongoose.model('Debate', debateSchema);

export default Debate;
