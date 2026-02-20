process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import http from 'http';
import { Server } from 'socket.io';

dotenv.config();

const app = express();
const server = http.createServer(app);

// Socket.io setup with permissive CORS
const io = new Server(server, {
    cors: {
        origin: true, // Reflect request origin
        methods: ["GET", "POST"],
        credentials: true
    }
});

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

app.use(express.json());



// Database Connection
const promptForDB = 'mongodb://localhost:27017/careercraft';
const mongoURI = process.env.MONGODB_URI || promptForDB;

if (mongoURI === promptForDB) {
    console.warn('⚠️  WARNING: MONGODB_URI is not set in .env. Using local fallback which might not work if you intended to use Atlas.');
}

mongoose.connect(mongoURI)
    .then(() => console.log('✅ MongoDB connected successfully'))
    .catch((err) => console.error('❌ MongoDB connection error:', err));

// Routes
import resumeRoutes from './routes/resumeRoutes.js';
import codeRoutes from './routes/codeRoutes.js';
import scoreRoutes from './routes/scoreRoutes.js';
import ollamaRoutes from './routes/ollamaRoutes.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import groqRoutes from './routes/groqRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

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

// Global error handler (must be after routes)
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

// Socket.io Logic
io.on('connection', (socket) => {
    console.log(`User Connected: ${socket.id}`);

    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId);
        console.log(`User ${userId} joined room ${roomId}`);
        socket.to(roomId).emit('user-connected', userId);

        socket.on('disconnect', () => {
            console.log(`User ${userId} disconnected`);
            socket.to(roomId).emit('user-disconnected', userId);
        });
    });

    // Simple Peer Signaling
    socket.on("signal", (payload) => {
        io.to(payload.target).emit("signal", {
            signal: payload.signal,
            callerID: payload.callerID
        });
    });
});

// Start Server (only when not on Vercel)
if (process.env.VERCEL !== '1') {
    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`Uploads directory: ${path.join(process.cwd(), 'uploads/')}`);
    });
}

// Export for Vercel serverless deployment
export default app;
