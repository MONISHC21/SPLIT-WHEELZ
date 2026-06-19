import { Router } from 'express';
import {
  getVehicles, getVehicleById, createVehicle, updateVehicle,
  uploadVehicleImages, getVehicleAvailability, getFeaturedVehicles, deleteVehicle,
} from '../controllers/vehicleController';
import { authenticate, requireRole } from '../middleware/auth';
import { uploadMultipleImages } from '../middleware/upload';

const router = Router();

router.get('/', getVehicles);
router.get('/featured', getFeaturedVehicles);
router.get('/:id', getVehicleById);
router.get('/:id/availability', getVehicleAvailability);
router.post('/', authenticate, requireRole('ADMIN'), createVehicle);
router.put('/:id', authenticate, requireRole('ADMIN'), updateVehicle);
router.post('/:id/images', authenticate, requireRole('ADMIN'), uploadMultipleImages.array('images', 10), uploadVehicleImages);
router.delete('/:id', authenticate, requireRole('ADMIN'), deleteVehicle);

export default router;
