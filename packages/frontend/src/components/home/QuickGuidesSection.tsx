import React from 'react';
import { Link } from 'react-router-dom';
import { CheckSquare, HelpCircle, Smartphone, Users, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext.js';

export const QuickGuidesSection: React.FC = () => {
  const { t } = useLanguage();

  const cards = [
    {
      to: '/scenarios',
      title: t.home.testSafetyCard,
      desc: t.home.testSafetyDesc,
      icon: CheckSquare,
      color: 'from-blue-600 to-indigo-700',
      badge: 'Interactive',
    },
    {
      to: '/quiz',
      title: t.home.quizCard,
      desc: t.home.quizDesc,
      icon: HelpCircle,
      color: 'from-emerald-600 to-teal-700',
      badge: 'Level 1, 2, 3',
    },
    {
      to: '/smartphone-guide',
      title: t.home.mobileGuideCard,
      desc: t.home.mobileGuideDesc,
      icon: Smartphone,
      color: 'from-amber-600 to-orange-700',
      badge: 'Visual Steps',
    },
    {
      to: '/community',
      title: t.home.villageCepTitle,
      desc: t.home.villageCepSubtitle,
      icon: Users,
      color: 'from-purple-600 to-pink-700',
      badge: 'Workshop Kit',
    },
  ];

  return (
    <section className="py-14 sm:py-20 bg-slate-50 dark:bg-navy-950 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t.home.interactiveToolsTitle}
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400">
            Learn with interactive simulations and easy-to-understand visual guides.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <Link
                key={idx}
                to={card.to}
                className="group relative bg-white dark:bg-navy-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${card.color} text-white flex items-center justify-center shadow-md`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {card.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-emerald-500 transition-colors">
                    {card.title}
                  </h3>

                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {card.desc}
                  </p>
                </div>

                <div className="pt-6 flex items-center text-sm font-bold text-emerald-600 dark:text-emerald-400 group-hover:translate-x-1 transition-transform">
                  <span>Explore Now</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};
