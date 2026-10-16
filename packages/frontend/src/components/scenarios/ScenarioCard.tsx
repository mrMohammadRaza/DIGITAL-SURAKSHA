import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import { Scenario } from '@digital-suraksha/shared';
import { useLanguage } from '../../context/LanguageContext.js';
import { api } from '../../services/apiClient.js';
import { VoicePlayButton } from '../common/VoicePlayButton.js';
import { Link } from 'react-router-dom';

interface ScenarioCardProps {
  scenario: Scenario;
}

export const ScenarioCard: React.FC<ScenarioCardProps> = ({ scenario }) => {
  const { language, t } = useLanguage();
  const [selectedChoice, setSelectedChoice] = useState<boolean | null>(null);
  const [result, setResult] = useState<{
    isCorrect: boolean;
    explanationEn: string;
    explanationHi: string;
    explanationMr: string;
    recommendationEn: string;
    recommendationHi: string;
    recommendationMr: string;
    relatedTopicSlug?: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const title =
    language === 'mr' ? scenario.titleMr : language === 'hi' ? scenario.titleHi : scenario.titleEn;
  const context =
    language === 'mr' ? scenario.contextMr : language === 'hi' ? scenario.contextHi : scenario.contextEn;
  const text =
    language === 'mr' ? scenario.scenarioTextMr : language === 'hi' ? scenario.scenarioTextHi : scenario.scenarioTextEn;

  const handleSelect = async (choice: boolean) => {
    if (selectedChoice !== null || isLoading) return;
    setSelectedChoice(choice);
    setIsLoading(true);

    try {
      const data = await api.checkScenario(scenario.id, choice);
      setResult(data);
    } catch {
      // Local fallback in case of network glitch
      const isCorrect = choice === scenario.isSafe;
      setResult({
        isCorrect,
        explanationEn: scenario.explanationEn,
        explanationHi: scenario.explanationHi,
        explanationMr: scenario.explanationMr,
        recommendationEn: scenario.recommendationEn,
        recommendationHi: scenario.recommendationHi,
        recommendationMr: scenario.recommendationMr,
        relatedTopicSlug: scenario.relatedTopicSlug || undefined,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedChoice(null);
    setResult(null);
  };

  const activeExplanation = result
    ? language === 'mr'
      ? result.explanationMr
      : language === 'hi'
      ? result.explanationHi
      : result.explanationEn
    : '';

  const activeRecommendation = result
    ? language === 'mr'
      ? result.recommendationMr
      : language === 'hi'
      ? result.recommendationHi
      : result.recommendationEn
    : '';

  return (
    <div className="bg-white dark:bg-navy-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm transition-all space-y-6">
      {/* Header & Voice */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
            {context}
          </span>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-snug">
            {title}
          </h3>
        </div>

        <VoicePlayButton text={`${title}. ${text}`} />
      </div>

      {/* Scenario Text */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-navy-950 border border-slate-200/80 dark:border-slate-800/80 text-slate-800 dark:text-slate-200 text-base leading-relaxed font-medium">
        "{text}"
      </div>

      {/* Choice Buttons */}
      {result === null ? (
        <div className="space-y-3">
          <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 text-center">
            {language === 'mr'
              ? 'हा प्रसंग सुरक्षित आहे की फसवणूक? एक पर्याय निवडा:'
              : language === 'hi'
              ? 'क्या यह सुरक्षित है या धोखाधड़ी? अपना विकल्प चुनें:'
              : 'Is this safe or a fraud trap? Choose your assessment:'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => handleSelect(true)}
              disabled={isLoading}
              className="py-3.5 px-6 rounded-2xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-950/70 border-2 border-emerald-500/40 hover:border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold text-base flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm"
            >
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>{t.common.safe}</span>
            </button>

            <button
              onClick={() => handleSelect(false)}
              disabled={isLoading}
              className="py-3.5 px-6 rounded-2xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-950/70 border-2 border-rose-500/40 hover:border-rose-500 text-rose-700 dark:text-rose-300 font-bold text-base flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm"
            >
              <ShieldAlert className="w-5 h-5 text-rose-600" />
              <span>{t.common.unsafe}</span>
            </button>
          </div>
        </div>
      ) : (
        /* Result & Feedback Area */
        <div className="space-y-4 animate-in fade-in duration-300">
          <div
            className={`p-4 sm:p-5 rounded-2xl border ${
              result.isCorrect
                ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500/40 text-emerald-900 dark:text-emerald-200'
                : 'bg-rose-50 dark:bg-rose-950/50 border-rose-500/40 text-rose-900 dark:text-rose-200'
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              {result.isCorrect ? (
                <>
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  <span className="font-extrabold text-base sm:text-lg">
                    {language === 'mr' ? 'अचूक उत्तर!' : language === 'hi' ? 'बिल्कुल सही जवाब!' : 'Correct Assessment!'}
                  </span>
                </>
              ) : (
                <>
                  <XCircle className="w-6 h-6 text-rose-600 dark:text-rose-400 flex-shrink-0" />
                  <span className="font-extrabold text-base sm:text-lg">
                    {language === 'mr' ? 'चुकीचे उत्तर — सावधान!' : language === 'hi' ? 'गलत जवाब — सावधानी जरूरी!' : 'Incorrect — Caution Needed!'}
                  </span>
                </>
              )}
            </div>

            <p className="text-sm sm:text-base leading-relaxed mb-3">
              {activeExplanation}
            </p>

            <div className="p-3 rounded-xl bg-white/70 dark:bg-black/30 text-xs sm:text-sm font-medium border border-black/5 dark:border-white/5 space-y-1">
              <span className="font-bold block text-slate-800 dark:text-slate-100">
                {t.common.recommendation}:
              </span>
              <span>{activeRecommendation}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              onClick={handleReset}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
            >
              {language === 'mr' ? 'पुन्हा प्रयत्न करा' : language === 'hi' ? 'फिर से कोशिश करें' : 'Try Again'}
            </button>

            {result.relatedTopicSlug && (
              <Link
                to={`/library/${result.relatedTopicSlug}`}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                <span>{t.common.relatedTopics}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}

            <VoicePlayButton text={`${activeExplanation}. ${activeRecommendation}`} />
          </div>
        </div>
      )}
    </div>
  );
};
