import { Router } from 'express';
import { getMyNotifications, markAsRead, deleteNotification } from '../controllers/notificationController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, getMyNotifications);
router.patch('/:id/read', authenticate, markAsRead);
router.delete('/:id', authenticate, deleteNotification);

export default router;
