import express from 'express';
import { createOrder, getMyOrders, getAllOrders, updateOrderStatus, cancelOrder } from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .post(protect, createOrder)
    .get(protect, admin, getAllOrders);

router.get('/myorders', protect, getMyOrders);
router.put('/:id/status', protect, admin, updateOrderStatus);
router.put('/:id/cancel', protect, cancelOrder);

export default router;
