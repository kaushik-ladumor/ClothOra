import express from 'express';
import verifyAdmin from '../middleware/adminMiddleware.js';
import {
  createOrder,
  getLatestOrder,
  getAllOrders,
  updatePaymentStatus,
  getOrderById,
  getAllOrdersAdmin,
  updateOrderStatus
} from '../controllers/orderController.js';
import authenticate from '../middleware/authMiddleware.js';
import { payment, verifyPayment } from '../controllers/paymentController.js';

const route = express.Router();

route.post('/pay', authenticate, payment);

// ✅ Verify payment (webhook handler)
route.post('/verify-payment', express.raw({type: 'application/json'}), verifyPayment);

// ✅ Order Routes
route.post('/', authenticate, createOrder);                    // Create new order
route.get('/', authenticate, getLatestOrder);                  // Get latest order
route.get('/all', authenticate, getAllOrders);                 // Get all user orders
route.get('/admin/all', authenticate, verifyAdmin, getAllOrdersAdmin); // Get all orders (admin)
route.get('/:orderId', authenticate, getOrderById);            // Get specific order
route.post('/update-payment', authenticate, updatePaymentStatus); // Update payment status
route.put('/:orderId/status', authenticate, verifyAdmin, updateOrderStatus); // Update order status (admin)

export default route;