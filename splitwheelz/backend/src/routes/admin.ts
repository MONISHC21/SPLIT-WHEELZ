import { Router } from 'express';
import {
  getDashboardStats, getAllUsers, banUser, unbanUser,
  verifyVehicle, getRevenueAnalytics, resolveDispute, featureVehicle,
} from '../controllers/adminController';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();

router.use(authenticate, requireRole('ADMIN'));

router.get('/dashboard', getDashboardStats);
router.get('/users', getAllUsers);
router.post('/users/:userId/ban', banUser);
router.post('/users/:userId/unban', unbanUser);
router.post('/vehicles/:vehicleId/verify', verifyVehicle);
router.post('/vehicles/:vehicleId/feature', featureVehicle);
router.get('/analytics/revenue', getRevenueAnalytics);
router.post('/disputes/:disputeId/resolve', resolveDispute);

export default router;
