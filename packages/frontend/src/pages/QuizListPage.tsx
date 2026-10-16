import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext.js';
import { api } from '../services/apiClient.js';
import { Quiz } from '@digital-suraksha/shared';
import { HelpCircle, Award, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { VoicePlayButton } from '../components/common/VoicePlayButton.js';

export const QuizListPage: React.FC = () => {
  const { language, t } = useLanguage();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const data = await api.getQuizzes();
        setQuizzes(data);
      } catch (err) {
        console.error('Failed to load quizzes:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  const pageTitle =
    language === 'mr'
      ? 'सायबर सुरक्षा प्रश्नमंजुषा (Quiz)'
      : language === 'hi'
      ? 'साइबर सुरक्षा प्रश्नोत्तरी (Quiz)'
      : 'Interactive Cyber Safety Quizzes';

  const pageSubtitle =
    language === 'mr'
      ? 'नवशिक्या, मध्यम आणि प्रगत पातळीवर स्वतःच्या सायबर ज्ञानाची चाचणी घ्या आणि सुरक्षित राहा.'
      : language === 'hi'
      ? 'शुरुआती, मध्यम और विशेषज्ञ स्तर पर अपनी डिजिटल सुरक्षा समझ की जांच करें।'
      : 'Test your knowledge on UPI PIN, OTPs, QR codes, and cyber scam protection.';

  return (
    <div className="py-12 sm:py-16 bg-slate-50 dark:bg-navy-950 min-h-screen transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <HelpCircle className="w-4 h-4" />
            <span>Module F • डिजिटल सुरक्षा प्रश्नोत्तरी</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            {pageTitle}
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            {pageSubtitle}
          </p>

          <VoicePlayButton text={`${pageTitle}. ${pageSubtitle}`} label={t.voice.play} />
        </div>

        {/* Quizzes Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-64 rounded-3xl bg-slate-200 dark:bg-navy-900 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {quizzes.map((quiz, idx) => {
              const title =
                language === 'mr' ? quiz.titleMr : language === 'hi' ? quiz.titleHi : quiz.titleEn;
              const desc =
                language === 'mr' ? quiz.descriptionMr : language === 'hi' ? quiz.descriptionHi : quiz.descriptionEn;

              return (
                <div
                  key={quiz.id}
                  className="bg-white dark:bg-navy-900 rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between space-y-6"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs font-extrabold uppercase tracking-wider px-3 py-1 rounded-full ${
                          quiz.difficulty === 'beginner'
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                            : quiz.difficulty === 'intermediate'
                            ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                            : 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                        }`}
                      >
                        {quiz.difficulty}
                      </span>
                      <VoicePlayButton text={`${title}. ${desc}`} />
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-snug">
                      {title}
                    </h3>

                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {desc}
                    </p>

                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span>
                        {quiz.questionsCount || 3} {language === 'mr' ? 'महत्त्वाचे प्रश्न' : language === 'hi' ? 'महत्वपूर्ण प्रश्न' : 'Questions'}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Link
                      to={`/quiz/${quiz.slug}`}
                      className="w-full py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md shadow-emerald-900/30 transition-all flex items-center justify-center gap-2 active:scale-95"
                    >
                      <span>{language === 'mr' ? 'क्विझ सुरू करा' : language === 'hi' ? 'क्विज़ शुरू करें' : 'Start Quiz'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
