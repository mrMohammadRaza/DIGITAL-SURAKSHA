import React from 'react';
import { useLanguage } from '../context/LanguageContext.js';
import { BookOpen, Target, Cpu, CheckCircle2, AlertCircle, Shield } from 'lucide-react';
import { VoicePlayButton } from '../components/common/VoicePlayButton.js';

export const AboutPage: React.FC = () => {
  const { language } = useLanguage();

  return (
    <div className="py-12 sm:py-16 bg-slate-50 dark:bg-navy-950 min-h-screen transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <BookOpen className="w-4 h-4" />
            <span>Module K • शैक्षणिक प्रकल्प माहिती</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            {language === 'mr' ? 'प्रकल्पाची पार्श्वभूमी आणि उद्दिष्टे' : language === 'hi' ? 'परियोजना की पृष्ठभूमि एवं उद्देश्य' : 'Project Background & Architecture'}
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            Community Engagement Project (CEP) on Online Fraud Awareness & Digital Literacy for Rural India.
          </p>

          <VoicePlayButton
            text="Digital Suraksha is a college community engagement project built to empower rural communities against online fraud and cyber crimes."
          />
        </div>

        {/* Problem Statement */}
        <div className="bg-white dark:bg-navy-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-red-500" />
            <span>1. Problem Statement (समस्या कथन)</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
            With the rapid adoption of smartphones, UPI, and cheap 4G/5G internet across rural and semi-urban India, millions of first-time digital users, farmers, elderly citizens, and rural women have entered the digital economy. However, lack of foundational cybersecurity awareness has made them primary targets for organized cyber fraud networks. Deceptions such as fake bank calls, OTP theft, screen-sharing malware (AnyDesk), and "PIN to receive money" UPI scams lead to devastating financial loss.
          </p>
        </div>

        {/* Project Objectives */}
        <div className="bg-white dark:bg-navy-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            <span>2. Project Objectives & Scope</span>
          </h2>
          <ul className="space-y-2.5 text-sm sm:text-base text-slate-700 dark:text-slate-300">
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
              <span><strong>Trilingual Accessibility:</strong> Provide genuine, localized curriculum in Hindi, Marathi, and English with browser Web Speech synthesis for citizens who struggle with reading text.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
              <span><strong>Interactive Scenarios & Quizzes:</strong> Validate user decision-making with tamper-proof server-side scoring and actionable explanations.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
              <span><strong>Community Fieldwork Kit:</strong> Equip student teams with printable checklists, 45-minute workshop plans, and ethical survey tools.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
              <span><strong>Emergency Preparedness:</strong> Educate on the 1930 National Cybercrime Helpline and the critical 1-2 hour "Golden Hour" fund freezing mechanism.</span>
            </li>
          </ul>
        </div>

        {/* Tech Stack */}
        <div className="bg-white dark:bg-navy-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-blue-500" />
            <span>3. Technology Stack & Engineering Design</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 space-y-1">
              <strong className="block text-slate-900 dark:text-white">Frontend:</strong>
              <p className="text-slate-600 dark:text-slate-400">React 18, TypeScript, Vite, Tailwind CSS, Lucide icons, Web Speech Synthesis API.</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 space-y-1">
              <strong className="block text-slate-900 dark:text-white">Backend:</strong>
              <p className="text-slate-600 dark:text-slate-400">Node.js, Express, TypeScript, Zod validation, JWT session cookies, rate limiting.</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 space-y-1">
              <strong className="block text-slate-900 dark:text-white">Database:</strong>
              <p className="text-slate-600 dark:text-slate-400">Prisma ORM, PostgreSQL (production / Docker) + SQLite (zero-config local dev).</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 space-y-1">
              <strong className="block text-slate-900 dark:text-white">Testing & CI:</strong>
              <p className="text-slate-600 dark:text-slate-400">Vitest, React Testing Library, Supertest, Playwright E2E, GitHub Actions.</p>
            </div>
          </div>
        </div>

        {/* Limitations & Future Work */}
        <div className="bg-slate-100 dark:bg-navy-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold">
            <AlertCircle className="w-5 h-5 text-amber-500" />
            <span>4. Limitations & Scope Boundaries</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            This platform is an educational awareness prototype created for college project demonstration and community outreach. It does not interface directly with bank core networks or police databases, and speech synthesis quality depends on the voices installed on the user’s operating system.
          </p>
        </div>
      </div>
    </div>
  );
};
