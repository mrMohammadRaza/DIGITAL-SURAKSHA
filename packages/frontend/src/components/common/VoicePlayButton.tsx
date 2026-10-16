import React from 'react';
import { Volume2, VolumeX, Pause } from 'lucide-react';
import { useVoice } from '../../context/VoiceContext.js';
import { useLanguage } from '../../context/LanguageContext.js';

interface VoicePlayButtonProps {
  text: string;
  label?: string;
  className?: string;
}

export const VoicePlayButton: React.FC<VoicePlayButtonProps> = ({ text, label, className = '' }) => {
  const { isSpeaking, isPaused, isSupported, speak, pause, currentText } = useVoice();
  const { t } = useLanguage();

  if (!isSupported) return null;

  const isCurrentActive = isSpeaking && currentText === text.replace(/[#*_`[\]()]/g, ' ').replace(/\s+/g, ' ').trim();

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCurrentActive) {
      if (isPaused) {
        speak(text);
      } else {
        pause();
      }
    } else {
      speak(text);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium text-xs transition-all border ${
        isCurrentActive
          ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm animate-pulse'
          : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
      } ${className}`}
      title={label || t.voice.play}
      aria-label={label || t.voice.play}
    >
      {isCurrentActive && !isPaused ? (
        <>
          <Pause className="w-3.5 h-3.5" />
          <span>{t.voice.pause}</span>
        </>
      ) : isCurrentActive && isPaused ? (
        <>
          <Volume2 className="w-3.5 h-3.5" />
          <span>{t.voice.resume}</span>
        </>
      ) : (
        <>
          <Volume2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>{label || t.voice.play}</span>
        </>
      )}
    </button>
  );
};
