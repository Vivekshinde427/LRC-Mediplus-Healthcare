import Banner from '../models/Banner.js';

export const getBanners = async (req, res) => {
    try {
        const banners = await Banner.find({}).sort({ createdAt: -1 });
        res.json(banners);
    } catch (error) {
        res.status(500).json({ error: error.message });
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
