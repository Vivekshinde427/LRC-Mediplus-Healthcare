import express from 'express';
import multer from 'multer';
import path from 'path';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Multer storage config
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename(req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `product-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

// File filter — only images
function fileFilter(req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif|webp|svg/;
    const extValid = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeValid = allowedTypes.test(file.mimetype.split('/')[1]);

    if (extValid && mimeValid) {
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

// POST /api/upload — upload a single product image
router.post('/', protect, admin, (req, res) => {
    upload.single('image')(req, res, (err) => {
        if (err) {
            if (err instanceof multer.MulterError) {
                if (err.code === 'LIMIT_FILE_SIZE') {
                    return res.status(400).json({ error: 'File size exceeds 5MB limit.' });
                }
                return res.status(400).json({ error: err.message });
            }
            return res.status(400).json({ error: err.message });
        }

        if (!req.file) {
            return res.status(400).json({ error: 'No image file provided.' });
        }

        // Return the URL path to the uploaded file
        const imageUrl = `/uploads/${req.file.filename}`;
        res.json({ imageUrl, message: 'Image uploaded successfully.' });
    });
});

export default router;
