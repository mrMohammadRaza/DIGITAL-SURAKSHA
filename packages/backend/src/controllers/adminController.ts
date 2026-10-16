import { Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../db/prisma.js';
import { env } from '../config/env.js';
import { adminLoginSchema } from '@digital-suraksha/shared';
import { AuthRequest } from '../middleware/authMiddleware.js';

export async function adminLogin(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { email, password } = adminLoginSchema.parse(req.body);

    const admin = await prisma.adminUser.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!admin) {
      return res.status(401).json({
        success: false,
        error: { code: 'INVALID_CREDENTIALS', message: 'Invalid official email or password' },
      });
    }

    const isMatch = bcrypt.compareSync(password, admin.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: { code: 'INVALID_CREDENTIALS', message: 'Invalid official email or password' },
      });
    }

    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: admin.role },
      env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Set secure HttpOnly cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    });

    // Record audit log
    await prisma.auditLog.create({
      data: {
        action: 'ADMIN_LOGIN',
        performedBy: admin.email,
        details: 'Admin logged into administration portal',
        ipAddress: req.ip || '127.0.0.1',
      },
    });

    res.status(200).json({
      success: true,
      data: {
        token,
        user: {
          id: admin.id,
          email: admin.email,
          name: admin.name,
          role: admin.role,
        },
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function adminLogout(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    res.clearCookie('token');

    if (req.user) {
      await prisma.auditLog.create({
        data: {
          action: 'ADMIN_LOGOUT',
          performedBy: req.user.email,
          details: 'Admin logged out of session',
          ipAddress: req.ip || '127.0.0.1',
        },
      });
    }

    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (err) {
    next(err);
  }
}

export async function getAdminMe(req: AuthRequest, res: Response) {
  res.status(200).json({
    success: true,
    data: req.user,
  });
}

export async function getAdminDashboard(_req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const [
      topicsCount,
      categoriesCount,
      quizzesCount,
      attemptsCount,
      feedbackCount,
      recentAttempts,
      recentLogs,
    ] = await Promise.all([
      prisma.topic.count(),
      prisma.category.count(),
      prisma.quiz.count(),
      prisma.quizAttempt.count(),
      prisma.feedback.count(),
      prisma.quizAttempt.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { quiz: { select: { titleEn: true, difficulty: true } } },
      }),
      prisma.auditLog.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    const attempts = await prisma.quizAttempt.findMany({
      select: { score: true, totalPoints: true, passed: true },
    });

    const passCount = attempts.filter((a) => a.passed).length;
    const passRate = attempts.length > 0 ? Math.round((passCount / attempts.length) * 100) : 0;

    res.status(200).json({
      success: true,
      data: {
        stats: {
          topicsCount,
          categoriesCount,
          quizzesCount,
          attemptsCount,
          feedbackCount,
          passRate,
        },
        recentAttempts,
        recentLogs,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function createTopic(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const b = req.body;
    const topic = await prisma.topic.create({
      data: {
        slug: b.slug,
        categoryId: b.categoryId,
        severity: b.severity || 'high',
        tags: JSON.stringify(b.tags || []),
        order: b.order || 0,
        titleEn: b.titleEn,
        definitionEn: b.definitionEn,
        howItWorksEn: b.howItWorksEn,
        fictionalExampleEn: b.fictionalExampleEn,
        warningSignsEn: JSON.stringify(b.warningSignsEn || []),
        safeActionsEn: JSON.stringify(b.safeActionsEn || []),
        victimGuidanceEn: JSON.stringify(b.victimGuidanceEn || []),
        titleHi: b.titleHi,
        definitionHi: b.definitionHi,
        howItWorksHi: b.howItWorksHi,
        fictionalExampleHi: b.fictionalExampleHi,
        warningSignsHi: JSON.stringify(b.warningSignsHi || []),
        safeActionsHi: JSON.stringify(b.safeActionsHi || []),
        victimGuidanceHi: JSON.stringify(b.victimGuidanceHi || []),
        titleMr: b.titleMr,
        definitionMr: b.definitionMr,
        howItWorksMr: b.howItWorksMr,
        fictionalExampleMr: b.fictionalExampleMr,
        warningSignsMr: JSON.stringify(b.warningSignsMr || []),
        safeActionsMr: JSON.stringify(b.safeActionsMr || []),
        victimGuidanceMr: JSON.stringify(b.victimGuidanceMr || []),
        relatedSlugs: JSON.stringify(b.relatedSlugs || []),
      },
    });

    await prisma.auditLog.create({
      data: {
        action: 'CREATE_TOPIC',
        performedBy: req.user?.email || 'admin',
        details: `Created new educational fraud topic: ${topic.slug}`,
        ipAddress: req.ip || '127.0.0.1',
      },
    });

    res.status(201).json({ success: true, data: topic });
  } catch (err) {
    next(err);
  }
}

export async function updateTopic(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const b = req.body;

    const data: any = { ...b };
    if (b.tags && Array.isArray(b.tags)) data.tags = JSON.stringify(b.tags);
    if (b.warningSignsEn && Array.isArray(b.warningSignsEn)) data.warningSignsEn = JSON.stringify(b.warningSignsEn);
    if (b.safeActionsEn && Array.isArray(b.safeActionsEn)) data.safeActionsEn = JSON.stringify(b.safeActionsEn);
    if (b.victimGuidanceEn && Array.isArray(b.victimGuidanceEn)) data.victimGuidanceEn = JSON.stringify(b.victimGuidanceEn);
    if (b.warningSignsHi && Array.isArray(b.warningSignsHi)) data.warningSignsHi = JSON.stringify(b.warningSignsHi);
    if (b.safeActionsHi && Array.isArray(b.safeActionsHi)) data.safeActionsHi = JSON.stringify(b.safeActionsHi);
    if (b.victimGuidanceHi && Array.isArray(b.victimGuidanceHi)) data.victimGuidanceHi = JSON.stringify(b.victimGuidanceHi);
    if (b.warningSignsMr && Array.isArray(b.warningSignsMr)) data.warningSignsMr = JSON.stringify(b.warningSignsMr);
    if (b.safeActionsMr && Array.isArray(b.safeActionsMr)) data.safeActionsMr = JSON.stringify(b.safeActionsMr);
    if (b.victimGuidanceMr && Array.isArray(b.victimGuidanceMr)) data.victimGuidanceMr = JSON.stringify(b.victimGuidanceMr);

    const updated = await prisma.topic.update({
      where: { id },
      data,
    });

    await prisma.auditLog.create({
      data: {
        action: 'UPDATE_TOPIC',
        performedBy: req.user?.email || 'admin',
        details: `Updated educational topic: ${updated.slug}`,
        ipAddress: req.ip || '127.0.0.1',
      },
    });

    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
}

export async function deleteTopic(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const topic = await prisma.topic.delete({
      where: { id },
    });

    await prisma.auditLog.create({
      data: {
        action: 'DELETE_TOPIC',
        performedBy: req.user?.email || 'admin',
        details: `Deleted topic: ${topic.slug}`,
        ipAddress: req.ip || '127.0.0.1',
      },
    });

    res.status(200).json({ success: true, message: 'Topic deleted successfully' });
  } catch (err) {
    next(err);
  }
}

export async function getAllFeedbackAdmin(_req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const list = await prisma.feedback.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json({ success: true, data: list });
  } catch (err) {
    next(err);
  }
}

export async function toggleFeedbackApproval(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const current = await prisma.feedback.findUnique({ where: { id } });
    if (!current) {
      return res.status(404).json({ success: false, error: { message: 'Feedback not found' } });
    }

    const updated = await prisma.feedback.update({
      where: { id },
      data: { isApproved: !current.isApproved },
    });

    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
}
