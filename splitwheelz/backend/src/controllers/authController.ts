import { Request, Response } from 'express';
import { prisma } from '../config/database';
import { verifyFirebaseToken } from '../config/firebase';
import { generateTokens } from '../middleware/auth';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';
import { logger } from '../config/logger';
import jwt from 'jsonwebtoken';

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register or login with Firebase token
 *     tags: [Auth]
 *     security: []
 */
export const registerOrLogin = asyncHandler(async (req: Request, res: Response) => {
  const { firebaseToken, fcmToken } = req.body;

  if (!firebaseToken) {
    throw new AppError('Firebase token required', 400);
  }

  let decoded;
  try {
    decoded = await verifyFirebaseToken(firebaseToken);
  } catch (err) {
    throw new AppError('Invalid Firebase token', 401);
  }

  const { uid, email, name, picture, phone_number } = decoded;

  if (!email) {
    throw new AppError('Email is required', 400);
  }

  let user = await prisma.user.findUnique({ where: { firebaseUid: uid } });

  if (!user) {
    user = await prisma.user.create({
      data: {
        firebaseUid: uid,
        email,
        name: name || email.split('@')[0],
        avatar: picture || null,
        phone: phone_number || null,
        isEmailVerified: decoded.email_verified || false,
        fcmTokens: fcmToken ? [fcmToken] : [],
      },
    });

    logger.info(`New user registered: ${email}`);
  } else {
    // Update FCM token if provided
    const updateData: Record<string, unknown> = {};
    if (fcmToken && !user.fcmTokens.includes(fcmToken)) {
      updateData.fcmTokens = [...user.fcmTokens.slice(-4), fcmToken];
    }
    if (name && !user.name) updateData.name = name;
    if (picture && !user.avatar) updateData.avatar = picture;

    if (Object.keys(updateData).length > 0) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: updateData,
      });
    }
  }

  if (user.isBanned) {
    throw new AppError('Your account has been suspended', 403);
  }

  const tokens = generateTokens(user);

  res.status(200).json({
    success: true,
    message: 'Authentication successful',
    data: {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        isPhoneVerified: user.isPhoneVerified,
        kycVerified: user.kycVerified,
        loyaltyPoints: user.loyaltyPoints,
        referralCode: user.referralCode,
      },
      ...tokens,
    },
  });
});

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     tags: [Auth]
 *     security: []
 */
export const refreshToken = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken: token } = req.body;

  if (!token) {
    throw new AppError('Refresh token required', 400);
  }

  const secret = process.env.REFRESH_TOKEN_SECRET || 'fallback-refresh-secret';
  let decoded: { userId: string };

  try {
    decoded = jwt.verify(token, secret) as { userId: string };
  } catch {
    throw new AppError('Invalid or expired refresh token', 401);
  }

  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
    select: { id: true, email: true, role: true, firebaseUid: true, isActive: true, isBanned: true },
  });

  if (!user || !user.isActive || user.isBanned) {
    throw new AppError('User not found or inactive', 401);
  }

  const tokens = generateTokens(user);

  res.json({
    success: true,
    data: tokens,
  });
});

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current user profile
 *     tags: [Auth]
 */
export const getMe = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    include: {
      ownerships: {
        include: {
          vehicle: {
            select: {
              id: true,
              make: true,
              model: true,
              year: true,
              images: true,
              registrationNumber: true,
            },
          },
        },
        where: { status: 'ACTIVE' },
      },
      _count: {
        select: {
          bookings: true,
          ownerships: true,
        },
      },
    },
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  res.json({
    success: true,
    data: user,
  });
});

/**
 * @swagger
 * /api/auth/update-profile:
 *   patch:
 *     summary: Update user profile
 *     tags: [Auth]
 */
export const updateProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const {
    name,
    phone,
    addressLine1,
    addressLine2,
    city,
    state,
    pincode,
    drivingLicense,
  } = req.body;

  const user = await prisma.user.update({
    where: { id: req.user!.id },
    data: {
      ...(name && { name }),
      ...(phone && { phone }),
      ...(addressLine1 !== undefined && { addressLine1 }),
      ...(addressLine2 !== undefined && { addressLine2 }),
      ...(city && { city }),
      ...(state && { state }),
      ...(pincode && { pincode }),
      ...(drivingLicense && { drivingLicense }),
    },
  });

  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: user,
  });
});

/**
 * @swagger
 * /api/auth/update-fcm:
 *   post:
 *     summary: Update FCM token
 *     tags: [Auth]
 */
export const updateFcmToken = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { fcmToken, remove } = req.body;

  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    select: { fcmTokens: true },
  });

  if (!user) throw new AppError('User not found', 404);

  let tokens = user.fcmTokens;

  if (remove) {
    tokens = tokens.filter((t) => t !== fcmToken);
  } else if (fcmToken && !tokens.includes(fcmToken)) {
    tokens = [...tokens.slice(-4), fcmToken];
  }

  await prisma.user.update({
    where: { id: req.user!.id },
    data: { fcmTokens: tokens },
  });

  res.json({ success: true, message: 'FCM token updated' });
});

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout (clear FCM token)
 *     tags: [Auth]
 */
export const logout = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { fcmToken } = req.body;

  if (fcmToken) {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: { fcmTokens: true },
    });

    if (user) {
      await prisma.user.update({
        where: { id: req.user!.id },
        data: { fcmTokens: user.fcmTokens.filter((t) => t !== fcmToken) },
      });
    }
  }

  res.json({ success: true, message: 'Logged out successfully' });
});
