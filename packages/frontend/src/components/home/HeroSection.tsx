import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, BookOpen, HelpCircle, PhoneCall, CheckCircle2, Volume2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext.js';
import { useVoice } from '../../context/VoiceContext.js';

export const HeroSection: React.FC = () => {
  const { t } = useLanguage();
  const { speak, isSupported } = useVoice();

  const handleListenHero = () => {
    speak(`${t.home.heroTitle}. ${t.home.heroSubtitle}. Call 1930 for any cyber emergency.`);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-navy-900 via-navy-950 to-slate-900 text-white pt-12 pb-16 lg:pt-20 lg:pb-24 border-b border-slate-800">
      {/* Decorative gradient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-emerald-500/10 blur-3xl pointer-events-none rounded-full" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs sm:text-sm font-semibold tracking-wide">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>College Community Engagement Project (CEP) • जन-जागरूकता अभियान</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            {t.home.heroTitle}
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-slate-300 leading-relaxed max-w-3xl mx-auto">
            {t.home.heroSubtitle}
          </p>

          {/* Voice Guidance Shortcut */}
          {isSupported && (
            <div className="pt-1">
              <button
                onClick={handleListenHero}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-emerald-300 border border-emerald-500/30 text-sm font-semibold transition-all hover:scale-105"
                title="Listen in your selected language"
              >
                <Volume2 className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span>{t.voice.title} - {t.voice.play}</span>
              </button>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <Link
              to="/library"
              className="px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-base shadow-lg shadow-emerald-900/40 hover:shadow-emerald-900/60 transition-all flex items-center gap-2 transform active:scale-95"
            >
              <BookOpen className="w-5 h-5" />
              <span>{t.home.startLearning}</span>
            </Link>

            <Link
              to="/quiz"
              className="px-6 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-base border border-slate-700 hover:border-slate-600 transition-all flex items-center gap-2 transform active:scale-95"
            >
              <HelpCircle className="w-5 h-5 text-amber-400" />
              <span>{t.home.takeQuiz}</span>
            </Link>

            <Link
              to="/emergency"
              className="px-6 py-3.5 rounded-2xl bg-red-600/90 hover:bg-red-600 text-white font-bold text-base shadow-lg shadow-red-950/50 transition-all flex items-center gap-2 transform active:scale-95"
            >
              <PhoneCall className="w-5 h-5 text-amber-200" />
              <span>{t.home.emergencyHelp}</span>
            </Link>
          </div>

          {/* Trust Guarantees */}
          <div className="pt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto text-xs sm:text-sm text-slate-300">
            <div className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-slate-900/50 border border-slate-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>No Registration Required</span>
            </div>
            <div className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-slate-900/50 border border-slate-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Zero OTP/PIN Collection</span>
            </div>
            <div className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-slate-900/50 border border-slate-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Free Village Workshop Kit</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
