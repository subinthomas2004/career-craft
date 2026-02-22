import mongoose from 'mongoose';

const materialSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String, // e.g., 'PYQ', 'Syllabus', 'Notes', 'Aptitude'
        required: true,
        default: 'Document'
    },
    cloudUrl: {
        type: String,
        required: true
    }
}, { _id: false });

const companySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    description: {
        type: String,
        default: ""
    },
    logoUrl: {
        type: String,
        default: ""
    },
    materials: [materialSchema],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Company = mongoose.model('Company', companySchema);

export default Company;
