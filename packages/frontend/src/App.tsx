import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext.js';
import { VoiceProvider } from './context/VoiceContext.js';
import { AuthProvider } from './context/AuthContext.js';
import { EmergencyBanner } from './components/layout/EmergencyBanner.js';
import { Navbar } from './components/layout/Navbar.js';
import { VoiceControlBar } from './components/layout/VoiceControlBar.js';
import { Footer } from './components/layout/Footer.js';

// Pages
import { HomePage } from './pages/HomePage.js';
import { SmartphoneGuidePage } from './pages/SmartphoneGuidePage.js';
import { FraudLibraryPage } from './pages/FraudLibraryPage.js';
import { TopicDetailPage } from './pages/TopicDetailPage.js';
import { UpiSafetyPage } from './pages/UpiSafetyPage.js';
import { ScenariosPage } from './pages/ScenariosPage.js';
import { QuizListPage } from './pages/QuizListPage.js';
import { QuizActivePage } from './pages/QuizActivePage.js';
import { EmergencyHelpPage } from './pages/EmergencyHelpPage.js';
import { CommunityPage } from './pages/CommunityPage.js';
import { AboutPage } from './pages/AboutPage.js';
import { AdminLoginPage } from './pages/AdminLoginPage.js';
import { AdminDashboardPage } from './pages/AdminDashboardPage.js';
import { NotFoundPage } from './pages/NotFoundPage.js';

export function App() {
  return (
    <LanguageProvider>
      <VoiceProvider>
        <AuthProvider>
          <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 dark:bg-navy-950 dark:text-slate-100 font-sans selection:bg-emerald-500 selection:text-white transition-colors">
            {/* 1930 Emergency Banner */}
            <EmergencyBanner />

            {/* Navigation Header */}
            <Navbar />

            {/* Main Application Routes */}
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/smartphone-guide" element={<SmartphoneGuidePage />} />
                <Route path="/library" element={<FraudLibraryPage />} />
                <Route path="/library/:slug" element={<TopicDetailPage />} />
                <Route path="/upi-safety" element={<UpiSafetyPage />} />
                <Route path="/scenarios" element={<ScenariosPage />} />
                <Route path="/quiz" element={<QuizListPage />} />
                <Route path="/quiz/:slug" element={<QuizActivePage />} />
                <Route path="/emergency" element={<EmergencyHelpPage />} />
                <Route path="/community" element={<CommunityPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/admin/login" element={<AdminLoginPage />} />
                <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>

            {/* Floating Voice Guidance Bar */}
            <VoiceControlBar />

            {/* Footer with CEP attribution & helplines */}
            <Footer />
          </div>
        </AuthProvider>
      </VoiceProvider>
    </LanguageProvider>
  );
}

export default App;
