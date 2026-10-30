import React from 'react';
import { useT } from '../i18n/useT';
import { trackLanguageChange } from '../analytics/ga4';

export const LangToggle: React.FC = () => {
  const { lang, setLang } = useT();

  const handleLangChange = (nextLang: 'bn' | 'en') => {
    setLang(nextLang);
    trackLanguageChange(nextLang);
  };

  return (
    <div
      className="lang-toggle-group"
      role="group"
      aria-label="Language toggle"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        backgroundColor: 'var(--color-hairline-soft)',
        border: '1px solid var(--color-hairline)',
        borderRadius: 'var(--radius-full)',
        padding: '3px',
      }}
    >
      <button
        type="button"
        lang="bn"
        className="lang-toggle-btn"
        aria-pressed={lang === 'bn'}
        onClick={() => handleLangChange('bn')}
        style={{
          border: 'none',
          borderRadius: 'var(--radius-full)',
          padding: '6px 16px',
          fontSize: '13px',
          fontWeight: lang === 'bn' ? 600 : 500,
          backgroundColor: lang === 'bn' ? 'var(--color-button-primary-bg)' : 'transparent',
          color: lang === 'bn' ? 'var(--color-button-primary-text)' : 'var(--color-ink-muted)',
          cursor: 'pointer',
          transition: 'all 0.15s ease',
          lineHeight: 1.2,
          minHeight: '32px',
        }}
      >
        বাংলা
      </button>
      <button
        type="button"
        lang="en"
        className="lang-toggle-btn"
        aria-pressed={lang === 'en'}
        onClick={() => handleLangChange('en')}
        style={{
          border: 'none',
          borderRadius: 'var(--radius-full)',
          padding: '6px 16px',
          fontSize: '13px',
          fontWeight: lang === 'en' ? 600 : 500,
          backgroundColor: lang === 'en' ? 'var(--color-button-primary-bg)' : 'transparent',
          color: lang === 'en' ? 'var(--color-button-primary-text)' : 'var(--color-ink-muted)',
          cursor: 'pointer',
          transition: 'all 0.15s ease',
          lineHeight: 1.2,
          minHeight: '32px',
        }}
      >
        English
      </button>
    </div>
  );
};

