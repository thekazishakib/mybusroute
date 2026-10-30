import React from 'react';
import { Link } from 'react-router-dom';
import { useT } from '../i18n/useT';
import { SEOHead } from '../seo/SEOHead';
import { ShieldIcon, WalletIcon, CalendarIcon } from '../components/Icons';

export const TermsPage: React.FC = () => {
  const { lang } = useT();

  return (
    <main className="container-wide" style={{ padding: '40px 20px 80px', maxWidth: '860px', margin: '0 auto' }}>
      <SEOHead
        title={lang === 'bn' ? 'শর্তাবলী ও ডিসক্লেইমার (Terms & Disclaimer) — বাসরুট' : 'Terms of Service & Disclaimer — BusRoute'}
        description={
          lang === 'bn'
            ? 'বাসরুট ব্যবহারের নিয়মাবলী, বিআরটিএ সরকারি ভাড়ার ডিসক্লেইমার এবং স্বাধীন পাবলিক ট্রানজিট সহায়িকা নীতিমালা।'
            : 'BusRoute terms of use, BRTA transit fare disclaimer, limitations of liability, and service conditions.'
        }
        canonicalPath="/terms"
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
          <ShieldIcon size={14} color="var(--color-ink)" />
          <span>{lang === 'bn' ? 'ব্যবহারের শর্তাবলী ও আইনি দায়মুক্তি' : 'Terms of Service & Disclaimers'}</span>
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
          {lang === 'bn' ? 'শর্তাবলী ও ডিসক্লেইমার (Terms & Disclaimer)' : 'Terms of Service & Disclaimer'}
        </h1>

        <p style={{ fontSize: '15px', color: 'var(--color-ink-muted)', margin: 0, lineHeight: 1.6 }} lang={lang}>
          {lang === 'bn'
            ? 'বাসরুট প্ল্যাটফর্ম ব্যবহারের পূর্বে অনুগ্রহ করে নিচের শর্তাবলী ও আইনি ডিসক্লেইমার মনোযোগ সহকারে পড়ুন।'
            : 'Please review the following terms and civic transit disclaimers before utilizing the BusRoute platform.'}
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
            {lang === 'bn' ? '১. স্বাধীন নাগরিক প্ল্যাটফর্ম ঘোষণা' : '1. Independent Civic Platform'}
          </h2>
          <p style={{ fontSize: '14.5px', color: 'var(--color-ink-muted)', lineHeight: 1.6, margin: 0 }} lang={lang}>
            {lang === 'bn'
              ? 'বাসরুট (BusRoute) একটি সম্পূর্ণ স্বাধীন, অলাভজনক ও উন্মুক্ত নাগরিক ট্রানজিট সেবা নির্দেশিকা। এটি কোনো সরকারি সংস্থা, বিআরটিএ (BRTA), ডিটিসিএ (DTCA) কিংবা কোনো নির্দিষ্ট বাস মালিক সমিতির অফিশিয়াল অ্যাপ নয়। জনসাধারণের যাতায়াত সহজ করার উদ্দেশ্যে পাবলিক ডোমেইনের তথ্যের ভিত্তিতে এটি পরিচালিত হয়।'
              : 'BusRoute is an independent, non-commercial civic public transit platform. It is not an official organ of BRTA, DTCA, or private bus transport unions. It aggregates publicly available circulars to assist commuters navigate Dhaka transit.'}
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-ink)', margin: '0 0 8px 0' }} lang={lang}>
            {lang === 'bn' ? '২. সরকারি ভাড়ার হার ও বাস্তব ভাড়া ডিসক্লেইমার' : '2. Transit Fare Disclaimers'}
          </h2>
          <p style={{ fontSize: '14.5px', color: 'var(--color-ink-muted)', lineHeight: 1.6, margin: 0 }} lang={lang}>
            {lang === 'bn'
              ? 'ওয়েবসাইটে প্রদর্শিত সকল ভাড়া বিআরটিএ-র সরকারি প্রজ্ঞাপন (প্রতি কিলোমিটার ২.৭০ টাকা, সর্বনিম্ন ভাড়া ১০ টাকা) এবং সড়ক দূরত্বের ওপর ভিত্তি করে হিসাব করা আনুমানিক (Estimated) ভাড়া। বাস্তব ক্ষেত্রে কন্ডাক্টরের কাছে ১ বা ২ টাকার খুচরা ভাংতির অভাব, সেকশনাল স্ল্যাব ভাড়া কিংবা অস্থায়ী রোড ডাইভারশনের কারণে টিকিটের মূল্যে ±৫ টাকা সমন্বয় হতে পারে। এসি বাস ও এক্সপ্রেসওয়ে সার্ভিস এই হিসাবের আওতাভুক্ত নয়।'
              : 'Displayed fares are calculated approximations derived from official BRTA gazette rates (2.70 BDT/km, minimum 10 BDT) over measured road geometry. In real-world commutes, bus conductors may collect ±5 BDT variations due to sectional staging or coin shortages. AC premium buses and expressway shuttles are excluded.'}
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-ink)', margin: '0 0 8px 0' }} lang={lang}>
            {lang === 'bn' ? '৩. সময়সূচী ও রুট পরিবর্তন সংক্রান্ত দায়মুক্তি' : '3. Schedule & Route Availability'}
          </h2>
          <p style={{ fontSize: '14.5px', color: 'var(--color-ink-muted)', lineHeight: 1.6, margin: 0 }} lang={lang}>
            {lang === 'bn'
              ? 'ঢাকার ট্রাফিক জ্যাম, ভিআইপি মুভমেন্ট, আবহাওয়া ও উন্নয়ন প্রকল্পের কারণে যেকোনো বাসের চলাচল সময় বা রুটের সাময়িক পরিবর্তন ঘটতে পারে। বাসরুট প্ল্যাটফর্ম কোনো বাসের আগমন বিলম্ব বা রুট পরিবর্তনের জন্য দায়ী থাকবে না।'
              : 'City traffic conditions, civic construction, or weather incidents may impact daily bus frequencies and route variations. BusRoute carries no liability for missed connections, operational delays, or temporary road detours.'}
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-ink)', margin: '0 0 8px 0' }} lang={lang}>
            {lang === 'bn' ? '৪. মেধা সম্পত্তি ও উন্মুক্ত ব্যবহার' : '4. Intellectual Property & Fair Use'}
          </h2>
          <p style={{ fontSize: '14.5px', color: 'var(--color-ink-muted)', lineHeight: 1.6, margin: 0 }} lang={lang}>
            {lang === 'bn'
              ? 'বাসরুটের সোর্স কোড ও ইউজার ইন্টারফেস উন্মুক্ত ওপেন সোর্স দর্শনে নির্মিত। অননুমোদিতভাবে এই ডেটাবেজ বাণিজ্যিক উদ্দেশ্যে স্ক্র্যাপ বা বিকৃত করা নিষিদ্ধ।'
              : 'BusRoute codebase and interface are developed under open-source software principles. Unauthorized bulk data extraction for commercial exploitation or misleading resale is strictly prohibited.'}
          </p>
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
          <span>{lang === 'bn' ? 'কার্যকর তারিখ: অক্টোবর ২০২৬' : 'Effective Date: October 2026'}</span>
        </div>
      </div>

      <div style={{ marginTop: '28px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <Link to="/" className="btn-secondary" style={{ borderRadius: 'var(--radius-full)', padding: '10px 20px', fontSize: '14px' }} lang={lang}>
          ← {lang === 'bn' ? 'হোমে ফিরে যান' : 'Back to Home'}
        </Link>
        <Link to="/privacy" className="btn-secondary" style={{ borderRadius: 'var(--radius-full)', padding: '10px 20px', fontSize: '14px' }} lang={lang}>
          {lang === 'bn' ? 'গোপনীয়তা নীতি দেখুন →' : 'View Privacy Policy →'}
        </Link>
      </div>
    </main>
  );
};

