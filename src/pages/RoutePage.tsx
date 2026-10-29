import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useT, formatNumber } from '../i18n/useT';
import {
  getRouteById,
  getStopById,
  getRouteDisplayName,
  getBusOperatingHours,
  isRouteIncomplete,
} from '../data/load';
import { StopList } from '../components/StopList';
import { RouteMap } from '../components/RouteMap';
import { Notice } from '../components/Notice';
import type { Stop } from '../data/types';

export const RoutePage: React.FC = () => {
  const { routeId } = useParams<{ routeId: string }>();
  const { lang, t } = useT();

  const route = routeId ? getRouteById(routeId) : undefined;

  if (!route) {
    return (
      <main className="container-wide" style={{ paddingTop: '48px', paddingBottom: '64px' }}>
        <div className="container-narrow">
          <Notice>{t('busNotFound')}</Notice>
          <div style={{ marginTop: '24px' }}>
            <Link to="/" className="btn-secondary" lang={lang}>
              {t('backToHome')}
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const orderedStops: Stop[] = route.stops
    .map((sId) => getStopById(sId))
    .filter((s): s is Stop => Boolean(s));

  const displayName = getRouteDisplayName(route, lang);
  const titleLang = lang === 'bn' && route.name_bn ? 'bn' : 'en';
  const incomplete = isRouteIncomplete(route);
  const hoursInfo = getBusOperatingHours(route, lang);

  const [isHeaderScrolled, setIsHeaderScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsHeaderScrolled(window.scrollY > 180);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <main className="container-wide" style={{ paddingBottom: '64px' }}>
      <section
        className="pastel-block pastel-block-lilac"
        data-testid="bus-header-block"
      >
        <div style={{ marginBottom: '8px', fontSize: '14px', fontWeight: 600 }} lang={lang}>
          {t('busPageEyebrow')} • <span>{route.service_type || (lang === 'bn' ? 'অনুমোদিত রুট' : 'Authorized Route')}</span>
        </div>
        <h1 className="display-title" lang={titleLang}>
          {displayName}
        </h1>
        {route.name_bn && (
          <p className="block-subhead" lang="bn" style={{ marginBottom: '8px', fontSize: '20px' }}>
            {route.name_bn}
          </p>
        )}
        {route.name_en !== displayName && (
          <p className="block-subhead" lang="en" style={{ marginBottom: '16px' }}>
            {route.name_en}
          </p>
        )}

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '16px',
            fontSize: '16px',
            marginTop: '16px',
            alignItems: 'center',
          }}
        >
          <span lang={lang}>{t('bothDirections')}</span>
          <span>•</span>
          <span lang={lang}>
            {t('totalStopsOnRoute')} {formatNumber(orderedStops.length, lang)}
          </span>
          {route.service_type && (
            <>
              <span>•</span>
              <span lang={lang}>
                {t('serviceTypeLabel')}{' '}
                <span lang="en">{route.service_type}</span>
              </span>
            </>
          )}
          <span>•</span>
          <div>
            <span lang={lang} style={{ color: 'var(--color-ink-muted)' }}>
              {t('operatingHoursLabel')}{' '}
            </span>
            {hoursInfo.isUnknown ? (
              <span className="chip chip-unknown" lang={lang}>
                {t('hoursUnknown')}
              </span>
            ) : (
              <strong lang="en">{hoursInfo.hoursStr}</strong>
            )}
          </div>
        </div>
      </section>

      {isHeaderScrolled && (
        <div
          style={{
            position: 'sticky',
            top: '72px',
            zIndex: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.96)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderRadius: '9999px',
            padding: '10px 24px',
            border: '1px solid var(--color-hairline)',
            boxShadow: '0 8px 28px rgba(0,0,0,0.1)',
            maxWidth: '480px',
            margin: '0 auto 16px auto',
          }}
        >
          <h2
            style={{
              fontSize: '18px',
              fontWeight: 800,
              color: 'var(--color-ink)',
              margin: 0,
              textAlign: 'center',
            }}
            lang={titleLang}
          >
            {displayName}
          </h2>
        </div>
      )}

      <section style={{ maxWidth: '1240px', margin: '32px auto 0' }}>
        <div style={{ marginBottom: '24px' }}>
          <Link to="/routes" className="btn-secondary" lang={lang}>
            ← {lang === 'bn' ? 'সকল বাস রুট' : 'All Bus Routes'}
          </Link>
        </div>

        <div
          style={{
            alignItems: 'start',
          }}
          className="routes-split-layout"
        >
          <div>
            <h2 style={{ fontSize: '22px', marginBottom: '16px', fontWeight: 800 }} lang={lang}>
              {t('orderedStopsHeading')}
            </h2>
            <StopList stops={orderedStops} />
          </div>

          <div
            className="sticky-route-map"
            style={{
              position: 'sticky',
              top: '84px',
              height: '580px',
              maxHeight: 'calc(100vh - 100px)',
              borderRadius: '24px',
              overflow: 'hidden',
              border: '1px solid var(--color-hairline)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.06)',
              backgroundColor: '#ffffff',
            }}
          >
            <RouteMap
              stops={orderedStops}
              fromStop={orderedStops[0] || null}
              toStop={orderedStops[orderedStops.length - 1] || null}
              viewMode="map"
              onToggleViewMode={() => {}}
            />
          </div>
        </div>
      </section>
    </main>
  );
};
