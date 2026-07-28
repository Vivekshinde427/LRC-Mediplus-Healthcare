import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import seedRoutes from './routes/seedRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import bannerRoutes from './routes/bannerRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Ensure MongoDB is connected for every request (essential for Vercel Serverless)
app.use(async (req, res, next) => {
    try {
        await connectDB();
    } catch (e) {
        console.error('DB connect middleware error:', e.message);
    }
    next();
});

// Serve uploaded images as static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes — support both /api/* and direct /* paths for Vercel serverless compatibility
app.use(['/api/auth', '/auth'], authRoutes);
app.use(['/api/products', '/products'], productRoutes);
app.use(['/api/orders', '/orders'], orderRoutes);
app.use(['/api/chat', '/chat'], chatRoutes);
app.use(['/api/upload', '/upload'], uploadRoutes);
app.use(['/api/banners', '/banners'], bannerRoutes);
app.use(['/api', '/'], seedRoutes);

// Root route check
app.get('/api-status', (req, res) => {
    res.json({ message: 'LRC Medi+ Healthcare API Server is running...', timestamp: new Date() });
});

// Fallback error handler
app.use((err, req, res, next) => {
    console.error('Unhandled Error:', err.stack);
    res.status(500).json({ error: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;
if (!process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`LRC Medi+ Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
}

export default app;
