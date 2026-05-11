import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    userName: { type: String },
    userEmail: { type: String },
    title: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String, 
        required: true 
    },
    type: { 
        type: String, 
        enum: ['feedback', 'complaint', 'bug'], 
        default: 'feedback' 
    },
    status: { 
        type: String, 
        enum: ['pending', 'in_review', 'resolved'], 
        default: 'pending' 
    },
    adminReply: { type: String },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    updatedAt: { 
        type: Date, 
        default: Date.now 
    }
});

const Feedback = mongoose.model('Feedback', feedbackSchema);
export default Feedback;
