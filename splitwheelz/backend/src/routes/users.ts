import { Router } from 'express';
import { prisma } from '../config/database';
import { authenticate } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';
import { Response } from 'express';

const router = Router();

router.get('/profile', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    select: {
      id: true, name: true, email: true, phone: true, avatar: true,
      role: true, isEmailVerified: true, isPhoneVerified: true,
      kycVerified: true, addressLine1: true, addressLine2: true,
      city: true, state: true, pincode: true, country: true,
      drivingLicense: true, loyaltyPoints: true, referralCode: true,
      totalBookings: true, totalSpent: true, createdAt: true,
    },
  });

  res.json({ success: true, data: user });
}));

router.get('/dashboard', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    activeOwnerships,
    upcomingBookings,
    monthlyStats,
    recentPayments,
    unreadNotifications,
  ] = await Promise.all([
    prisma.vehicleOwnership.findMany({
      where: { userId, status: 'ACTIVE' },
      include: {
        vehicle: {
          select: {
            id: true, make: true, model: true, year: true,
            registrationNumber: true, images: true, color: true,
            status: true,
          },
        },
      },
    }),
    prisma.booking.findMany({
      where: {
        userId,
        status: { in: ['CONFIRMED', 'PENDING'] },
        startTime: { gte: now },
      },
      include: {
        vehicle: {
          select: { id: true, make: true, model: true, images: true, registrationNumber: true },
        },
      },
      orderBy: { startTime: 'asc' },
      take: 5,
    }),
    prisma.booking.aggregate({
      where: {
        userId,
        createdAt: { gte: monthStart },
        status: { in: ['CONFIRMED', 'COMPLETED'] },
      },
      _count: true,
      _sum: { durationHours: true, finalAmount: true },
    }),
    prisma.payment.findMany({
      where: { userId, status: 'COMPLETED' },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        booking: {
          select: {
            vehicle: { select: { make: true, model: true } },
          },
        },
      },
    }),
    prisma.notification.count({
      where: { userId, isRead: false },
    }),
  ]);

  res.json({
    success: true,
    data: {
      activeOwnerships,
      upcomingBookings,
      monthlyStats: {
        bookings: monthlyStats._count,
        hoursUsed: monthlyStats._sum.durationHours || 0,
        amountSpent: monthlyStats._sum.finalAmount || 0,
      },
      recentPayments,
      unreadNotifications,
    },
  });
}));

router.get('/activity', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const activities = await prisma.activityLog.findMany({
    where: { userId: req.user!.id },
    orderBy: { createdAt: 'desc' },
    take: 20,
  });

  res.json({ success: true, data: activities });
}));

export default router;
