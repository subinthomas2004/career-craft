import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { performance } from 'perf_hooks';

dotenv.config();

const mongoURI = process.env.MONGODB_URI;

async function check() {
    console.log('Testing connection to:', mongoURI.split('@')[1]); // Don't log credentials
    
    const start = performance.now();
    try {
        await mongoose.connect(mongoURI, {
            serverSelectionTimeoutMS: 10000,
        });
        const end = performance.now();
        console.log(`✅ Connected in ${((end - start) / 1000).toFixed(2)}s`);
        
        const startPing = performance.now();
        await mongoose.connection.db.admin().ping();
        const endPing = performance.now();
        console.log(`📡 Ping to DB took ${((endPing - startPing) / 1000).toFixed(2)}s`);
        
        await mongoose.disconnect();
    } catch (err) {
        console.error('❌ Connection failed:', err.message);
    }
}

check();
