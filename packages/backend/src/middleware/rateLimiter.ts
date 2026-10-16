import rateLimit from 'express-rate-limit';

// General API rate limiter: 300 requests per 15 minutes per IP
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests. Please try again after 15 minutes.',
    },
  },
  skip: () => process.env.NODE_ENV === 'test',
});

// Strict rate limiter for Admin Login: 10 attempts per 15 minutes
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'AUTH_RATE_LIMIT_EXCEEDED',
      message: 'Too many login attempts. Please try again after 15 minutes.',
    },
  },
  skip: () => process.env.NODE_ENV === 'test',
});

// Feedback and Quiz submission rate limiter: 30 submissions per hour
export const submissionLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'SUBMISSION_RATE_LIMIT_EXCEEDED',
      message: 'Submission limit reached. Please wait before submitting more feedback or quiz attempts.',
    },
  },
  skip: () => process.env.NODE_ENV === 'test',
});
