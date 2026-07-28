import mongoose from 'mongoose';

// Keep bufferCommands ON (default) so queries queue up while connecting
// This is the correct setting for Vercel serverless
let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/lrc_healthcare';

        cached.promise = mongoose.connect(uri, {
            serverSelectionTimeoutMS: 8000,
            socketTimeoutMS: 45000
        }).then((db) => {
            console.log(`MongoDB Connected: ${db.connection.host}`);
            return db;
        }).catch((err) => {
            cached.promise = null;
            console.error(`MongoDB Connection Error: ${err.message}`);
            throw err;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    return cached.conn;
};

export default connectDB;
