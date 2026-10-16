import { Router } from 'express';
import {
  getCategories,
  getTopics,
  getTopicBySlug,
  searchContent,
  getScenarios,
  checkScenario,
} from '../controllers/contentController.js';

export const contentRouter = Router();

contentRouter.get('/categories', getCategories);
contentRouter.get('/topics', getTopics);
contentRouter.get('/topics/:slug', getTopicBySlug);
contentRouter.get('/search', searchContent);
contentRouter.get('/scenarios', getScenarios);
contentRouter.post('/scenarios/:id/check', checkScenario);
