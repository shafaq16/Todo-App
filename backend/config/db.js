import dotenv from "dotenv";
import mongoose from "mongoose";

// Load environment variables from your .env file
dotenv.config();

const connectDB = async () => {
    const uri = process.env.MONGO_URI;

    if (!uri) {
        console.error("❌ MONGO_URI is missing in your .env file!");
        process.exit(1);
    }

    try {
        const conn = await mongoose.connect(uri);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        process.exit(1); // Stop the application entirely if the database fails to connect
    }
};

export default connectDB;