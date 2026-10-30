// @vitest-environment jsdom
import React from 'react';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { ThemeProvider, useTheme } from '../src/theme/ThemeContext';
import { ThemeToggle } from '../src/components/ThemeToggle';
import { I18nProvider } from '../src/i18n/useT';

describe('Theme management tests', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  afterEach(() => {
    cleanup();
  });

  it('initializes with light mode if no localStorage is set', () => {
    const TestComponent = () => {
      const { theme } = useTheme();
      return <div data-testid="theme-val">{theme}</div>;
    };

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme-val').textContent).toBe('light');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('respects stored theme from localStorage', () => {
    localStorage.setItem('busroute_theme', 'dark');

    const TestComponent = () => {
      const { theme } = useTheme();
      return <div data-testid="theme-val">{theme}</div>;
    };

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme-val').textContent).toBe('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('toggles theme when clicking ThemeToggle button', () => {
    render(
      <I18nProvider initialLang="bn">
        <ThemeProvider>
          <ThemeToggle />
        </ThemeProvider>
      </I18nProvider>
    );

    const button = screen.getByRole('button');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');

    // Toggle to dark
    fireEvent.click(button);
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(localStorage.getItem('busroute_theme')).toBe('dark');

    // Toggle back to light
    fireEvent.click(button);
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    expect(localStorage.getItem('busroute_theme')).toBe('light');
  });
});

