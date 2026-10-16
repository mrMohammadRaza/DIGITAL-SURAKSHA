import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock window.speechSynthesis
Object.defineProperty(window, 'speechSynthesis', {
  writable: true,
  value: {
    speak: vi.fn(),
    cancel: vi.fn(),
    pause: vi.fn(),
    resume: vi.fn(),
    getVoices: vi.fn().mockReturnValue([
      { name: 'Google हिन्दी', lang: 'hi-IN', default: true },
      { name: 'Google English', lang: 'en-IN', default: false },
    ]),
    onvoiceschanged: null,
  },
});

// Mock SpeechSynthesisUtterance
(global as any).SpeechSynthesisUtterance = vi.fn().mockImplementation((text) => ({
  text,
  lang: 'hi-IN',
  rate: 1.0,
  pitch: 1.0,
  voice: null,
  onstart: null,
  onend: null,
  onerror: null,
}));
