import mongoose from 'mongoose';

const communicationSessionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    score: {
        type: Number,
        required: true
    },
    wpm: {
        type: Number,
        required: true
    },
    grammarErrorCount: {
        type: Number,
        default: 0
    },
    fillerWordCount: {
        type: Number,
        default: 0
    },
    mode: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const CommunicationSession = mongoose.model('CommunicationSession', communicationSessionSchema);

export default CommunicationSession;
