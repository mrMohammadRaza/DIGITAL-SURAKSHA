import { Request, Response, NextFunction } from 'express';
import { prisma } from '../db/prisma.js';
import { quizSubmissionSchema } from '@digital-suraksha/shared';

export async function getQuizzes(_req: Request, res: Response, next: NextFunction) {
  try {
    const quizzes = await prisma.quiz.findMany({
      include: {
        category: {
          select: { id: true, slug: true, nameEn: true, nameHi: true, nameMr: true },
        },
        _count: {
          select: { questions: true, attempts: true },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    const formatted = quizzes.map((q) => ({
      id: q.id,
      slug: q.slug,
      titleEn: q.titleEn,
      titleHi: q.titleHi,
      titleMr: q.titleMr,
      descriptionEn: q.descriptionEn,
      descriptionHi: q.descriptionHi,
      descriptionMr: q.descriptionMr,
      difficulty: q.difficulty,
      category: q.category,
      questionsCount: q._count.questions,
      totalAttempts: q._count.attempts,
    }));

    res.status(200).json({
      success: true,
      data: formatted,
    });
  } catch (err) {
    next(err);
  }
}

export async function getQuizBySlug(req: Request, res: Response, next: NextFunction) {
  try {
    const { slug } = req.params;

    const quiz = await prisma.quiz.findUnique({
      where: { slug },
      include: {
        category: true,
        questions: {
          orderBy: { order: 'asc' },
          include: {
            options: {
              select: {
                id: true,
                textEn: true,
                textHi: true,
                textMr: true,
                // Notice: isCorrect is intentionally NOT selected to prevent client cheating!
              },
            },
          },
        },
      },
    });

    if (!quiz) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'QUIZ_NOT_FOUND',
          message: `Quiz '${slug}' was not found`,
        },
      });
    }

    res.status(200).json({
      success: true,
      data: quiz,
    });
  } catch (err) {
    next(err);
  }
}

export async function submitQuizAttempt(req: Request, res: Response, next: NextFunction) {
  try {
    const { slug } = req.params;
    const body = quizSubmissionSchema.parse(req.body);

    const quiz = await prisma.quiz.findUnique({
      where: { slug },
      include: {
        questions: {
          include: {
            options: true,
          },
        },
      },
    });

    if (!quiz) {
      return res.status(404).json({
        success: false,
        error: { code: 'QUIZ_NOT_FOUND', message: 'Quiz not found' },
      });
    }

    let score = 0;
    let totalPossibleScore = 0;
    let correctCount = 0;
    const details: any[] = [];
    const responsesToCreate: any[] = [];

    // Map submitted answers by questionId
    const answersMap = new Map<string, string>();
    for (const a of body.answers) {
      answersMap.set(a.questionId, a.selectedOptionId);
    }

    for (const question of quiz.questions) {
      totalPossibleScore += question.points;
      const selectedOptionId = answersMap.get(question.id);
      const correctOption = question.options.find((o) => o.isCorrect);

      const isCorrect = Boolean(
        selectedOptionId && correctOption && selectedOptionId === correctOption.id
      );

      if (isCorrect) {
        score += question.points;
        correctCount += 1;
      }

      if (selectedOptionId) {
        responsesToCreate.push({
          questionId: question.id,
          selectedOptionId,
          isCorrect,
        });
      }

      details.push({
        questionId: question.id,
        questionEn: question.questionEn,
        questionHi: question.questionHi,
        questionMr: question.questionMr,
        selectedOptionId: selectedOptionId || null,
        isCorrect,
        correctOptionId: correctOption?.id || '',
        explanationEn: question.explanationEn,
        explanationHi: question.explanationHi,
        explanationMr: question.explanationMr,
      });
    }

    const percentage = totalPossibleScore > 0 ? Math.round((score / totalPossibleScore) * 100) : 0;
    const passed = percentage >= 60;

    let feedbackEn = 'Great effort! Review the explanations below to stay completely protected.';
    let feedbackHi = 'अच्छा प्रयास! पूरी तरह सुरक्षित रहने के लिए नीचे दिए गए स्पष्टीकरण को ध्यान से पढ़ें।';
    let feedbackMr = 'छान प्रयत्न! सायबर सुरक्षिततेसाठी खालील माहिती नीट समजून घ्या.';

    if (percentage === 100) {
      feedbackEn = 'Outstanding! You have master-level awareness of online fraud prevention.';
      feedbackHi = 'शानदार! आपको ऑनलाइन धोखाधड़ी से बचने की बेहतरीन और पूरी समझ है।';
      feedbackMr = 'उत्कृष्ट! तुम्हाला ऑनलाइन फसवणुकीपासून सुरक्षित राहण्याची उत्तम जाण आहे.';
    } else if (percentage < 50) {
      feedbackEn = 'Caution needed! Please read our Smartphone and UPI Safety Guides to protect your money.';
      feedbackHi = 'सावधानी जरूरी है! अपनी मेहनत की कमाई बचाने के लिए हमारे स्मार्टफोन और यूपीआई गाइड को जरूर पढ़ें।';
      feedbackMr = 'सावधान राहा! स्वतःचे पैसे सुरक्षित ठेवण्यासाठी आमचे स्मार्टफोन व यूपीआय सुरक्षेचे धडे नक्की वाचा.';
    }

    // Persist attempt in database
    const attempt = await prisma.quizAttempt.create({
      data: {
        quizId: quiz.id,
        userIdentifier: body.userIdentifier || null,
        score,
        totalPoints: totalPossibleScore,
        percentage,
        passed,
        responses: {
          create: responsesToCreate,
        },
      },
    });

    res.status(200).json({
      success: true,
      data: {
        attemptId: attempt.id,
        quizId: quiz.id,
        quizSlug: quiz.slug,
        totalQuestions: quiz.questions.length,
        correctCount,
        score,
        totalPossibleScore,
        percentage,
        passed,
        feedbackEn,
        feedbackHi,
        feedbackMr,
        details,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function getAttemptResults(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    const attempt = await prisma.quizAttempt.findUnique({
      where: { id },
      include: {
        quiz: {
          include: {
            questions: {
              include: {
                options: true,
              },
            },
          },
        },
        responses: true,
      },
    });

    if (!attempt) {
      return res.status(404).json({
        success: false,
        error: { code: 'ATTEMPT_NOT_FOUND', message: 'Quiz attempt not found' },
      });
    }

    const responsesMap = new Map<string, string>();
    for (const r of attempt.responses) {
      responsesMap.set(r.questionId, r.selectedOptionId);
    }

    const details = attempt.quiz.questions.map((q) => {
      const selectedOptionId = responsesMap.get(q.id);
      const correctOption = q.options.find((o) => o.isCorrect);
      return {
        questionId: q.id,
        questionEn: q.questionEn,
        questionHi: q.questionHi,
        questionMr: q.questionMr,
        selectedOptionId: selectedOptionId || null,
        isCorrect: Boolean(selectedOptionId && correctOption && selectedOptionId === correctOption.id),
        correctOptionId: correctOption?.id || '',
        explanationEn: q.explanationEn,
        explanationHi: q.explanationHi,
        explanationMr: q.explanationMr,
      };
    });

    res.status(200).json({
      success: true,
      data: {
        attemptId: attempt.id,
        quizId: attempt.quizId,
        score: attempt.score,
        totalPoints: attempt.totalPoints,
        percentage: attempt.percentage,
        passed: attempt.passed,
        createdAt: attempt.createdAt,
        details,
      },
    });
  } catch (err) {
    next(err);
  }
}
