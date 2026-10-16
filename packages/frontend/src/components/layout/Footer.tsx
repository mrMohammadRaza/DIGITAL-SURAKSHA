import React from 'react';
import { Shield, ExternalLink, Heart, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext.js';
import { APP_CONFIG } from '@digital-suraksha/shared';

export const Footer: React.FC = () => {
  const { language, t } = useLanguage();

  return (
    <footer className="bg-navy-950 text-slate-300 border-t border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Purpose */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white">
                <Shield className="w-6 h-6" />
              </div>
              <span className="font-extrabold text-xl text-white">
                {language === 'mr' ? 'डिजिटल सुरक्षा' : language === 'hi' ? 'डिजिटल सुरक्षा' : 'Digital Suraksha'}
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-md">
              {language === 'mr'
                ? 'ग्रामीण भागातील नागरिक, शेतकरी आणि महिलांमध्ये सायबर सुरक्षिततेची जनजागृती निर्माण करण्यासाठी तयार केलेला महाविद्यालयीन सामाजिक प्रकल्प (College Community Engagement Project - CEP).'
                : language === 'hi'
                ? 'ग्रामीण नागरिकों, किसानों और पहली बार स्मार्टफोन चलाने वालों में साइबर सुरक्षा जागरूकता फैलाने के लिए कॉलेज सामुदायिक सहभागिता परियोजना (CEP)।'
                : 'A college Community Engagement Project (CEP) dedicated to educating rural villagers, farmers, seniors, and first-time smartphone users on digital payment security and cyber fraud prevention.'}
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>College CEP Project | Built for Public Cyber Literacy</span>
            </div>
          </div>

          {/* Quick Learning Links */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              {language === 'mr' ? 'महत्त्वाचे धडे' : language === 'hi' ? 'मुख्य विषय' : 'Safety Guides'}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/smartphone-guide" className="hover:text-emerald-400 transition-colors">
                  {t.nav.smartphoneGuide}
                </Link>
              </li>
              <li>
                <Link to="/library" className="hover:text-emerald-400 transition-colors">
                  {t.nav.fraudLibrary}
                </Link>
              </li>
              <li>
                <Link to="/upi-safety" className="hover:text-emerald-400 transition-colors">
                  {t.nav.upiSafety}
                </Link>
              </li>
              <li>
                <Link to="/scenarios" className="hover:text-emerald-400 transition-colors">
                  {t.nav.scenarios}
                </Link>
              </li>
              <li>
                <Link to="/quiz" className="hover:text-emerald-400 transition-colors">
                  {t.nav.quiz}
                </Link>
              </li>
              <li>
                <Link to="/community" className="hover:text-emerald-400 transition-colors">
                  {t.nav.community}
                </Link>
              </li>
            </ul>
          </div>

          {/* Official Helplines & Verification */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              {language === 'mr' ? 'अधिकृत पोर्टल' : language === 'hi' ? 'सरकारी पोर्टल' : 'Official Portals'}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="tel:1930"
                  className="inline-flex items-center gap-1.5 text-amber-300 hover:text-amber-200 font-semibold"
                >
                  <span>1930 Cyber Helpline</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </li>
              <li>
                <a
                  href={APP_CONFIG.PORTAL_NATIONAL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-emerald-400"
                >
                  <span>cybercrime.gov.in</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </li>
              <li>
                <a
                  href={APP_CONFIG.SACHET_PORTAL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-emerald-400"
                >
                  <span>RBI Sachet Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </li>
              <li>
                <a
                  href={APP_CONFIG.CHAKSHU_PORTAL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-emerald-400"
                >
                  <span>DoT Chakshu Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer & Copyright */}
        <div className="mt-10 pt-6 border-t border-slate-800 text-xs text-slate-400 space-y-3">
          <div className="flex items-start gap-2 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
            <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Disclaimer:</strong> Digital Suraksha is an educational community initiative developed as an academic project. This platform NEVER asks for ATM PINs, UPI PINs, passwords, or bank OTPs. It does not represent or impersonate any government agency or law enforcement department.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-slate-400 pt-2">
            <p>© {new Date().getFullYear()} Digital Suraksha — College Community Engagement Project (CEP).</p>
            <p className="flex items-center gap-1">
              Made with <Heart className="w-3.5 h-3.5 text-red-500 fill-current" /> for rural digital literacy.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
