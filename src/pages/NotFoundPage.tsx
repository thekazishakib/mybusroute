import React from 'react';
import { Link } from 'react-router-dom';
import { useT } from '../i18n/useT';
import { SEOHead } from '../seo/SEOHead';
import { SearchIcon, BusIcon } from '../components/Icons';

export const NotFoundPage: React.FC = () => {
  const { lang } = useT();

  return (
    <main className="container-wide" style={{ padding: '60px 20px 100px', maxWidth: '720px', margin: '0 auto', textAlign: 'center' }}>
      <SEOHead
        title={lang === 'bn' ? 'পৃষ্ঠাটি পাওয়া যায়নি (৪০৪) — বাসরুট' : 'Page Not Found (404) — BusRoute'}
        description={lang === 'bn' ? 'অনুরোধকৃত পেজটি খুঁজে পাওয়া যায়নি।' : 'The requested transit page does not exist.'}
      />

      <div
        style={{
          width: '80px',
          height: '80px',
          borderRadius: '24px',
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-hairline)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '20px',
          color: 'var(--color-ink)',
        }}
      >
        <BusIcon size={38} />
      </div>

      <div
        style={{
          fontSize: '14px',
          fontWeight: 700,
          color: 'var(--color-ink-muted)',
          letterSpacing: '1px',
          marginBottom: '8px',
        }}
      >
        ERROR 404
      </div>

      <h1
        style={{
          fontSize: '32px',
          fontWeight: 800,
          color: 'var(--color-ink)',
          margin: '0 0 12px 0',
        }}
        lang={lang}
      >
        {lang === 'bn' ? 'কাঙ্ক্ষিত পৃষ্ঠাটি পাওয়া যায়নি' : 'Page Not Found'}
      </h1>

      <p
        style={{
          fontSize: '15px',
          color: 'var(--color-ink-muted)',
          maxWidth: '520px',
          margin: '0 auto 28px auto',
          lineHeight: 1.6,
        }}
        lang={lang}
      >
        {lang === 'bn'
          ? 'আপনি যে পেজটি খুঁজছেন তা হয়তো সরানো হয়েছে বা ঠিকানাটি ভুল। বাসরুটের মূল পেজে গিয়ে যেকোনো বাসের রুট অনুসন্ধান করতে পারেন।'
          : 'The page you are looking for might have been moved or the URL is incorrect. Use the links below to find active bus routes.'}
      </p>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
        <Link
          to="/"
          className="btn-primary"
          style={{ borderRadius: 'var(--radius-full)', padding: '12px 28px', fontSize: '14.5px', gap: '8px' }}
          lang={lang}
        >
          <SearchIcon size={16} color="currentColor" />
          <span>{lang === 'bn' ? 'হোমে রুট খুঁজুন' : 'Search Routes'}</span>
        </Link>

        <Link
          to="/routes"
          className="btn-secondary"
          style={{ borderRadius: 'var(--radius-full)', padding: '12px 28px', fontSize: '14.5px' }}
          lang={lang}
        >
          {lang === 'bn' ? 'সকল বাসের ডিরেক্টরি' : 'All Buses Directory'}
        </Link>
      </div>
    </main>
  );
};

