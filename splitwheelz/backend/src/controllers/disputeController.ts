import { Response } from 'express';
import { prisma } from '../config/database';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

export const createDispute = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { vehicleId, bookingId, type, title, description, evidence } = req.body;

  const dispute = await prisma.dispute.create({
    data: {
      raisedById: req.user!.id,
      vehicleId,
      bookingId,
      type,
      title,
      description,
      evidence: evidence || [],
    },
  });

  await prisma.notification.create({
    data: {
      userId: req.user!.id,
      title: 'Dispute Filed',
      body: 'Your dispute has been filed and is under review.',
      type: 'DISPUTE_CREATED',
      data: { disputeId: dispute.id },
    },
  });

  res.status(201).json({
    success: true,
    message: 'Dispute filed successfully',
    data: dispute,
  });
});

export const getMyDisputes = asyncHandler(async (req: AuthRequest, res: Response) => {
  const disputes = await prisma.dispute.findMany({
    where: { raisedById: req.user!.id },
    orderBy: { createdAt: 'desc' },
    include: {
      booking: {
        select: {
          id: true, startTime: true, endTime: true,
          vehicle: { select: { make: true, model: true } },
        },
      },
    },
  });

  res.json({ success: true, data: disputes });
});

export const getDisputeById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const dispute = await prisma.dispute.findUnique({
    where: { id },
    include: {
      raisedBy: { select: { id: true, name: true, avatar: true, email: true } },
      booking: { include: { vehicle: true } },
    },
  });

  if (!dispute) throw new AppError('Dispute not found', 404);

  if (dispute.raisedById !== req.user!.id && req.user!.role !== 'ADMIN') {
    throw new AppError('Not authorized', 403);
  }

  res.json({ success: true, data: dispute });
});

export const createVote = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { vehicleId, type, title, description, options, deadline } = req.body;

  const ownership = await prisma.vehicleOwnership.findUnique({
    where: { vehicleId_userId: { vehicleId, userId: req.user!.id } },
  });

  if (!ownership || ownership.status !== 'ACTIVE') {
    throw new AppError('You must be an active co-owner to create votes', 403);
  }

  const vote = await prisma.vote.create({
    data: {
      vehicleId,
      createdById: req.user!.id,
      type,
      title,
      description,
      options: options.map((o: string) => ({ label: o, count: 0 })),
      deadline: new Date(deadline),
    },
  });

  // Notify all co-owners
  const owners = await prisma.vehicleOwnership.findMany({
    where: { vehicleId, status: 'ACTIVE', NOT: { userId: req.user!.id } },
    select: { userId: true },
  });

  await prisma.notification.createMany({
    data: owners.map((o) => ({
      userId: o.userId,
      title: 'New Vote',
      body: `A new vote has been created: "${title}"`,
      type: 'VOTE_CREATED',
      data: { voteId: vote.id, vehicleId },
    })),
  });

  res.status(201).json({ success: true, data: vote });
});

export const castVote = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { voteId } = req.params;
  const { optionIndex } = req.body;

  const vote = await prisma.vote.findUnique({ where: { id: voteId } });
  if (!vote) throw new AppError('Vote not found', 404);
  if (!vote.isActive) throw new AppError('Vote is closed', 400);
  if (new Date(vote.deadline) < new Date()) throw new AppError('Voting deadline passed', 400);

  const ownership = await prisma.vehicleOwnership.findUnique({
    where: { vehicleId_userId: { vehicleId: vote.vehicleId, userId: req.user!.id } },
  });

  if (!ownership || ownership.status !== 'ACTIVE') {
    throw new AppError('Not authorized to vote', 403);
  }

  // Check if already voted
  const alreadyVoted = await prisma.vote.findFirst({
    where: {
      id: voteId,
      voters: { some: { id: req.user!.id } },
    },
  });

  if (alreadyVoted) throw new AppError('Already voted', 400);

  const options = vote.options as Array<{ label: string; count: number }>;
  if (optionIndex < 0 || optionIndex >= options.length) {
    throw new AppError('Invalid option', 400);
  }

  options[optionIndex].count += 1;

  const updated = await prisma.vote.update({
    where: { id: voteId },
    data: {
      options,
      voters: { connect: { id: req.user!.id } },
    },
  });

  res.json({ success: true, message: 'Vote cast', data: updated });
});
