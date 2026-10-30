import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useT } from '../i18n/useT';
import { PortfolioIcon, LinkedinIcon, GithubIcon, CalendarIcon, EditIcon, CloseIcon } from './Icons';
import { ReportModal } from './ReportModal';

export const Footer: React.FC = () => {
  const { lang, t } = useT();
  const [activeModal, setActiveModal] = useState<'privacy' | 'terms' | 'security' | null>(null);
  const [isReportOpen, setIsReportOpen] = useState(false);

  return (
    <footer
      style={{
        backgroundColor: 'var(--color-surface)',
        borderTop: '1px solid var(--color-hairline)',
        padding: '48px 20px 36px',
        marginTop: 'auto',
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '36px',
            marginBottom: '36px',
            alignItems: 'start',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Link to="/" style={{ display: 'inline-block', textDecoration: 'none' }}>
                <img
                  src="/logo.png"
                  alt="BusRoute"
                  className="brand-logo"
                  style={{
                    height: '32px',
                    width: 'auto',
                    display: 'block',
                  }}
                />
              </Link>
            </div>
            <p style={{ fontSize: '13.5px', color: 'var(--color-ink-muted)', lineHeight: 1.6, margin: '0 0 12px 0' }} lang={lang}>
              {lang === 'bn'
                ? 'ঢাকার লোকাল বাস রুট, মধ্যবর্তী স্টপেজ এবং সরকারি নিয়মে সঠিক ভাড়া জানার আধুনিক ডিজিটাল প্ল্যাটফর্ম।'
                : 'Modern transit platform to find Dhaka city local bus routes, intermediate stops, and official BRTA fares.'}
            </p>
            <div style={{ fontSize: '12.5px', color: 'var(--color-ink-muted)', marginBottom: '8px' }}>
              © 2026 BusRoute • {lang === 'bn' ? 'সর্বস্বত্ব সংরক্ষিত।' : 'All rights reserved.'}
            </div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-hairline)',
                fontSize: '11.5px',
                color: 'var(--color-ink-muted)',
                lineHeight: 1,
              }}
            >
              <CalendarIcon size={12} color="var(--color-ink-muted)" />
              <span>{lang === 'bn' ? 'সর্বশেষ ডেটা আপডেট: সেপ্টেম্বর ২০২৬' : 'Data last updated: September 2026'}</span>
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '14.5px', fontWeight: 700, margin: '0 0 14px 0', color: 'var(--color-ink)' }} lang={lang}>
              {lang === 'bn' ? 'প্রয়োজনীয় লিংক' : 'Quick Links'}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { to: '/', label: lang === 'bn' ? 'হোম পেজ' : 'Home' },
                { to: '/routes', label: lang === 'bn' ? 'সকল বাস ও রুট' : 'All Buses & Routes' },
                { to: '/fare', label: lang === 'bn' ? 'ভাড়া নির্দেশিকা' : 'Fare Rules & Guide' },
                { to: '/about', label: lang === 'bn' ? 'আমাদের সম্পর্কে' : 'About BusRoute' },
              ].map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  style={{
                    fontSize: '13.5px',
                    color: 'var(--color-ink-muted)',
                    textDecoration: 'none',
                    transition: 'color 0.15s ease',
                  }}
                >
                  {l.label}
                </Link>
              ))}

              <button
                type="button"
                onClick={() => setIsReportOpen(true)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginTop: '4px',
                  backgroundColor: 'var(--color-surface-raised)',
                  border: '1px solid var(--color-hairline)',
                  borderRadius: 'var(--radius-full)',
                  padding: '7px 14px',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  color: 'var(--color-ink)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  alignSelf: 'flex-start',
                }}
                lang={lang}
              >
                <EditIcon size={14} color="var(--color-ink)" />
                <span>{lang === 'bn' ? 'তথ্য সংশোধন বা মিসিং রিপোর্ট' : 'Report Wrong or Missing Info'}</span>
              </button>
            </div>
          </div>

          <div
            style={{
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-hairline)',
              borderRadius: 'var(--radius-lg)',
              padding: '24px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    display: 'inline-block',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-ink)',
                  }}
                />
                <span style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--color-ink-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {lang === 'bn' ? 'ডেভেলপার ও প্রকৌশলী' : 'Lead Developer'}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap', marginBottom: '8px' }}>
              <h4 style={{ fontSize: '16px', fontWeight: 800, margin: 0, color: 'var(--color-ink)' }}>
                Kazi Shakib <span style={{ fontWeight: 500, fontSize: '13px', color: 'var(--color-ink-muted)' }}>is the developer</span>
              </h4>

              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <a
                  href="https://www.kazishakib.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Portfolio - kazishakib.com"
                  aria-label="Portfolio - kazishakib.com"
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-surface-raised)',
                    border: '1px solid var(--color-hairline-strong)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-ink)',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <PortfolioIcon size={16} color="var(--color-ink)" />
                </a>

                <a
                  href="https://bd.linkedin.com/in/kazishakib"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="LinkedIn - Kazi Shakib"
                  aria-label="LinkedIn - Kazi Shakib"
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-surface-raised)',
                    border: '1px solid var(--color-hairline-strong)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-ink)',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <LinkedinIcon size={16} color="var(--color-ink)" />
                </a>

                <a
                  href="https://github.com/thekazishakib"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="GitHub - thekazishakib"
                  aria-label="GitHub - thekazishakib"
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-surface-raised)',
                    border: '1px solid var(--color-hairline-strong)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-ink)',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <GithubIcon size={16} color="var(--color-ink)" />
                </a>
              </div>
            </div>

            <p style={{ fontSize: '12.5px', color: 'var(--color-ink-muted)', lineHeight: 1.55, margin: 0 }} lang={lang}>
              {lang === 'bn'
                ? 'সকল তথ্য সরকারি ওয়েবসাইট (BRTA / DTCA) থেকে সংগৃহীত। রুট ডেটা স্ট্রাকচার ও সার্চ অ্যালগরিদম তৈরি ও অপটিমাইজ করেছেন কাজী সাকিব।'
                : 'Transit data collected from official government websites (BRTA/DTCA). Custom data structures and routing algorithms engineered by Kazi Shakib.'}
            </p>
          </div>
        </div>

        <div
          style={{
            borderTop: '1px solid var(--color-hairline)',
            paddingTop: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '14px',
            fontSize: '12.5px',
            color: 'var(--color-ink-muted)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <Link
              to="/privacy"
              style={{ color: 'inherit', textDecoration: 'underline' }}
            >
              {lang === 'bn' ? 'প্রাইভেসি পলিসি' : 'Privacy Policy'}
            </Link>
            <span>•</span>
            <Link
              to="/terms"
              style={{ color: 'inherit', textDecoration: 'underline' }}
            >
              {lang === 'bn' ? 'ব্যবহারের শর্তাবলী' : 'Terms of Service'}
            </Link>
            <span>•</span>
            <Link
              to="/about"
              style={{ color: 'inherit', textDecoration: 'underline' }}
            >
              {lang === 'bn' ? 'নিরাপত্তা ও সরকারি ডেটা' : 'Security & Govt Data'}
            </Link>
            <span>•</span>
            <button
              type="button"
              onClick={() => setIsReportOpen(true)}
              style={{
                background: 'none',
                border: 'none',
                color: 'inherit',
                cursor: 'pointer',
                padding: 0,
                fontSize: '12.5px',
                textDecoration: 'underline',
              }}
              lang={lang}
            >
              {lang === 'bn' ? 'তথ্য সংশোধন বা রিপোর্ট' : 'Report Missing / Correction'}
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', fontSize: '12px', color: 'var(--color-ink-muted)' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '3px 8px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-hairline)',
                fontSize: '11.5px',
                color: 'var(--color-ink)',
                fontWeight: 500,
              }}
            >
              <CalendarIcon size={11} color="var(--color-ink-muted)" />
              {lang === 'bn' ? 'সেপ্টেম্বর ২০২৬ সংস্করণ' : 'September 2026 Edition'}
            </span>
            <span>•</span>
            <span>Developed for Dhaka commuters by Kazi Shakib.</span>
          </div>
        </div>
      </div>

      {activeModal && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: 'rgba(0, 0, 0, 0.45)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={() => setActiveModal(null)}
        >
          <div
            style={{
              backgroundColor: 'var(--color-surface-raised)',
              borderRadius: '20px',
              maxWidth: '560px',
              width: '100%',
              padding: '28px',
              boxShadow: '0 20px 48px rgba(0,0,0,0.18)',
              border: '1px solid var(--color-hairline)',
              position: 'relative',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: 'var(--color-ink)' }}>
                {activeModal === 'privacy' && (lang === 'bn' ? 'প্রাইভেসি পলিসি' : 'Privacy Policy')}
                {activeModal === 'terms' && (lang === 'bn' ? 'ব্যবহারের শর্তাবলী' : 'Terms of Service')}
                {activeModal === 'security' && (lang === 'bn' ? 'নিরাপত্তা ও সরকারি ডেটা নির্দেশিকা' : 'Security & Government Data Guidelines')}
              </h3>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  border: '1px solid var(--color-hairline)',
                  backgroundColor: 'var(--color-surface)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-ink)',
                }}
              >
                <CloseIcon size={14} color="var(--color-ink)" />
              </button>
            </div>

            <div style={{ fontSize: '14px', lineHeight: 1.65, color: 'var(--color-ink-muted)' }}>
              {activeModal === 'privacy' && (
                <div>
                  <p style={{ marginBottom: '10px' }}>
                    {lang === 'bn'
                      ? 'বাসরুট অ্যাপে আপনার ব্যক্তিগত তথ্যের সর্বোচ্চ সুরক্ষা দেওয়া হয়। এই অ্যাপটি ব্যবহারকারীর কোনো ব্যক্তিগত তথ্য, ফোন নম্বর বা পরিচয় ডেটাবেজে জমা রাখে না।'
                      : 'BusRoute guarantees the utmost privacy for commuters. We do not collect, track, store, or sell any personal identifying information or contact details.'}
                  </p>
                  <p style={{ margin: '0 0 10px 0' }}>
                    {lang === 'bn'
                      ? 'সকল অনুসন্ধান ও রুট প্রসেসিং সরাসরি আপনার ডিভাইসে ব্রাউজারের মাধ্যমে সম্পাদিত হয়। কোনো ট্র্যাকিং বিজ্ঞাপন বা থার্ড পার্টি কুকিজ নেই।'
                      : 'All route matching and calculations execute entirely client-side inside your browser with zero intrusive ad tracking.'}
                  </p>
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: 'var(--color-surface)',
                      border: '1px solid var(--color-hairline)',
                      fontSize: '11.5px',
                      color: 'var(--color-ink)',
                      fontWeight: 500,
                      marginTop: '4px',
                    }}
                  >
                    <CalendarIcon size={12} color="var(--color-ink-muted)" />
                    <span>{lang === 'bn' ? 'ডেটা সর্বশেষ আপডেট: সেপ্টেম্বর ২০২৬' : 'Data last updated: September 2026'}</span>
                  </div>
                </div>
              )}

              {activeModal === 'terms' && (
                <div>
                  <p style={{ marginBottom: '10px' }}>
                    {lang === 'bn'
                      ? 'এই প্ল্যাটফর্মে প্রদর্শিত বাস ভাড়া বিআরটিএ (BRTA) প্রজ্ঞাপিত সরকারি হারের (প্রতি কিমি ২.৭০ টাকা, সর্বনিম্ন ভাড়া ১০ টাকা) উপর ভিত্তি করে হিসাব করা হয়।'
                      : 'The bus fares shown on this platform are computed strictly using official BRTA gazette rates (BDT 2.70 per km, base fare BDT 10).'}
                  </p>
                  <p style={{ margin: '0 0 10px 0' }}>
                    {lang === 'bn'
                      ? 'বাস্তব ক্ষেত্রে সড়কে তীব্র জ্যাম, পরিবর্তিত রুট বা কন্ডাক্টরের ভাংতি না থাকার কারণে ভাড়ায় ৫ টাকা কম-বেশি হতে পারে।'
                      : 'Real-world fares on running buses may slightly vary (±5 Tk) due to local road diversions or coin change availability.'}
                  </p>
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: 'var(--color-surface)',
                      border: '1px solid var(--color-hairline)',
                      fontSize: '11.5px',
                      color: 'var(--color-ink)',
                      fontWeight: 500,
                      marginTop: '4px',
                    }}
                  >
                    <CalendarIcon size={12} color="var(--color-ink-muted)" />
                    <span>{lang === 'bn' ? 'ডেটা সর্বশেষ আপডেট: সেপ্টেম্বর ২০২৬ (বিআরটিএ সরকারি প্রজ্ঞাপন অনুযায়ী)' : 'Data last updated: September 2026 (per official BRTA circular)'}</span>
                  </div>
                </div>
              )}

              {activeModal === 'security' && (
                <div>
                  <p style={{ marginBottom: '10px' }}>
                    {lang === 'bn'
                      ? 'সকল বাস রুট ও স্টপেজ সরকারি গেজেট ও ঢাকা পরিবহন সমন্বয় কর্তৃপক্ষ (ডিটিসিএ)-এর উন্মুক্ত ডেটা থেকে সংগৃহীত। ডেটা স্ট্রাকচার ও অ্যালগরিদম প্রস্তুত করেছেন কাজী সাকিব।'
                      : 'All bus routes and stop coordinates are sourced from official government gazettes and open DTCA documents. The data structure and search routing algorithms were developed and verified by Kazi Shakib.'}
                  </p>
                  <p style={{ margin: '0 0 10px 0' }}>
                    {lang === 'bn'
                      ? 'সাইটটি আধুনিক ও নিরাপদ ওয়েব স্ট্যান্ডার্ড অনুসরণ করে তৈরি, যাতে যাত্রীরা সম্পূর্ণ নিরাপদে ও নির্ভরযোগ্যভাবে সেবা গ্রহণ করতে পারেন।'
                      : 'Engineered following modern, secure web protocols to provide Dhaka city commuters with a safe and dependable public transit guide.'}
                  </p>
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: 'var(--color-surface)',
                      border: '1px solid var(--color-hairline)',
                      fontSize: '11.5px',
                      color: 'var(--color-ink)',
                      fontWeight: 500,
                      marginTop: '4px',
                    }}
                  >
                    <CalendarIcon size={12} color="var(--color-ink-muted)" />
                    <span>{lang === 'bn' ? 'ডেটা সর্বশেষ সংস্করণ ও আপডেট: সেপ্টেম্বর ২০২৬' : 'Data last updated & verified: September 2026'}</span>
                  </div>
                </div>
              )}
            </div>

            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                style={{
                  padding: '8px 20px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'var(--color-button-primary-bg)',
                  color: 'var(--color-button-primary-text)',
                  border: 'none',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {lang === 'bn' ? 'ঠিক আছে' : 'Got it'}
              </button>
            </div>
          </div>
        </div>
      )}

      <ReportModal isOpen={isReportOpen} onClose={() => setIsReportOpen(false)} />
    </footer>
  );
};
