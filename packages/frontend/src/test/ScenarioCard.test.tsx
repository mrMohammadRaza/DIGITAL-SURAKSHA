import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { LanguageProvider } from '../context/LanguageContext.js';
import { ScenarioCard } from '../components/scenarios/ScenarioCard.js';
import { Scenario } from '@digital-suraksha/shared';

const mockScenario: Scenario = {
  id: 'sc-1',
  titleEn: 'Fake Bank Call',
  titleHi: 'फर्जी बैंक कॉल',
  titleMr: 'बनावट बँक कॉल',
  contextEn: 'Phone Call',
  contextHi: 'फोन कॉल',
  contextMr: 'फोन कॉल',
  scenarioTextEn: 'A caller asks for your 6-digit OTP to unblock your card.',
  scenarioTextHi: 'कॉलर आपका कार्ड चालू रखने के लिए 6 अंकों का OTP मांगता है।',
  scenarioTextMr: 'कॉलर तुमचे कार्ड चालू ठेवण्यासाठी ६ अंकी OTP मागतो.',
  isSafe: false, // Unsafe!
  explanationEn: 'Banks never ask for OTPs over phone calls.',
  explanationHi: 'बैंक कभी भी फोन पर OTP नहीं मांगता।',
  explanationMr: 'बँक कधीही फोनवर OTP मागत नाही.',
  recommendationEn: 'Disconnect the call and visit your bank branch.',
  recommendationHi: 'फोन काटें और अपनी बैंक शाखा जाएं।',
  recommendationMr: 'फोन कट करा आणि बँकेत जा.',
};

describe('Interactive Scenario Card Suite', () => {
  it('should render scenario and display instant feedback when user chooses Unsafe', async () => {
    render(
      <BrowserRouter>
        <LanguageProvider>
          <ScenarioCard scenario={mockScenario} />
        </LanguageProvider>
      </BrowserRouter>
    );

    expect(screen.getByText(/फर्जी बैंक कॉल/i)).toBeInTheDocument();

    // Find the UNSAFE button
    const unsafeButton = screen.getByRole('button', { name: /असुरक्षित \/ ठगी/i });
    expect(unsafeButton).toBeInTheDocument();

    fireEvent.click(unsafeButton);

    // Wait for the feedback to appear
    await waitFor(() => {
      expect(screen.getByText(/बिल्कुल सही जवाब/i)).toBeInTheDocument();
      expect(screen.getByText(/बैंक कभी भी फोन पर OTP नहीं मांगता/i)).toBeInTheDocument();
    });
  });
});
