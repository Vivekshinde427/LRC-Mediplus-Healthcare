import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        description: { type: String, required: true },
        price: { type: Number, required: true, min: 0 },
        rentPricePerDay: { type: Number, default: 0 },
        category: { type: String, required: true },
        subCategory: { type: String, enum: ['equipment', 'medicine'], default: 'equipment' },
        image: { type: String, default: '' },
        imageKey: { type: String, default: '' },
        isTrending: { type: Boolean, default: false },
        inStock: { type: Boolean, default: true },
        requiresPrescription: { type: Boolean, default: false }
    },
    { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);
export default Product;
