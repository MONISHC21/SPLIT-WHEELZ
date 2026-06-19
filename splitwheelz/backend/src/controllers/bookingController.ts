import { Response } from 'express';
import { prisma } from '../config/database';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';
import { sendBookingConfirmationEmail } from '../services/emailService';

export const createBooking = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { vehicleId, startTime, endTime, purpose, pickupLocation, dropLocation, notes } = req.body;

  const vehicle = await prisma.vehicle.findUnique({
    where: { id: vehicleId },
    include: {
      ownerships: {
        where: { userId: req.user!.id, status: 'ACTIVE' },
      },
    },
  });

  if (!vehicle) throw new AppError('Vehicle not found', 404);
  if (vehicle.status !== 'AVAILABLE') throw new AppError('Vehicle is not available for booking', 400);

  const ownership = vehicle.ownerships[0];
  if (!ownership) {
    throw new AppError('You must be a co-owner to book this vehicle', 403);
  }

  const start = new Date(startTime);
  const end = new Date(endTime);

  if (start >= end) throw new AppError('End time must be after start time', 400);
  if (start < new Date()) throw new AppError('Cannot book in the past', 400);

  // Check for conflicts
  const conflict = await prisma.booking.findFirst({
    where: {
      vehicleId,
      status: { in: ['CONFIRMED', 'PENDING'] },
      OR: [
        { AND: [{ startTime: { lte: start } }, { endTime: { gt: start } }] },
        { AND: [{ startTime: { lt: end } }, { endTime: { gte: end } }] },
        { AND: [{ startTime: { gte: start } }, { endTime: { lte: end } }] },
      ],
    },
  });

  if (conflict) {
    throw new AppError('Vehicle is already booked for this time slot', 409);
  }

  // Check weekly hour limit
  const weekStart = new Date(start);
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  weekStart.setHours(0, 0, 0, 0);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 7);

  const weeklyBookings = await prisma.booking.aggregate({
    where: {
      vehicleId,
      userId: req.user!.id,
      status: { in: ['CONFIRMED', 'PENDING'] },
      startTime: { gte: weekStart, lte: weekEnd },
    },
    _sum: { durationHours: true },
  });

  const durationHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
  const totalWeeklyHours = Number(weeklyBookings._sum.durationHours || 0) + durationHours;

  if (totalWeeklyHours > ownership.weeklyHours) {
    throw new AppError(
      `Exceeds your weekly limit of ${ownership.weeklyHours} hours. Used: ${weeklyBookings._sum.durationHours || 0}h`,
      400
    );
  }

  const hourlyRate = Number(vehicle.pricePerSlot) / (4 * 42); // Monthly price / (4 weeks * 42 hours)
  const totalAmount = parseFloat((hourlyRate * durationHours).toFixed(2));

  const booking = await prisma.booking.create({
    data: {
      vehicleId,
      userId: req.user!.id,
      startTime: start,
      endTime: end,
      durationHours: durationHours,
      purpose,
      pickupLocation,
      dropLocation,
      notes,
      totalAmount,
      finalAmount: totalAmount,
      status: 'PENDING',
    },
    include: {
      vehicle: { select: { make: true, model: true, registrationNumber: true } },
      user: { select: { name: true, email: true } },
    },
  });

  // Send confirmation email (non-blocking)
  sendBookingConfirmationEmail(booking.user.email, booking.user.name, booking).catch(console.error);

  // Create notification
  await prisma.notification.create({
    data: {
      userId: req.user!.id,
      title: 'Booking Created',
      body: `Your booking for ${booking.vehicle.make} ${booking.vehicle.model} has been created. Complete payment to confirm.`,
      type: 'BOOKING_CREATED',
      data: { bookingId: booking.id },
    },
  });

  res.status(201).json({
    success: true,
    message: 'Booking created. Please complete payment to confirm.',
    data: booking,
  });
});

export const getMyBookings = asyncHandler(async (req: AuthRequest, res: Response) => {
  const {
    page = '1',
    limit = '10',
    status,
    startDate,
    endDate,
  } = req.query as Record<string, string>;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const where = {
    userId: req.user!.id,
    ...(status && { status }),
    ...(startDate && endDate
      ? { startTime: { gte: new Date(startDate), lte: new Date(endDate) } }
      : {}),
  };

  const [bookings, total] = await Promise.all([
    prisma.booking.findMany({
      where,
      skip,
      take: parseInt(limit),
      orderBy: { createdAt: 'desc' },
      include: {
        vehicle: {
          select: {
            id: true, make: true, model: true, year: true,
            registrationNumber: true, images: true, color: true,
          },
        },
        payments: {
          select: { id: true, status: true, amount: true, type: true },
        },
      },
    }),
    prisma.booking.count({ where }),
  ]);

  res.json({
    success: true,
    data: {
      bookings,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    },
  });
});

export const getBookingById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      vehicle: {
        include: {
          ownerships: {
            where: { status: 'ACTIVE' },
            include: { user: { select: { id: true, name: true, avatar: true } } },
          },
        },
      },
      user: { select: { id: true, name: true, email: true, avatar: true } },
      payments: true,
      disputes: { select: { id: true, status: true, type: true, title: true } },
    },
  });

  if (!booking) throw new AppError('Booking not found', 404);

  if (booking.userId !== req.user!.id && req.user!.role !== 'ADMIN') {
    throw new AppError('Not authorized to view this booking', 403);
  }

  res.json({ success: true, data: booking });
});

export const cancelBooking = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { reason } = req.body;

  const booking = await prisma.booking.findUnique({ where: { id } });
  if (!booking) throw new AppError('Booking not found', 404);

  if (booking.userId !== req.user!.id && req.user!.role !== 'ADMIN') {
    throw new AppError('Not authorized to cancel this booking', 403);
  }

  if (!['PENDING', 'CONFIRMED'].includes(booking.status)) {
    throw new AppError(`Cannot cancel booking with status: ${booking.status}`, 400);
  }

  const hoursUntilStart = (booking.startTime.getTime() - Date.now()) / (1000 * 60 * 60);
  if (hoursUntilStart < 2) {
    throw new AppError('Cannot cancel booking less than 2 hours before start', 400);
  }

  const updated = await prisma.booking.update({
    where: { id },
    data: {
      status: 'CANCELLED',
      cancellationReason: reason || 'Cancelled by user',
      cancelledAt: new Date(),
    },
  });

  await prisma.notification.create({
    data: {
      userId: booking.userId,
      title: 'Booking Cancelled',
      body: 'Your booking has been cancelled. Refund will be processed within 3-5 business days.',
      type: 'BOOKING_CANCELLED',
      data: { bookingId: booking.id },
    },
  });

  res.json({ success: true, message: 'Booking cancelled', data: updated });
});

export const completeBooking = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { endOdometer } = req.body;

  const booking = await prisma.booking.findUnique({
    where: { id },
    include: { user: true },
  });

  if (!booking) throw new AppError('Booking not found', 404);
  if (booking.status !== 'CONFIRMED') throw new AppError('Booking is not confirmed', 400);

  const updated = await prisma.booking.update({
    where: { id },
    data: {
      status: 'COMPLETED',
      endOdometer: endOdometer ? parseInt(endOdometer) : null,
      completedAt: new Date(),
    },
  });

  // Update user stats
  await prisma.user.update({
    where: { id: booking.userId },
    data: {
      totalBookings: { increment: 1 },
      totalSpent: { increment: booking.finalAmount },
      loyaltyPoints: { increment: Math.floor(Number(booking.finalAmount) / 100) },
    },
  });

  res.json({ success: true, message: 'Booking completed', data: updated });
});

export const getVehicleBookings = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { vehicleId } = req.params;
  const { startDate, endDate } = req.query as Record<string, string>;

  const ownership = await prisma.vehicleOwnership.findUnique({
    where: {
      vehicleId_userId: { vehicleId, userId: req.user!.id },
    },
  });

  if (!ownership && req.user!.role !== 'ADMIN') {
    throw new AppError('Not authorized to view bookings for this vehicle', 403);
  }

  const bookings = await prisma.booking.findMany({
    where: {
      vehicleId,
      ...(startDate && endDate
        ? {
            startTime: {
              gte: new Date(startDate),
              lte: new Date(endDate),
            },
          }
        : {}),
    },
    include: {
      user: { select: { id: true, name: true, avatar: true } },
    },
    orderBy: { startTime: 'asc' },
  });

  res.json({ success: true, data: bookings });
});
