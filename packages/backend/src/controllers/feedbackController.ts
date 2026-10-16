import { Request, Response, NextFunction } from 'express';
import { prisma } from '../db/prisma.js';
import { feedbackSubmissionSchema } from '@digital-suraksha/shared';

export async function getFeedback(_req: Request, res: Response, next: NextFunction) {
  try {
    const feedbackList = await prisma.feedback.findMany({
      where: { isApproved: true },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    res.status(200).json({
      success: true,
      data: feedbackList,
    });
  } catch (err) {
    next(err);
  }
}

export async function submitFeedback(req: Request, res: Response, next: NextFunction) {
  try {
    const data = feedbackSubmissionSchema.parse(req.body);

    const created = await prisma.feedback.create({
      data: {
        name: data.name?.trim() || 'Anonymous Citizen',
        villageOrCity: data.villageOrCity?.trim() || 'Rural Community',
        rating: data.rating,
        category: data.category,
        comment: data.comment.trim(),
        language: data.language,
        isApproved: true,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Feedback received with gratitude. Thank you for supporting village cyber safety!',
      data: created,
    });
  } catch (err) {
    next(err);
  }
}
