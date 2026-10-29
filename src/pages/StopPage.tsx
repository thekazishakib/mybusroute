import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useT, formatNumber } from '../i18n/useT';
import {
  getStopById,
  getRouteById,
  getRouteDisplayName,
  getStopDisplayName,
  getBusOperatingHours,
  isRouteIncomplete,
  isStopIncomplete,
} from '../data/load';
import { Notice } from '../components/Notice';
import type { Route } from '../data/types';

export const StopPage: React.FC = () => {
  const { stopId } = useParams<{ stopId: string }>();
  const { lang, t } = useT();

  const stop = stopId ? getStopById(stopId) : undefined;

  if (!stop) {
    return (
      <main className="container-wide" style={{ paddingTop: '48px', paddingBottom: '64px' }}>
        <div className="container-narrow">
          <Notice>{t('stopNotFound')}</Notice>
          <div style={{ marginTop: '24px' }}>
            <Link to="/" className="btn-secondary" lang={lang}>
              {t('backToHome')}
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Deduplicate routes
  const seenRouteIds = new Set<string>();
  const passingRoutes: Route[] = [];
  for (const id of stop.bus_ids) {
    const r = getRouteById(id);
    if (r && !seenRouteIds.has(r.id)) {
      seenRouteIds.add(r.id);
      passingRoutes.push(r);
    }
  }

  const incomplete = isStopIncomplete(stop);

  return (
    <main className="container-wide" style={{ paddingBottom: '64px' }}>
      <section
        className="pastel-block pastel-block-lime"
        data-testid="stop-header-block"
      >
        <div style={{ marginBottom: '8px', fontFamily: 'var(--font-mono)', fontSize: '14px' }} lang={lang}>
          {t('stopPageEyebrow')} • <span>{stop.id}</span>
        </div>
        <h1 className="display-title" lang={lang}>
          {getStopDisplayName(stop, lang)}
        </h1>
        {lang === 'bn' && stop.name_en && (
          <p className="block-subhead" lang="en" style={{ marginBottom: '8px', fontSize: '18px', color: 'var(--color-ink-muted)' }}>
            ({stop.name_en})
          </p>
        )}
        {lang === 'en' && stop.name_bn && (
          <p className="block-subhead" lang="bn" style={{ marginBottom: '8px', fontSize: '18px', color: 'var(--color-ink-muted)' }}>
            ({stop.name_bn})
          </p>
        )}

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', marginTop: '12px' }}>
          <span className="caption" lang={lang}>
            {t('busesThroughStopHeading')}: {formatNumber(passingRoutes.length, lang)}
          </span>
          <span>•</span>
          <span className="caption" lang="en">
            GPS: {stop.lat.toFixed(4)}, {stop.lng.toFixed(4)}
          </span>
          <span className="chip" lang="en" style={{ fontSize: '11px' }}>
            Coord Confidence: {stop.coord_confidence}
          </span>
        </div>

        {stop.aliases && stop.aliases.length > 0 && (
          <div style={{ marginTop: '12px', fontSize: '14px' }} lang="en">
            <strong>Aliases / Site spellings:</strong> {stop.aliases.join(', ')}
          </div>
        )}
      </section>

      <section className="container-narrow section-gap">
        <div style={{ marginBottom: '24px' }}>
          <Link to="/" className="btn-secondary" lang={lang}>
            ← {t('backToHome')}
          </Link>
        </div>

        <div className="bus-card">
          <h2 className="card-title" lang={lang} style={{ marginBottom: '16px' }}>
            {t('busesThroughStopHeading')} ({formatNumber(passingRoutes.length, lang)})
          </h2>
          <ul className="stop-list">
            {passingRoutes.map((bus) => {
              const busName = getRouteDisplayName(bus, lang);
              const nameLang = lang === 'bn' && bus.name_bn ? 'bn' : 'en';
              const busIncomplete = isRouteIncomplete(bus);
              const hours = getBusOperatingHours(bus, lang);

              return (
                <li key={bus.id} className="stop-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      flexWrap: 'wrap',
                    }}
                  >
                    <Link
                      to={`/bus/${bus.id}`}
                      lang={nameLang}
                      style={{
                        textDecoration: 'underline',
                        textUnderlineOffset: '4px',
                        fontWeight: 600,
                        fontSize: '16px',
                      }}
                    >
                      {busName}
                    </Link>

                    {hours.isUnknown ? (
                      <span className="chip chip-unknown" lang={lang} style={{ fontSize: '11px' }}>
                        {t('hoursUnknown')}
                      </span>
                    ) : (
                      <span className="caption" lang="en" style={{ fontSize: '12px' }}>
                        {hours.hoursStr}
                      </span>
                    )}
                  </div>

                  <span className="caption" lang={lang}>
                    {formatNumber(bus.stop_count, lang)} {t('stopsCount')}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </main>
  );
};
