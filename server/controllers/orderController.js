import Order from '../models/Order.js';

export const createOrder = async (req, res) => {
    try {
        const { items, totalPrice, deliveryAddress, phone, paymentMethod, prescriptionUrl } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ error: 'No order items specified.' });
        }

        const order = new Order({
            user: req.user._id,
            userName: req.user.name,
            userEmail: req.user.email,
            items,
            totalPrice,
            deliveryAddress: deliveryAddress || req.user.address,
            phone: phone || req.user.phone,
            paymentMethod: paymentMethod || 'Cash on Delivery',
            prescriptionUrl: prescriptionUrl || ''
        });

        const createdOrder = await order.save();
        res.status(201).json(createdOrder);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).populate('user', 'id name email').sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            order.status = req.body.status || order.status;
            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ error: 'Order not found.' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const cancelOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
                return res.status(403).json({ error: 'Not authorized to cancel this order.' });
            }

            if (order.status !== 'pending') {
                return res.status(400).json({ error: 'Only pending orders can be cancelled.' });
            }

            order.status = 'cancelled';
            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ error: 'Order not found.' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
