import React, { useState, useEffect } from 'react';
import { Search, Filter, BookOpen, AlertTriangle, ArrowRight, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.js';
import { api } from '../services/apiClient.js';
import { Topic, Category } from '@digital-suraksha/shared';
import { Link } from 'react-router-dom';
import { VoicePlayButton } from '../components/common/VoicePlayButton.js';

export const FraudLibraryPage: React.FC = () => {
  const { language, t } = useLanguage();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [cats, tops] = await Promise.all([
          api.getCategories(),
          api.getTopics(selectedCategory ? { category: selectedCategory } : undefined),
        ]);
        setCategories(cats);
        setTopics(tops);
      } catch (err) {
        console.error('Failed to load library:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedCategory]);

  // Live client-side text filter on search input
  const filteredTopics = topics.filter((tItem) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    const searchable = [
      tItem.titleEn,
      tItem.titleHi,
      tItem.titleMr,
      tItem.definitionEn,
      tItem.definitionHi,
      tItem.definitionMr,
      ...(tItem.tags || []),
    ].join(' ').toLowerCase();
    return searchable.includes(term);
  });

  return (
    <div className="py-12 sm:py-16 bg-slate-50 dark:bg-navy-950 min-h-screen transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <BookOpen className="w-4 h-4" />
            <span>Module C • ऑनलाइन फ्रॉड जागरूकता लाइब्रेरी</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            {t.library.pageTitle}
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            {t.library.pageSubtitle}
          </p>

          <VoicePlayButton
            text={`${t.library.pageTitle}. ${t.library.pageSubtitle}`}
            label={t.voice.play}
            className="mt-2"
          />
        </div>

        {/* Search Bar & Category Filter */}
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t.common.searchPlaceholder}
              className="w-full pl-12 pr-10 py-4 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm sm:text-base font-medium"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Category Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              onClick={() => setSelectedCategory('')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${
                selectedCategory === ''
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white dark:bg-navy-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {t.common.allCategories}
            </button>

            {categories.map((cat) => {
              const catName =
                language === 'mr' ? cat.nameMr : language === 'hi' ? cat.nameHi : cat.nameEn;
              const isSelected = selectedCategory === cat.slug;

              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-white dark:bg-navy-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {catName}
                </button>
              );
            })}
          </div>
        </div>

        {/* Topics Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-64 rounded-3xl bg-slate-200 dark:bg-navy-900 animate-pulse" />
            ))}
          </div>
        ) : filteredTopics.length === 0 ? (
          <div className="text-center py-16 space-y-4 max-w-md mx-auto">
            <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {t.common.noResults}
            </h3>
            <p className="text-sm text-slate-500">
              Try searching with common terms like "OTP", "PIN", "PhonePe", "Lottery", or "AnyDesk".
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('');
              }}
              className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold"
            >
              {t.common.clearFilters}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTopics.map((topic) => {
              const title =
                language === 'mr' ? topic.titleMr : language === 'hi' ? topic.titleHi : topic.titleEn;
              const definition =
                language === 'mr'
                  ? topic.definitionMr
                  : language === 'hi'
                  ? topic.definitionHi
                  : topic.definitionEn;

              return (
                <div
                  key={topic.id}
                  className="bg-white dark:bg-navy-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
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

                    <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-snug">
                      {title}
                    </h3>

                    <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                      {definition}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <Link
                      to={`/library/${topic.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                    >
                      <span>{t.common.readMore}</span>
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
