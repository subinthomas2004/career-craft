import mongoose from 'mongoose';
import dotenv from 'dotenv';
import CodingScore from './backend/models/CodingScore.js';

dotenv.config({ path: './backend/.env' });

async function run() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB");

        const leaderboard = await CodingScore.aggregate([
            {
                $project: {
                    userId: 1,
                    solvedCount: { $size: "$solvedProblems" }
                }
            },
            {
                $match: {
                    solvedCount: { $gt: 0 }
                }
            },
            {
                $sort: { solvedCount: -1 }
            },
            {
                $lookup: {
                    from: 'users', // Use collection name in plural lowercase
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $unwind: '$user'
            },
            {
                $match: {
                    'user.showProgressPublicly': { $ne: false } // Only keep users where it's true or undefined
                }
            },
            {
                $project: {
                    _id: 0,
                    name: '$user.name',
                    solvedCount: 1,
                    profilePicture: '$user.profilePicture'
                }
            }
        ]);
        console.log("Success:", leaderboard);
    } catch (error) {
        console.error("Error:", error);
    } finally {
        await mongoose.disconnect();
    }
}

run();
