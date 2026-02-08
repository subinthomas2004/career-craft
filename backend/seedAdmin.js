import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';

dotenv.config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');

        const adminEmail = 'admin@careercraft.com';
        const adminPassword = 'admin@careercraft.com';

        // Check if admin exists
        let adminUser = await User.findOne({ email: adminEmail });

        if (adminUser) {
            console.log('Admin user already exists. Updating role and password...');
            const salt = await bcrypt.genSalt(10);
            adminUser.password = await bcrypt.hash(adminPassword, salt);
            adminUser.role = 'admin';
            adminUser.isVerified = true;
            await adminUser.save();
            console.log('Admin user updated successfully');
        } else {
            console.log('Creating new admin user...');
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(adminPassword, salt);

            await User.create({
                name: 'Admin User',
                email: adminEmail,
                password: hashedPassword,
                role: 'admin',
                isVerified: true
            });
            console.log('Admin user created successfully');
        }

        process.exit();
    } catch (error) {
        console.error('Error seeding admin:', error);
        process.exit(1);
    }
};

seedAdmin();
