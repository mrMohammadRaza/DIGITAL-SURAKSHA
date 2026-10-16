import { Router } from 'express';
import {
  getQuizzes,
  getQuizBySlug,
  submitQuizAttempt,
  getAttemptResults,
} from '../controllers/quizController.js';
import { submissionLimiter } from '../middleware/rateLimiter.js';

export const quizRouter = Router();

quizRouter.get('/quizzes', getQuizzes);
quizRouter.get('/quizzes/:slug', getQuizBySlug);
quizRouter.post('/quizzes/:slug/attempts', submissionLimiter, submitQuizAttempt);
quizRouter.get('/attempts/:id/results', getAttemptResults);
