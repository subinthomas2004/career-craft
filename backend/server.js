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
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
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

// Start Server
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Uploads directory: ${path.join(process.cwd(), 'uploads/')}`);
});
