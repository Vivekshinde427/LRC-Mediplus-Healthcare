import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema(
    {
        title: { type: String, trim: true, default: '' },
        caption: { type: String, trim: true, default: '' },
        image: { type: String, required: true }
    },
    { timestamps: true }
);

const Banner = mongoose.model('Banner', bannerSchema);
export default Banner;
