import React from 'react';
import { useLanguage } from '../context/LanguageContext.js';
import { Smartphone, Lock, ShieldCheck, AlertOctagon, KeyRound, RefreshCw, EyeOff, ShieldAlert, Sparkles } from 'lucide-react';
import { VoicePlayButton } from '../components/common/VoicePlayButton.js';
import { Link } from 'react-router-dom';

export const SmartphoneGuidePage: React.FC = () => {
  const { language, t } = useLanguage();

  const getStepIcon = (idx: number) => {
    switch (idx) {
      case 0:
        return <Lock className="w-6 h-6 text-emerald-500" />;
      case 1:
        return <ShieldCheck className="w-6 h-6 text-blue-500" />;
      case 2:
        return <EyeOff className="w-6 h-6 text-purple-500" />;
      case 3:
        return <AlertOctagon className="w-6 h-6 text-red-500" />;
      case 4:
        return <KeyRound className="w-6 h-6 text-teal-500" />;
      case 5:
        return <RefreshCw className="w-6 h-6 text-amber-500" />;
      default:
        return <Smartphone className="w-6 h-6 text-emerald-500" />;
    }
  };

  return (
    <div className="py-12 sm:py-16 bg-slate-50 dark:bg-navy-950 min-h-screen transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Smartphone className="w-4 h-4" />
            <span>Module B • स्मार्टफोन सुरक्षा गाइड</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            {t.mobileGuide.pageTitle}
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            {t.mobileGuide.pageSubtitle}
          </p>

          <VoicePlayButton
            text={`${t.mobileGuide.pageTitle}. ${t.mobileGuide.pageSubtitle}`}
            label={t.voice.play}
            className="mt-2"
          />
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {t.mobileGuide.steps.map((step, idx) => (
            <div
              key={step.id}
              className="bg-white dark:bg-navy-900 rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-navy-800 flex items-center justify-center border border-slate-200 dark:border-slate-700 shadow-sm">
                    {getStepIcon(idx)}
                  </div>
                  <span className="text-2xl font-black text-slate-300 dark:text-slate-700">
                    0{idx + 1}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-snug">
                  {step.title}
                </h3>

                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {step.desc}
                </p>

                {/* Practical Tip Callout */}
                <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/60 text-xs text-emerald-900 dark:text-emerald-200 font-medium">
                  <strong>
                    {language === 'mr' ? 'कसे करावे:' : language === 'hi' ? 'कैसे करें:' : 'How to do:'}{' '}
                  </strong>
                  {step.tip}
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <VoicePlayButton text={`${step.title}. ${step.desc}. ${step.tip}`} />
              </div>
            </div>
          ))}
        </div>

        {/* Remote Access App Warning Box */}
        <div className="bg-gradient-to-br from-red-900/90 to-rose-950 text-white rounded-3xl p-6 sm:p-10 border border-red-700/50 shadow-xl space-y-4">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-8 h-8 text-amber-300 flex-shrink-0 animate-pulse" />
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              {language === 'mr'
                ? 'सतर्कतेचा इशारा: AnyDesk किंवा QuickSupport कधीही डाऊनलोड करू नका!'
                : language === 'hi'
                ? 'सावधानी चेतावनी: AnyDesk या QuickSupport ऐप कभी भी इंस्टॉल न करें!'
                : 'CRITICAL ALERT: Never install AnyDesk or QuickSupport on phone instruction!'}
            </h2>
          </div>

          <p className="text-sm sm:text-base text-red-100 leading-relaxed max-w-4xl">
            {language === 'mr'
              ? 'हे अॅप्स रिमोट कंट्रोल अॅप्स असतात. कॉलरच्या सांगण्यावरून हे अॅप इन्स्टॉल केल्यास तो तुमच्या मोबाईलचा स्क्रीन थेट पाहू शकतो आणि बँक पासवर्ड व ओटीपी चोरून पैसे लंपास करू शकतो.'
              : language === 'hi'
              ? 'ये स्क्रीन शेयरिंग ऐप्स होते हैं। कॉलर के कहने पर इन्हें इंस्टॉल करने से ठग आपके पूरे फोन की स्क्रीन लाइव देखने लगता है और आपके बैंक का गुप्त पासवर्ड व ओटीपी चुराकर खाते को साफ कर देता है।'
              : 'These are screen-sharing and remote-control applications. When installed at a caller’s insistence, they provide a 100% live view of your screen, exposing your banking passwords, UPI PINs, and incoming SMS OTPs directly to cyber criminals.'}
          </p>

          <div className="pt-2">
            <Link
              to="/library/screen-sharing-fraud"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-red-900 font-bold text-sm hover:bg-amber-100 transition-colors"
            >
              <span>{language === 'mr' ? 'सविस्तर धोका समजून घ्या' : language === 'hi' ? 'खतरे की पूरी जानकारी पढ़ें' : 'Read Full Threat Analysis'}</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
