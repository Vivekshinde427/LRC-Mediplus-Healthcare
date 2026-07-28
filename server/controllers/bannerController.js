import Banner from '../models/Banner.js';

const FALLBACK_BANNERS = [
    {
        _id: 'fb-b1',
        title: 'ICU Beds & Oxygen Concentrators',
        caption: 'Flexible Monthly Rental Plans across Navi Mumbai',
        image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&h=600&fit=crop'
    },
    {
        _id: 'fb-b2',
        title: 'Electric & Manual Wheelchairs',
        caption: '100% Sanitized & Tested for Doorstep Delivery',
        image: 'https://images.unsplash.com/photo-1589810635657-232948472d98?w=800&h=600&fit=crop'
    },
    {
        _id: 'fb-b3',
        title: 'Surgical & Emergency Care Supplies',
        caption: 'Trusted Medical Grade Healthcare Equipment',
        image: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?w=800&h=600&fit=crop'
    }
];

export const getBanners = async (req, res) => {
    try {
        const banners = await Banner.find({}).sort({ createdAt: -1 });
        if (banners && banners.length > 0) {
            return res.json(banners);
        }
        res.json(FALLBACK_BANNERS);
    } catch (error) {
        console.warn('MongoDB Banners fetch failed, using fallback list:', error.message);
        res.json(FALLBACK_BANNERS);
    }
};

export const createBanner = async (req, res) => {
    try {
        const { title, caption, image } = req.body;
        if (!image) {
            return res.status(400).json({ error: 'Banner image is required.' });
        }

        const banner = new Banner({
            title: title || '',
            caption: caption || '',
            image
        });

        const createdBanner = await banner.save();
        res.status(201).json(createdBanner);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteBanner = async (req, res) => {
    try {
        const banner = await Banner.findById(req.params.id);
        if (banner) {
            await Banner.deleteOne({ _id: banner._id });
            res.json({ message: 'Banner deleted successfully.' });
        } else {
            res.status(404).json({ error: 'Banner not found.' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
