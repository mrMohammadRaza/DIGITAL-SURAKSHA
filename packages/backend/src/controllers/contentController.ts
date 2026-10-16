import { Request, Response, NextFunction } from 'express';
import { prisma } from '../db/prisma.js';
import { searchQuerySchema, scenarioValidationSchema } from '@digital-suraksha/shared';

// Helper to safely parse JSON strings from database
function safeJsonParse<T>(jsonStr: string, fallback: T): T {
  try {
    return JSON.parse(jsonStr);
  } catch {
    return fallback;
  }
}

export async function getCategories(_req: Request, res: Response, next: NextFunction) {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { order: 'asc' },
      include: {
        _count: {
          select: { topics: true, quizzes: true },
        },
      },
    });

    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (err) {
    next(err);
  }
}

export async function getTopics(req: Request, res: Response, next: NextFunction) {
  try {
    const { category, severity } = req.query;

    const where: any = {};
    if (category) {
      where.category = { slug: String(category) };
    }
    if (severity) {
      where.severity = String(severity);
    }

    const topics = await prisma.topic.findMany({
      where,
      orderBy: { order: 'asc' },
      include: {
        category: {
          select: { id: true, slug: true, nameEn: true, nameHi: true, nameMr: true, icon: true },
        },
      },
    });

    const formatted = topics.map((t) => ({
      ...t,
      tags: safeJsonParse<string[]>(t.tags, []),
      warningSignsEn: safeJsonParse<string[]>(t.warningSignsEn, []),
      safeActionsEn: safeJsonParse<string[]>(t.safeActionsEn, []),
      victimGuidanceEn: safeJsonParse<string[]>(t.victimGuidanceEn, []),
      warningSignsHi: safeJsonParse<string[]>(t.warningSignsHi, []),
      safeActionsHi: safeJsonParse<string[]>(t.safeActionsHi, []),
      victimGuidanceHi: safeJsonParse<string[]>(t.victimGuidanceHi, []),
      warningSignsMr: safeJsonParse<string[]>(t.warningSignsMr, []),
      safeActionsMr: safeJsonParse<string[]>(t.safeActionsMr, []),
      victimGuidanceMr: safeJsonParse<string[]>(t.victimGuidanceMr, []),
      relatedSlugs: safeJsonParse<string[]>(t.relatedSlugs, []),
    }));

    res.status(200).json({
      success: true,
      data: formatted,
    });
  } catch (err) {
    next(err);
  }
}

export async function getTopicBySlug(req: Request, res: Response, next: NextFunction) {
  try {
    const { slug } = req.params;

    const topic = await prisma.topic.findUnique({
      where: { slug },
      include: {
        category: true,
      },
    });

    if (!topic) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'TOPIC_NOT_FOUND',
          message: `Topic with slug '${slug}' was not found.`,
        },
      });
    }

    const relatedSlugs = safeJsonParse<string[]>(topic.relatedSlugs, []);
    let relatedTopics: any[] = [];
    if (relatedSlugs.length > 0) {
      relatedTopics = await prisma.topic.findMany({
        where: { slug: { in: relatedSlugs } },
        select: {
          id: true,
          slug: true,
          titleEn: true,
          titleHi: true,
          titleMr: true,
          severity: true,
        },
      });
    }

    const formatted = {
      ...topic,
      tags: safeJsonParse<string[]>(topic.tags, []),
      warningSignsEn: safeJsonParse<string[]>(topic.warningSignsEn, []),
      safeActionsEn: safeJsonParse<string[]>(topic.safeActionsEn, []),
      victimGuidanceEn: safeJsonParse<string[]>(topic.victimGuidanceEn, []),
      warningSignsHi: safeJsonParse<string[]>(topic.warningSignsHi, []),
      safeActionsHi: safeJsonParse<string[]>(topic.safeActionsHi, []),
      victimGuidanceHi: safeJsonParse<string[]>(topic.victimGuidanceHi, []),
      warningSignsMr: safeJsonParse<string[]>(topic.warningSignsMr, []),
      safeActionsMr: safeJsonParse<string[]>(topic.safeActionsMr, []),
      victimGuidanceMr: safeJsonParse<string[]>(topic.victimGuidanceMr, []),
      relatedSlugs,
      relatedTopics,
    };

    res.status(200).json({
      success: true,
      data: formatted,
    });
  } catch (err) {
    next(err);
  }
}

export async function searchContent(req: Request, res: Response, next: NextFunction) {
  try {
    const query = searchQuerySchema.parse(req.query);
    const searchTerm = query.q?.trim().toLowerCase() || '';

    const allTopics = await prisma.topic.findMany({
      include: {
        category: true,
      },
    });

    const filtered = allTopics.filter((t) => {
      if (query.category && t.category.slug !== query.category) {
        return false;
      }
      if (query.severity && t.severity !== query.severity) {
        return false;
      }
      if (!searchTerm) {
        return true;
      }

      const searchableText = [
        t.titleEn,
        t.definitionEn,
        t.howItWorksEn,
        t.titleHi,
        t.definitionHi,
        t.howItWorksHi,
        t.titleMr,
        t.definitionMr,
        t.howItWorksMr,
        t.tags,
      ].join(' ').toLowerCase();

      return searchableText.includes(searchTerm);
    });

    const formatted = filtered.map((t) => ({
      id: t.id,
      slug: t.slug,
      categorySlug: t.category.slug,
      categoryNameEn: t.category.nameEn,
      categoryNameHi: t.category.nameHi,
      categoryNameMr: t.category.nameMr,
      severity: t.severity,
      titleEn: t.titleEn,
      titleHi: t.titleHi,
      titleMr: t.titleMr,
      definitionEn: t.definitionEn,
      definitionHi: t.definitionHi,
      definitionMr: t.definitionMr,
      tags: safeJsonParse<string[]>(t.tags, []),
    }));

    res.status(200).json({
      success: true,
      data: formatted,
      pagination: {
        total: formatted.length,
        page: query.page,
        limit: query.limit,
        totalPages: Math.ceil(formatted.length / query.limit) || 1,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function getScenarios(_req: Request, res: Response, next: NextFunction) {
  try {
    const scenarios = await prisma.scenario.findMany({
      orderBy: { order: 'asc' },
    });

    res.status(200).json({
      success: true,
      data: scenarios,
    });
  } catch (err) {
    next(err);
  }
}

export async function checkScenario(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { userChoice } = scenarioValidationSchema.parse({
      scenarioId: id,
      userChoice: req.body.userChoice,
    });

    const scenario = await prisma.scenario.findUnique({
      where: { id },
    });

    if (!scenario) {
      return res.status(404).json({
        success: false,
        error: { code: 'SCENARIO_NOT_FOUND', message: 'Scenario not found' },
      });
    }

    const isCorrect = userChoice === scenario.isSafe;

    res.status(200).json({
      success: true,
      data: {
        scenarioId: scenario.id,
        userChoice,
        actualIsSafe: scenario.isSafe,
        isCorrect,
        explanationEn: scenario.explanationEn,
        explanationHi: scenario.explanationHi,
        explanationMr: scenario.explanationMr,
        recommendationEn: scenario.recommendationEn,
        recommendationHi: scenario.recommendationHi,
        recommendationMr: scenario.recommendationMr,
        relatedTopicSlug: scenario.relatedTopicSlug,
      },
    });
  } catch (err) {
    next(err);
  }
}
