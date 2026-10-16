import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.js';

export const NotFoundPage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="py-24 bg-slate-50 dark:bg-navy-950 min-h-[70vh] flex items-center justify-center text-center px-4">
      <div className="max-w-md space-y-6">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/20 text-amber-500 flex items-center justify-center">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">
          404 — Page Not Found
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          The requested page does not exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.common.backToHome}</span>
        </Link>
      </div>
    </div>
  );
};
