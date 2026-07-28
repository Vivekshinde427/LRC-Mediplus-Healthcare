import mongoose from 'mongoose';

// Disable Mongoose query buffering so database errors fail fast instead of hanging Vercel serverless functions
mongoose.set('bufferCommands', false);

let isConnected = false;

const connectDB = async () => {
    if (isConnected || mongoose.connection.readyState >= 1) {
        return true;
    }

    const uri = process.env.MONGODB_URI;
    if (!uri && process.env.VERCEL) {
        console.warn('MONGODB_URI environment variable is not configured in Vercel.');
        return false;
    }

    try {
        const db = await mongoose.connect(uri || 'mongodb://127.0.0.1:27017/lrc_healthcare', {
            serverSelectionTimeoutMS: 3000
        });
        isConnected = db.connections[0].readyState >= 1;
        console.log(`MongoDB Connected: ${db.connection.host}`);
        return true;
    } catch (error) {
        console.error(`MongoDB Connection Error: ${error.message}`);
        return false;
    }
};

export default connectDB;
