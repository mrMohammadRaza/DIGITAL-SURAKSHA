import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { LanguageProvider } from '../context/LanguageContext.js';
import { VoiceProvider, useVoice } from '../context/VoiceContext.js';
import { VoicePlayButton } from '../components/common/VoicePlayButton.js';

const VoiceTestComponent = () => {
  const { isSupported } = useVoice();
  return (
    <div>
      <span data-testid="voice-supported">{isSupported ? 'YES' : 'NO'}</span>
      <VoicePlayButton text="UPI PIN is only for sending money" label="Listen" />
    </div>
  );
};

describe('Voice Guidance & Speech Synthesis Suite', () => {
  it('should detect SpeechSynthesis and trigger speak when play button is clicked', () => {
    render(
      <LanguageProvider>
        <VoiceProvider>
          <VoiceTestComponent />
        </VoiceProvider>
      </LanguageProvider>
    );

    expect(screen.getByTestId('voice-supported').textContent).toBe('YES');

    const button = screen.getByRole('button', { name: /listen/i });
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(window.speechSynthesis.speak).toHaveBeenCalled();
  });
});
