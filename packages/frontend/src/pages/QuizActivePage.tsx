import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/apiClient.js';
import { Quiz } from '@digital-suraksha/shared';
import { QuizRunner } from '../components/quiz/QuizRunner.js';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.js';

export const QuizActivePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useLanguage();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      if (!slug) return;
      setIsLoading(true);
      try {
        const data = await api.getQuizBySlug(slug);
        setQuiz(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load quiz');
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuiz();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="py-20 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-slate-500 font-medium">Loading Quiz Questions...</p>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="py-20 text-center max-w-md mx-auto space-y-4">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto" />
        <h2 className="text-2xl font-bold">{error || 'Quiz not found'}</h2>
        <Link
          to="/quiz"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Quizzes</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="py-12 sm:py-16 bg-slate-50 dark:bg-navy-950 min-h-screen transition-colors">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <Link
          to="/quiz"
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Quizzes</span>
        </Link>

        <QuizRunner quiz={quiz} />
      </div>
    </div>
  );
};
