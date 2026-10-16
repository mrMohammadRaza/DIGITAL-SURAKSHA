import { Router } from 'express';
import {
  adminLogin,
  adminLogout,
  getAdminMe,
  getAdminDashboard,
  createTopic,
  updateTopic,
  deleteTopic,
  getAllFeedbackAdmin,
  toggleFeedbackApproval,
} from '../controllers/adminController.js';
import { requireAdmin } from '../middleware/authMiddleware.js';
import { authLimiter } from '../middleware/rateLimiter.js';

export const adminRouter = Router();

// Public auth endpoints (rate-limited)
adminRouter.post('/admin/login', authLimiter, adminLogin);
adminRouter.post('/admin/logout', adminLogout);

// Protected endpoints
adminRouter.get('/admin/me', requireAdmin, getAdminMe);
adminRouter.get('/admin/dashboard', requireAdmin, getAdminDashboard);

// Topic management
adminRouter.post('/admin/topics', requireAdmin, createTopic);
adminRouter.put('/admin/topics/:id', requireAdmin, updateTopic);
adminRouter.delete('/admin/topics/:id', requireAdmin, deleteTopic);

// Feedback moderation
adminRouter.get('/admin/feedback', requireAdmin, getAllFeedbackAdmin);
adminRouter.patch('/admin/feedback/:id/toggle-approval', requireAdmin, toggleFeedbackApproval);
