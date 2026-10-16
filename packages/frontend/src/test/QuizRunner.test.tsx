import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { LanguageProvider } from '../context/LanguageContext.js';
import { QuizRunner } from '../components/quiz/QuizRunner.js';
import { Quiz } from '@digital-suraksha/shared';
import { api } from '../services/apiClient.js';

const mockQuiz: Quiz = {
  id: 'q-1',
  slug: 'test-quiz',
  titleEn: 'Test Quiz',
  titleHi: 'परीक्षण क्विज़',
  titleMr: 'चाचणी क्विझ',
  descriptionEn: 'Test Description',
  descriptionHi: 'परीक्षण विवरण',
  descriptionMr: 'चाचणी वर्णन',
  difficulty: 'beginner',
  questions: [
    {
      id: 'quest-1',
      quizId: 'q-1',
      order: 1,
      difficulty: 'beginner',
      points: 10,
      questionEn: 'When do you enter UPI PIN?',
      questionHi: 'यूपीआई पिन कब डाला जाता है?',
      questionMr: 'यूपीआय पिन कधी टाकला जातो?',
      explanationEn: 'Only when sending money.',
      explanationHi: 'केवल पैसे भेजते समय।',
      explanationMr: 'फक्त पैसे पाठवताना.',
      options: [
        { id: 'opt-1', textEn: 'Only when sending money', textHi: 'केवल पैसे भेजते समय', textMr: 'फक्त पैसे पाठवताना' },
        { id: 'opt-2', textEn: 'To receive money', textHi: 'पैसे प्राप्त करने के लिए', textMr: 'पैसे मिळवण्यासाठी' },
      ],
    },
  ],
};

describe('Interactive Quiz Runner Suite', () => {
  it('should render question and handle option selection and submission', async () => {
    // Mock api.submitQuizAttempt
    vi.spyOn(api, 'submitQuizAttempt').mockResolvedValueOnce({
      attemptId: 'att-123',
      quizId: 'q-1',
      quizSlug: 'test-quiz',
      totalQuestions: 1,
      correctCount: 1,
      score: 10,
      totalPossibleScore: 10,
      percentage: 100,
      passed: true,
      feedbackEn: 'Outstanding!',
      feedbackHi: 'शानदार!',
      feedbackMr: 'उत्कृष्ट!',
      details: [
        {
          questionId: 'quest-1',
          questionHi: 'यूपीआई पिन कब डाला जाता है?',
          selectedOptionId: 'opt-1',
          isCorrect: true,
          correctOptionId: 'opt-1',
          explanationEn: 'Only when sending money.',
          explanationHi: 'केवल पैसे भेजते समय।',
          explanationMr: 'फक्त पैसे पाठवताना.',
        },
      ],
    });

    render(
      <BrowserRouter>
        <LanguageProvider>
          <QuizRunner quiz={mockQuiz} />
        </LanguageProvider>
      </BrowserRouter>
    );

    expect(screen.getByText(/यूपीआई पिन कब डाला जाता है?/i)).toBeInTheDocument();

    // Select the first option
    const option = screen.getByText(/केवल पैसे भेजते समय/i);
    fireEvent.click(option);

    // Submit button
    const submitBtn = screen.getByRole('button', { name: /परिणाम देखें/i });
    fireEvent.click(submitBtn);

    // Results screen
    await waitFor(() => {
      expect(screen.getByText(/100%/i)).toBeInTheDocument();
      expect(screen.getByText(/शानदार!/i)).toBeInTheDocument();
    });
  });
});
