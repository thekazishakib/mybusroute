import React from 'react';
import { Link } from 'react-router-dom';
import { useT } from '../i18n/useT';
import {
  BusIcon,
  PinIcon,
  LightningIcon,
  ShieldIcon,
  PrivacyIcon,
  WalletIcon,
  PortfolioIcon,
  LinkedinIcon,
  GithubIcon,
  CalendarIcon,
} from '../components/Icons';

export const AboutPage: React.FC = () => {
  const { lang, t } = useT();

  return (
    <main className="container-wide" style={{ padding: '40px 20px 80px' }}>
      <div style={{ maxWidth: '960px', margin: '0 auto' }}>
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
          <BusIcon size={14} color="var(--color-ink)" />
          <span>{lang === 'bn' ? 'আমাদের সম্পর্কে ও নির্দেশিকা' : 'About & Transit Guidelines'}</span>
        </div>

        <h1
          style={{
            fontSize: 'clamp(30px, 4.5vw, 42px)',
            fontWeight: 800,
            color: 'var(--color-ink)',
            lineHeight: 1.25,
            margin: '0 0 14px 0',
          }}
          lang={lang}
        >
          {lang === 'bn' ? 'বাসে যাতায়াত হোক স্বস্তিময়' : 'Ride Buses, Travel With Ease'}
        </h1>

        <p
          style={{
            fontSize: '16px',
            color: 'var(--color-ink-muted)',
            lineHeight: 1.65,
            margin: '0 0 36px 0',
          }}
          lang={lang}
        >
          {lang === 'bn'
            ? 'ঢাকা শহরের ব্যস্ত জীবনে সঠিক বাস রুট, মধ্যবর্তী স্টপেজ এবং সরকারি নিয়মে নির্ধারিত ভাড়া সহজে ও দ্রুত জানার জন্য তৈরি করা হয়েছে BusRoute প্ল্যাটফর্ম।'
            : 'BusRoute is dedicated to helping commuters, students, and citizens navigate Dhaka city bus routes, stops, and official fares with ease and reliability.'}
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '20px',
            marginBottom: '36px',
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
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                backgroundColor: 'var(--color-surface-raised)',
                border: '1px solid var(--color-hairline)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '14px',
                color: 'var(--color-ink)',
              }}
            >
              <BusIcon size={20} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 6px 0', color: 'var(--color-ink)' }} lang={lang}>
              {lang === 'bn' ? '১৮৪টি বাস রুট' : '184 Bus Routes'}
            </h3>
            <p style={{ fontSize: '13.5px', color: 'var(--color-ink-muted)', lineHeight: 1.5, margin: 0 }} lang={lang}>
              {lang === 'bn'
                ? 'মিরপুর, উত্তরা, মতিঝিল, সাভার, গুলিস্তান, ফার্মগেটসহ ঢাকার সকল প্রধান রুটের সঠিক তথ্য।'
                : 'Complete verified route data covering all key corridors of metropolitan Dhaka.'}
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
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                backgroundColor: 'var(--color-surface-raised)',
                border: '1px solid var(--color-hairline)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '14px',
                color: 'var(--color-ink)',
              }}
            >
              <PinIcon size={20} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 6px 0', color: 'var(--color-ink)' }} lang={lang}>
              {lang === 'bn' ? '২৬০টি বাস স্টপ' : '260 Bus Stops'}
            </h3>
            <p style={{ fontSize: '13.5px', color: 'var(--color-ink-muted)', lineHeight: 1.5, margin: 0 }} lang={lang}>
              {lang === 'bn'
                ? 'ঢাকা বিশ্ববিদ্যালয় (শাহবাগ), আদমজী, ক্যাম্পাস ও গুরুত্বপূর্ণ সকল স্টপেজের বাংলা ও ইংরেজি নাম।'
                : 'Natural naming with full Bengali and English aliases, landmarks, and transfer points.'}
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
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                backgroundColor: 'var(--color-surface-raised)',
                border: '1px solid var(--color-hairline)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '14px',
                color: 'var(--color-ink)',
              }}
            >
              <LightningIcon size={20} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 6px 0', color: 'var(--color-ink)' }} lang={lang}>
              {lang === 'bn' ? 'তাত্ক্ষণিক ও নির্ভরযোগ্য' : 'Instant & Reliable'}
            </h3>
            <p style={{ fontSize: '13.5px', color: 'var(--color-ink-muted)', lineHeight: 1.5, margin: 0 }} lang={lang}>
              {lang === 'bn'
                ? 'সম্পূর্ণ ডেটাবেজ ব্রাউজারে সংরক্ষিত থাকায় এক পলকেই যেকোনো রুটের ফলাফল পাওয়া যায়।'
                : 'Zero latency instant search powered by local data and smart fuzzy matching.'}
            </p>
          </div>
        </div>

        <section
          style={{
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-hairline)',
            borderRadius: 'var(--radius-lg)',
            padding: '28px',
            marginBottom: '36px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#0a0a0a',
                display: 'inline-block',
              }}
            />
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-ink-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {lang === 'bn' ? 'ডেভেলপার পরিচিতি' : 'Developer Spotlight'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px', flexWrap: 'wrap', marginBottom: '12px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-ink)', margin: 0 }}>
              Kazi Shakib <span style={{ fontSize: '15px', fontWeight: 500, color: 'var(--color-ink-muted)' }}>is the developer</span>
            </h2>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <a
                href="https://www.kazishakib.com"
                target="_blank"
                rel="noopener noreferrer"
                title="Portfolio Website - www.kazishakib.com"
                aria-label="Portfolio Website"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-surface-raised)',
                  border: '1px solid var(--color-hairline-strong)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#0a0a0a',
                  transition: 'transform 0.15s ease',
                }}
              >
                <PortfolioIcon size={18} color="#0a0a0a" />
              </a>

              <a
                href="https://bd.linkedin.com/in/kazishakib"
                target="_blank"
                rel="noopener noreferrer"
                title="LinkedIn - Kazi Shakib"
                aria-label="LinkedIn Profile"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-surface-raised)',
                  border: '1px solid var(--color-hairline-strong)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#0a0a0a',
                  transition: 'transform 0.15s ease',
                }}
              >
                <LinkedinIcon size={18} color="#0a0a0a" />
              </a>

              <a
                href="https://github.com/thekazishakib"
                target="_blank"
                rel="noopener noreferrer"
                title="GitHub - thekazishakib"
                aria-label="GitHub Profile"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-surface-raised)',
                  border: '1px solid var(--color-hairline-strong)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#0a0a0a',
                  transition: 'transform 0.15s ease',
                }}
              >
                <GithubIcon size={18} color="#0a0a0a" />
              </a>
            </div>
          </div>

          <p style={{ fontSize: '14.5px', color: 'var(--color-ink)', lineHeight: 1.65, margin: 0 }} lang={lang}>
            {lang === 'bn'
              ? 'আমি কাজী সাকিব (Kazi Shakib), এই অ্যাপটির নির্মাতা ও ডেভেলপার। ঢাকা শহরের মানুষের যাতায়াত সহজ করতে সরকারি ওয়েবসাইট (BRTA / DTCA) থেকে উন্মুক্ত তথ্য সংগ্রহ করে কাস্টম ডেটা স্ট্রাকচার ও রুট ফাইন্ডিং অ্যালগরিদম তৈরি করেছি। প্ল্যাটফর্মটি সম্পূর্ণ ইউজার-ফ্রেন্ডলি এবং নির্ভরযোগ্য।'
              : 'I am Kazi Shakib, the lead architect and developer of BusRoute. Designed to streamline daily commuting across metropolitan Dhaka, the platform compiles transit records from official government agencies into high-performance graph data structures with optimized search routing algorithms.'}
          </p>
        </section>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '36px' }}>
          
          <div
            id="privacy"
            style={{
              padding: '24px',
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-hairline)',
              borderRadius: 'var(--radius-lg)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--color-surface-raised)',
                  border: '1px solid var(--color-hairline)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-ink)',
                  flexShrink: 0,
                }}
              >
                <PrivacyIcon size={18} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: 'var(--color-ink)' }} lang={lang}>
                {lang === 'bn' ? 'গোপনীয়তা নীতি (Privacy Policy)' : 'Privacy Policy'}
              </h3>
            </div>
            <p style={{ fontSize: '14px', color: 'var(--color-ink-muted)', lineHeight: 1.65, margin: '0 0 10px 0' }} lang={lang}>
              {lang === 'bn'
                ? 'বাসরুট অ্যাপে আপনার ব্যক্তিগত তথ্যের সর্বোচ্চ সুরক্ষা দেওয়া হয়। এই অ্যাপটি ব্যবহারকারীর কোনো ব্যক্তিগত তথ্য, ফোন নম্বর বা অবস্থান ট্র্যাকিং দূরবর্তী কোনো সার্ভারে জমা রাখে না। সকল রুট অনুসন্ধান প্রক্রিয়া সম্পূর্ণ আপনার ব্রাউজারে সুরক্ষিতভাবে সম্পন্ন হয়।'
                : 'BusRoute respects your privacy. We do not collect, track, store, or sell any personal identifying information or contact details. All route matching and calculations execute entirely client-side inside your browser with zero intrusive ad tracking.'}
            </p>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--color-surface-raised)',
                border: '1px solid var(--color-hairline)',
                fontSize: '11.5px',
                color: 'var(--color-ink-muted)',
                fontWeight: 500,
              }}
            >
              <CalendarIcon size={12} color="var(--color-ink-muted)" />
              <span>{lang === 'bn' ? 'সর্বশেষ ডেটা আপডেট: সেপ্টেম্বর ২০২৬' : 'Data last updated: September 2026'}</span>
            </div>
          </div>

          <div
            id="terms"
            style={{
              padding: '24px',
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-hairline)',
              borderRadius: 'var(--radius-lg)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--color-surface-raised)',
                  border: '1px solid var(--color-hairline)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-ink)',
                  flexShrink: 0,
                }}
              >
                <WalletIcon size={18} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: 'var(--color-ink)' }} lang={lang}>
                {lang === 'bn' ? 'ব্যবহারের শর্তাবলী (Terms of Service)' : 'Terms of Service'}
              </h3>
            </div>
            <p style={{ fontSize: '14px', color: 'var(--color-ink-muted)', lineHeight: 1.65, margin: '0 0 10px 0' }} lang={lang}>
              {lang === 'bn'
                ? 'বাসরুট অ্যাপে প্রদর্শিত সকল বাস ভাড়া বাংলাদেশ সড়ক পরিবহন কর্তৃপক্ষ (BRTA)-এর সরকারি প্রজ্ঞাপন (প্রতি কিমি ২.৭০ টাকা, সর্বনিম্ন ভাড়া ১০ টাকা) অনুযায়ী হিসাব করা। বাস্তব পরিস্থিতিতে সড়কে জ্যাম বা কন্ডাক্টরের কাছে খুচরা ভাংতি না থাকলে টিকিটের মূল্যে সামান্য ৫ টাকা কম-বেশি হতে পারে।'
                : 'The bus fares shown on this platform are computed strictly using official BRTA gazette rates (BDT 2.70 per km, base fare BDT 10). Real-world fares on running buses may occasionally differ by ±5 Tk due to small change coin availability or traffic diversions.'}
            </p>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--color-surface-raised)',
                border: '1px solid var(--color-hairline)',
                fontSize: '11.5px',
                color: 'var(--color-ink-muted)',
                fontWeight: 500,
              }}
            >
              <CalendarIcon size={12} color="var(--color-ink-muted)" />
              <span>{lang === 'bn' ? 'সর্বশেষ ডেটা আপডেট: সেপ্টেম্বর ২০২৬ (বিআরটিএ সরকারি প্রজ্ঞাপন অনুযায়ী)' : 'Data last updated: September 2026 (per official BRTA circular)'}</span>
            </div>
          </div>

          <div
            id="security"
            style={{
              padding: '24px',
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-hairline)',
              borderRadius: 'var(--radius-lg)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--color-surface-raised)',
                  border: '1px solid var(--color-hairline)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-ink)',
                  flexShrink: 0,
                }}
              >
                <ShieldIcon size={18} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: 'var(--color-ink)' }} lang={lang}>
                {lang === 'bn' ? 'নিরাপত্তা ও সরকারি ডেটা নির্দেশিকা' : 'Security & Government Data Guidelines'}
              </h3>
            </div>
            <p style={{ fontSize: '14px', color: 'var(--color-ink-muted)', lineHeight: 1.65, margin: '0 0 10px 0' }} lang={lang}>
              {lang === 'bn'
                ? 'এই প্ল্যাটফর্মের ১৮৪টি বাস রুট এবং ২৬০টি স্টপেজের তথ্য বাংলাদেশ সরকার, বিআরটিএ ও ঢাকা পরিবহন সমন্বয় কর্তৃপক্ষ (ডিটিসিএ)-এর উন্মুক্ত সরকারি প্রকাশনা থেকে সংগৃহীত। এলোমেলো সরকারি ডেটা গুছিয়ে কাস্টম ডেটা স্ট্রাকচার ও সাব-মিলিমিলেসেকেন্ড গ্রাফ অ্যালগরিদম তৈরি ও অপটিমাইজ করেছেন কাজী সাকিব।'
                : 'All bus routes and stop coordinates are sourced from official government gazettes and open DTCA documents. The raw transit data was re-architected into clean graph data structures with sub-millisecond search algorithms engineered by Kazi Shakib.'}
            </p>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--color-surface-raised)',
                border: '1px solid var(--color-hairline)',
                fontSize: '11.5px',
                color: 'var(--color-ink-muted)',
                fontWeight: 500,
              }}
            >
              <CalendarIcon size={12} color="var(--color-ink-muted)" />
              <span>{lang === 'bn' ? 'সর্বশেষ ডেটা সংস্করণ ও আপডেট: সেপ্টেম্বর ২০২৬' : 'Data last updated & verified: September 2026'}</span>
            </div>
          </div>

        </div>

        <div>
          <Link
            to="/"
            className="btn-secondary"
            style={{ borderRadius: 'var(--radius-full)', padding: '10px 24px', fontSize: '14px', fontWeight: 600 }}
            lang={lang}
          >
            ← {lang === 'bn' ? 'হোমে ফিরে যান' : 'Back to Home'}
          </Link>
        </div>

      </div>
    </main>
  );
};
