import { Router } from 'express';
import { getFeedback, submitFeedback } from '../controllers/feedbackController.js';
import { submissionLimiter } from '../middleware/rateLimiter.js';

export const feedbackRouter = Router();

feedbackRouter.get('/feedback', getFeedback);
feedbackRouter.post('/feedback', submissionLimiter, submitFeedback);
