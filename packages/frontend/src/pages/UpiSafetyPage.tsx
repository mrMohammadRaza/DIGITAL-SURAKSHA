import React from 'react';
import { useLanguage } from '../context/LanguageContext.js';
import { CreditCard, KeyRound, QrCode, ArrowDownLeft, ArrowUpRight, AlertTriangle, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { VoicePlayButton } from '../components/common/VoicePlayButton.js';
import { Link } from 'react-router-dom';

export const UpiSafetyPage: React.FC = () => {
  const { language, t } = useLanguage();

  return (
    <div className="py-12 sm:py-16 bg-slate-50 dark:bg-navy-950 min-h-screen transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <CreditCard className="w-4 h-4" />
            <span>Module D • यूपीआई और डिजिटल भुगतान सुरक्षा</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            {t.upi.pageTitle}
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            {t.upi.pageSubtitle}
          </p>

          <VoicePlayButton
            text={`${t.upi.pageTitle}. ${t.upi.pageSubtitle}`}
            label={t.voice.play}
            className="mt-2"
          />
        </div>

        {/* The Cardinal Law of UPI PIN (High visual prominence) */}
        <div className="bg-gradient-to-br from-navy-900 via-navy-950 to-slate-900 text-white rounded-3xl p-6 sm:p-10 border border-emerald-500/40 shadow-2xl space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm uppercase tracking-wider">
                <KeyRound className="w-5 h-5" />
                <span>The Golden Law • सबसे बड़ा नियम</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                {t.upi.cardinalRuleTitle}
              </h2>
            </div>

            <VoicePlayButton text={`${t.upi.cardinalRuleTitle}. ${t.upi.cardinalRuleDesc}`} />
          </div>

          <p className="text-base sm:text-lg text-slate-200 leading-relaxed max-w-4xl font-medium">
            {t.upi.cardinalRuleDesc}
          </p>

          {/* Visual Comparison: Sending vs Receiving */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Sending */}
            <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-700/80 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <ArrowUpRight className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-amber-400">
                  {t.upi.goldenComparison.sendingTitle}
                </h3>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                {t.upi.goldenComparison.sendingDesc}
              </p>
              <div className="inline-block px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
                PIN IS REQUIRED (पिन डालना होगा)
              </div>
            </div>

            {/* Receiving */}
            <div className="bg-emerald-950/40 rounded-2xl p-6 border border-emerald-500/30 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <ArrowDownLeft className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-emerald-400">
                  {t.upi.goldenComparison.receivingTitle}
                </h3>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                {t.upi.goldenComparison.receivingDesc}
              </p>
              <div className="inline-block px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                NO PIN NEEDED (पिन की कोई जरूरत नहीं)
              </div>
            </div>
          </div>
        </div>

        {/* Practical Checklist on GPay, PhonePe, Paytm */}
        <div className="bg-white dark:bg-navy-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              {t.upi.popularAppsTitle}
            </h2>
            <VoicePlayButton
              text={t.upi.appChecklist.join('. ')}
              label={t.voice.play}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {t.upi.appChecklist.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Failed & Delayed Transactions Guidance */}
        <div className="bg-amber-50 dark:bg-navy-900 rounded-3xl p-6 sm:p-8 border border-amber-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400 flex-shrink-0" />
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              {t.upi.failedTransactionsTitle}
            </h3>
          </div>

          <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
            {t.upi.failedTransactionsDesc}
          </p>

          <div className="pt-2 flex items-center gap-4">
            <Link
              to="/emergency"
              className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              {language === 'mr' ? 'बँकेचे टोल-फ्री क्रमांक पहा' : language === 'hi' ? 'बैंक टोल-फ्री नंबर देखें' : 'View Bank Emergency Numbers'} →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
