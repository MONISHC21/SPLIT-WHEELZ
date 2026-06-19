import { Router } from 'express';
import {
  createOrder, verifyPayment, getMyPayments,
  requestRefund, getPaymentStats,
} from '../controllers/paymentController';
import { authenticate } from '../middleware/auth';
import { paymentLimiter } from '../middleware/rateLimiter';

const router = Router();

router.post('/create-order', authenticate, paymentLimiter, createOrder);
router.post('/verify', authenticate, verifyPayment);
router.get('/my', authenticate, getMyPayments);
router.get('/stats', authenticate, getPaymentStats);
router.post('/:paymentId/refund', authenticate, requestRefund);

export default router;
