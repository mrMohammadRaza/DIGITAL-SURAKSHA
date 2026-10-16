import { Request, Response } from 'express';
import { prisma } from '../db/prisma.js';

export async function getHealth(_req: Request, res: Response) {
  res.status(200).json({
    success: true,
    data: {
      status: 'UP',
      timestamp: new Date().toISOString(),
      service: 'digital-suraksha-api',
      version: '1.0.0',
    },
  });
}

export async function getReady(_req: Request, res: Response) {
  try {
    // Check database connectivity
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({
      success: true,
      data: {
        status: 'READY',
        database: 'CONNECTED',
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      error: {
        code: 'DATABASE_UNAVAILABLE',
        message: 'Database readiness check failed',
      },
    });
  }
}
