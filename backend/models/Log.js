import mongoose from 'mongoose';

const logSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    userName: { type: String },
    userEmail: { type: String },
    action: { 
        type: String, 
        enum: ['login', 'logout', 'suspicious_activity'], 
        required: true 
    },
    ipAddress: { type: String },
    userAgent: { type: String },
    details: { type: String },
    timestamp: { 
        type: Date, 
        default: Date.now 
    }
});

const Log = mongoose.model('Log', logSchema);
export default Log;
