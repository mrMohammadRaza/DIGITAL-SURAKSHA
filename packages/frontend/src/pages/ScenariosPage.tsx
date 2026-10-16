import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext.js';
import { api } from '../services/apiClient.js';
import { Scenario } from '@digital-suraksha/shared';
import { ScenarioCard } from '../components/scenarios/ScenarioCard.js';
import { CheckSquare, Sparkles, HelpCircle } from 'lucide-react';
import { VoicePlayButton } from '../components/common/VoicePlayButton.js';

export const ScenariosPage: React.FC = () => {
  const { language, t } = useLanguage();
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchScenarios = async () => {
      try {
        const data = await api.getScenarios();
        setScenarios(data);
      } catch (err) {
        console.error('Failed to load scenarios:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchScenarios();
  }, []);

  const pageTitle =
    language === 'mr'
      ? 'सुरक्षित vs धोकादायक प्रसंग सराव'
      : language === 'hi'
      ? 'सुरक्षित vs असुरक्षित स्थिति अभ्यास'
      : 'Safe vs Unsafe Scenarios Practice';

  const pageSubtitle =
    language === 'mr'
      ? 'वास्तविक जीवनातील फोन कॉल आणि मेसेज सुरक्षित आहेत की फसवणूक हे ओळखण्याचा सराव करा.'
      : language === 'hi'
      ? 'वास्तविक जीवन में आने वाले फोन कॉल्स और संदेशों में से सुरक्षित और धोखाधड़ी को पहचानें।'
      : 'Practice distinguishing between legitimate requests and cyber scam traps in realistic scenarios.';

  return (
    <div className="py-12 sm:py-16 bg-slate-50 dark:bg-navy-950 min-h-screen transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <CheckSquare className="w-4 h-4" />
            <span>Module E • सजीव प्रसंग अभ्यास</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            {pageTitle}
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            {pageSubtitle}
          </p>

          <VoicePlayButton text={`${pageTitle}. ${pageSubtitle}`} label={t.voice.play} />
        </div>

        {/* Scenarios List */}
        {isLoading ? (
          <div className="space-y-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-64 rounded-3xl bg-slate-200 dark:bg-navy-900 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-8">
            {scenarios.map((scenario) => (
              <ScenarioCard key={scenario.id} scenario={scenario} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
