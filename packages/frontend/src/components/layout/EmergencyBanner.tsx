import React from 'react';
import { PhoneCall, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext.js';
import { Link } from 'react-router-dom';

export const EmergencyBanner: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white shadow-md border-b border-red-800">
      <div className="max-w-7xl mx-auto px-4 py-2 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm font-medium">
        <div className="flex items-center gap-2 text-center sm:text-left">
          <span className="bg-white/20 p-1 rounded-full animate-pulse flex-shrink-0">
            <AlertTriangle className="w-4 h-4 text-amber-300" />
          </span>
          <div>
            <span className="font-extrabold tracking-wide uppercase mr-2 text-amber-200">
              {t.emergencyBanner.alert}
            </span>
            <span>{t.emergencyBanner.goldenHour}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <a
            href="tel:1930"
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-white text-red-700 font-bold rounded-full hover:bg-amber-100 transition-colors shadow-sm text-xs sm:text-sm focus:ring-2 focus:ring-amber-300"
            title="Call 1930 Cyber Helpline"
          >
            <PhoneCall className="w-3.5 h-3.5 animate-bounce" />
            <span>Call 1930</span>
          </a>

          <Link
            to="/emergency"
            className="inline-flex items-center gap-1 px-3 py-1 bg-red-900/60 hover:bg-red-900 text-white rounded-full transition-colors text-xs border border-white/20"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{t.nav.emergency}</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
