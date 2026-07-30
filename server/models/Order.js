import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true, default: 1 },
    option: { type: String, enum: ['buy', 'rent'], default: 'buy' },
    rentDurationDays: { type: Number, default: 1 },
    price: { type: Number, required: true }
});

const orderSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        userName: { type: String, required: true },
        userEmail: { type: String, required: true },
        items: [orderItemSchema],
        totalPrice: { type: Number, required: true },
        deliveryAddress: { type: String, required: true },
        phone: { type: String, required: true },
        paymentMethod: { type: String, default: 'Cash on Delivery / UPI on Delivery' },
        prescriptionUrl: { type: String, default: '' },
        status: {
            type: String,
            enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
            default: 'pending'
        }
    },
    { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);
export default Order;
