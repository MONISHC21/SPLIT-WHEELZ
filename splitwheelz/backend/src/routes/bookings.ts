import { Router } from 'express';
import {
  createBooking, getMyBookings, getBookingById, cancelBooking,
  completeBooking, getVehicleBookings,
} from '../controllers/bookingController';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();

router.post('/', authenticate, createBooking);
router.get('/my', authenticate, getMyBookings);
router.get('/:id', authenticate, getBookingById);
router.patch('/:id/cancel', authenticate, cancelBooking);
router.patch('/:id/complete', authenticate, requireRole('ADMIN'), completeBooking);
router.get('/vehicle/:vehicleId', authenticate, getVehicleBookings);

export default router;
