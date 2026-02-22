import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import Company from './models/Company.js';

dotenv.config();

// ==========================================
// ⚠️ CLOUDINARY CONFIGURATION ⚠️
// ==========================================
// Get these from your Cloudinary Dashboard: https://console.cloudinary.com/
cloudinary.config({
    cloud_name: 'dlarj09on', // e.g., 'dvxyz123'
    api_key: '849368662787658',       // e.g., '123456789012345'
    api_secret: '1D4k2qsAWT7cVNghJ65cSs5lfNE'  // e.g., 'abcdefghijklmnopqrstuvwxyz'
});

const PLACEMENT_MATERIALS_DIR = 'D:\\VISWA\\career\\Placement material';

// ==========================================
// SCRIPT LOGIC
// ==========================================

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/careercraft';
        await mongoose.connect(mongoURI, { serverSelectionTimeoutMS: 5000 });
        console.log('✅ MongoDB connected');
    } catch (err) {
        console.error('❌ MongoDB error:', err.message);
        process.exit(1);
    }
};

const uploadFileToCloudinary = async (localFilePath, companyName) => {
    try {
        const fileName = path.basename(localFilePath);
        console.log(`   Uploading ${fileName} to Cloudinary...`);

        // Cloudinary requires setting resource_type: "raw" or "auto" for non-image files like PDFs/DOCX
        const result = await cloudinary.uploader.upload(localFilePath, {
            folder: `placement_materials/${companyName}`,
            resource_type: "auto",
            public_id: path.parse(fileName).name, // File name without extension
            use_filename: true,
            unique_filename: false
        });

        return result.secure_url;
    } catch (error) {
        console.error(`   ❌ Failed to upload ${localFilePath}:`, error.message || error);
        return null;
    }
};

// Helper function to recursively find all files in a directory
const getAllFilesRecursively = (dirPath, arrayOfFiles = []) => {
    const files = fs.readdirSync(dirPath, { withFileTypes: true });

    files.forEach(file => {
        if (file.isDirectory()) {
            arrayOfFiles = getAllFilesRecursively(path.join(dirPath, file.name), arrayOfFiles);
        } else {
            // Only include common document types
            const validExtensions = ['.pdf', '.docx', '.doc', '.txt'];
            const ext = path.extname(file.name).toLowerCase();
            if (validExtensions.includes(ext)) {
                arrayOfFiles.push(path.join(dirPath, file.name));
            }
        }
    });

    return arrayOfFiles;
};

const runMigration = async () => {
    // Check if configuration is updated
    if (cloudinary.config().cloud_name === 'YOUR_CLOUD_NAME') {
        console.error('❌ PLEASE UPDATE YOUR CLOUDINARY CREDENTIALS AT THE TOP OF THIS SCRIPT!');
        process.exit(1);
    }

    await connectDB();

    if (!fs.existsSync(PLACEMENT_MATERIALS_DIR)) {
        console.error(`❌ Folder not found: ${PLACEMENT_MATERIALS_DIR}`);
        process.exit(1);
    }

    const companyFolders = fs.readdirSync(PLACEMENT_MATERIALS_DIR, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

    console.log(`📂 Found ${companyFolders.length} companies to process.`);

    for (const companyName of companyFolders) {
        console.log(`\n🏢 Processing Company: ${companyName}`);

        let company = await Company.findOne({ name: companyName });
        if (company) {
            console.log(`   ⏭️ Company already exists in DB. Resuming and adding missing materials...`);
            // We NO LONGER clear the materials array here!
        } else {
            company = new Company({
                name: companyName,
                description: `${companyName} placement preparation materials`,
                logoUrl: ''
            });
        }

        const companyDir = path.join(PLACEMENT_MATERIALS_DIR, companyName);
        const allFiles = getAllFilesRecursively(companyDir);

        console.log(`   📝 Found ${allFiles.length} valid material files (including subfolders).`);

        let materialsSaved = 0;
        for (const localFilePath of allFiles) {
            const fileName = path.basename(localFilePath);
            const fileTitle = path.parse(fileName).name;

            // Skip if it already exists in the database
            const alreadyExists = company.materials.some(m => m.title === fileTitle);
            if (alreadyExists) {
                console.log(`   ⏭️ Skipping ${fileName} (already uploaded)`);
                continue; // Skip uploading this file again!
            }

            const cloudUrl = await uploadFileToCloudinary(localFilePath, companyName);

            if (cloudUrl) {
                const ext = path.extname(fileName).toLowerCase();
                let docType = 'Document';
                if (fileName.toLowerCase().includes('pyq') || fileName.toLowerCase().includes('paper')) {
                    docType = 'PYQ';
                } else if (fileName.toLowerCase().includes('quiz') || fileName.toLowerCase().includes('aptitude') || fileName.toLowerCase().includes('quest')) {
                    docType = 'Quiz';
                } else if (fileName.toLowerCase().includes('syllabus')) {
                    docType = 'Syllabus';
                } else if (fileName.toLowerCase().includes('note') || fileName.toLowerCase().includes('fundamental')) {
                    docType = 'Notes';
                }

                company.materials.push({
                    title: path.parse(fileName).name,
                    type: docType,
                    cloudUrl: cloudUrl
                });
                materialsSaved++;
            }
        }

        await company.save();
        console.log(`   ✅ Saved ${materialsSaved} materials for ${companyName} to database.`);
    }

    console.log('\n🎉 ALL DONE! Migration completed successfully!');
    process.exit(0);
};

runMigration();
