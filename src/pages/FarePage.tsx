import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useT, formatNumber } from '../i18n/useT';
import { WalletIcon, PinIcon, ShieldIcon, CalendarIcon } from '../components/Icons';
import { trackFareCalculate } from '../analytics/ga4';

export const FarePage: React.FC = () => {
  const { lang, t } = useT();
  const [km, setKm] = useState<number>(5);

  const calculatedFare = Math.max(10, Math.ceil(km * 2.7));

  return (
    <main className="container-wide" style={{ padding: '40px 20px 80px' }}>
      <div style={{ maxWidth: '800px', marginBottom: '36px' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 16px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-hairline)',
            fontSize: '13px',
            fontWeight: 600,
            color: 'var(--color-ink)',
            marginBottom: '16px',
          }}
          lang={lang}
        >
          <WalletIcon size={14} color="var(--color-ink)" />
          <span>{lang === 'bn' ? 'বিআরটিএ নির্দেশিত ভাড়ার নিয়ম ও নির্দেশিকা' : 'BRTA Notified Fare Guidelines & Calculator'}</span>
        </div>

        <h1
          style={{
            fontSize: '36px',
            fontWeight: 800,
            color: 'var(--color-ink)',
            lineHeight: 1.25,
            margin: '0 0 12px 0',
          }}
          lang={lang}
        >
          {lang === 'bn' ? 'ঢাকা বাস ভাড়া নির্দেশিকা' : 'Dhaka Bus Fare Guide'}
        </h1>

        <p
          style={{
            fontSize: '16px',
            color: 'var(--color-ink-muted)',
            lineHeight: 1.6,
            margin: 0,
          }}
          lang={lang}
        >
          {lang === 'bn'
            ? 'বিআরটিএ (BRTA) প্রজ্ঞাপন অনুযায়ী ঢাকা সিটি বাসের সরকারি রেট (প্রতি কিমি ২.৭০ টাকা, সর্বনিম্ন ১০ টাকা) ও দূরত্ব ভিত্তিক আনুমানিক ভাড়ার বিস্তারিত।'
            : 'Dhaka city bus fare guidelines based on official BRTA circular rates (Tk 2.70/km, minimum Tk 10) and distance-based estimates.'}
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
          marginBottom: '40px',
        }}
      >
        <div
          style={{
            padding: '24px',
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-hairline)',
            borderRadius: 'var(--radius-lg)',
          }}
        >
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'var(--color-surface-raised)', border: '1px solid var(--color-hairline)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px', color: 'var(--color-ink)' }}>
            <WalletIcon size={20} />
          </div>
          <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 8px 0', color: 'var(--color-ink)' }} lang={lang}>
            {lang === 'bn' ? 'সর্বনিম্ন ভাড়া: ১০ টাকা' : 'Minimum Fare: 10 Tk'}
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--color-ink-muted)', lineHeight: 1.5, margin: 0 }} lang={lang}>
            {lang === 'bn'
              ? 'সিটি বাসে ওঠার পর যেকোনো নিকটবর্তী স্টপেজে নামলেও সরকারি নিয়মে বড় বাসের সর্বনিম্ন ১০ টাকা (মিনিবাস ৮ টাকা) ভাড়া প্রযোজ্য।'
              : 'Regardless of distance or stops traveled, base minimum fare is 10 BDT for standard buses (8 BDT for minibuses).'}
          </p>
        </div>

        <div
          style={{
            padding: '24px',
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-hairline)',
            borderRadius: 'var(--radius-lg)',
          }}
        >
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'var(--color-surface-raised)', border: '1px solid var(--color-hairline)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px', color: 'var(--color-ink)' }}>
            <PinIcon size={20} />
          </div>
          <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 8px 0', color: 'var(--color-ink)' }} lang={lang}>
            {lang === 'bn' ? 'প্রতি কিমি: ২.৭০ টাকা' : 'Rate Per Km: 2.70 Tk'}
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--color-ink-muted)', lineHeight: 1.5, margin: 0 }} lang={lang}>
            {lang === 'bn'
              ? 'বিআরটিএ সরকারি প্রজ্ঞাপন অনুযায়ী ঢাকা ও চট্টগ্রাম মহানগর এলাকায় সাধারণ সিটি বাসের নির্ধারিত হার প্রতি কিলোমিটারে ২.৭০ টাকা।'
              : 'Per BRTA gazette notification, the official metropolitan rate for diesel city buses is 2.70 BDT per kilometer.'}
          </p>
        </div>

        <div
          style={{
            padding: '24px',
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-hairline)',
            borderRadius: 'var(--radius-lg)',
          }}
        >
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'var(--color-surface-raised)', border: '1px solid var(--color-hairline)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px', color: 'var(--color-ink)' }}>
            <WalletIcon size={20} />
          </div>
          <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 8px 0', color: 'var(--color-ink)' }} lang={lang}>
            {lang === 'bn' ? 'ভাংতি ও কন্ডাক্টর সমন্বয়' : 'Conductor Change Policy'}
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--color-ink-muted)', lineHeight: 1.5, margin: 0 }} lang={lang}>
            {lang === 'bn'
              ? 'কন্ডাক্টরের কাছে ১ বা ২ টাকার খুচরা ভাংতি না থাকায় অথবা স্টপেজ সেকশন প্রথার কারণে নির্ধারিত হিসাব থেকে ±৫ টাকা কম-বেশি হতে পারে।'
              : 'Conductors may charge ±5 Tk from the exact amount due to shortage of 1 or 2 Tk change coins or sectional staging.'}
          </p>
        </div>
      </div>

      <div
        style={{
          maxWidth: '680px',
          padding: '28px',
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-hairline)',
          borderRadius: 'var(--radius-xl)',
          marginBottom: '40px',
        }}
      >
        <h2 style={{ fontSize: '20px', fontWeight: 700, margin: '0 0 6px 0', color: 'var(--color-ink)' }} lang={lang}>
          {lang === 'bn' ? 'দূরত্ব অনুযায়ী আনুমানিক ভাড়া হিসাব করুন' : 'Calculate Estimated Fare by Distance'}
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--color-ink-muted)', margin: '0 0 20px 0' }} lang={lang}>
          {lang === 'bn' ? 'দূরত্ব স্লাইডার টেনে আনুমানিক ভাড়া দেখে নিন (প্রতি কিমি ২.৭০ টাকা, সর্বনিম্ন ১০ টাকা):' : 'Drag distance slider to estimate fare (Tk 2.70/km, minimum Tk 10):'}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <input
            type="range"
            min="1"
            max="40"
            value={km}
            onChange={(e) => {
              const val = Number(e.target.value);
              setKm(val);
              const f = Math.max(10, Math.ceil(val * 2.7));
              trackFareCalculate(val, f);
            }}
            style={{ flex: 1, accentColor: 'var(--color-ink)' }}
          />
          <span style={{ fontWeight: 700, fontSize: '18px', minWidth: '80px', color: 'var(--color-ink)' }} lang={lang}>
            {formatNumber(km, lang)} {lang === 'bn' ? 'কিমি' : 'km'}
          </span>
        </div>

        <div
          style={{
            padding: '16px 20px',
            backgroundColor: 'var(--color-surface-raised)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-hairline)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div>
            <div style={{ fontSize: '13px', color: 'var(--color-ink-muted)' }}>
              {lang === 'bn' ? 'আনুমানিক মোট ভাড়া:' : 'Estimated Fare:'}
            </div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--color-ink)' }} lang={lang}>
              ৳ {formatNumber(calculatedFare, lang)}
            </div>
          </div>

          <div className="chip chip-fare" style={{ fontSize: '12px', fontWeight: 600 }}>
            ±৫ {lang === 'bn' ? 'টাকা সমন্বয় হতে পারে (আনুমানিক)' : 'Tk variation possible (Estimated)'}
          </div>
        </div>
      </div>

      {/* Sources, Limitations & Verification Card */}
      <section
        style={{
          maxWidth: '800px',
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-hairline)',
          borderRadius: 'var(--radius-xl)',
          padding: '28px',
          marginBottom: '36px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <ShieldIcon size={20} color="var(--color-ink)" />
          <h2 style={{ fontSize: '20px', fontWeight: 700, margin: 0, color: 'var(--color-ink)' }} lang={lang}>
            {lang === 'bn' ? 'তথ্যসূত্র, সীমাবদ্ধতা ও যাচাই নোটিশ' : 'Data Sources, Limitations & Verification'}
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '14px', lineHeight: 1.6, color: 'var(--color-ink)' }}>
          <div>
            <strong>{lang === 'bn' ? '১. বিআরটিএ সরকারি নির্দেশিত রেট:' : '1. Official BRTA Circular Reference:'}</strong>
            <p style={{ margin: '4px 0 0 0', color: 'var(--color-ink-muted)' }} lang={lang}>
              {lang === 'bn'
                ? 'বাংলাদেশ সড়ক পরিবহন কর্তৃপক্ষ (BRTA) প্রজ্ঞাপন অনুযায়ী ঢাকা মেট্রোপলিটন এলাকায় চলাচলকারী সাধারণ সিটি বাসের ভাড়া প্রতি কিলোমিটার ২.৭০ টাকা এবং সর্বনিম্ন ভাড়া ১০ টাকা। শিক্ষার্থীদের জন্য সরকার নির্ধারিত ৫০% হাফ ভাড়া প্রযোজ্য (সচিত্র শিক্ষাপ্রতিষ্ঠান আইডি প্রদর্শন সাপেক্ষে, ছুটির দিন ব্যতীত)।'
                : 'Under Bangladesh Road Transport Authority (BRTA) notifications, the official rate for standard city buses in metropolitan Dhaka is 2.70 BDT per kilometer, with a minimum fare of 10 BDT. 50% concession applies for students with valid institutional ID (except government holidays).'}
            </p>
          </div>

          <div>
            <strong>{lang === 'bn' ? '২. হিসাব ও বাস্তব সীমাবদ্ধতা:' : '2. Calculation & Operational Limitations:'}</strong>
            <p style={{ margin: '4px 0 0 0', color: 'var(--color-ink-muted)' }} lang={lang}>
              {lang === 'bn'
                ? 'বাসরুট একটি স্বাধীন পাবলিক সার্ভিস প্ল্যাটফর্ম। প্রদর্শিত ভাড়া অ্যালগরিদম ভিত্তিক আনুমানিক (Estimated) হিসাব। কন্ডাক্টরের কাছে ১ বা ২ টাকার খুচরা কয়েন না থাকা, সড়ক ডাইভারশন বা বাস কোম্পানিগুলোর নির্দিষ্ট স্টপেজ স্ল্যাব অনুযায়ী টিকিটে সামান্য ৫ টাকা কম-বেশি হতে পারে। এসি বাস এই হিসাবের অন্তর্ভুক্ত নয়।'
                : 'BusRoute is an independent civic platform. Displayed fares are distance-calculated estimates. Real-world fares collected by bus conductors may vary by ±5 Tk due to lack of 1-2 Tk change coins or sectional staging. AC buses and expressway services are excluded.'}
            </p>
          </div>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--color-surface-raised)',
              border: '1px solid var(--color-hairline)',
              fontSize: '12.5px',
              color: 'var(--color-ink)',
              fontWeight: 600,
              alignSelf: 'flex-start',
            }}
          >
            <CalendarIcon size={14} color="var(--color-ink)" />
            <span>{lang === 'bn' ? 'সর্বশেষ ডেটা যাচাই ও আপডেট: সেপ্টেম্বর ২০২৬ (বিআরটিএ প্রজ্ঞাপন অনুযায়ী)' : 'Last verified & updated: September 2026 (per BRTA circular)'}</span>
          </div>
        </div>
      </section>

      <div style={{ marginTop: '20px' }}>
        <Link to="/" className="btn-secondary" style={{ borderRadius: 'var(--radius-full)', padding: '10px 24px' }} lang={lang}>
          ← {lang === 'bn' ? 'হোমে ফিরে বাস রুট খুঁজুন' : 'Back to Search Routes'}
        </Link>
      </div>
    </main>
  );
};
