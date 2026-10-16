import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';
import { prisma } from '../src/db/prisma.js';

describe('Digital Suraksha Backend API Suite', () => {
  beforeAll(async () => {
    // Ensure database connection
    await prisma.$connect();
  });

  describe('Health & Readiness', () => {
    it('GET /api/v1/health should return UP status', async () => {
      const res = await request(app).get('/api/v1/health');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('UP');
    });

    it('GET /api/v1/ready should verify database readiness', async () => {
      const res = await request(app).get('/api/v1/ready');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.database).toBe('CONNECTED');
    });
  });

  describe('Educational Content & Search', () => {
    it('GET /api/v1/categories should return all categories', async () => {
      const res = await request(app).get('/api/v1/categories');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
      expect(res.body.data[0]).toHaveProperty('slug');
      expect(res.body.data[0]).toHaveProperty('nameHi');
      expect(res.body.data[0]).toHaveProperty('nameMr');
    });

    it('GET /api/v1/topics should return topics with parsed JSON lists', async () => {
      const res = await request(app).get('/api/v1/topics');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);

      const first = res.body.data[0];
      expect(Array.isArray(first.warningSignsHi)).toBe(true);
      expect(Array.isArray(first.safeActionsHi)).toBe(true);
      expect(Array.isArray(first.victimGuidanceHi)).toBe(true);
    });

    it('GET /api/v1/topics/:slug should return a single topic', async () => {
      const res = await request(app).get('/api/v1/topics/upi-collect-request');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.slug).toBe('upi-collect-request');
      expect(res.body.data.titleHi).toContain('यूपीआई कलेक्ट रिक्वेस्ट');
    });

    it('GET /api/v1/topics/:slug with invalid slug should return 404', async () => {
      const res = await request(app).get('/api/v1/topics/non-existent-fraud');
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('TOPIC_NOT_FOUND');
    });

    it('GET /api/v1/search should find topics matching keywords', async () => {
      const res = await request(app).get('/api/v1/search?q=पिन');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });
  });

  describe('Interactive Scenarios', () => {
    it('GET /api/v1/scenarios should return safe/unsafe learning cards', async () => {
      const res = await request(app).get('/api/v1/scenarios');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    it('POST /api/v1/scenarios/:id/check should validate user choice', async () => {
      const listRes = await request(app).get('/api/v1/scenarios');
      const scenario = listRes.body.data[0];

      const res = await request(app)
        .post(`/api/v1/scenarios/${scenario.id}/check`)
        .send({ userChoice: false });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('isCorrect');
      expect(res.body.data).toHaveProperty('explanationHi');
      expect(res.body.data).toHaveProperty('recommendationHi');
    });
  });

  describe('Interactive Quiz Engine & Server Validation', () => {
    it('GET /api/v1/quizzes should return available quizzes', async () => {
      const res = await request(app).get('/api/v1/quizzes');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBeGreaterThanOrEqual(3);
    });

    it('GET /api/v1/quizzes/:slug should strip isCorrect from options', async () => {
      const res = await request(app).get('/api/v1/quizzes/quiz-beginner');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      const quiz = res.body.data;
      expect(quiz.questions.length).toBeGreaterThan(0);

      const firstQuestion = quiz.questions[0];
      expect(firstQuestion.options.length).toBeGreaterThan(0);
      // Strict security check: isCorrect must NOT be revealed to students!
      expect(firstQuestion.options[0]).not.toHaveProperty('isCorrect');
    });

    it('POST /api/v1/quizzes/:slug/attempts should score on server and save attempt', async () => {
      // Get the beginner quiz
      const quizRes = await request(app).get('/api/v1/quizzes/quiz-beginner');
      const quiz = quizRes.body.data;

      // Prepare submission with first option of each question
      const answers = quiz.questions.map((q: any) => ({
        questionId: q.id,
        selectedOptionId: q.options[0].id,
      }));

      const res = await request(app)
        .post(`/api/v1/quizzes/${quiz.slug}/attempts`)
        .send({
          quizId: quiz.id,
          userIdentifier: 'test-student-session-123',
          answers,
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('attemptId');
      expect(res.body.data).toHaveProperty('score');
      expect(res.body.data).toHaveProperty('percentage');
      expect(res.body.data).toHaveProperty('feedbackHi');
      expect(Array.isArray(res.body.data.details)).toBe(true);

      // Verify attempt retrieval endpoint
      const resultRes = await request(app).get(`/api/v1/attempts/${res.body.data.attemptId}/results`);
      expect(resultRes.status).toBe(200);
      expect(resultRes.body.success).toBe(true);
      expect(resultRes.body.data.attemptId).toBe(res.body.data.attemptId);
    });
  });

  describe('Community Feedback', () => {
    it('POST /api/v1/feedback should create genuine feedback with Zod validation', async () => {
      const res = await request(app)
        .post('/api/v1/feedback')
        .send({
          name: 'Mukesh Sharma',
          villageOrCity: 'Gopalpur Village',
          rating: 5,
          category: 'cep_session',
          comment: 'बहुत उपयोगी सत्र था। हमें समझ आया कि किसी को भी बैंक का OTP नहीं बताना चाहिए।',
          language: 'hi',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('Mukesh Sharma');
    });

    it('POST /api/v1/feedback should reject too short comments', async () => {
      const res = await request(app)
        .post('/api/v1/feedback')
        .send({
          name: 'Mukesh',
          rating: 5,
          category: 'general',
          comment: 'hi', // less than 5 characters
          language: 'hi',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('Admin Security & Authorization', () => {
    it('GET /api/v1/admin/dashboard should reject unauthorized requests with 401', async () => {
      const res = await request(app).get('/api/v1/admin/dashboard');
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('UNAUTHORIZED');
    });

    it('POST /api/v1/admin/login should reject invalid credentials', async () => {
      const res = await request(app)
        .post('/api/v1/admin/login')
        .send({
          email: 'admin@suraksha.gov.in',
          password: 'WrongPassword123!',
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('INVALID_CREDENTIALS');
    });

    it('POST /api/v1/admin/login should succeed with valid credentials and allow admin dashboard access', async () => {
      const loginRes = await request(app)
        .post('/api/v1/admin/login')
        .send({
          email: 'admin@suraksha.gov.in',
          password: 'SurakshaAdmin2026!',
        });

      expect(loginRes.status).toBe(200);
      expect(loginRes.body.success).toBe(true);
      expect(loginRes.body.data).toHaveProperty('token');
      expect(loginRes.headers['set-cookie']).toBeDefined();

      const token = loginRes.body.data.token;

      // Access protected admin dashboard using Bearer token
      const dashRes = await request(app)
        .get('/api/v1/admin/dashboard')
        .set('Authorization', `Bearer ${token}`);

      expect(dashRes.status).toBe(200);
      expect(dashRes.body.success).toBe(true);
      expect(dashRes.body.data.stats.topicsCount).toBeGreaterThan(0);
      expect(dashRes.body.data.stats.quizzesCount).toBeGreaterThan(0);
    });
  });
});
