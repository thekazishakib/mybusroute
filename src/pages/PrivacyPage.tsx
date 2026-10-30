import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useT } from '../i18n/useT';
import { SEOHead } from '../seo/SEOHead';
import { ShieldIcon, PrivacyIcon, CalendarIcon, EditIcon } from '../components/Icons';
import { ReportModal } from '../components/ReportModal';

export const PrivacyPage: React.FC = () => {
  const { lang } = useT();
  const [isReportOpen, setIsReportOpen] = useState(false);

  return (
    <main className="container-wide" style={{ padding: '40px 20px 80px', maxWidth: '860px', margin: '0 auto' }}>
      <SEOHead
        title={lang === 'bn' ? 'গোপনীয়তা নীতি (Privacy Policy) — বাসরুট' : 'Privacy Policy — BusRoute Dhaka'}
        description={
          lang === 'bn'
            ? 'বাসরুট প্ল্যাটফর্মের গোপনীয়তা নীতি, ডেটা সুরক্ষা এবং ব্যবহারকারীর তথ্যের নিরাপত্তা সংক্রান্ত নীতিমালা।'
            : 'BusRoute Dhaka privacy policy, data practices, local storage usage, and user protection standards.'
        }
        canonicalPath="/privacy"
      />

      <div style={{ marginBottom: '32px' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-hairline)',
            fontSize: '12.5px',
            fontWeight: 600,
            color: 'var(--color-ink)',
            marginBottom: '16px',
          }}
          lang={lang}
        >
          <PrivacyIcon size={14} color="var(--color-ink)" />
          <span>{lang === 'bn' ? 'আইনি ও গোপনীয়তা বিবরণী' : 'Legal & Privacy Statement'}</span>
        </div>

        <h1
          style={{
            fontSize: '34px',
            fontWeight: 800,
            color: 'var(--color-ink)',
            margin: '0 0 10px 0',
            lineHeight: 1.25,
          }}
          lang={lang}
        >
          {lang === 'bn' ? 'গোপনীয়তা নীতি (Privacy Policy)' : 'Privacy Policy'}
        </h1>

        <p style={{ fontSize: '15px', color: 'var(--color-ink-muted)', margin: 0, lineHeight: 1.6 }} lang={lang}>
          {lang === 'bn'
            ? 'বাসরুট একটি উন্মুক্ত নাগরিক পাবলিক ট্রানজিট সহায়িকা প্ল্যাটফর্ম। আমরা আপনার ব্যক্তিগত গোপনীয়তাকে সর্বোচ্চ গুরুত্ব প্রদান করি।'
            : 'BusRoute is an open civic public transit directory. We are strictly committed to safeguarding your personal privacy.'}
        </p>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          backgroundColor: 'var(--color-surface-raised)',
          border: '1px solid var(--color-hairline)',
          borderRadius: '24px',
          padding: '32px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
        }}
      >
        <section>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-ink)', margin: '0 0 8px 0' }} lang={lang}>
            {lang === 'bn' ? '১. সংগৃহীত তথ্য ও ডেটা প্রক্রিয়া' : '1. Information We Collect'}
          </h2>
          <p style={{ fontSize: '14.5px', color: 'var(--color-ink-muted)', lineHeight: 1.6, margin: 0 }} lang={lang}>
            {lang === 'bn'
              ? 'বাসরুট ব্যবহার করার জন্য কোনো অ্যাকাউন্ট খোলা বা লগইন করার প্রয়োজন নেই। আমরা কোনো ব্যক্তিগত তথ্য যেমন নাম, ফোন নম্বর, ইমেইল, অথবা আর্থিক তথ্য সংগ্রহ বা সংরক্ষণ করি না। বাসের রুট ও স্টপেজ অনুসন্ধান সম্পূর্ণভাবে ব্রাউজারের ক্লায়েন্ট সাইডে প্রক্রিয়াজাত হয়।'
              : 'BusRoute requires no user account or login. We do not collect or store sensitive personal information such as names, phone numbers, email addresses, or financial data. Bus route queries are processed locally within your browser.'}
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-ink)', margin: '0 0 8px 0' }} lang={lang}>
            {lang === 'bn' ? '২. লোকাল স্টোরেজ (Local Storage) ব্যবহার' : '2. Browser Local Storage'}
          </h2>
          <p style={{ fontSize: '14.5px', color: 'var(--color-ink-muted)', lineHeight: 1.6, margin: 0 }} lang={lang}>
            {lang === 'bn'
              ? 'আমরা ব্রাউজারের লোকাল স্টোরেজ কেবলমাত্র আপনার ইন্টারফেস পছন্দসমূহ সংরক্ষণের জন্য ব্যবহার করি: যেমন ডার্ক/লাইট মোড পছন্দ (busroute_theme) এবং নির্বাচিত ভাষা (বাংলা বা ইংরেজি)। এই তথ্য আপনার ডিভাইসেই থাকে এবং আমাদের সার্ভারে পাঠানো হয় না।'
              : 'We use browser local storage solely to remember your UI preferences: your theme selection (dark/light) and preferred language (Bangla/English). This preference data never leaves your device.'}
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-ink)', margin: '0 0 8px 0' }} lang={lang}>
            {lang === 'bn' ? '৩. গুগল অ্যানালিটিক্স ও পরিমাপক কুকিজ' : '3. Google Analytics & Metrics'}
          </h2>
          <p style={{ fontSize: '14.5px', color: 'var(--color-ink-muted)', lineHeight: 1.6, margin: 0 }} lang={lang}>
            {lang === 'bn'
              ? 'ওয়েবসাইটটির পারফরম্যান্স মূল্যায়ন ও রুট অনুসন্ধানের উপযোগিতা উন্নত করতে আমরা গুগল অ্যানালিটিক্স ৪ (GA4) ব্যবহার করতে পারি। এটি সম্পূর্ণ নামহীন (anonymized) সাধারণ মেট্রিক যেমন পেজ ভিউ, অনুসন্ধান ইভেন্ট ও ডিভাইসের ধরন রেকর্ড করে।'
              : 'To measure application reliability and optimize transit search workflows, we may utilize Google Analytics 4 (GA4). Analytics metrics are processed anonymously without identifying individuals.'}
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-ink)', margin: '0 0 8px 0' }} lang={lang}>
            {lang === 'bn' ? '৪. তৃতীয় পক্ষের মানচিত্র ও এপিআই' : '4. Third-Party Map & Tile Services'}
          </h2>
          <p style={{ fontSize: '14.5px', color: 'var(--color-ink-muted)', lineHeight: 1.6, margin: 0 }} lang={lang}>
            {lang === 'bn'
              ? 'রাস্তা ও স্টপেজের অবস্থান প্রদর্শনের জন্য ওপেনস্ট্রিটম্যাপ (OpenStreetMap) এবং রোড জ্যামিতি গণনার জন্য ওএসআরএম (OSRM) ব্যবহার করা হয়। এই সার্ভিসগুলো তাদের নিজস্ব ওপেন সোর্স গোপনীয়তা নীতি অনুযায়ী কাজ করে।'
              : 'For geospatial stoppage rendering, we interface with OpenStreetMap tile servers and project OSRM routing geometry in accordance with their respective privacy and tile usage policies.'}
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-ink)', margin: '0 0 8px 0' }} lang={lang}>
            {lang === 'bn' ? '৫. যোগাযোগ ও তথ্য সংশোধন' : '5. Contact & Data Corrections'}
          </h2>
          <p style={{ fontSize: '14.5px', color: 'var(--color-ink-muted)', lineHeight: 1.6, margin: '0 0 16px 0' }} lang={lang}>
            {lang === 'bn'
              ? 'বাসের রুট, স্টপেজ বা ভাড়ার তথ্যে কোনো ভুল বা অসংগতি চোখে পড়লে সরাসরি আমাদের ইন-অ্যাপ রিপোর্ট ব্যবস্থার মাধ্যমে জানাতে পারেন। কোনো প্রকার অ্যাকাউন্ট তৈরি বা ব্যক্তিগত তথ্য দেওয়া ছাড়াই সরাসরি আপনার সংশোধন প্রস্তাবনা পাঠানো সম্ভব।'
              : 'If you identify any discrepancies in bus routes, missing stoppages, or fare inaccuracies, you can report them directly via our in-app reporting tool without registering or sharing personal data.'}
          </p>
          <button
            type="button"
            onClick={() => setIsReportOpen(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'var(--color-button-primary-bg)',
              color: 'var(--color-button-primary-text)',
              border: 'none',
              borderRadius: 'var(--radius-full)',
              padding: '10px 22px',
              fontSize: '13.5px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            lang={lang}
          >
            <EditIcon size={15} color="var(--color-button-primary-text)" />
            <span>{lang === 'bn' ? 'তথ্য সংশোধন বা রিপোর্ট পাঠান' : 'Submit Route / Fare Report'}</span>
          </button>
        </section>

        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 14px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-hairline)',
            fontSize: '12px',
            fontWeight: 600,
            color: 'var(--color-ink)',
            alignSelf: 'flex-start',
            marginTop: '8px',
          }}
        >
          <CalendarIcon size={13} color="var(--color-ink)" />
          <span>{lang === 'bn' ? 'সর্বশেষ আপডেট: অক্টোবর ২০২৬' : 'Last Updated: October 2026'}</span>
        </div>
      </div>

      <div style={{ marginTop: '28px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <Link to="/" className="btn-secondary" style={{ borderRadius: 'var(--radius-full)', padding: '10px 20px', fontSize: '14px' }} lang={lang}>
          ← {lang === 'bn' ? 'হোমে ফিরে যান' : 'Back to Home'}
        </Link>
        <Link to="/terms" className="btn-secondary" style={{ borderRadius: 'var(--radius-full)', padding: '10px 20px', fontSize: '14px' }} lang={lang}>
          {lang === 'bn' ? 'ব্যবহারের শর্তাবলী দেখুন →' : 'View Terms of Service →'}
        </Link>
      </div>

      <ReportModal isOpen={isReportOpen} onClose={() => setIsReportOpen(false)} />
    </main>
  );
};

