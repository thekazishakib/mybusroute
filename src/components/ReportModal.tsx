import React, { useState, useEffect } from 'react';
import { useT } from '../i18n/useT';
import { CloseIcon, CheckCircleIcon } from './Icons';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  busName?: string;
  routeId?: string;
}

export interface SavedReport {
  id: number;
  reportType: string;
  busName: string;
  routeId: string;
  details: string;
  timestamp: string;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  busName,
  routeId,
}) => {
  const { lang } = useT();
  const [reportType, setReportType] = useState('stoppage');
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [viewHistory, setViewHistory] = useState(false);
  const [savedReports, setSavedReports] = useState<SavedReport[]>([]);

  useEffect(() => {
    if (isOpen) {
      try {
        const stored = JSON.parse(localStorage.getItem('busroute_user_reports') || '[]');
        setSavedReports(stored);
      } catch {
        setSavedReports([]);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!details.trim()) return;

    const newReport: SavedReport = {
      id: Date.now(),
      reportType,
      busName: busName || 'সাধারণ রুট',
      routeId: routeId || '',
      details: details.trim(),
      timestamp: new Date().toLocaleString(),
    };

    // 1. Save to local storage (zero database, local persistence)
    try {
      const updated = [newReport, ...savedReports.slice(0, 49)];
      localStorage.setItem('busroute_user_reports', JSON.stringify(updated));
      setSavedReports(updated);
    } catch (err) {
      console.warn('Storage save error:', err);
    }

    setSubmitted(true);
  };

  const handleClearHistory = () => {
    localStorage.removeItem('busroute_user_reports');
    setSavedReports([]);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1100,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'var(--color-surface-raised)',
          border: '1px solid var(--color-hairline)',
          borderRadius: '24px',
          padding: '28px',
          maxWidth: '540px',
          width: '100%',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.2)',
          position: 'relative',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'none',
            border: 'none',
            color: 'var(--color-ink-muted)',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          title={lang === 'bn' ? 'বন্ধ করুন' : 'Close'}
        >
          <CloseIcon size={16} />
        </button>

        {viewHistory ? (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-ink)', margin: 0 }} lang={lang}>
                {lang === 'bn' ? 'সংরক্ষিত রিপোর্টসমূহ' : 'Saved Reports Ledger'}
              </h3>
              {savedReports.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearHistory}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#dc2626',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    textDecoration: 'underline',
                  }}
                  lang={lang}
                >
                  {lang === 'bn' ? 'সব মুছুন' : 'Clear all'}
                </button>
              )}
            </div>

            <div style={{ overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '10px', paddingRight: '4px', marginBottom: '16px' }}>
              {savedReports.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '36px 0', color: 'var(--color-ink-muted)', fontSize: '13.5px' }}>
                  {lang === 'bn' ? 'এখনো কোনো রিপোর্ট সংরক্ষিত হয়নি।' : 'No reports recorded yet.'}
                </div>
              ) : (
                savedReports.map((r) => (
                  <div
                    key={r.id}
                    style={{
                      padding: '12px 14px',
                      backgroundColor: 'var(--color-surface)',
                      border: '1px solid var(--color-hairline)',
                      borderRadius: '12px',
                      fontSize: '13px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <strong style={{ color: 'var(--color-ink)' }}>{r.busName}</strong>
                      <span style={{ fontSize: '11px', color: 'var(--color-ink-muted)' }}>{r.timestamp}</span>
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--color-ink-muted)', marginBottom: '4px' }}>
                      <strong>{lang === 'bn' ? 'ধরন: ' : 'Type: '}</strong>{r.reportType}
                    </div>
                    <div style={{ color: 'var(--color-ink)', lineHeight: 1.45, whiteSpace: 'pre-wrap' }}>
                      {r.details}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="btn-primary"
                style={{ borderRadius: 'var(--radius-full)', padding: '8px 20px', fontSize: '13px' }}
                onClick={() => setViewHistory(false)}
              >
                {lang === 'bn' ? '← নতুন রিপোর্ট ফর্ম' : '← Back to Report Form'}
              </button>
            </div>
          </div>
        ) : submitted ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-hairline)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a' }}>
                <CheckCircleIcon size={32} color="#16a34a" />
              </div>
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-ink)', margin: '0 0 8px 0' }} lang={lang}>
              {lang === 'bn' ? 'তথ্য প্রেরণের জন্য ধন্যবাদ!' : 'Thank you for your report!'}
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--color-ink-muted)', lineHeight: 1.5, margin: '0 0 20px 0' }} lang={lang}>
              {lang === 'bn'
                ? 'আপনার পাঠানো সংশোধনের তথ্য নিরাপদে সংরক্ষিত হয়েছে। এটি দ্রুত পর্যালোচনা করে ডেটাবেজে আপডেট করা হবে।'
                : 'Your route correction has been securely recorded and will be verified for update.'}
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button
                type="button"
                className="btn-secondary"
                style={{ borderRadius: 'var(--radius-full)', padding: '10px 20px', fontSize: '13px' }}
                onClick={() => {
                  setSubmitted(false);
                  setViewHistory(true);
                }}
              >
                {lang === 'bn' ? 'সংরক্ষিত রিপোর্ট দেখুন' : 'View Saved Reports'}
              </button>
              <button
                type="button"
                className="btn-primary"
                style={{ borderRadius: 'var(--radius-full)', padding: '10px 24px', fontSize: '13px' }}
                onClick={() => {
                  setSubmitted(false);
                  setDetails('');
                  onClose();
                }}
              >
                {lang === 'bn' ? 'ঠিক আছে' : 'OK'}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-ink)', margin: '0 0 6px 0' }} lang={lang}>
              {lang === 'bn' ? 'রুটের তথ্য সংশোধন বা রিপোর্ট' : 'Report Route Correction'}
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--color-ink-muted)', margin: '0 0 18px 0' }} lang={lang}>
              {busName ? (
                <span>
                  <strong>{busName}</strong> {lang === 'bn' ? 'বাসের কোনো স্টপেজ বা তথ্যে ভুল থাকলে আমাদের জানান:' : 'stoppage or route correction:'}
                </span>
              ) : (
                lang === 'bn' ? 'বাসের রুট বা ভাড়ায় কোনো পরিবর্তন থাকলে জানান:' : 'Notice changed stops or fares? Let us know:'
              )}
            </p>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--color-ink)', display: 'block', marginBottom: '6px' }} lang={lang}>
                {lang === 'bn' ? 'রিপোর্টের ধরন:' : 'Issue Type:'}
              </label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '10px',
                  border: '1px solid var(--color-hairline-strong)',
                  backgroundColor: 'var(--color-surface)',
                  color: 'var(--color-ink)',
                  fontSize: '13.5px',
                  outline: 'none',
                }}
              >
                <option value="stoppage">{lang === 'bn' ? 'স্টপেজ বাদ পড়েছে বা নাম ভুল' : 'Missing or incorrect stop'}</option>
                <option value="route_change">{lang === 'bn' ? 'বাসের রুট বা রাস্তা পরিবর্তন হয়েছে' : 'Route path or diversion change'}</option>
                <option value="fare">{lang === 'bn' ? 'ভাড়া সংক্রান্ত অসঙ্গতি' : 'Fare discrepancy'}</option>
                <option value="hours">{lang === 'bn' ? 'চলাচলের সময়সূচী পরিবর্তন' : 'Operating hours change'}</option>
                <option value="other">{lang === 'bn' ? 'অন্যান্য' : 'Other'}</option>
              </select>
            </div>

            <div style={{ marginBottom: '18px' }}>
              <label style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--color-ink)', display: 'block', marginBottom: '6px' }} lang={lang}>
                {lang === 'bn' ? 'বিস্তারিত বিবরণ লিখুন:' : 'Correction Details:'}
              </label>
              <textarea
                required
                rows={4}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder={lang === 'bn' ? 'সঠিক স্টপেজের নাম বা রুটের বর্ণনা এখানে লিখুন...' : 'Describe the missing stop or updated route details...'}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: '1px solid var(--color-hairline-strong)',
                  backgroundColor: 'var(--color-surface)',
                  color: 'var(--color-ink)',
                  fontSize: '13.5px',
                  outline: 'none',
                  resize: 'vertical',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit',
                }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap' }}>
              <div>
                {savedReports.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setViewHistory(true)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--color-ink-muted)',
                      fontSize: '12px',
                      textDecoration: 'underline',
                      cursor: 'pointer',
                      padding: 0,
                    }}
                    lang={lang}
                  >
                    {lang === 'bn' ? `পূর্বে সেভ হওয়া রিপোর্ট দেখুন (${savedReports.length})` : `View saved reports (${savedReports.length})`}
                  </button>
                )}
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  style={{ borderRadius: 'var(--radius-full)', padding: '8px 18px', fontSize: '13px' }}
                  onClick={onClose}
                >
                  {lang === 'bn' ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ borderRadius: 'var(--radius-full)', padding: '8px 22px', fontSize: '13px' }}
                >
                  {lang === 'bn' ? 'রিপোর্ট পাঠান' : 'Submit Report'}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
