import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import React from 'react';
import { LanguageProvider, useLanguage } from '../context/LanguageContext.js';

const LanguageTestComponent = () => {
  const { language, setLanguage, t } = useLanguage();
  return (
    <div>
      <span data-testid="current-lang">{language}</span>
      <h1 data-testid="home-nav">{t.nav.home}</h1>
      <button data-testid="switch-en" onClick={() => setLanguage('en')}>
        English
      </button>
      <button data-testid="switch-mr" onClick={() => setLanguage('mr')}>
        मराठी
      </button>
      <button data-testid="switch-hi" onClick={() => setLanguage('hi')}>
        हिन्दी
      </button>
    </div>
  );
};

describe('Language Switching & Localization Suite', () => {
  it('should default to Hindi and update UI text dynamically when switched', () => {
    render(
      <LanguageProvider>
        <LanguageTestComponent />
      </LanguageProvider>
    );

    // Initial default should be Hindi
    expect(screen.getByTestId('current-lang').textContent).toBe('hi');
    expect(screen.getByTestId('home-nav').textContent).toBe('मुख्य पृष्ठ');

    // Switch to English
    fireEvent.click(screen.getByTestId('switch-en'));
    expect(screen.getByTestId('current-lang').textContent).toBe('en');
    expect(screen.getByTestId('home-nav').textContent).toBe('Home');

    // Switch to Marathi
    fireEvent.click(screen.getByTestId('switch-mr'));
    expect(screen.getByTestId('current-lang').textContent).toBe('mr');
    expect(screen.getByTestId('home-nav').textContent).toBe('मुख्य पान');
  });
});
