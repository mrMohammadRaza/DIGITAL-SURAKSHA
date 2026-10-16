import { z } from 'zod';

export const languageSchema = z.enum(['en', 'hi', 'mr']).default('hi');

export const quizAnswerSubmissionSchema = z.object({
  questionId: z.string().min(1, 'Question ID is required'),
  selectedOptionId: z.string().min(1, 'Selected Option ID is required'),
});

export const quizSubmissionSchema = z.object({
  quizId: z.string().min(1, 'Quiz ID is required'),
  userIdentifier: z.string().max(100).optional(),
  answers: z.array(quizAnswerSubmissionSchema).min(1, 'At least one answer must be provided'),
});

export const feedbackSubmissionSchema = z.object({
  name: z.string().max(80).optional(),
  villageOrCity: z.string().max(100).optional(),
  rating: z.number().int().min(1).max(5),
  category: z.enum(['general', 'content_clarity', 'language_quality', 'cep_session']),
  comment: z.string().min(5, 'Feedback must be at least 5 characters long').max(1000),
  language: z.enum(['en', 'hi', 'mr']),
});

export const adminLoginSchema = z.object({
  email: z.string().email('Valid official email required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const searchQuerySchema = z.object({
  q: z.string().max(100).optional(),
  category: z.string().max(50).optional(),
  lang: languageSchema.optional(),
  severity: z.enum(['medium', 'high', 'critical']).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

export const scenarioValidationSchema = z.object({
  scenarioId: z.string().min(1),
  userChoice: z.boolean(), // true for safe, false for unsafe
});
