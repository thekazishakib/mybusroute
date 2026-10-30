import React from 'react';
import { useTheme } from '../theme/ThemeContext';
import { useT } from '../i18n/useT';
import { SunIcon, MoonIcon } from './Icons';
import { trackThemeChange } from '../analytics/ga4';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { lang } = useT();

  const handleToggle = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    toggleTheme();
    trackThemeChange(nextTheme);
  };

  const isDark = theme === 'dark';
  const label = isDark
    ? lang === 'bn'
      ? 'লাইট মোডে পরিবর্তন করুন'
      : 'Switch to light mode'
    : lang === 'bn'
      ? 'ডার্ক মোডে পরিবর্তন করুন'
      : 'Switch to dark mode';

  return (
    <button
      type="button"
      onClick={handleToggle}
      title={label}
      aria-label={label}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '34px',
        height: '34px',
        borderRadius: 'var(--radius-full)',
        backgroundColor: 'var(--color-hairline-soft)',
        border: '1px solid var(--color-hairline)',
        color: 'var(--color-ink)',
        cursor: 'pointer',
        transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        padding: 0,
        flexShrink: 0,
      }}
    >
      {isDark ? <SunIcon size={16} /> : <MoonIcon size={16} />}
    </button>
  );
};

