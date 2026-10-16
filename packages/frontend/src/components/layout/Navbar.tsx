import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Menu, X, Globe, Smartphone, BookOpen, CreditCard, HelpCircle, CheckSquare, Users, Lock } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext.js';
import { Language } from '@digital-suraksha/shared';

export const Navbar: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { path: '/', label: t.nav.home, icon: Shield },
    { path: '/smartphone-guide', label: t.nav.smartphoneGuide, icon: Smartphone },
    { path: '/library', label: t.nav.fraudLibrary, icon: BookOpen },
    { path: '/upi-safety', label: t.nav.upiSafety, icon: CreditCard },
    { path: '/scenarios', label: t.nav.scenarios, icon: CheckSquare },
    { path: '/quiz', label: t.nav.quiz, icon: HelpCircle },
    { path: '/community', label: t.nav.community, icon: Users },
  ];

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
  };

  return (
    <header className="sticky top-0 z-40 bg-navy-900/95 backdrop-blur-md border-b border-slate-800 text-white transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-emerald-400 rounded-lg p-1"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-900/50 flex-shrink-0">
              <Shield className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white block leading-tight">
                {language === 'mr' ? 'डिजिटल सुरक्षा' : language === 'hi' ? 'डिजिटल सुरक्षा' : 'Digital Suraksha'}
              </span>
              <span className="text-[11px] sm:text-xs text-emerald-400 font-semibold tracking-wide uppercase block">
                Rural Cyber Safety (CEP)
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/30 font-semibold'
                      : 'text-slate-200 hover:text-white hover:bg-slate-800/80'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Language Switcher & Admin Link */}
          <div className="hidden sm:flex items-center gap-2">
            <div className="flex items-center bg-slate-800/90 rounded-xl p-1 border border-slate-700">
              <Globe className="w-4 h-4 text-emerald-400 ml-1.5 mr-1" />
              <button
                onClick={() => handleLanguageChange('hi')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  language === 'hi'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="हिन्दी में देखें"
              >
                हिन्दी
              </button>
              <button
                onClick={() => handleLanguageChange('mr')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  language === 'mr'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="मराठीत पहा"
              >
                मराठी
              </button>
              <button
                onClick={() => handleLanguageChange('en')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  language === 'en'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="View in English"
              >
                English
              </button>
            </div>

            <Link
              to="/admin/login"
              className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
              title={t.nav.admin}
              aria-label={t.nav.admin}
            >
              <Lock className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 lg:hidden">
            <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700">
              <button
                onClick={() => handleLanguageChange('hi')}
                className={`px-2 py-1 rounded text-xs font-medium ${language === 'hi' ? 'bg-emerald-600 text-white' : 'text-slate-300'}`}
              >
                हि
              </button>
              <button
                onClick={() => handleLanguageChange('mr')}
                className={`px-2 py-1 rounded text-xs font-medium ${language === 'mr' ? 'bg-emerald-600 text-white' : 'text-slate-300'}`}
              >
                म
              </button>
              <button
                onClick={() => handleLanguageChange('en')}
                className={`px-2 py-1 rounded text-xs font-medium ${language === 'en' ? 'bg-emerald-600 text-white' : 'text-slate-300'}`}
              >
                EN
              </button>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-slate-800 text-slate-200 hover:text-white hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-navy-950 px-4 pt-2 pb-6 space-y-1 animate-in slide-in-from-top-3">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl text-base font-medium transition-colors ${
                  isActive
                    ? 'bg-emerald-600 text-white font-semibold'
                    : 'text-slate-200 hover:bg-slate-900'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Icon className="w-5 h-5 text-emerald-400" />
                <span>{link.label}</span>
              </Link>
            );
          })}

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-sm">
            <Link
              to="/about"
              className="text-slate-400 hover:text-white"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t.nav.about}
            </Link>
            <Link
              to="/admin/login"
              className="flex items-center gap-1.5 text-slate-400 hover:text-emerald-400"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Lock className="w-4 h-4" />
              <span>{t.nav.admin}</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
