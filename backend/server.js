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

// Global error handler (must be after routes)
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

// Socket.io Logic
const lobbies = {}; // Track lobby participants: { roomCode: [{ socketId, userId, name, ... }] }

io.on('connection', (socket) => {
    console.log(`User Connected: ${socket.id}`);

    // --- Lobby Events ---

    // Check if a room exists (for joiners before joining)
    socket.on('check-room', (roomCode, callback) => {
        const exists = !!lobbies[roomCode];
        if (typeof callback === 'function') {
            callback({ exists, participants: exists ? lobbies[roomCode].length : 0 });
        }
    });

    socket.on('join-lobby', (roomCode, userInfo) => {
        // If NOT host, the room must already exist (created by a host)
        if (!userInfo.isHost && !lobbies[roomCode]) {
            socket.emit('room-not-found');
            return;
        }

        // Check if room is full (max 5 human participants)
        if (lobbies[roomCode] && lobbies[roomCode].length >= 5) {
            socket.emit('lobby-full');
            return;
        }

        socket.join(roomCode);

        if (!lobbies[roomCode]) lobbies[roomCode] = [];

        // Don't add duplicate
        const exists = lobbies[roomCode].find(p => p.userId === userInfo.userId);
        if (!exists) {
            lobbies[roomCode].push({ socketId: socket.id, ...userInfo });
        }

        io.to(roomCode).emit('lobby-update', lobbies[roomCode]);
        console.log(`[Lobby] ${userInfo.name} joined room ${roomCode} (${lobbies[roomCode].length}/5)`);
    });

    socket.on('leave-lobby', (roomCode) => {
        if (lobbies[roomCode]) {
            const user = lobbies[roomCode].find(p => p.socketId === socket.id);
            lobbies[roomCode] = lobbies[roomCode].filter(p => p.socketId !== socket.id);
            if (user) {
                io.to(roomCode).emit('lobby-user-left', { name: user.name });
                io.to(roomCode).emit('lobby-update', lobbies[roomCode]);
            }
            if (lobbies[roomCode].length === 0) delete lobbies[roomCode];
        }
    });

    socket.on('lobby-chat-message', (roomCode, message) => {
        io.to(roomCode).emit('lobby-chat', message);
    });

    socket.on('start-discussion', (roomCode, data) => {
        io.to(roomCode).emit('discussion-started', data);
        delete lobbies[roomCode]; // Cleanup
        console.log(`[Lobby] Discussion started in room ${roomCode}`);
    });

    // Cleanup on disconnect
    socket.on('disconnect', () => {
        console.log(`User Disconnected: ${socket.id}`);
        // Clean up from any lobby
        for (const [roomCode, participants] of Object.entries(lobbies)) {
            const user = participants.find(p => p.socketId === socket.id);
            if (user) {
                lobbies[roomCode] = participants.filter(p => p.socketId !== socket.id);
                io.to(roomCode).emit('lobby-user-left', { name: user.name });
                io.to(roomCode).emit('lobby-update', lobbies[roomCode]);
                if (lobbies[roomCode].length === 0) delete lobbies[roomCode];
            }
        }
    });

    // --- GD Room Events ---
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
