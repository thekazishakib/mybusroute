import React from 'react';
import type { JourneyOption, Stop } from '../data/types';
import { useT, formatNumber } from '../i18n/useT';
import { getStopDisplayName, getRouteDisplayName, getBusOperatingHours } from '../data/load';
import { BusIcon, MapIcon } from './Icons';
import { RouteMap } from './RouteMap';

interface RouteDetailsModalProps {
  option: JourneyOption;
  fromStop: Stop;
  toStop: Stop;
  onBack: () => void;
}

export const RouteDetailsModal: React.FC<RouteDetailsModalProps> = ({
  option,
  fromStop,
  toStop,
  onBack,
}) => {
  const { lang, t } = useT();

  const isDirect = option.transferCount === 0;
  const primaryRoute = option.legs[0]?.primaryRoute;
  const allRoutes = option.legs.flatMap((l) => l.routes);
  const busNames = Array.from(new Set(allRoutes.map((r) => getRouteDisplayName(r, lang)))).join(' / ');
  const allStops = option.legs.flatMap((l, i) => (i === 0 ? l.stops : l.stops.slice(1)));
  const operatingHours = primaryRoute ? getBusOperatingHours(primaryRoute, lang) : null;

  return (
    <div style={{ animation: 'fadeIn 0.2s ease', maxWidth: '1000px', margin: '0 auto' }}>
      <button
        type="button"
        onClick={onBack}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--color-ink-muted)',
          fontSize: '14px',
          fontWeight: 600,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '0 0 16px 0',
        }}
        lang={lang}
      >
        <span>←</span>
        <span>{lang === 'bn' ? 'সার্চ ফলাফলে ফিরে যান' : 'Back to search results'}</span>
      </button>

      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 800, margin: '0 0 4px 0', color: 'var(--color-ink)' }} lang={lang}>
          {lang === 'bn' ? 'রুটের বিস্তারিত' : 'Route Details'}
        </h2>
        <div style={{ fontSize: '15px', color: 'var(--color-ink-muted)', fontWeight: 500 }} lang={lang}>
          {getStopDisplayName(fromStop, lang)} → {getStopDisplayName(toStop, lang)}
        </div>
      </div>

      <div
        style={{
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-hairline)',
          borderRadius: '20px',
          padding: '24px',
          marginBottom: '28px',
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
          flexWrap: 'wrap',
        }}
      >
        <div
          style={{
            width: '76px',
            height: '76px',
            borderRadius: '16px',
            backgroundColor: 'var(--color-surface-raised)',
            border: '1px solid var(--color-hairline)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            color: 'var(--color-ink)',
          }}
        >
          <BusIcon size={38} />
        </div>

        <div style={{ flex: 1, minWidth: '240px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span
              style={{
                backgroundColor: 'var(--color-surface)',
                color: 'var(--color-ink)',
                border: '1px solid var(--color-hairline)',
                fontWeight: 600,
                fontSize: '12.5px',
                padding: '4px 12px',
                borderRadius: '9999px',
              }}
            >
              {isDirect ? (lang === 'bn' ? 'সরাসরি বাস' : 'Direct Bus') : (lang === 'bn' ? 'বাস পরিবর্তন করে' : 'With Transfer')}
            </span>
          </div>

          <h3 style={{ fontSize: '20px', fontWeight: 800, margin: '0 0 8px 0', color: 'var(--color-ink)' }}>
            {busNames}
          </h3>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span className="chip" style={{ fontSize: '12px', fontWeight: 600 }}>
              {formatNumber(option.totalStopsRidden, lang)} {t('stopsCount')}
            </span>
            <span className="chip" style={{ fontSize: '12px', fontWeight: 600 }}>
              {formatNumber(option.totalKm, lang)} {lang === 'bn' ? 'কিমি' : 'km'}
            </span>
            <span className="chip chip-fare" style={{ fontSize: '12px', fontWeight: 700 }}>
              {t('totalFareLabel')} ৳ {formatNumber(option.totalFareTk, lang)}
            </span>
          </div>
        </div>
      </div>

      <div
        style={{
          marginBottom: '28px',
          borderRadius: '20px',
          overflow: 'hidden',
          border: '1px solid var(--color-hairline)',
          backgroundColor: 'var(--color-surface)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
        }}
      >
        <div
          style={{
            padding: '16px 20px 12px',
            borderBottom: '1px solid var(--color-hairline)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#0a0a0a',
                display: 'inline-block',
              }}
            />
            <h3 style={{ fontSize: '15px', fontWeight: 700, margin: 0, color: 'var(--color-ink)' }} lang={lang}>
              {lang === 'bn' ? 'রুটের ম্যাপ ও স্টপেজ ট্র্যাকিং' : 'Route Map & Stoppage Tracking'}
            </h3>
          </div>
          <span style={{ fontSize: '12.5px', color: 'var(--color-ink-muted)', fontWeight: 600 }}>
            {formatNumber(allStops.length, lang)} {lang === 'bn' ? 'টি স্টপ' : 'stops'} • {formatNumber(option.totalKm, lang)} {lang === 'bn' ? 'কিমি' : 'km'}
          </span>
        </div>

        <RouteMap
          stops={allStops}
          fromStop={fromStop}
          toStop={toStop}
          transferStop={option.transferStops?.[0] || null}
        />
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '24px',
          marginBottom: '28px',
        }}
      >
        <div
          style={{
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-hairline)',
            borderRadius: '20px',
            padding: '24px',
          }}
        >
          <h4 style={{ fontSize: '17px', fontWeight: 700, margin: '0 0 18px 0', color: 'var(--color-ink)' }} lang={lang}>
            {lang === 'bn' ? 'স্টপেজের তালিকা' : 'Stops Timeline'}
          </h4>

          <div style={{ position: 'relative', paddingLeft: '8px' }}>
            {allStops.map((st, idx) => {
              const isStart = st.id === fromStop.id;
              const isEnd = st.id === toStop.id;
              const isTransfer = option.transferStops.some((ts) => ts.id === st.id);

              return (
                <div
                  key={st.id || idx}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '14px',
                    position: 'relative',
                    paddingBottom: idx === allStops.length - 1 ? '0' : '20px',
                  }}
                >
                  {idx < allStops.length - 1 && (
                    <div
                      style={{
                        position: 'absolute',
                        left: '11px',
                        top: '22px',
                        bottom: '0',
                        width: '2px',
                        backgroundColor: 'var(--color-hairline)',
                      }}
                    />
                  )}

                  <span
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: isStart || isEnd ? '#0a0a0a' : isTransfer ? '#525252' : '#ffffff',
                      border: isStart || isEnd || isTransfer ? 'none' : '2px solid var(--color-hairline-strong)',
                      color: isStart || isEnd || isTransfer ? '#ffffff' : 'var(--color-ink-muted)',
                      fontSize: '11px',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 2,
                      flexShrink: 0,
                    }}
                  >
                    {idx + 1}
                  </span>

                  <div>
                    <div style={{ fontWeight: isStart || isEnd || isTransfer ? 700 : 500, fontSize: '15px', color: 'var(--color-ink)' }}>
                      {getStopDisplayName(st, lang)}
                    </div>
                    {isStart && (
                      <div style={{ fontSize: '12px', color: 'var(--color-ink-muted)', fontWeight: 600 }}>
                        ({lang === 'bn' ? 'উৎস স্থান' : 'Origin'})
                      </div>
                    )}
                    {isEnd && (
                      <div style={{ fontSize: '12px', color: 'var(--color-ink-muted)', fontWeight: 600 }}>
                        ({lang === 'bn' ? 'গন্তব্য' : 'Destination'})
                      </div>
                    )}
                    {isTransfer && (
                      <div style={{ fontSize: '12px', color: 'var(--color-ink-muted)', fontWeight: 600 }}>
                        ({lang === 'bn' ? 'বাস পরিবর্তনের স্থান' : 'Transfer Stop'})
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div
          style={{
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-hairline)',
            borderRadius: '20px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <h4 style={{ fontSize: '17px', fontWeight: 700, margin: '0 0 6px 0', color: 'var(--color-ink)' }} lang={lang}>
            {lang === 'bn' ? 'ভাড়া ও তথ্য' : 'Fare & Journey Details'}
          </h4>

          <div
            style={{
              padding: '14px 16px',
              backgroundColor: 'var(--color-surface-raised)',
              borderRadius: '12px',
              border: '1px solid var(--color-hairline)',
            }}
          >
            <div style={{ fontSize: '12px', color: 'var(--color-ink-muted)' }}>{t('totalFareLabel')}</div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-ink)' }}>
              ৳ {formatNumber(option.totalFareTk, lang)}{' '}
              <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--color-ink-muted)' }}>
                ({lang === 'bn' ? 'সরকারি হার' : 'Official Rate'})
              </span>
            </div>
            <div style={{ fontSize: '11.5px', color: 'var(--color-ink-muted)', marginTop: '4px' }}>
              * {lang === 'bn' ? 'শিক্ষার্থীদের হাফ ভাড়া শুধুমাত্র ছুটির দিন বাদে' : 'Student half fare applicable (except holidays)'}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-hairline-soft)', paddingBottom: '8px' }}>
              <span style={{ color: 'var(--color-ink-muted)' }}>{lang === 'bn' ? 'বাসের নাম:' : 'Bus Name:'}</span>
              <strong style={{ color: 'var(--color-ink)' }}>{busNames}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-hairline-soft)', paddingBottom: '8px' }}>
              <span style={{ color: 'var(--color-ink-muted)' }}>{lang === 'bn' ? 'যাত্রার ধরন:' : 'Service:'}</span>
              <strong style={{ color: 'var(--color-ink)' }}>
                {isDirect ? (lang === 'bn' ? 'সরাসরি রুট' : 'Direct') : (lang === 'bn' ? '১ বার পরিবর্তন' : '1 Transfer')}
              </strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-hairline-soft)', paddingBottom: '8px' }}>
              <span style={{ color: 'var(--color-ink-muted)' }}>{lang === 'bn' ? 'মোট দূরত্ব:' : 'Total Distance:'}</span>
              <strong style={{ color: 'var(--color-ink)' }}>
                {formatNumber(option.totalKm, lang)} {lang === 'bn' ? 'কিমি' : 'km'}
              </strong>
            </div>

            {operatingHours && !operatingHours.isUnknown && (
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-hairline-soft)', paddingBottom: '8px' }}>
                <span style={{ color: 'var(--color-ink-muted)' }}>{t('operatingHoursLabel')}</span>
                <strong style={{ color: 'var(--color-ink)' }}>{operatingHours.hoursStr}</strong>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '4px' }}>
              <span style={{ color: 'var(--color-ink-muted)' }}>{lang === 'bn' ? 'ভাংতি নীতি:' : 'Change Policy:'}</span>
              <span className="chip" style={{ fontSize: '12px', fontWeight: 600 }}>
                {t('fareVariationShort')}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          padding: '14px 20px',
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-hairline)',
          borderRadius: '14px',
          fontSize: '13px',
          color: 'var(--color-ink-muted)',
          lineHeight: 1.5,
        }}
        lang={lang}
      >
        <strong>{lang === 'bn' ? 'বিশেষ সতর্কতা:' : 'Note:'}</strong>{' '}
        {lang === 'bn'
          ? 'ট্রাফিকের কারণে সময় ও ভাড়ার তথ্য পরিবর্তিত হতে পারে। কন্ডাক্টরের কাছে ভাংতি না থাকলে সামান্য কম-বেশি হতে পারে।'
          : 'Travel time and fares may vary due to city traffic. Conductors may adjust ±5 Tk when small change is unavailable.'}
      </div>

      <div style={{ marginTop: '24px', textAlign: 'center' }}>
        <button
          type="button"
          onClick={onBack}
          style={{
            backgroundColor: '#0a0a0a',
            color: '#ffffff',
            borderRadius: 'var(--radius-full)',
            padding: '12px 28px',
            fontSize: '14px',
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
            transition: 'opacity 0.15s ease',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
          }}
          lang={lang}
        >
          <span>←</span>
          <span>{lang === 'bn' ? 'সার্চ ফলাফলে ফিরে যান' : 'Back to search results'}</span>
        </button>
      </div>
    </div>
  );
};
