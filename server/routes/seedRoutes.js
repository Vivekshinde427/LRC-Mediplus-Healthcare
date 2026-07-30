import express from 'express';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Banner from '../models/Banner.js';

const router = express.Router();

const SEED_PRODUCTS = [
    // Wheelchair Category
    {
        name: 'Manual Wheelchair',
        description: 'Durable manual wheelchair with comfortable seating and easy-fold mechanism. Suitable for indoor and outdoor use. Features adjustable footrests and armrests for maximum comfort.',
        price: 5999,
        rentPricePerDay: 150,
        category: 'Wheelchair',
        subCategory: 'equipment',
        image: 'https://images.unsplash.com/photo-1589810635657-232948472d98?w=500&h=400&fit=crop',
        isTrending: true
    },
    {
        name: 'Electric Wheelchair',
        description: 'Battery-powered electric wheelchair with joystick control. Long battery life, comfortable cushioned seat, and smooth ride technology.',
        price: 45000,
        rentPricePerDay: 800,
        category: 'Wheelchair',
        subCategory: 'equipment',
        image: 'https://images.unsplash.com/photo-1589810635657-232948472d98?w=500&h=400&fit=crop',
        isTrending: true
    },
    {
        name: 'Lightweight Folding Wheelchair',
        description: 'Ultra-lightweight aluminum frame wheelchair that folds compactly for travel. Weighs only 12 kg, making it easy to transport.',
        price: 8500,
        rentPricePerDay: 200,
        category: 'Wheelchair',
        subCategory: 'equipment',
        image: 'https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?w=500&h=400&fit=crop',
        isTrending: false
    },
    // Hospital Beds Category
    {
        name: 'Standard Hospital Bed',
        description: 'Manual crank hospital bed with adjustable head and foot sections. Includes side rails and IV pole holder. Perfect for home care.',
        price: 18000,
        rentPricePerDay: 500,
        category: 'Hospital Beds',
        subCategory: 'equipment',
        image: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?w=500&h=400&fit=crop',
        isTrending: true
    },
    {
        name: 'ICU Bed with Side Rails',
        description: 'Premium ICU-grade bed with full electric adjustment, CPR function, and collapsible side rails. Features Trendelenburg positioning.',
        price: 35000,
        rentPricePerDay: 900,
        category: 'Hospital Beds',
        subCategory: 'equipment',
        image: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?w=500&h=400&fit=crop',
        isTrending: true
    },
    {
        name: 'Semi-Electric Hospital Bed',
        description: 'Electric head and foot adjustment with manual height adjustment. Easy remote control operation for patient independence.',
        price: 26000,
        rentPricePerDay: 700,
        category: 'Hospital Beds',
        subCategory: 'equipment',
        image: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?w=500&h=400&fit=crop',
        isTrending: false
    },
    // Surgical Equipment
    {
        name: 'Surgical Instrument Kit',
        description: 'Complete stainless steel surgical kit with scissors, forceps, scalpel handle, and retractor. Sterilized and medical grade.',
        price: 2499,
        rentPricePerDay: 0,
        category: 'Surgical Equipment',
        subCategory: 'equipment',
        image: 'https://images.unsplash.com/photo-1551190822-a9ce113ac100?w=500&h=400&fit=crop',
        isTrending: false
    },
    {
        name: 'Suction Machine (Portable)',
        description: 'High-vacuum portable suction machine for respiratory secretion removal. Includes oil-free lubrication pump and overflow protection.',
        price: 7999,
        rentPricePerDay: 250,
        category: 'Surgical Equipment',
        subCategory: 'equipment',
        image: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=500&h=400&fit=crop',
        isTrending: true
    },
    // Oxygen Concentrators
    {
        name: '5L Oxygen Concentrator',
        description: 'Continuous flow 5 Liters per minute oxygen concentrator with purity indicator (>93% purity). Quiet operation and built-in nebulizer option.',
        price: 32000,
        rentPricePerDay: 750,
        category: 'Oxygen Concentrators',
        subCategory: 'equipment',
        image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&h=400&fit=crop',
        isTrending: true
    },
    // Personal Care & Monitors
    {
        name: 'Digital BP Monitor',
        description: 'Fully automatic digital blood pressure monitor with cuff check indicator, hypertension warning, and irregular heartbeat detection.',
        price: 1899,
        rentPricePerDay: 0,
        category: 'Personal Care',
        subCategory: 'equipment',
        image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=500&h=400&fit=crop',
        isTrending: true
    },
    {
        name: 'Fingertip Pulse Oximeter',
        description: 'Accurate SpO2 blood oxygen saturation and pulse rate monitor. OLED dual-color display with auto shutdown and low battery warning.',
        price: 899,
        rentPricePerDay: 0,
        category: 'Personal Care',
        subCategory: 'equipment',
        image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&h=400&fit=crop',
        isTrending: false
    },
    // Medicines
    {
        name: 'Paracetamol 650mg (Pack of 15)',
        description: 'Effective analgesic and antipyretic medicine for fever relief and mild to moderate pain relief.',
        price: 35,
        rentPricePerDay: 0,
        category: 'Pain Relief',
        subCategory: 'medicine',
        image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&h=400&fit=crop',
        isTrending: true
    },
    {
        name: 'Multivitamin & Mineral Capsules (30s)',
        description: 'Daily essential health supplement to boost immunity, energy, and overall wellbeing.',
        price: 249,
        rentPricePerDay: 0,
        category: 'Vitamins & Supplements',
        subCategory: 'medicine',
        image: 'https://images.unsplash.com/photo-1577401239170-897942555fb3?w=500&h=400&fit=crop',
        isTrending: true
    },
    {
        name: 'First Aid Emergency Kit',
        description: 'Comprehensive medical emergency box with bandages, antiseptic solution, gauze, scissors, gloves, and burn ointment.',
        price: 650,
        rentPricePerDay: 0,
        category: 'First Aid',
        subCategory: 'medicine',
        image: 'https://images.unsplash.com/photo-1603555501671-8f96b3fce8b5?w=500&h=400&fit=crop',
        isTrending: true
    }
];

router.post('/seed', async (req, res) => {
    try {
        // Clear existing products & re-seed
        await Product.deleteMany({});
        const seededProducts = await Product.insertMany(SEED_PRODUCTS);

        // Seed default Hero Banners if none exist
        const existingBanners = await Banner.countDocuments({});
        if (existingBanners === 0) {
            await Banner.insertMany([
                {
                    title: 'ICU Beds & Oxygen Concentrators',
                    caption: 'Flexible daily rental Plans across Navi Mumbai',
                    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&h=600&fit=crop'
                },
                {
                    title: 'Electric & Manual Wheelchairs',
                    caption: '100% Sanitized & Tested for Doorstep Delivery',
                    image: 'https://images.unsplash.com/photo-1589810635657-232948472d98?w=800&h=600&fit=crop'
                },
                {
                    title: 'Surgical & Emergency Care Supplies',
                    caption: 'Trusted Medical Grade Healthcare Equipment',
                    image: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?w=800&h=600&fit=crop'
                }
            ]);
        }

        // Ensure default admin user exists
        const adminEmail = 'mediiplus.healthcare@gmail.com';
        let adminUser = await User.findOne({ email: adminEmail });
        if (!adminUser) {
            adminUser = await User.create({
                name: 'LRC Medi+ Admin',
                email: adminEmail,
                password: 'AdminPassword123!',
                phone: '+91 9876543210',
                address: 'Navi Mumbai, Maharashtra, India',
                role: 'admin'
            });
        }

        res.json({
            message: 'Database seeded successfully!',
            productCount: seededProducts.length,
            adminCreated: adminEmail
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
