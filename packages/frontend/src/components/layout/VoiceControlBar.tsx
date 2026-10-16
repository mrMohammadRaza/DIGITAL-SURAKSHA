import React from 'react';
import { Volume2, VolumeX, Pause, Play, Square } from 'lucide-react';
import { useVoice } from '../../context/VoiceContext.js';
import { useLanguage } from '../../context/LanguageContext.js';

export const VoiceControlBar: React.FC = () => {
  const { isSpeaking, isPaused, isSupported, pause, resume, stop, currentText } = useVoice();
  const { t } = useLanguage();

  if (!isSupported) return null;

  // Only render floating player if audio is active or was paused
  if (!isSpeaking && !isPaused && !currentText) return null;

  return (
    <aside
      aria-label="Voice guidance control bar"
      className="fixed bottom-4 right-4 z-50 max-w-sm w-[calc(100%-2rem)] bg-navy-900/95 backdrop-blur-md text-white rounded-2xl shadow-2xl border border-emerald-500/40 p-3.5 transition-all animate-in slide-in-from-bottom-5"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-9 h-9 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 border border-emerald-500/30">
            {isSpeaking && !isPaused ? (
              <Volume2 className="w-5 h-5 animate-pulse" />
            ) : (
              <VolumeX className="w-5 h-5 text-slate-400" />
            )}
          </div>
          <div className="truncate">
            <p className="text-xs font-semibold text-emerald-400">
              {isSpeaking && !isPaused ? t.voice.speaking : t.voice.paused}
            </p>
            <p className="text-xs text-slate-300 truncate max-w-[180px]">
              {currentText || t.voice.title}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          {isSpeaking && !isPaused ? (
            <button
              onClick={pause}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 transition-colors"
              title={t.voice.pause}
              aria-label={t.voice.pause}
            >
              <Pause className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={resume}
              className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
              title={t.voice.resume}
              aria-label={t.voice.resume}
            >
              <Play className="w-4 h-4 fill-current" />
            </button>
          )}

          <button
            onClick={stop}
            className="p-2 rounded-xl bg-slate-800 hover:bg-red-900/60 text-red-400 transition-colors"
            title={t.voice.stop}
            aria-label={t.voice.stop}
          >
            <Square className="w-4 h-4 fill-current" />
          </button>
        </div>
      </div>
    </aside>
  );
};
