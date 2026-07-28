import express from 'express';
import multer from 'multer';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Memory storage for serverless & cloud compatibility (works 100% on Vercel without disk storage)
const storage = multer.memoryStorage();

function fileFilter(req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif|webp|svg/;
    const mimeValid = allowedTypes.test(file.mimetype);

    if (mimeValid) {
        cb(null, true);
    } else {
        cb(new Error('Only image files (jpg, png, gif, webp, svg) are allowed.'), false);
    }
}

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB max
});

// POST /api/upload — convert uploaded image to Base64 Data URI for cloud persistence
router.post('/', protect, admin, (req, res) => {
    upload.single('image')(req, res, (err) => {
        if (err) {
            return res.status(400).json({ error: err.message || 'Image upload failed.' });
        }

        if (!req.file) {
            return res.status(400).json({ error: 'No image file provided.' });
        }

        // Convert file buffer to Data URI
        const mimeType = req.file.mimetype || 'image/jpeg';
        const base64Image = req.file.buffer.toString('base64');
        const imageUrl = `data:${mimeType};base64,${base64Image}`;

        res.json({ imageUrl, message: 'Image uploaded successfully.' });
    });
});

export default router;
