import { Router } from 'express';
import {
  createDispute, getMyDisputes, getDisputeById,
  createVote, castVote,
} from '../controllers/disputeController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/', authenticate, createDispute);
router.get('/my', authenticate, getMyDisputes);
router.get('/:id', authenticate, getDisputeById);
router.post('/votes', authenticate, createVote);
router.post('/votes/:voteId/cast', authenticate, castVote);

export default router;
