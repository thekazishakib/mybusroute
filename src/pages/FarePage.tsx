import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useT, formatNumber } from '../i18n/useT';
import { WalletIcon, PinIcon } from '../components/Icons';

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
          <WalletIcon size={14} color="#0f172a" />
          <span>{lang === 'bn' ? 'সরকারি ভাড়ার তালিকা ও নিয়মাবলী' : 'Official BRTA Fare Rules & Guide'}</span>
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
            ? 'বিআরটিএ (BRTA) প্রজ্ঞাপন অনুযায়ী ঢাকার সিটি বাসের সর্বনিম্ন ভাড়া এবং দূরত্ব অনুযায়ী নির্ধারিত হারের পূর্ণাঙ্গ তথ্য।'
            : 'Complete information on Dhaka city bus minimum fares and distance-based rates according to BRTA gazette notifications.'}
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
              ? 'যেকোনো বাসে ওঠার পর যেকোনো নিকটবর্তী স্টপেজে নামলেও সর্বনিম্ন ১০ টাকা ভাড়া প্রযোজ্য।'
              : 'Regardless of distance or stops traveled, the minimum base fare for city buses is 10 BDT.'}
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
              ? 'সর্বনিম্ন ভাড়ার দূরত্বের পর প্রতি অতিরিক্ত কিলোমিটারের জন্য সরকারি নির্ধারিত হার ২.৭০ টাকা।'
              : 'Beyond the minimum fare distance threshold, government gazette sets the fare at 2.70 BDT per kilometer.'}
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
              ? 'কন্ডাক্টর অনেক সময় ১ বা ২ টাকার ভাংতি না থাকার কারণে নির্ধারিত পরিমাণ থেকে ৫ টাকা কম-বেশি করতে পারে।'
              : 'Conductors may charge ±5 Tk from the exact amount due to shortage of 1 or 2 Tk change.'}
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
          {lang === 'bn' ? 'দূরত্ব স্লাইডার টেনে ভাড়া দেখে নিন:' : 'Drag the distance slider to check fare:'}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <input
            type="range"
            min="1"
            max="40"
            value={km}
            onChange={(e) => setKm(Number(e.target.value))}
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
            ±৫ {lang === 'bn' ? 'টাকা সমন্বয় হতে পারে' : 'Tk variation possible'}
          </div>
        </div>
      </div>

      <div style={{ marginTop: '20px' }}>
        <Link to="/" className="btn-secondary" style={{ borderRadius: 'var(--radius-full)', padding: '10px 24px' }} lang={lang}>
          ← {lang === 'bn' ? 'হোমে ফিরে বাস রুট খুঁজুন' : 'Back to Search Routes'}
        </Link>
      </div>
    </main>
  );
};
