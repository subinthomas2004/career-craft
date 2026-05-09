import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import http from 'http';

import fs from 'fs';
dotenv.config();

// Ensure uploads directory exists
const uploadsDir = path.join(path.resolve(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

const app = express();

const PORT = process.env.PORT || 5001;

// Middleware
// Fix: Use origin: true to reflect the request origin, which allows credentials
app.use(cors({
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// Handle preflight requests for all routes
app.options('*', cors());

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve static files from the 'uploads' directory
const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database Connection (serverless-optimized with connection caching)
const promptForDB = 'mongodb://localhost:27017/careercraft';
const mongoURI = process.env.MONGODB_URI || promptForDB;

if (mongoURI === promptForDB) {
    console.warn('⚠️  WARNING: MONGODB_URI is not set in .env. Using local fallback.');
}

// Cache connection for serverless reuse
let isConnected = false;

const connectDB = async () => {
    if (isConnected) return;
    try {
        await mongoose.connect(mongoURI, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        isConnected = true;
        console.log('✅ MongoDB connected successfully');
    } catch (err) {
        console.error('❌ MongoDB connection error:', err.message);
        isConnected = false;
    }
};

// Connect on startup
connectDB();

// Middleware to ensure DB connection on each request (for serverless cold starts)
app.use(async (req, res, next) => {
    if (!isConnected) {
        await connectDB();
    }
    next();
});

// Routes
import resumeRoutes from './routes/resumeRoutes.js';
import codeRoutes from './routes/codeRoutes.js';
import scoreRoutes from './routes/scoreRoutes.js';
import ollamaRoutes from './routes/ollamaRoutes.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import groqRoutes from './routes/groqRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import companyRoutes from './routes/companyRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import typingRoutes from './routes/typingRoutes.js';
import softSkillsRoutes from './routes/softSkillsRoutes.js';
import forumRoutes from './routes/forumRoutes.js';
import codingScoreRoutes from './routes/codingScoreRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';

app.get('/', (req, res) => {
    res.send('Career Craft API is running');
});

app.use('/api/resume', resumeRoutes);
app.use('/api/code', codeRoutes);
app.use('/api/scores', scoreRoutes);
app.use('/api/ollama', ollamaRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/groq', groqRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/typing', typingRoutes);
app.use('/api/soft-skills', softSkillsRoutes);
app.use('/api/forum', forumRoutes);
app.use('/api/coding-scores', codingScoreRoutes);
app.use('/api/notifications', notificationRoutes);

// Global error handler (must be after routes)
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
});



// Start Server (only when not on Vercel)
if (process.env.VERCEL !== '1') {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`Uploads directory: ${path.join(process.cwd(), 'uploads')}`);
    });
}

// Export for Vercel serverless deployment
export default app;
