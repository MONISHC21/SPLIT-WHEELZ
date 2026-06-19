import { Request, Response } from 'express';
import { prisma } from '../config/database';
import { asyncHandler } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

export const getDashboardStats = asyncHandler(async (_req: Request, res: Response) => {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

  const [
    totalUsers, newUsersThisMonth, newUsersLastMonth,
    totalVehicles, activeVehicles,
    totalBookings, bookingsThisMonth, bookingsLastMonth,
    totalRevenue, revenueThisMonth, revenueLastMonth,
    pendingDisputes,
    recentBookings, recentUsers,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { createdAt: { gte: monthStart } } }),
    prisma.user.count({ where: { createdAt: { gte: lastMonthStart, lte: lastMonthEnd } } }),
    prisma.vehicle.count(),
    prisma.vehicle.count({ where: { status: 'AVAILABLE' } }),
    prisma.booking.count(),
    prisma.booking.count({ where: { createdAt: { gte: monthStart } } }),
    prisma.booking.count({ where: { createdAt: { gte: lastMonthStart, lte: lastMonthEnd } } }),
    prisma.payment.aggregate({ where: { status: 'COMPLETED' }, _sum: { amount: true } }),
    prisma.payment.aggregate({
      where: { status: 'COMPLETED', createdAt: { gte: monthStart } },
      _sum: { amount: true },
    }),
    prisma.payment.aggregate({
      where: { status: 'COMPLETED', createdAt: { gte: lastMonthStart, lte: lastMonthEnd } },
      _sum: { amount: true },
    }),
    prisma.dispute.count({ where: { status: 'OPEN' } }),
    prisma.booking.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true, email: true, avatar: true } },
        vehicle: { select: { make: true, model: true, registrationNumber: true } },
      },
    }),
    prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true, email: true, avatar: true, createdAt: true, role: true },
    }),
  ]);

  const userGrowth = newUsersLastMonth > 0
    ? ((newUsersThisMonth - newUsersLastMonth) / newUsersLastMonth * 100).toFixed(1)
    : '100';

  const bookingGrowth = bookingsLastMonth > 0
    ? ((bookingsThisMonth - bookingsLastMonth) / bookingsLastMonth * 100).toFixed(1)
    : '100';

  const revenueLastMonthAmt = Number(revenueLastMonth._sum.amount || 0);
  const revenueThisMonthAmt = Number(revenueThisMonth._sum.amount || 0);
  const revenueGrowth = revenueLastMonthAmt > 0
    ? ((revenueThisMonthAmt - revenueLastMonthAmt) / revenueLastMonthAmt * 100).toFixed(1)
    : '100';

  res.json({
    success: true,
    data: {
      overview: {
        totalUsers,
        newUsersThisMonth,
        userGrowth: parseFloat(userGrowth),
        totalVehicles,
        activeVehicles,
        totalBookings,
        bookingsThisMonth,
        bookingGrowth: parseFloat(bookingGrowth),
        totalRevenue: totalRevenue._sum.amount || 0,
        revenueThisMonth: revenueThisMonthAmt,
        revenueGrowth: parseFloat(revenueGrowth),
        pendingDisputes,
      },
      recentBookings,
      recentUsers,
    },
  });
});

export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const {
    page = '1', limit = '20', search, role, status,
  } = req.query as Record<string, string>;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const where = {
    ...(role && { role }),
    ...(status === 'banned' ? { isBanned: true } : status === 'inactive' ? { isActive: false } : {}),
    ...(search && {
      OR: [
        { name: { contains: search, mode: 'insensitive' as const } },
        { email: { contains: search, mode: 'insensitive' as const } },
        { phone: { contains: search, mode: 'insensitive' as const } },
      ],
    }),
  };

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: parseInt(limit),
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { bookings: true, ownerships: true } },
      },
    }),
    prisma.user.count({ where }),
  ]);

  res.json({
    success: true,
    data: {
      users,
      pagination: {
        total, page: parseInt(page), limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    },
  });
});

export const banUser = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { userId } = req.params;
  const { reason } = req.body;

  await prisma.user.update({
    where: { id: userId },
    data: { isBanned: true, isActive: false },
  });

  await prisma.notification.create({
    data: {
      userId,
      title: 'Account Suspended',
      body: `Your account has been suspended. Reason: ${reason || 'Violation of terms'}`,
      type: 'ACCOUNT_BANNED',
      data: { reason },
    },
  });

  res.json({ success: true, message: 'User banned' });
});

export const unbanUser = asyncHandler(async (_req: Request, res: Response) => {
  const { userId } = _req.params;

  await prisma.user.update({
    where: { id: userId },
    data: { isBanned: false, isActive: true },
  });

  res.json({ success: true, message: 'User unbanned' });
});

export const verifyVehicle = asyncHandler(async (req: Request, res: Response) => {
  const { vehicleId } = req.params;

  await prisma.vehicle.update({
    where: { id: vehicleId },
    data: { isVerified: true },
  });

  res.json({ success: true, message: 'Vehicle verified' });
});

export const getRevenueAnalytics = asyncHandler(async (_req: Request, res: Response) => {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const monthlyRevenue = await prisma.$queryRaw<Array<{ month: Date; total: number; count: number }>>`
    SELECT
      date_trunc('month', "createdAt") as month,
      SUM(amount) as total,
      COUNT(*) as count
    FROM "Payment"
    WHERE status = 'COMPLETED' AND "createdAt" >= ${sixMonthsAgo}
    GROUP BY month
    ORDER BY month ASC
  `;

  const vehicleTypeRevenue = await prisma.$queryRaw<Array<{ type: string; total: number }>>`
    SELECT v.type, SUM(p.amount) as total
    FROM "Payment" p
    JOIN "Booking" b ON p."bookingId" = b.id
    JOIN "Vehicle" v ON b."vehicleId" = v.id
    WHERE p.status = 'COMPLETED'
    GROUP BY v.type
    ORDER BY total DESC
  `;

  res.json({
    success: true,
    data: { monthlyRevenue, vehicleTypeRevenue },
  });
});

export const resolveDispute = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { disputeId } = req.params;
  const { resolution, status } = req.body;

  const dispute = await prisma.dispute.update({
    where: { id: disputeId },
    data: {
      status,
      resolution,
      resolvedAt: new Date(),
      resolvedBy: req.user!.id,
    },
    include: { raisedBy: { select: { id: true, name: true } } },
  });

  await prisma.notification.create({
    data: {
      userId: dispute.raisedById,
      title: 'Dispute Resolved',
      body: `Your dispute has been ${status.toLowerCase()}. ${resolution}`,
      type: 'DISPUTE_RESOLVED',
      data: { disputeId },
    },
  });

  res.json({ success: true, message: 'Dispute resolved', data: dispute });
});

export const featureVehicle = asyncHandler(async (req: Request, res: Response) => {
  const { vehicleId } = req.params;
  const { featured } = req.body;

  await prisma.vehicle.update({
    where: { id: vehicleId },
    data: { isFeatured: Boolean(featured) },
  });

  res.json({ success: true, message: `Vehicle ${featured ? 'featured' : 'unfeatured'}` });
});
