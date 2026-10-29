import React, { createContext, useContext, useState, useEffect } from 'react';
import bn from './bn.json';
import en from './en.json';

export type Lang = 'bn' | 'en';
export type TranslationKey = keyof typeof bn;

interface I18nContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: TranslationKey) => string;
}

const translations: Record<Lang, Record<TranslationKey, string>> = {
  bn,
  en,
};

const I18nContext = createContext<I18nContextValue>({
  lang: 'bn',
  setLang: () => {},
  t: (key) => bn[key],
});

const BENGALI_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

export function formatNumber(num: number, lang: Lang): string {
  if (lang === 'en') return String(num);
  return String(num).replace(/\d/g, (d) => BENGALI_DIGITS[Number(d)]);
}

export function I18nProvider({
  children,
  initialLang = 'bn',
}: {
  children: React.ReactNode;
  initialLang?: Lang;
}) {
  const [lang, setLangState] = useState<Lang>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlLang = params.get('lang');
      if (urlLang === 'en' || urlLang === 'bn') return urlLang;
    }
    return initialLang;
  });

  const setLang = (next: Lang) => {
    setLangState(next);
    if (typeof document !== 'undefined') {
      document.documentElement.lang = next;
    }
  };

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
    }
  }, [lang]);

  const t = (key: TranslationKey): string => {
    return translations[lang][key] ?? bn[key] ?? key;
  };

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useT() {
  return useContext(I18nContext);
}
