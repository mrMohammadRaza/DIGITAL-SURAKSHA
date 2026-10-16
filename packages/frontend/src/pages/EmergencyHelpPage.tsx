import React from 'react';
import { useLanguage } from '../context/LanguageContext.js';
import { PhoneCall, ExternalLink, ShieldAlert, Clock, CheckSquare, Building, AlertCircle, Sparkles } from 'lucide-react';
import { BANK_HELPLINES, APP_CONFIG } from '@digital-suraksha/shared';
import { VoicePlayButton } from '../components/common/VoicePlayButton.js';

export const EmergencyHelpPage: React.FC = () => {
  const { language, t } = useLanguage();

  return (
    <div className="py-12 sm:py-16 bg-slate-50 dark:bg-navy-950 min-h-screen transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-bold uppercase tracking-wider">
            <PhoneCall className="w-4 h-4 animate-bounce" />
            <span>Module I • आपातकालीन साइबर सहायता</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            {t.emergency.pageTitle}
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            {t.emergency.pageSubtitle}
          </p>

          <VoicePlayButton
            text={`${t.emergency.pageTitle}. ${t.emergency.pageSubtitle}`}
            label={t.voice.play}
            className="mt-2"
          />
        </div>

        {/* Primary Helpline & Portal Callout (Golden Hour) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 1930 Phone Card */}
          <div className="bg-gradient-to-br from-red-600 via-rose-600 to-red-700 text-white rounded-3xl p-8 shadow-xl space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider">
                  24x7 Toll-Free Helpline
                </span>
                <Clock className="w-6 h-6 text-amber-200" />
              </div>

              <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
                Dial 1930
              </h2>

              <p className="text-sm sm:text-base text-red-100 leading-relaxed font-medium">
                {t.emergency.helplineDesc}
              </p>
            </div>

            <div className="pt-2">
              <a
                href="tel:1930"
                className="w-full py-4 px-6 rounded-2xl bg-white text-red-700 font-extrabold text-base sm:text-lg hover:bg-amber-100 transition-colors shadow-md flex items-center justify-center gap-2 active:scale-95"
              >
                <PhoneCall className="w-5 h-5" />
                <span>Call 1930 Now (तुरंत कॉल करें)</span>
              </a>
            </div>
          </div>

          {/* Official Portal Card */}
          <div className="bg-white dark:bg-navy-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
                  Official Government Portal
                </span>
                <ExternalLink className="w-6 h-6 text-slate-400" />
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                cybercrime.gov.in
              </h2>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                {t.emergency.portalDesc}
              </p>
            </div>

            <div className="pt-2">
              <a
                href={APP_CONFIG.PORTAL_NATIONAL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 px-6 rounded-2xl bg-navy-900 hover:bg-navy-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-extrabold text-base transition-colors shadow-md flex items-center justify-center gap-2 active:scale-95"
              >
                <span>Open cybercrime.gov.in</span>
                <ExternalLink className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Evidence Preservation Checklist */}
        <div className="bg-white dark:bg-navy-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-amber-600 dark:text-amber-400 font-bold text-lg sm:text-xl">
              <ShieldAlert className="w-6 h-6" />
              <h2>{t.emergency.evidenceChecklistTitle}</h2>
            </div>
            <VoicePlayButton text={t.emergency.evidenceItems.join('. ')} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {t.emergency.evidenceItems.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800"
              >
                <CheckSquare className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bank Directory */}
        <div className="bg-white dark:bg-navy-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center gap-2.5 text-slate-900 dark:text-white font-bold text-lg sm:text-xl">
            <Building className="w-6 h-6 text-emerald-500" />
            <h2>{t.emergency.bankDirectoryTitle}</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {BANK_HELPLINES.map((bank, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-1.5">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    {bank.bankName}
                  </h3>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                    {bank.tollFree}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
                  <span className="font-semibold block">Card Block Action:</span>
                  <span>{bank.blockSms}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Legal Disclaimer */}
        <div className="p-4 rounded-2xl bg-slate-100 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 flex items-start gap-3 text-xs text-slate-600 dark:text-slate-400">
          <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
          <p>
            <strong>Note:</strong> While 1930 and bank freezing stop unauthorized funds withdrawal when reported promptly, this college awareness portal does not guarantee monetary recovery. Always interact with official banks and law enforcement through independently verified numbers.
          </p>
        </div>
      </div>
    </div>
  );
};
