import React from 'react';
import { KeyRound, ShieldAlert, Smartphone, Clock } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext.js';
import { GOLDEN_RULES } from '@digital-suraksha/shared';
import { VoicePlayButton } from '../common/VoicePlayButton.js';

export const GoldenRulesSection: React.FC = () => {
  const { language, t } = useLanguage();

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'KeyRound':
        return <KeyRound className="w-7 h-7 text-amber-500 dark:text-amber-400" />;
      case 'ShieldAlert':
        return <ShieldAlert className="w-7 h-7 text-red-500 dark:text-red-400" />;
      case 'SmartphoneOff':
        return <Smartphone className="w-7 h-7 text-purple-500 dark:text-purple-400" />;
      case 'Clock':
        return <Clock className="w-7 h-7 text-emerald-500 dark:text-emerald-400" />;
      default:
        return <KeyRound className="w-7 h-7 text-emerald-500" />;
    }
  };

  return (
    <section className="py-14 sm:py-20 bg-white dark:bg-navy-900 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t.home.goldenRulesTitle}
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300">
            {t.home.goldenRulesSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {GOLDEN_RULES.map((rule, idx) => {
            const title =
              language === 'mr' ? rule.titleMr : language === 'hi' ? rule.titleHi : rule.titleEn;
            const desc =
              language === 'mr' ? rule.descMr : language === 'hi' ? rule.descHi : rule.descEn;

            return (
              <div
                key={rule.id}
                className="relative bg-slate-50 dark:bg-navy-950 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-white dark:bg-navy-800 flex items-center justify-center shadow-sm border border-slate-100 dark:border-slate-700">
                      {getIcon(rule.icon)}
                    </div>
                    <span className="text-3xl font-black text-slate-300 dark:text-slate-700">
                      0{idx + 1}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-snug">
                    {title}
                  </h3>

                  <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                    {desc}
                  </p>
                </div>

                <div className="pt-2 flex justify-end">
                  <VoicePlayButton text={`${title}. ${desc}`} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
