import { Response } from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { prisma } from '../config/database';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';
import { logger } from '../config/logger';

let _razorpay: Razorpay | null = null;

function getRazorpay(): Razorpay {
  if (!_razorpay) {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) {
      throw new AppError('Payment service not configured', 503);
    }
    _razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
  }
  return _razorpay;
}

export const createOrder = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { bookingId, ownershipId, type = 'BOOKING_PAYMENT', amount } = req.body;

  let finalAmount = amount;
  let description = '';
  let currency = 'INR';

  if (bookingId) {
    const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking) throw new AppError('Booking not found', 404);
    if (booking.userId !== req.user!.id) throw new AppError('Not authorized', 403);
    if (booking.paymentStatus === 'COMPLETED') throw new AppError('Already paid', 400);
    finalAmount = Math.round(Number(booking.finalAmount) * 100); // Convert to paise
    description = `Booking payment for ${bookingId}`;
  } else if (ownershipId) {
    const ownership = await prisma.vehicleOwnership.findUnique({
      where: { id: ownershipId },
      include: { vehicle: { select: { make: true, model: true } } },
    });
    if (!ownership) throw new AppError('Ownership not found', 404);
    if (ownership.userId !== req.user!.id) throw new AppError('Not authorized', 403);
    finalAmount = Math.round(Number(ownership.purchasePrice) * 100);
    description = `Slot purchase for ${ownership.vehicle.make} ${ownership.vehicle.model}`;
  }

  if (!finalAmount || finalAmount <= 0) {
    throw new AppError('Invalid amount', 400);
  }

  const razorpayOrder = await getRazorpay().orders.create({
    amount: finalAmount,
    currency,
    receipt: `sw_${Date.now()}`,
    notes: {
      userId: req.user!.id,
      bookingId: bookingId || '',
      ownershipId: ownershipId || '',
      type,
    },
  });

  const payment = await prisma.payment.create({
    data: {
      userId: req.user!.id,
      bookingId: bookingId || null,
      type,
      amount: finalAmount / 100,
      currency,
      status: 'PENDING',
      razorpayOrderId: razorpayOrder.id,
      description,
    },
  });

  res.status(201).json({
    success: true,
    data: {
      orderId: razorpayOrder.id,
      amount: finalAmount,
      currency,
      paymentId: payment.id,
      keyId: process.env.RAZORPAY_KEY_ID,
    },
  });
});

export const verifyPayment = asyncHandler(async (req: AuthRequest, res: Response) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    paymentId,
  } = req.body;

  // Verify signature
  const secret = process.env.RAZORPAY_KEY_SECRET || '';
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  if (expectedSignature !== razorpay_signature) {
    throw new AppError('Payment verification failed — invalid signature', 400);
  }

  // Fetch Razorpay payment details for cross-check
  const razorpayPayment = await getRazorpay().payments.fetch(razorpay_payment_id);
  if (razorpayPayment.status !== 'captured') {
    throw new AppError('Payment not captured', 400);
  }

  const payment = await prisma.payment.update({
    where: { id: paymentId },
    data: {
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      status: 'COMPLETED',
    },
    include: { booking: true },
  });

  // If booking payment, confirm the booking
  if (payment.bookingId && payment.booking) {
    await prisma.booking.update({
      where: { id: payment.bookingId },
      data: {
        paymentStatus: 'COMPLETED',
        status: 'CONFIRMED',
      },
    });

    await prisma.notification.create({
      data: {
        userId: req.user!.id,
        title: 'Payment Successful',
        body: `Your payment of ₹${payment.amount} was successful. Booking confirmed!`,
        type: 'PAYMENT_SUCCESS',
        data: { paymentId: payment.id, bookingId: payment.bookingId },
      },
    });
  }

  // If ownership payment
  if (payment.type === 'SLOT_PURCHASE') {
    const notes = razorpayPayment.notes as Record<string, string>;
    if (notes.ownershipId) {
      await prisma.vehicleOwnership.update({
        where: { id: notes.ownershipId },
        data: { status: 'ACTIVE' },
      });

      const ownership = await prisma.vehicleOwnership.findUnique({
        where: { id: notes.ownershipId },
        select: { vehicleId: true },
      });

      if (ownership) {
        await prisma.vehicle.update({
          where: { id: ownership.vehicleId },
          data: { availableSlots: { decrement: 1 } },
        });
      }
    }
  }

  logger.info(`Payment verified: ${razorpay_payment_id} for user ${req.user!.id}`);

  res.json({
    success: true,
    message: 'Payment verified and confirmed',
    data: payment,
  });
});

export const getMyPayments = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { page = '1', limit = '10', status, type } = req.query as Record<string, string>;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const where = {
    userId: req.user!.id,
    ...(status && { status }),
    ...(type && { type }),
  };

  const [payments, total] = await Promise.all([
    prisma.payment.findMany({
      where,
      skip,
      take: parseInt(limit),
      orderBy: { createdAt: 'desc' },
      include: {
        booking: {
          select: {
            id: true,
            startTime: true,
            endTime: true,
            vehicle: { select: { make: true, model: true, images: true } },
          },
        },
      },
    }),
    prisma.payment.count({ where }),
  ]);

  res.json({
    success: true,
    data: {
      payments,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    },
  });
});

export const requestRefund = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { paymentId } = req.params;
  const { reason } = req.body;

  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: { booking: true },
  });

  if (!payment) throw new AppError('Payment not found', 404);
  if (payment.userId !== req.user!.id) throw new AppError('Not authorized', 403);
  if (payment.status !== 'COMPLETED') throw new AppError('Only completed payments can be refunded', 400);

  if (!payment.razorpayPaymentId) {
    throw new AppError('No Razorpay payment ID found', 400);
  }

  // Check if booking is eligible for refund
  if (payment.booking) {
    const hoursUntilBooking = (payment.booking.startTime.getTime() - Date.now()) / (1000 * 60 * 60);
    if (hoursUntilBooking < 24) {
      throw new AppError('Refund not available within 24 hours of booking start', 400);
    }
  }

  const refund = await getRazorpay().payments.refund(payment.razorpayPaymentId, {
    amount: Math.round(Number(payment.amount) * 100),
    notes: { reason, userId: req.user!.id },
  });

  await prisma.payment.update({
    where: { id: paymentId },
    data: {
      status: 'REFUNDED',
      refundId: refund.id,
      refundAmount: payment.amount,
      refundReason: reason,
      refundedAt: new Date(),
    },
  });

  await prisma.notification.create({
    data: {
      userId: req.user!.id,
      title: 'Refund Initiated',
      body: `Refund of ₹${payment.amount} has been initiated. It will be credited within 5-7 business days.`,
      type: 'REFUND_INITIATED',
      data: { paymentId },
    },
  });

  res.json({ success: true, message: 'Refund initiated', data: { refundId: refund.id } });
});

export const getPaymentStats = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;

  const [totalSpent, totalRefunded, paymentsByMonth] = await Promise.all([
    prisma.payment.aggregate({
      where: { userId, status: 'COMPLETED' },
      _sum: { amount: true },
      _count: true,
    }),
    prisma.payment.aggregate({
      where: { userId, status: 'REFUNDED' },
      _sum: { refundAmount: true },
    }),
    prisma.$queryRaw`
      SELECT date_trunc('month', "createdAt") as month, SUM(amount) as total
      FROM "Payment"
      WHERE "userId" = ${userId} AND status = 'COMPLETED'
      GROUP BY month ORDER BY month DESC LIMIT 6
    `,
  ]);

  res.json({
    success: true,
    data: {
      totalSpent: totalSpent._sum.amount || 0,
      totalTransactions: totalSpent._count,
      totalRefunded: totalRefunded._sum.refundAmount || 0,
      monthlyBreakdown: paymentsByMonth,
    },
  });
});
