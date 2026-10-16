import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useLanguage } from './LanguageContext.js';

interface VoiceContextType {
  isSpeaking: boolean;
  isPaused: boolean;
  isSupported: boolean;
  currentText: string | null;
  speak: (text: string) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
}

const VoiceContext = createContext<VoiceContextType>({
  isSpeaking: false,
  isPaused: false,
  isSupported: false,
  currentText: null,
  speak: () => {},
  pause: () => {},
  resume: () => {},
  stop: () => {},
});

export const VoiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { language } = useLanguage();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [currentText, setCurrentText] = useState<string | null>(null);
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setIsSupported(true);
      const updateVoices = () => {
        voicesRef.current = window.speechSynthesis.getVoices();
      };
      updateVoices();
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, []);

  const stop = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
      setCurrentText(null);
    }
  };

  const pause = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const resume = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    }
  };

  const speak = (text: string) => {
    if (!isSupported || !text.trim()) return;

    // Clean text of markdown / symbols for clean pronunciation
    const cleanText = text
      .replace(/[#*_`[\]()]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    stop();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.9; // Slightly slower, clear pace for rural beginners & seniors
    utterance.pitch = 1.0;

    // Select suitable voice
    const voices = voicesRef.current.length > 0 ? voicesRef.current : window.speechSynthesis.getVoices();
    let selectedVoice: SpeechSynthesisVoice | undefined;

    if (language === 'hi') {
      selectedVoice = voices.find((v) => v.lang.toLowerCase().includes('hi'));
      utterance.lang = 'hi-IN';
    } else if (language === 'mr') {
      selectedVoice = voices.find((v) => v.lang.toLowerCase().includes('mr')) ||
                      voices.find((v) => v.lang.toLowerCase().includes('hi'));
      utterance.lang = 'mr-IN';
    } else {
      selectedVoice = voices.find((v) => v.lang.toLowerCase().includes('en-in')) ||
                      voices.find((v) => v.lang.toLowerCase().includes('en'));
      utterance.lang = 'en-IN';
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
      setCurrentText(cleanText);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
      setCurrentText(null);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setIsPaused(false);
      setCurrentText(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  // Automatically stop speech if user navigates or changes language
  useEffect(() => {
    return () => {
      stop();
    };
  }, [language]);

  return (
    <VoiceContext.Provider
      value={{
        isSpeaking,
        isPaused,
        isSupported,
        currentText,
        speak,
        pause,
        resume,
        stop,
      }}
    >
      {children}
    </VoiceContext.Provider>
  );
};

export const useVoice = () => useContext(VoiceContext);
