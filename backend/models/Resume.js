import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
    userId: {
        type: String, // Or mongoose.Schema.Types.ObjectId if using User model
        required: false // Optional for now until auth is fully linked
    },
    fileName: {
        type: String,
        required: true
    },
    fileType: {
        type: String,
        default: 'application/pdf'
    },
    uploadDate: {
        type: Date,
        default: Date.now
    },
    score: {
        type: Number,
        required: true
    },
    analysis: {
        keywordsFound: [String],
        keywordsMissing: [String],
        formattingIssues: [String],
        strengths: [String],
        improvements: [String]
    }
});

const Resume = mongoose.model('Resume', resumeSchema);

export default Resume;
