import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext.js';
import { api } from '../services/apiClient.js';
import { Topic } from '@digital-suraksha/shared';
import { ArrowLeft, AlertOctagon, CheckCircle2, AlertTriangle, PhoneCall, ArrowRight, ShieldAlert } from 'lucide-react';
import { VoicePlayButton } from '../components/common/VoicePlayButton.js';

export const TopicDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { language, t } = useLanguage();
  const [topic, setTopic] = useState<Topic | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopic = async () => {
      if (!slug) return;
      setIsLoading(true);
      setError(null);
      try {
        const data = await api.getTopicBySlug(slug);
        setTopic(data);
      } catch (err: any) {
        setError(err.message || 'Topic not found');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopic();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="py-20 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-slate-500 font-medium">{t.common.loading}</p>
      </div>
    );
  }

  if (error || !topic) {
    return (
      <div className="py-20 text-center max-w-md mx-auto space-y-4">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto" />
        <h2 className="text-2xl font-bold">{error || 'Topic not found'}</h2>
        <Link
          to="/library"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.common.backToList}</span>
        </Link>
      </div>
    );
  }

  const title =
    language === 'mr' ? topic.titleMr : language === 'hi' ? topic.titleHi : topic.titleEn;
  const definition =
    language === 'mr' ? topic.definitionMr : language === 'hi' ? topic.definitionHi : topic.definitionEn;
  const howItWorks =
    language === 'mr' ? topic.howItWorksMr : language === 'hi' ? topic.howItWorksHi : topic.howItWorksEn;
  const fictionalExample =
    language === 'mr' ? topic.fictionalExampleMr : language === 'hi' ? topic.fictionalExampleHi : topic.fictionalExampleEn;
  const warningSigns =
    language === 'mr' ? (topic.warningSignsMr as any) : language === 'hi' ? (topic.warningSignsHi as any) : (topic.warningSignsEn as any);
  const safeActions =
    language === 'mr' ? (topic.safeActionsMr as any) : language === 'hi' ? (topic.safeActionsHi as any) : (topic.safeActionsEn as any);
  const victimGuidance =
    language === 'mr' ? (topic.victimGuidanceMr as any) : language === 'hi' ? (topic.victimGuidanceHi as any) : (topic.victimGuidanceEn as any);

  const fullTopicAudioText = `${title}. ${definition}. How it works: ${howItWorks}. Warning signs: ${Array.isArray(warningSigns) ? warningSigns.join('. ') : ''}. Safe actions: ${Array.isArray(safeActions) ? safeActions.join('. ') : ''}`;

  return (
    <div className="py-12 sm:py-16 bg-slate-50 dark:bg-navy-950 min-h-screen transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Back navigation & Voice button */}
        <div className="flex items-center justify-between">
          <Link
            to="/library"
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t.common.backToList}</span>
          </Link>

          <VoicePlayButton text={fullTopicAudioText} label={t.voice.play} />
        </div>

        {/* Title & Severity */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-extrabold uppercase tracking-wider px-3 py-1 rounded-full ${
                topic.severity === 'critical'
                  ? 'bg-red-50 text-red-600 dark:bg-red-950/60 dark:text-red-400 border border-red-200 dark:border-red-900'
                  : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200 dark:border-amber-900'
              }`}
            >
              {topic.severity === 'critical' ? t.common.severityCritical : t.common.severityHigh}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white leading-tight">
            {title}
          </h1>
        </div>

        {/* Section 1: Definition */}
        <div className="bg-white dark:bg-navy-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {t.library.definition}
            </h2>
            <VoicePlayButton text={definition} />
          </div>
          <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
            {definition}
          </p>
        </div>

        {/* Section 2: How it works */}
        <div className="bg-white dark:bg-navy-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {t.library.howItWorks}
            </h2>
            <VoicePlayButton text={howItWorks} />
          </div>
          <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed">
            {howItWorks}
          </p>
        </div>

        {/* Section 3: Clearly Labelled Fictional Example */}
        <div className="bg-amber-50/70 dark:bg-amber-950/30 rounded-3xl p-6 sm:p-8 border border-amber-200 dark:border-amber-900/60 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-800 dark:text-amber-400 font-bold text-base">
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              <span>{t.library.fictionalExample}</span>
            </div>
            <VoicePlayButton text={fictionalExample} />
          </div>
          <p className="text-base text-amber-950 dark:text-amber-200 leading-relaxed italic">
            "{fictionalExample}"
          </p>
        </div>

        {/* Section 4: Warning Signs & Safe Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Warning Signs */}
          <div className="bg-rose-50/60 dark:bg-rose-950/20 rounded-3xl p-6 sm:p-7 border border-rose-200 dark:border-rose-900/50 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-bold text-base">
              <AlertOctagon className="w-5 h-5 flex-shrink-0" />
              <span>{t.library.warningSigns}</span>
            </div>
            <ul className="space-y-2.5 text-sm text-slate-800 dark:text-slate-200">
              {Array.isArray(warningSigns) &&
                warningSigns.map((ws: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 flex-shrink-0" />
                    <span>{ws}</span>
                  </li>
                ))}
            </ul>
          </div>

          {/* Safe Actions */}
          <div className="bg-emerald-50/60 dark:bg-emerald-950/20 rounded-3xl p-6 sm:p-7 border border-emerald-200 dark:border-emerald-900/50 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-base">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              <span>{t.library.safeActions}</span>
            </div>
            <ul className="space-y-2.5 text-sm text-slate-800 dark:text-slate-200">
              {Array.isArray(safeActions) &&
                safeActions.map((sa: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                    <span>{sa}</span>
                  </li>
                ))}
            </ul>
          </div>
        </div>

        {/* Section 5: What to Do If Already Interacted / Lost Money */}
        <div className="bg-gradient-to-br from-navy-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-700 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-red-400 font-bold text-lg">
              <PhoneCall className="w-6 h-6 animate-pulse" />
              <span>{t.library.victimGuidance}</span>
            </div>
            <Link
              to="/emergency"
              className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-sm"
            >
              1930 Helpline
            </Link>
          </div>

          <ul className="space-y-2 text-sm text-slate-200">
            {Array.isArray(victimGuidance) &&
              victimGuidance.map((vg: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{vg}</span>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
