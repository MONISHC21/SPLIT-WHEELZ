import { Router } from 'express';
import {
  getOwnershipDetails, purchaseSlot, getMyOwnerships,
  getOwnershipStats, transferSlot, getCoOwnerChat, sendChatMessage,
} from '../controllers/ownershipController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/my', authenticate, getMyOwnerships);
router.get('/:vehicleId', getOwnershipDetails);
router.post('/:vehicleId/purchase', authenticate, purchaseSlot);
router.get('/:vehicleId/stats', authenticate, getOwnershipStats);
router.post('/:vehicleId/transfer', authenticate, transferSlot);
router.get('/:vehicleId/chat', authenticate, getCoOwnerChat);
router.post('/:vehicleId/chat', authenticate, sendChatMessage);

export default router;
