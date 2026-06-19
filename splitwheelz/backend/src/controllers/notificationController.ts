import { Response } from 'express';
import { prisma } from '../config/database';
import { asyncHandler } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

export const getMyNotifications = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { page = '1', limit = '20', unreadOnly } = req.query as Record<string, string>;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const where = {
    userId: req.user!.id,
    ...(unreadOnly === 'true' && { isRead: false }),
  };

  const [notifications, total, unreadCount] = await Promise.all([
    prisma.notification.findMany({
      where,
      skip,
      take: parseInt(limit),
      orderBy: { createdAt: 'desc' },
    }),
    prisma.notification.count({ where }),
    prisma.notification.count({ where: { userId: req.user!.id, isRead: false } }),
  ]);

  res.json({
    success: true,
    data: {
      notifications,
      unreadCount,
      pagination: {
        total, page: parseInt(page), limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    },
  });
});

export const markAsRead = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  if (id === 'all') {
    await prisma.notification.updateMany({
      where: { userId: req.user!.id, isRead: false },
      data: { isRead: true, readAt: new Date() },
    });
    return res.json({ success: true, message: 'All notifications marked as read' });
  }

  await prisma.notification.update({
    where: { id, userId: req.user!.id },
    data: { isRead: true, readAt: new Date() },
  });

  res.json({ success: true, message: 'Notification marked as read' });
});

export const deleteNotification = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  await prisma.notification.deleteMany({
    where: { id, userId: req.user!.id },
  });

  res.json({ success: true, message: 'Notification deleted' });
});
