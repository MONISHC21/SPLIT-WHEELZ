import { Request, Response } from 'express';
import { prisma } from '../config/database';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

export const getOwnershipDetails = asyncHandler(async (req: Request, res: Response) => {
  const { vehicleId } = req.params;

  const ownerships = await prisma.vehicleOwnership.findMany({
    where: { vehicleId },
    include: {
      user: {
        select: {
          id: true, name: true, avatar: true, email: true,
          kycVerified: true, totalBookings: true, createdAt: true,
        },
      },
    },
    orderBy: { slotNumber: 'asc' },
  });

  const vehicle = await prisma.vehicle.findUnique({
    where: { id: vehicleId },
    select: {
      id: true, make: true, model: true, year: true,
      totalSlots: true, availableSlots: true, pricePerSlot: true,
      monthlyMaintenanceCost: true, insuranceCost: true,
    },
  });

  if (!vehicle) throw new AppError('Vehicle not found', 404);

  res.json({
    success: true,
    data: { vehicle, ownerships },
  });
});

export const purchaseSlot = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { vehicleId } = req.params;

  const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
  if (!vehicle) throw new AppError('Vehicle not found', 404);
  if (vehicle.availableSlots <= 0) throw new AppError('No slots available', 400);

  const existing = await prisma.vehicleOwnership.findUnique({
    where: { vehicleId_userId: { vehicleId, userId: req.user!.id } },
  });

  if (existing && existing.status === 'ACTIVE') {
    throw new AppError('You already own a slot in this vehicle', 400);
  }

  // Find next available slot number
  const takenSlots = await prisma.vehicleOwnership.findMany({
    where: { vehicleId },
    select: { slotNumber: true },
    orderBy: { slotNumber: 'asc' },
  });

  const takenNumbers = takenSlots.map((s) => s.slotNumber);
  let slotNumber = 1;
  while (takenNumbers.includes(slotNumber)) slotNumber++;

  const ownership = await prisma.vehicleOwnership.create({
    data: {
      vehicleId,
      userId: req.user!.id,
      slotNumber,
      ownershipShare: parseFloat((100 / vehicle.totalSlots).toFixed(2)),
      purchasePrice: vehicle.pricePerSlot,
      status: 'PENDING',
      weeklyHours: Math.floor((7 * 24) / vehicle.totalSlots),
    },
  });

  res.status(201).json({
    success: true,
    message: 'Slot reservation created. Please complete payment to activate.',
    data: ownership,
  });
});

export const getMyOwnerships = asyncHandler(async (req: AuthRequest, res: Response) => {
  const ownerships = await prisma.vehicleOwnership.findMany({
    where: { userId: req.user!.id },
    include: {
      vehicle: {
        include: {
          ownerships: {
            where: { status: 'ACTIVE' },
            include: {
              user: { select: { id: true, name: true, avatar: true } },
            },
          },
          _count: { select: { bookings: true } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  res.json({ success: true, data: ownerships });
});

export const getOwnershipStats = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { vehicleId } = req.params;

  const ownership = await prisma.vehicleOwnership.findUnique({
    where: { vehicleId_userId: { vehicleId, userId: req.user!.id } },
  });

  if (!ownership) throw new AppError('You do not own a slot in this vehicle', 404);

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const [bookingStats, expenses, maintenanceRecords] = await Promise.all([
    prisma.booking.aggregate({
      where: {
        vehicleId,
        userId: req.user!.id,
        startTime: { gte: monthStart, lte: monthEnd },
        status: { in: ['CONFIRMED', 'COMPLETED'] },
      },
      _sum: { durationHours: true, finalAmount: true },
      _count: true,
    }),
    prisma.vehicleExpense.findMany({
      where: {
        vehicleId,
        createdAt: { gte: monthStart },
      },
    }),
    prisma.maintenanceRecord.findMany({
      where: { vehicleId },
      orderBy: { serviceDate: 'desc' },
      take: 5,
    }),
  ]);

  const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const myShare = Number(ownership.ownershipShare) / 100;
  const myExpenseShare = totalExpenses * myShare;

  res.json({
    success: true,
    data: {
      ownership,
      monthlyStats: {
        bookings: bookingStats._count,
        hoursUsed: bookingStats._sum.durationHours || 0,
        amountSpent: bookingStats._sum.finalAmount || 0,
        expenseShare: myExpenseShare,
      },
      upcomingMaintenance: maintenanceRecords.filter(
        (m) => m.nextDueDate && m.nextDueDate > now
      ),
    },
  });
});

export const transferSlot = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { vehicleId } = req.params;
  const { newOwnerEmail, reason } = req.body;

  const ownership = await prisma.vehicleOwnership.findUnique({
    where: { vehicleId_userId: { vehicleId, userId: req.user!.id } },
  });

  if (!ownership || ownership.status !== 'ACTIVE') {
    throw new AppError('Active ownership not found', 404);
  }

  const newOwner = await prisma.user.findUnique({ where: { email: newOwnerEmail } });
  if (!newOwner) throw new AppError('New owner not found', 404);

  const existingOwnership = await prisma.vehicleOwnership.findUnique({
    where: { vehicleId_userId: { vehicleId, userId: newOwner.id } },
  });

  if (existingOwnership) {
    throw new AppError('This user already has a slot in this vehicle', 400);
  }

  // Transfer ownership
  await prisma.$transaction([
    prisma.vehicleOwnership.update({
      where: { id: ownership.id },
      data: { status: 'TRANSFERRED' },
    }),
    prisma.vehicleOwnership.create({
      data: {
        vehicleId,
        userId: newOwner.id,
        slotNumber: ownership.slotNumber,
        ownershipShare: ownership.ownershipShare,
        purchasePrice: ownership.purchasePrice,
        status: 'ACTIVE',
        weeklyHours: ownership.weeklyHours,
        isAdmin: false,
      },
    }),
    prisma.notification.create({
      data: {
        userId: newOwner.id,
        title: 'Slot Transferred to You',
        body: `A vehicle slot has been transferred to you by a previous owner.`,
        type: 'SLOT_TRANSFERRED',
        data: { vehicleId },
      },
    }),
  ]);

  res.json({ success: true, message: 'Ownership transferred successfully' });
});

export const getCoOwnerChat = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { vehicleId } = req.params;
  const { page = '1', limit = '50' } = req.query as Record<string, string>;

  const ownership = await prisma.vehicleOwnership.findUnique({
    where: { vehicleId_userId: { vehicleId, userId: req.user!.id } },
  });

  if (!ownership && req.user!.role !== 'ADMIN') {
    throw new AppError('Not authorized', 403);
  }

  let room = await prisma.chatRoom.findUnique({ where: { vehicleId } });

  if (!room) {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId },
      select: { make: true, model: true },
    });
    if (!vehicle) throw new AppError('Vehicle not found', 404);

    room = await prisma.chatRoom.create({
      data: {
        vehicleId,
        name: `${vehicle.make} ${vehicle.model} Owners`,
      },
    });
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const messages = await prisma.chatMessage.findMany({
    where: { roomId: room.id },
    skip,
    take: parseInt(limit),
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { id: true, name: true, avatar: true } },
    },
  });

  res.json({
    success: true,
    data: {
      roomId: room.id,
      messages: messages.reverse(),
    },
  });
});

export const sendChatMessage = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { vehicleId } = req.params;
  const { message, attachments } = req.body;

  const ownership = await prisma.vehicleOwnership.findUnique({
    where: { vehicleId_userId: { vehicleId, userId: req.user!.id } },
  });

  if (!ownership) throw new AppError('Not authorized', 403);

  let room = await prisma.chatRoom.findUnique({ where: { vehicleId } });
  if (!room) {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId },
      select: { make: true, model: true },
    });
    if (!vehicle) throw new AppError('Vehicle not found', 404);
    room = await prisma.chatRoom.create({
      data: { vehicleId, name: `${vehicle.make} ${vehicle.model} Owners` },
    });
  }

  const chatMessage = await prisma.chatMessage.create({
    data: {
      roomId: room.id,
      userId: req.user!.id,
      message,
      attachments: attachments || [],
    },
    include: {
      user: { select: { id: true, name: true, avatar: true } },
    },
  });

  res.status(201).json({ success: true, data: chatMessage });
});
