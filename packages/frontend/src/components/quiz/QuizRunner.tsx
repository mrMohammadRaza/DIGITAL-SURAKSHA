import React, { useState } from 'react';
import { CheckCircle2, XCircle, RotateCcw, Award, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';
import { Quiz, QuizResultResponse } from '@digital-suraksha/shared';
import { useLanguage } from '../../context/LanguageContext.js';
import { api } from '../../services/apiClient.js';
import { VoicePlayButton } from '../common/VoicePlayButton.js';
import { Link } from 'react-router-dom';

interface QuizRunnerProps {
  quiz: Quiz;
  onExit?: () => void;
}

export const QuizRunner: React.FC<QuizRunnerProps> = ({ quiz, onExit }) => {
  const { language } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<QuizResultResponse | null>(null);

  const questions = quiz.questions || [];
  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;

  const currentQText = currentQuestion
    ? language === 'mr'
      ? currentQuestion.questionMr
      : language === 'hi'
      ? currentQuestion.questionHi
      : currentQuestion.questionEn
    : '';

  const handleSelectOption = (questionId: string, optionId: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const answers = Object.entries(selectedAnswers).map(([questionId, selectedOptionId]) => ({
        questionId,
        selectedOptionId,
      }));

      const res = await api.submitQuizAttempt(quiz.slug, {
        quizId: quiz.id,
        userIdentifier: `citizen-${Date.now()}`,
        answers,
      });

      setResult(res);
    } catch (err: any) {
      alert(`Submission failed: ${err.message || 'Please check connection'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetry = () => {
    setSelectedAnswers({});
    setCurrentIndex(0);
    setResult(null);
  };

  // If results are available, show comprehensive Score Gauge & Review
  if (result) {
    const feedbackText =
      language === 'mr'
        ? result.feedbackMr
        : language === 'hi'
        ? result.feedbackHi
        : result.feedbackEn;

    return (
      <div className="bg-white dark:bg-navy-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-xl space-y-8 animate-in fade-in duration-300">
        {/* Score Header */}
        <div className="text-center space-y-4 max-w-xl mx-auto">
          <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center border-2 border-emerald-500/40">
            {result.passed ? (
              <Award className="w-10 h-10 animate-bounce" />
            ) : (
              <ShieldCheck className="w-10 h-10 text-amber-500" />
            )}
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {result.passed
              ? language === 'mr'
                ? 'अभिनंदन! तुम्ही उत्तीर्ण झालात!'
                : language === 'hi'
                ? 'बधाई हो! आप उत्तीर्ण हुए!'
                : 'Congratulations! You Passed!'
              : language === 'mr'
              ? 'पुन्हा सराव आवश्यक आहे'
              : language === 'hi'
              ? 'और अभ्यास की आवश्यकता है'
              : 'Keep Practicing for Safety'}
          </h2>

          <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-slate-100 dark:bg-navy-950 border border-slate-200 dark:border-slate-800">
            <span className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
              {result.percentage}%
            </span>
            <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">
              ({result.correctCount} / {result.totalQuestions} {language === 'mr' ? 'उत्तरे बरोबर' : language === 'hi' ? 'उत्तर सही' : 'correct'})
            </span>
          </div>

          <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
            {feedbackText}
          </p>

          <VoicePlayButton text={feedbackText} />
        </div>

        {/* Detailed Question Review */}
        <div className="space-y-6 pt-4 border-t border-slate-200 dark:border-slate-800">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {language === 'mr'
              ? 'प्रश्नांचे सविस्तर स्पष्टीकरण (Answer Explanations):'
              : language === 'hi'
              ? 'प्रश्नों का विस्तृत स्पष्टीकरण (Answer Explanations):'
              : 'Detailed Question Explanations:'}
          </h3>

          <div className="space-y-4">
            {result.details.map((item, idx) => {
              const qTitle =
                language === 'mr'
                  ? item.questionMr
                  : language === 'hi'
                  ? item.questionHi
                  : item.questionEn;
              const expText =
                language === 'mr'
                  ? item.explanationMr
                  : language === 'hi'
                  ? item.explanationHi
                  : item.explanationEn;

              return (
                <div
                  key={item.questionId}
                  className={`p-5 rounded-2xl border ${
                    item.isCorrect
                      ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-500/30'
                      : 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-500/30'
                  } space-y-3`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      {item.isCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 flex-shrink-0 mt-0.5" />
                      )}
                      <span className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                        {idx + 1}. {qTitle}
                      </span>
                    </div>

                    <VoicePlayButton text={`${qTitle}. ${expText}`} />
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 pl-7 leading-relaxed font-medium">
                    <strong className="text-emerald-700 dark:text-emerald-400">
                      {language === 'mr' ? 'योग्य समज:' : language === 'hi' ? 'सही समझ:' : 'Explanation:'}{' '}
                    </strong>
                    {expText}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={handleRetry}
            className="px-6 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold text-sm flex items-center gap-2 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{language === 'mr' ? 'पुन्हा क्विझ द्या' : language === 'hi' ? 'पुनः क्विज़ दें' : 'Retake Quiz'}</span>
          </button>

          <Link
            to="/library"
            className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center gap-2 shadow-md shadow-emerald-900/40 transition-colors"
          >
            <span>{language === 'mr' ? 'मार्गदर्शक वाचा' : language === 'hi' ? 'गाइड पढ़ें' : 'Read Fraud Guides'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  // Quiz in Progress
  if (!currentQuestion) {
    return <div className="text-center py-10 font-bold">No questions found in this quiz.</div>;
  }

  const answeredCount = Object.keys(selectedAnswers).length;
  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);

  return (
    <div className="bg-white dark:bg-navy-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-xl space-y-8">
      {/* Progress & Header */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400">
          <span>
            {language === 'mr' ? 'प्रश्न' : language === 'hi' ? 'प्रश्न' : 'Question'} {currentIndex + 1} of {questions.length}
          </span>
          <span className="text-emerald-600 dark:text-emerald-400 font-bold">
            {answeredCount} / {questions.length} answered
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Question Text */}
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-snug">
            {currentIndex + 1}. {currentQText}
          </h3>

          <VoicePlayButton text={currentQText} />
        </div>

        {/* Options */}
        <div className="space-y-3 pt-2">
          {currentQuestion.options.map((option, idx) => {
            const optText =
              language === 'mr'
                ? option.textMr
                : language === 'hi'
                ? option.textHi
                : option.textEn;
            const isSelected = selectedAnswers[currentQuestion.id] === option.id;

            return (
              <button
                key={option.id}
                onClick={() => handleSelectOption(currentQuestion.id, option.id)}
                className={`w-full p-4 sm:p-5 rounded-2xl border-2 text-left transition-all flex items-center justify-between gap-4 ${
                  isSelected
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-950 dark:text-emerald-200 font-bold shadow-sm'
                    : 'bg-slate-50 dark:bg-navy-950 border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-slate-700 text-slate-800 dark:text-slate-200 font-medium'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold ${
                      isSelected
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="text-sm sm:text-base leading-relaxed">{optText}</span>
                </div>

                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-600'
                      : 'border-slate-300 dark:border-slate-600'
                  }`}
                >
                  {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {language === 'mr' ? 'मागे' : language === 'hi' ? 'पिछला' : 'Previous'}
        </button>

        {isLastQuestion ? (
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || answeredCount === 0}
            className="px-7 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-base shadow-lg shadow-emerald-900/40 disabled:opacity-50 transition-all flex items-center gap-2"
          >
            {isSubmitting ? (
              <span>Submitting to Server...</span>
            ) : (
              <>
                <Award className="w-5 h-5" />
                <span>{language === 'mr' ? 'निकाल पहा' : language === 'hi' ? 'परिणाम देखें' : 'Submit & View Score'}</span>
              </>
            )}
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md transition-colors flex items-center gap-1.5"
          >
            <span>{language === 'mr' ? 'पुढे' : language === 'hi' ? 'अगला' : 'Next'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
