import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/database';
import { AppError } from './errorHandler';
import { logger } from '../config/logger';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    firebaseUid: string;
  };
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('No authentication token provided', 401);
    }

    const token = authHeader.substring(7);
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new AppError('JWT secret not configured', 500);
    }

    const decoded = jwt.verify(token, secret) as {
      userId: string;
      email: string;
      role: string;
      firebaseUid: string;
    };

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        role: true,
        firebaseUid: true,
        isActive: true,
        isBanned: true,
      },
    });

    if (!user) {
      throw new AppError('User not found', 401);
    }

    if (!user.isActive || user.isBanned) {
      throw new AppError('Account suspended or inactive', 403);
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      firebaseUid: user.firebaseUid,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new AppError('Invalid or expired token', 401));
    } else {
      next(error);
    }
  }
};

export const requireRole = (...roles: string[]) => {
  return (req: AuthRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new AppError('Not authenticated', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError('Insufficient permissions', 403));
    }

    next();
  };
};

export const optionalAuth = async (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.substring(7);
    const secret = process.env.JWT_SECRET;
    if (!secret) return next();

    const decoded = jwt.verify(token, secret) as {
      userId: string;
      email: string;
      role: string;
      firebaseUid: string;
    };

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, role: true, firebaseUid: true, isActive: true },
    });

    if (user && user.isActive) {
      req.user = {
        id: user.id,
        email: user.email,
        role: user.role,
        firebaseUid: user.firebaseUid,
      };
    }

    next();
  } catch {
    next();
  }
};

export function generateTokens(user: { id: string; email: string; role: string; firebaseUid: string }) {
  const secret = process.env.JWT_SECRET || 'fallback-secret';
  const refreshSecret = process.env.REFRESH_TOKEN_SECRET || 'fallback-refresh-secret';

  const accessToken = jwt.sign(
    { userId: user.id, email: user.email, role: user.role, firebaseUid: user.firebaseUid },
    secret,
    { expiresIn: (process.env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn']) || '7d' }
  );

  const refreshToken = jwt.sign(
    { userId: user.id },
    refreshSecret,
    { expiresIn: (process.env.REFRESH_TOKEN_EXPIRES_IN as jwt.SignOptions['expiresIn']) || '30d' }
  );

  return { accessToken, refreshToken };
}

export default authenticate;
