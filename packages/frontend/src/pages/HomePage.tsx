import React, { useEffect, useState } from 'react';
import { HeroSection } from '../components/home/HeroSection.js';
import { GoldenRulesSection } from '../components/home/GoldenRulesSection.js';
import { QuickGuidesSection } from '../components/home/QuickGuidesSection.js';
import { useLanguage } from '../context/LanguageContext.js';
import { api } from '../services/apiClient.js';
import { Topic, Category } from '@digital-suraksha/shared';
import { Link } from 'react-router-dom';
import { ArrowRight, AlertTriangle, ShieldAlert, Sparkles, BookOpen } from 'lucide-react';
import { VoicePlayButton } from '../components/common/VoicePlayButton.js';

export const HomePage: React.FC = () => {
  const { language, t } = useLanguage();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const [topicsData, catsData] = await Promise.all([
          api.getTopics(),
          api.getCategories(),
        ]);
        setTopics(topicsData.slice(0, 6)); // Top 6 common frauds
        setCategories(catsData);
      } catch (err) {
        console.error('Failed to load home content:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadContent();
  }, []);

  return (
    <div className="space-y-0">
      {/* Module A: Hero Section */}
      <HeroSection />

      {/* Module A: Golden Rules */}
      <GoldenRulesSection />

      {/* Module A & C: Popular Online Fraud Topics in Rural India */}
      <section className="py-14 sm:py-20 bg-slate-50 dark:bg-navy-950 border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4" />
                <span>{language === 'mr' ? 'सतर्क राहा' : language === 'hi' ? 'सावधान रहें' : 'Stay Alert'}</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {t.home.popularTopicsTitle}
              </h2>
              <p className="text-base text-slate-600 dark:text-slate-400">
                {t.home.popularTopicsSubtitle}
              </p>
            </div>

            <Link
              to="/library"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-bold text-sm hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 shadow-sm transition-all"
            >
              <span>{t.home.viewAllTopics}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Topics Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-64 rounded-3xl bg-slate-200 dark:bg-navy-900 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topics.map((topic) => {
                const title =
                  language === 'mr'
                    ? topic.titleMr
                    : language === 'hi'
                    ? topic.titleHi
                    : topic.titleEn;
                const definition =
                  language === 'mr'
                    ? topic.definitionMr
                    : language === 'hi'
                    ? topic.definitionHi
                    : topic.definitionEn;

                return (
                  <div
                    key={topic.id}
                    className="group bg-white dark:bg-navy-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                            topic.severity === 'critical'
                              ? 'bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400 border border-red-200 dark:border-red-900'
                              : 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400 border border-amber-200 dark:border-amber-900'
                          }`}
                        >
                          {topic.severity === 'critical' ? t.common.severityCritical : t.common.severityHigh}
                        </span>

                        <VoicePlayButton text={`${title}. ${definition}`} />
                      </div>

                      <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-emerald-500 transition-colors leading-snug">
                        {title}
                      </h3>

                      <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                        {definition}
                      </p>
                    </div>

                    <div className="pt-6 border-t border-slate-100 dark:border-slate-800/80 mt-4 flex items-center justify-between">
                      <Link
                        to={`/library/${topic.slug}`}
                        className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                      >
                        <span>{t.common.readMore}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Module A: Quick Interactive Guides */}
      <QuickGuidesSection />
    </div>
  );
};
