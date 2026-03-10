import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const checkStorage = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection.db;
    const stats = await db.stats();
    
    console.log("Database Stats:");
    console.log(`- Total Documents: ${stats.objects}`);
    console.log(`- Data Size: ${(stats.dataSize / 1024 / 1024).toFixed(3)} MB`);
    console.log(`- Storage Size: ${(stats.storageSize / 1024 / 1024).toFixed(3)} MB`);
    console.log(`- Total Index Size: ${(stats.indexSize / 1024 / 1024).toFixed(3)} MB`);
    console.log(`- Average Object Size: ${stats.avgObjSize} bytes`);

    process.exit(0);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

checkStorage();
