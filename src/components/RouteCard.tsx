import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useT, formatNumber } from '../i18n/useT';
import { getRouteDisplayName, getStopDisplayName, getBusOperatingHours } from '../data/load';
import { StopList } from './StopList';
import type { JourneyOption } from '../data/types';

interface RouteCardProps {
  option: JourneyOption;
  index: number;
}

export const RouteCard: React.FC<RouteCardProps> = ({ option, index }) => {
  const { lang, t } = useT();
  const [isCardExpanded, setIsCardExpanded] = useState(false);

  const transferHeading =
    option.transferCount === 0
      ? t('directRoute')
      : option.transferCount === 1
      ? t('oneTransfer')
      : t('twoTransfers');

  // Collect all bus routes across all legs
  const allRoutes = option.legs.flatMap((l) => l.routes);
  const uniqueRoutes = Array.from(
    new Map(allRoutes.map((r) => [r.id, r])).values()
  );

  const startStop = option.legs[0]?.fromStop;
  const finalStop = option.legs[option.legs.length - 1]?.toStop;

  return (
    <article
      className="bus-card"
      data-testid={`journey-option-${index}`}
      lang={lang}
      style={{
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-hairline)',
        borderRadius: 'var(--radius-md)',
        marginBottom: '16px',
        overflow: 'hidden',
        transition: 'border-color 0.15s ease',
      }}
    >
      <div
        onClick={() => setIsCardExpanded(!isCardExpanded)}
        style={{
          padding: '16px',
          cursor: 'pointer',
          backgroundColor: isCardExpanded ? 'var(--color-surface-raised)' : 'transparent',
          transition: 'background-color 0.15s ease',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span className="eyebrow" lang={lang} style={{ color: 'var(--color-block-lime)', fontWeight: 700 }}>
                {formatNumber(index + 1, lang)}. {transferHeading}
              </span>
              <span style={{ fontSize: '13px', color: 'var(--color-ink-muted)' }}>
                • {formatNumber(option.totalKm, lang)} {lang === 'bn' ? 'কিমি' : 'km'} • {formatNumber(option.totalStopsRidden, lang)} {t('stopsCount')}
              </span>
            </div>

            <div style={{ marginTop: '6px', fontSize: '15px', fontWeight: 600, color: 'var(--color-ink)' }}>
              <span>{getStopDisplayName(startStop, lang)}</span>
              {option.transferStops.map((ts, idx) => (
                <span key={idx} style={{ color: 'var(--color-ink-muted)' }}>
                  {' → '}
                  <span style={{ color: 'var(--color-block-lilac)' }}>{getStopDisplayName(ts, lang)}</span>
                </span>
              ))}
              <span style={{ color: 'var(--color-ink-muted)' }}>{' → '}</span>
              <span>{getStopDisplayName(finalStop, lang)}</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span
              className="chip chip-fare"
              style={{ fontWeight: 700, fontSize: '15px' }}
              lang={lang}
            >
              {t('totalFareLabel')} {t('aboutFare')} {formatNumber(option.totalFareTk, lang)}
            </span>
            <span
              style={{ fontSize: '11px', color: 'var(--color-ink-muted)' }}
              lang={lang}
            >
              ({t('fareVariationShort')})
            </span>
          </div>
        </div>

        <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '13px', color: 'var(--color-ink-muted)' }}>
            {lang === 'bn' ? 'উপলব্ধ বাসসমূহ:' : 'Buses:'}
          </span>
          <div className="picker-chips" style={{ display: 'inline-flex', flexWrap: 'wrap', gap: '6px' }}>
            {uniqueRoutes.map((r) => {
              const rName = getRouteDisplayName(r, lang);
              return (
                <span
                  key={r.id}
                  className="chip"
                  style={{ fontSize: '13px', fontWeight: 600 }}
                  lang={lang}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Link
                    to={`/bus/${r.id}`}
                    style={{ color: 'inherit', textDecoration: 'none' }}
                  >
                    {rName}
                  </Link>
                </span>
              );
            })}
          </div>
        </div>

        <div
          style={{
            marginTop: '12px',
            paddingTop: '8px',
            borderTop: '1px solid var(--color-hairline-soft)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '13px',
            color: 'var(--color-ink-muted)',
          }}
        >
          <span style={{ color: isCardExpanded ? 'var(--color-block-lime)' : 'var(--color-ink-muted)', fontWeight: 500 }}>
            {isCardExpanded
              ? (lang === 'bn' ? '▲ রুট ও স্টপ বিস্তারিত লুকান' : '▲ Hide route details')
              : (lang === 'bn' ? '▼ সম্পূর্ণ রুট ও স্টপ দেখতে ক্লিক করুন' : '▼ Click to view full stops sequence')}
          </span>
          <span style={{ fontSize: '12px' }}>
            {isCardExpanded ? '▲' : '▼'}
          </span>
        </div>
      </div>

      {isCardExpanded && (
        <div style={{ padding: '16px', borderTop: '1px solid var(--color-hairline)' }}>
          {option.legs.map((leg, legIdx) => {
            const primaryRoute = leg.primaryRoute;
            const primaryRouteTitle = getRouteDisplayName(primaryRoute, lang);
            const hoursInfo = getBusOperatingHours(primaryRoute, lang);

            return (
              <React.Fragment key={legIdx}>
                {legIdx > 0 && (
                  <div
                    style={{
                      padding: '10px 14px',
                      backgroundColor: 'var(--color-surface-raised)',
                      border: '1px solid var(--color-hairline)',
                      borderRadius: 'var(--radius-md)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '8px',
                      marginBottom: '12px',
                    }}
                  >
                    <div>
                      <span lang={lang} style={{ fontWeight: 600, color: 'var(--color-block-lilac)' }}>
                        {t('changeAt')}{' '}
                      </span>
                      <Link
                        to={`/stop/${leg.fromStop.id}`}
                        lang={lang}
                        style={{
                          textDecoration: 'underline',
                          textUnderlineOffset: '4px',
                          fontWeight: 700,
                          color: 'var(--color-ink)',
                        }}
                      >
                        {getStopDisplayName(leg.fromStop, lang)}
                      </Link>
                    </div>
                    <span className="caption" lang={lang} style={{ fontSize: '12px' }}>
                      {lang === 'bn' ? '(নতুন সর্বনিম্ন ১০ টাকা)' : '(Fresh min Tk 10)'}
                    </span>
                  </div>
                )}

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    padding: '8px 0 16px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '12px',
                    }}
                  >
                    <div>
                      {option.legs.length > 1 && (
                        <div className="eyebrow" lang={lang} style={{ marginBottom: '4px' }}>
                          {t('legLabel')} {formatNumber(legIdx + 1, lang)}
                        </div>
                      )}

                      <h3 className="card-title" lang={lang} style={{ margin: '0 0 6px' }}>
                        <Link
                          to={`/bus/${primaryRoute.id}`}
                          style={{ textDecoration: 'underline', textUnderlineOffset: '4px' }}
                        >
                          {primaryRouteTitle}
                        </Link>
                      </h3>

                      <div style={{ marginTop: '2px', fontSize: '13px' }}>
                        <span lang={lang} style={{ color: 'var(--color-ink-muted)' }}>
                          {t('operatingHoursLabel')}{' '}
                        </span>
                        {hoursInfo.isUnknown ? (
                          <span className="chip chip-unknown" lang={lang} style={{ fontSize: '11px' }}>
                            {t('hoursUnknown')}
                          </span>
                        ) : (
                          <strong lang={lang}>{hoursInfo.hoursStr}</strong>
                        )}
                      </div>

                      <div style={{ marginTop: '8px', fontSize: '14px' }}>
                        <p style={{ margin: '4px 0' }} lang={lang}>
                          <strong lang={lang}>{t('boardAt')}</strong> {getStopDisplayName(leg.fromStop, lang)} →{' '}
                          <strong lang={lang}>{t('getOffAt')}</strong> {getStopDisplayName(leg.toStop, lang)}
                        </p>
                        <p className="caption" lang={lang} style={{ margin: '2px 0' }}>
                          {formatNumber(leg.stopsBetween, lang)} {t('stopsBetweenCount')} ({formatNumber(leg.stopsRidden, lang)} {t('stopsCount')} total) • {formatNumber(leg.estKm, lang)} {lang === 'bn' ? 'কিমি' : 'km'}
                        </p>
                        <p style={{ margin: '4px 0', fontWeight: 600, color: 'var(--color-accent-forest)' }} lang={lang}>
                          {t('fareLabel')} {t('aboutFare')} {formatNumber(leg.estFareTk, lang)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {leg.routes.length > 1 && (
                    <div style={{ marginTop: '6px' }}>
                      <div className="caption" lang={lang} style={{ marginBottom: '4px' }}>
                        {t('matchingBusesInGroup')} ({formatNumber(leg.routes.length, lang)}):
                      </div>
                      <div className="picker-chips" style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {leg.routes.map((r) => {
                          const rName = getRouteDisplayName(r, lang);
                          return (
                            <Link
                              key={r.id}
                              to={`/bus/${r.id}`}
                              className="chip"
                              lang={lang}
                            >
                              {rName}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div
                    style={{
                      marginTop: '10px',
                      paddingTop: '10px',
                      borderTop: '1px solid var(--color-hairline-soft)',
                    }}
                  >
                    <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: 'var(--color-ink-muted)' }}>
                      {lang === 'bn' ? 'এই অংশের স্টপ তালিকা:' : 'Stops on this leg:'}
                    </div>
                    <StopList
                      stops={leg.stops}
                      highlightStopIds={new Set([leg.fromStop.id, leg.toStop.id])}
                    />
                  </div>
                </div>
              </React.Fragment>
            );
          })}

          <div style={{ marginTop: '12px', paddingTop: '8px', borderTop: '1px dashed var(--color-hairline)' }}>
            <p className="caption" style={{ fontSize: '12px', color: 'var(--color-ink-muted)', lineHeight: '1.5' }} lang={lang}>
              {t('fareEstimateDisclaimer')}
            </p>
          </div>
        </div>
      )}
    </article>
  );
};
