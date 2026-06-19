import { Request, Response } from 'express';
import { prisma } from '../config/database';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';
import { uploadToS3 } from '../config/aws';

export const getVehicles = asyncHandler(async (req: Request, res: Response) => {
  const {
    page = '1',
    limit = '12',
    type,
    fuelType,
    minPrice,
    maxPrice,
    location,
    search,
    status = 'AVAILABLE',
    sortBy = 'createdAt',
    sortOrder = 'desc',
    availableSlots,
  } = req.query as Record<string, string>;

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const take = parseInt(limit);

  const where: Record<string, unknown> = {
    status: status || undefined,
    ...(type && { type }),
    ...(fuelType && { fuelType }),
    ...(location && { location: { contains: location, mode: 'insensitive' } }),
    ...(availableSlots && { availableSlots: { gte: parseInt(availableSlots) } }),
    ...(minPrice || maxPrice
      ? {
          pricePerSlot: {
            ...(minPrice && { gte: parseFloat(minPrice) }),
            ...(maxPrice && { lte: parseFloat(maxPrice) }),
          },
        }
      : {}),
    ...(search && {
      OR: [
        { make: { contains: search, mode: 'insensitive' } },
        { model: { contains: search, mode: 'insensitive' } },
        { registrationNumber: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
      ],
    }),
  };

  // Remove undefined values
  Object.keys(where).forEach((k) => where[k] === undefined && delete where[k]);

  const [vehicles, total] = await Promise.all([
    prisma.vehicle.findMany({
      where,
      skip,
      take,
      orderBy: { [sortBy]: sortOrder },
      include: {
        ownerships: {
          where: { status: 'ACTIVE' },
          include: {
            user: {
              select: { id: true, name: true, avatar: true },
            },
          },
        },
        _count: {
          select: {
            bookings: true,
            reviews: true,
          },
        },
      },
    }),
    prisma.vehicle.count({ where }),
  ]);

  res.json({
    success: true,
    data: {
      vehicles,
      pagination: {
        total,
        page: parseInt(page),
        limit: take,
        totalPages: Math.ceil(total / take),
        hasNext: skip + take < total,
      },
    },
  });
});

export const getVehicleById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const vehicle = await prisma.vehicle.findUnique({
    where: { id },
    include: {
      ownerships: {
        include: {
          user: {
            select: { id: true, name: true, avatar: true, kycVerified: true },
          },
        },
      },
      documents: true,
      reviews: {
        include: {
          user: { select: { id: true, name: true, avatar: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
      expenses: {
        orderBy: { createdAt: 'desc' },
        take: 5,
      },
      maintenance: {
        orderBy: { serviceDate: 'desc' },
        take: 5,
      },
      _count: {
        select: { bookings: true, reviews: true },
      },
    },
  });

  if (!vehicle) {
    throw new AppError('Vehicle not found', 404);
  }

  // Check today's availability
  const now = new Date();
  const todayBookings = await prisma.booking.findMany({
    where: {
      vehicleId: id,
      status: { in: ['CONFIRMED', 'PENDING'] },
      startTime: { lte: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7) },
      endTime: { gte: now },
    },
    select: { startTime: true, endTime: true, userId: true },
  });

  res.json({
    success: true,
    data: { ...vehicle, upcomingBookings: todayBookings },
  });
});

export const createVehicle = asyncHandler(async (req: AuthRequest, res: Response) => {
  const {
    make, model, year, registrationNumber, vin, color, type, fuelType,
    transmission, seatingCapacity, mileage, engineCC, description, features,
    totalSlots, pricePerSlot, monthlyMaintenanceCost, insuranceCost,
    location, latitude, longitude,
  } = req.body;

  const existing = await prisma.vehicle.findUnique({ where: { registrationNumber } });
  if (existing) {
    throw new AppError('Vehicle with this registration number already exists', 409);
  }

  const vehicle = await prisma.vehicle.create({
    data: {
      make, model, year: parseInt(year), registrationNumber, vin, color,
      type, fuelType, transmission, seatingCapacity: parseInt(seatingCapacity || '5'),
      mileage: mileage ? parseFloat(mileage) : null,
      engineCC: engineCC ? parseInt(engineCC) : null,
      description, features: features || [],
      totalSlots: parseInt(totalSlots || '2'),
      availableSlots: parseInt(totalSlots || '2'),
      pricePerSlot: parseFloat(pricePerSlot),
      monthlyMaintenanceCost: parseFloat(monthlyMaintenanceCost || '0'),
      insuranceCost: parseFloat(insuranceCost || '0'),
      location, latitude: latitude ? parseFloat(latitude) : null,
      longitude: longitude ? parseFloat(longitude) : null,
      addedById: req.user?.id || null,
    },
  });

  res.status(201).json({
    success: true,
    message: 'Vehicle created successfully',
    data: vehicle,
  });
});

export const updateVehicle = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const vehicle = await prisma.vehicle.findUnique({ where: { id } });
  if (!vehicle) throw new AppError('Vehicle not found', 404);

  const updated = await prisma.vehicle.update({
    where: { id },
    data: req.body,
  });

  res.json({
    success: true,
    message: 'Vehicle updated',
    data: updated,
  });
});

export const uploadVehicleImages = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const files = req.files as Express.Multer.File[];

  if (!files || files.length === 0) {
    throw new AppError('No files uploaded', 400);
  }

  const vehicle = await prisma.vehicle.findUnique({ where: { id } });
  if (!vehicle) throw new AppError('Vehicle not found', 404);

  const uploadPromises = files.map((file) =>
    uploadToS3(file.buffer, file.originalname, file.mimetype, `vehicles/${id}`)
  );

  const urls = await Promise.all(uploadPromises);

  const updated = await prisma.vehicle.update({
    where: { id },
    data: { images: [...vehicle.images, ...urls] },
  });

  res.json({
    success: true,
    message: 'Images uploaded',
    data: { images: updated.images },
  });
});

export const getVehicleAvailability = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { startDate, endDate } = req.query as { startDate: string; endDate: string };

  if (!startDate || !endDate) {
    throw new AppError('startDate and endDate required', 400);
  }

  const bookings = await prisma.booking.findMany({
    where: {
      vehicleId: id,
      status: { in: ['CONFIRMED', 'PENDING'] },
      OR: [
        {
          startTime: {
            gte: new Date(startDate),
            lte: new Date(endDate),
          },
        },
        {
          endTime: {
            gte: new Date(startDate),
            lte: new Date(endDate),
          },
        },
        {
          AND: [
            { startTime: { lte: new Date(startDate) } },
            { endTime: { gte: new Date(endDate) } },
          ],
        },
      ],
    },
    select: {
      startTime: true,
      endTime: true,
      user: { select: { id: true, name: true } },
    },
  });

  res.json({
    success: true,
    data: { bookedSlots: bookings },
  });
});

export const getFeaturedVehicles = asyncHandler(async (_req: Request, res: Response) => {
  const vehicles = await prisma.vehicle.findMany({
    where: { isFeatured: true, status: 'AVAILABLE' },
    take: 6,
    include: {
      ownerships: {
        where: { status: 'ACTIVE' },
        select: { userId: true },
      },
    },
    orderBy: { averageRating: 'desc' },
  });

  res.json({ success: true, data: vehicles });
});

export const deleteVehicle = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const vehicle = await prisma.vehicle.findUnique({ where: { id } });
  if (!vehicle) throw new AppError('Vehicle not found', 404);

  await prisma.vehicle.update({
    where: { id },
    data: { status: 'INACTIVE' },
  });

  res.json({ success: true, message: 'Vehicle deactivated' });
});
