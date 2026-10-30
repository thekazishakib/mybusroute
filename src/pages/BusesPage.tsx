import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useT, formatNumber } from '../i18n/useT';
import {
  routes,
  getRouteById,
  getStopById,
  getRouteDisplayName,
  getStopDisplayName,
  getBusOperatingHours,
  getRouteConfidence,
} from '../data/load';
import { RouteMap } from '../components/RouteMap';
import { SearchIcon, PinIcon, BusIcon, ClockIcon, CloseIcon, ArrowRightIcon, TransferIcon, CheckIcon, EditIcon } from '../components/Icons';
import { SEOHead } from '../seo/SEOHead';
import { ReportModal } from '../components/ReportModal';
import { trackRouteView } from '../analytics/ga4';
import type { Route, Stop } from '../data/types';

export const BusesPage: React.FC = () => {
  const { lang, t } = useT();
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRouteId, setSelectedRouteId] = useState<string>(() => {
    return searchParams.get('bus') || 'baishakhi';
  });

  const [isHeaderScrolled, setIsHeaderScrolled] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsHeaderScrolled(window.scrollY > 200);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const busParam = searchParams.get('bus');
    if (busParam && busParam !== selectedRouteId) {
      setSelectedRouteId(busParam);
    }
  }, [searchParams]);

  const handleSelectBus = (busId: string) => {
    setSelectedRouteId(busId);
    setSearchParams({ bus: busId });
  };

  const selectedRoute: Route = useMemo(() => {
    return getRouteById(selectedRouteId) || routes.find((r) => r.id === 'baishakhi') || routes[0];
  }, [selectedRouteId]);

  const orderedStops: Stop[] = useMemo(() => {
    return selectedRoute.stops
      .map((sId) => getStopById(sId))
      .filter((s): s is Stop => Boolean(s));
  }, [selectedRoute]);

  const hoursInfo = useMemo(() => {
    return getBusOperatingHours(selectedRoute, lang);
  }, [selectedRoute, lang]);

  const routeConfidence = useMemo(() => {
    return getRouteConfidence(selectedRoute, lang);
  }, [selectedRoute, lang]);

  useEffect(() => {
    if (selectedRoute) {
      trackRouteView(selectedRoute.id, getRouteDisplayName(selectedRoute, 'en'));
    }
  }, [selectedRoute]);

  const relatedRoutes = useMemo(() => {
    if (!selectedRoute) return [];
    const stopSet = new Set(selectedRoute.stops);
    return routes
      .filter((r) => r.id !== selectedRoute.id)
      .map((r) => ({
        route: r,
        sharedCount: r.stops.filter((s) => stopSet.has(s)).length,
      }))
      .filter((item) => item.sharedCount >= 2)
      .sort((a, b) => b.sharedCount - a.sharedCount)
      .slice(0, 6)
      .map((item) => item.route);
  }, [selectedRoute]);

  const filteredRoutes = useMemo(() => {
    if (!searchQuery.trim()) return routes;
    const q = searchQuery.toLowerCase().trim();
    return routes.filter((r) => {
      const matchEn = r.name_en.toLowerCase().includes(q);
      const matchBn = r.name_bn ? r.name_bn.toLowerCase().includes(q) : false;
      const matchId = r.id.toLowerCase().includes(q);
      const matchAsim =
        (q.includes('অসীম') || q.includes('asim') || q.includes('achim') || q.includes('আছিম') || q.includes('অছিম')) &&
        (r.id === 'achim_paribahan' || r.name_en.toLowerCase().includes('achim'));
      return matchEn || matchBn || matchId || matchAsim;
    });
  }, [searchQuery]);

  const popularBusChips = [
    { id: 'baishakhi', nameBn: 'বৈশাখী বাস', nameEn: 'Baishakhi' },
    { id: 'achim_paribahan', nameBn: 'অসীম পরিবহন', nameEn: 'Achim / Asim' },
    { id: 'alif_route_1', nameBn: 'আলিফ রুট ১', nameEn: 'Alif Route 1' },
    { id: 'brtc_route_1', nameBn: 'বিআরটিসি ১', nameEn: 'BRTC 1' },
    { id: 'brtc_elevated_expressway', nameBn: 'বিআরটিসি এক্সপ্রেসওয়ে', nameEn: 'BRTC Expressway' },
    { id: 'mirpur_link', nameBn: 'মিরপুর লিংক', nameEn: 'Mirpur Link' },
    { id: 'vip_27', nameBn: 'ভিআইপি ২৭', nameEn: 'VIP 27' },
    { id: 'alif_route_2', nameBn: 'আলিফ রুট ২', nameEn: 'Alif Route 2' },
  ];

  const firstStopName = orderedStops.length > 0 ? getStopDisplayName(orderedStops[0], lang) : '';
  const lastStopName = orderedStops.length > 1 ? getStopDisplayName(orderedStops[orderedStops.length - 1], lang) : '';

  return (
    <main className="container-wide" style={{ padding: '36px 20px 80px' }}>
      <SEOHead
        title={
          selectedRoute
            ? (lang === 'bn'
                ? `${getRouteDisplayName(selectedRoute, 'bn')} বাস রুট ও স্টপেজ তালিকা — বাসরুট`
                : `${getRouteDisplayName(selectedRoute, 'en')} Bus Route & Stoppages — BusRoute`)
            : undefined
        }
        description={
          selectedRoute
            ? (lang === 'bn'
                ? `${getRouteDisplayName(selectedRoute, 'bn')} বাসের রুট (${firstStopName} থেকে ${lastStopName})। মোট ${orderedStops.length}টি স্টপেজের তালিকা ও সময়সূচী (${hoursInfo.hoursStr})।`
                : `${getRouteDisplayName(selectedRoute, 'en')} Dhaka city bus route from ${firstStopName} to ${lastStopName}. Full list of ${orderedStops.length} stops and operating hours (${hoursInfo.hoursStr}).`)
            : undefined
        }
        canonicalPath={`/routes?bus=${selectedRoute.id}`}
      />

      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        busName={getRouteDisplayName(selectedRoute, lang)}
        routeId={selectedRoute.id}
      />
      <section style={{ marginBottom: '32px' }}>
        <div style={{ maxWidth: '800px', marginBottom: '24px' }}>
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
              marginBottom: '14px',
            }}
            lang={lang}
          >
            <BusIcon size={14} color="var(--color-ink)" />
            <span>{lang === 'bn' ? 'ঢাকার ১৮৪টি অনুমোদিত বাস রুট' : '184 Verified Dhaka Bus Routes'}</span>
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
            {lang === 'bn' ? 'ঢাকার বাস ও রুটসমূহ' : 'Dhaka City Bus Routes'}
          </h1>

          <p style={{ fontSize: '15px', color: 'var(--color-ink-muted)', margin: 0, lineHeight: 1.6 }} lang={lang}>
            {lang === 'bn'
              ? 'যেকোনো বাসের নাম নির্বাচন করে তার সম্পূর্ণ স্টপের ক্রম তালিকা এবং লাইভ রুট ম্যাপ দেখুন।'
              : 'Select any bus to explore its sequential stoppage list and interactive live route map.'}
          </p>
        </div>

        <div
          style={{
            backgroundColor: 'var(--color-surface-raised)',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--color-hairline)',
            boxShadow: '0 4px 18px rgba(0,0,0,0.04)',
            padding: '8px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            maxWidth: '680px',
            marginBottom: '16px',
          }}
        >
          <div style={{ color: 'var(--color-ink-muted)' }}>
            <SearchIcon size={18} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={lang === 'bn' ? 'বাসের নাম লিখুন (যেমন: বৈশাখী, আলিফ, বিআরটিসি...)' : 'Type bus name (e.g., Baishakhi, Alif, BRTC...)'}
            style={{
              border: 'none',
              outline: 'none',
              background: 'transparent',
              fontSize: '14.5px',
              width: '100%',
              color: 'var(--color-ink)',
            }}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              style={{
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                color: 'var(--color-ink-muted)',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CloseIcon size={14} color="var(--color-ink-muted)" />
            </button>
          )}
        </div>

        <div
          className="chips-scroll-container"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            overflowX: 'auto',
            WebkitOverflowScrolling: 'touch',
            paddingBottom: '4px',
          }}
        >
          <span style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--color-ink-muted)', flexShrink: 0 }}>
            {lang === 'bn' ? 'জনপ্রিয় বাস:' : 'Popular:'}
          </span>
          {popularBusChips.map((chip) => {
            const isChipSelected = selectedRouteId === chip.id;
            return (
              <button
                key={chip.id}
                type="button"
                onClick={() => handleSelectBus(chip.id)}
                style={{
                  padding: '7px 16px',
                  borderRadius: '9999px',
                  border: isChipSelected ? '1px solid var(--color-button-primary-bg)' : '1px solid var(--color-hairline)',
                  backgroundColor: isChipSelected ? 'var(--color-button-primary-bg)' : 'var(--color-surface-raised)',
                  color: isChipSelected ? 'var(--color-button-primary-text)' : 'var(--color-ink)',
                  fontSize: '12.5px',
                  fontWeight: isChipSelected ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: isChipSelected ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
                  flexShrink: 0,
                  whiteSpace: 'nowrap',
                }}
                lang={lang}
              >
                {lang === 'bn' ? chip.nameBn : chip.nameEn}
              </button>
            );
          })}
        </div>

        {searchQuery.trim() !== '' && (
          <div
            style={{
              marginTop: '12px',
              maxHeight: '160px',
              overflowY: 'auto',
              backgroundColor: 'var(--color-surface-raised)',
              border: '1px solid var(--color-hairline)',
              borderRadius: '14px',
              padding: '8px',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '6px',
            }}
          >
            {filteredRoutes.length > 0 ? (
              filteredRoutes.slice(0, 20).map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => {
                    handleSelectBus(r.id);
                    setSearchQuery('');
                  }}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '8px',
                    border: r.id === selectedRouteId ? '1px solid var(--color-button-primary-bg)' : '1px solid var(--color-hairline)',
                    backgroundColor: r.id === selectedRouteId ? 'var(--color-button-primary-bg)' : 'var(--color-surface)',
                    color: r.id === selectedRouteId ? 'var(--color-button-primary-text)' : 'var(--color-ink)',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {getRouteDisplayName(r, lang)}
                </button>
              ))
            ) : (
              <div style={{ padding: '8px 12px', fontSize: '13px', color: 'var(--color-ink-muted)' }}>
                {lang === 'bn' ? 'কোনো বাস পাওয়া যায়নি' : 'No bus found'}
              </div>
            )}
          </div>
        )}
      </section>

      <section
        style={{
          position: 'sticky',
          top: '72px',
          zIndex: 30,
          backgroundColor: 'var(--color-surface-raised)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderRadius: isHeaderScrolled ? '9999px' : '20px',
          padding: isHeaderScrolled ? '10px 24px' : '18px 24px',
          border: '1px solid var(--color-hairline)',
          boxShadow: isHeaderScrolled ? '0 8px 28px rgba(0,0,0,0.1)' : '0 4px 20px rgba(0,0,0,0.05)',
          marginBottom: '24px',
          transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {isHeaderScrolled ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
            }}
          >
            <h2
              style={{
                fontSize: '18px',
                fontWeight: 800,
                color: 'var(--color-ink)',
                margin: 0,
                textAlign: 'center',
                letterSpacing: '-0.3px',
              }}
              lang={lang}
            >
              {getRouteDisplayName(selectedRoute, lang)}
            </h2>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span
                  style={{
                    backgroundColor: 'var(--color-surface)',
                    color: 'var(--color-ink)',
                    fontWeight: 700,
                    fontSize: '11.5px',
                    padding: '4px 12px',
                    borderRadius: '9999px',
                    border: '1px solid var(--color-hairline)',
                  }}
                >
                  {selectedRoute.service_type || (lang === 'bn' ? 'সেমি সিটিং সার্ভিস' : 'Semi-Seating Service')}
                </span>
              </div>

              <h2
                style={{
                  fontSize: '26px',
                  fontWeight: 800,
                  color: 'var(--color-ink)',
                  margin: '0 0 4px 0',
                  lineHeight: 1.25,
                }}
                lang={lang}
              >
                {getRouteDisplayName(selectedRoute, lang)}
              </h2>

              {firstStopName && lastStopName && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '14.5px',
                    fontWeight: 600,
                    color: 'var(--color-ink)',
                  }}
                  lang={lang}
                >
                  <span>{firstStopName}</span>
                  <ArrowRightIcon size={14} color="var(--color-ink-muted)" />
                  <span>{lastStopName}</span>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <div
                style={{
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-hairline)',
                  padding: '7px 14px',
                  borderRadius: '12px',
                  fontSize: '12.5px',
                }}
                lang={lang}
              >
                <span style={{ color: 'var(--color-ink-muted)' }}>{lang === 'bn' ? 'মোট স্টপেজ: ' : 'Total Stops: '}</span>
                <strong style={{ color: 'var(--color-ink)' }}>{formatNumber(orderedStops.length, lang)} {t('stopsCount')}</strong>
              </div>

              <div
                style={{
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-hairline)',
                  padding: '7px 14px',
                  borderRadius: '12px',
                  fontSize: '12.5px',
                }}
                lang={lang}
              >
                <span style={{ color: 'var(--color-ink-muted)' }}>{lang === 'bn' ? 'সময়সূচী: ' : 'Hours: '}</span>
                <strong style={{ color: 'var(--color-ink)' }}>{hoursInfo.hoursStr}</strong>
              </div>

              <div
                style={{
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-hairline)',
                  padding: '7px 14px',
                  borderRadius: '12px',
                  fontSize: '12.5px',
                  color: 'var(--color-ink)',
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
                lang={lang}
              >
                <TransferIcon size={14} color="var(--color-ink)" />
                <span>{t('bothDirections')}</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginTop: '14px' }}>
              <div
                style={{
                  padding: '8px 12px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-hairline)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '12px',
                  color: 'var(--color-ink-muted)',
                }}
                lang={lang}
              >
                <CheckIcon size={14} color="var(--color-ink)" />
                <span>
                  <strong style={{ color: 'var(--color-ink)' }}>{routeConfidence.badgeLabel}:</strong> {routeConfidence.badgeNote}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setIsReportOpen(true)}
                style={{
                  backgroundColor: 'transparent',
                  border: '1px solid var(--color-hairline)',
                  borderRadius: '12px',
                  padding: '7px 12px',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: 'var(--color-ink-muted)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
                lang={lang}
                title={lang === 'bn' ? 'রুটের তথ্য সংশোধন বা রিপোর্ট করুন' : 'Report route correction or missing stop'}
              >
                <EditIcon size={14} color="currentColor" />
                <span>{lang === 'bn' ? 'তথ্য সংশোধন বা রিপোর্ট' : 'Report correction'}</span>
              </button>
            </div>
          </div>
        )}
      </section>

      <div
        style={{
          alignItems: 'start',
        }}
        className="routes-split-layout"
      >
        <div>
          <div
            style={{
              backgroundColor: 'var(--color-surface-raised)',
              borderRadius: '24px',
              border: '1px solid var(--color-hairline)',
              padding: '24px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
            }}
          >
            <h3
              style={{
                fontSize: '20px',
                fontWeight: 800,
                color: 'var(--color-ink)',
                margin: '0 0 8px 0',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
              lang={lang}
            >
              <PinIcon size={18} color="var(--color-ink)" />
              <span>{t('orderedStopsHeading')}</span>
            </h3>

            <p style={{ fontSize: '13px', color: 'var(--color-ink-muted)', margin: '0 0 16px 0' }} lang={lang}>
              {lang === 'bn'
                ? 'এই বাসের সকল স্টপেজ পর্যায়ক্রমে নিচে দেওয়া হলো।'
                : 'All sequential stops along this bus route.'}
            </p>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                maxHeight: '520px',
                overflowY: 'auto',
                paddingRight: '6px',
              }}
            >
              {orderedStops.map((stop, idx) => {
                const isFirst = idx === 0;
                const isLast = idx === orderedStops.length - 1;

                return (
                  <div
                    key={stop.id || idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      padding: '11px 16px',
                      borderRadius: '14px',
                      backgroundColor: 'var(--color-surface)',
                      border: '1px solid var(--color-hairline)',
                      transition: 'transform 0.15s ease',
                    }}
                  >
                    <div
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        backgroundColor: isFirst || isLast ? 'var(--color-button-primary-bg)' : 'var(--color-hairline-soft)',
                        color: isFirst || isLast ? 'var(--color-button-primary-text)' : 'var(--color-ink)',
                        fontWeight: 700,
                        fontSize: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {formatNumber(idx + 1, lang)}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: '14.5px', color: 'var(--color-ink)' }}>
                        {getStopDisplayName(stop, lang)}
                      </div>
                      {stop.name_bn && lang === 'bn' && stop.name_en && (
                        <div style={{ fontSize: '11px', color: 'var(--color-ink-muted)' }}>
                          {stop.name_en}
                        </div>
                      )}
                    </div>

                    {isFirst && (
                      <span
                        style={{
                          backgroundColor: 'var(--color-button-primary-bg)',
                          color: 'var(--color-button-primary-text)',
                          fontSize: '11px',
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: '6px',
                          flexShrink: 0,
                        }}
                        lang={lang}
                      >
                        {lang === 'bn' ? 'শুরু স্থান' : 'Origin'}
                      </span>
                    )}

                    {isLast && (
                      <span
                        style={{
                          backgroundColor: 'var(--color-hairline-strong)',
                          color: 'var(--color-ink)',
                          fontSize: '11px',
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: '6px',
                          flexShrink: 0,
                        }}
                        lang={lang}
                      >
                        {lang === 'bn' ? 'গন্তব্য' : 'Terminal'}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {relatedRoutes.length > 0 && (
              <div
                style={{
                  marginTop: '20px',
                  backgroundColor: 'var(--color-surface)',
                  borderRadius: '16px',
                  border: '1px solid var(--color-hairline)',
                  padding: '16px',
                }}
              >
                <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-ink)', marginBottom: '6px' }} lang={lang}>
                  {lang === 'bn' ? 'এই রুটের সাথে সম্পর্কিত সংযোগকারী বাস:' : 'Related Connecting Buses:'}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--color-ink-muted)', marginBottom: '10px' }} lang={lang}>
                  {lang === 'bn'
                    ? 'সাধারণ করিডোর ও স্টপেজ শেয়ার করা অন্যান্য বাস:'
                    : 'Buses sharing corridors or common transit stops:'}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {relatedRoutes.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => handleSelectBus(r.id)}
                      style={{
                        padding: '5px 12px',
                        borderRadius: '9999px',
                        border: '1px solid var(--color-hairline)',
                        backgroundColor: 'var(--color-surface-raised)',
                        color: 'var(--color-ink)',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                      lang={lang}
                    >
                      {getRouteDisplayName(r, lang)}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div
          className="sticky-route-map"
          style={{
            position: 'sticky',
            top: '76px',
            height: '580px',
            maxHeight: 'calc(100vh - 90px)',
            borderRadius: '24px',
            overflow: 'hidden',
            border: '1px solid var(--color-hairline)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.06)',
            backgroundColor: 'var(--color-surface-raised)',
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

      <div
        style={{
          marginTop: '40px',
          padding: '20px 24px',
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-hairline)',
          borderRadius: '16px',
          fontSize: '13px',
          color: 'var(--color-ink-muted)',
          lineHeight: 1.6,
        }}
        lang={lang}
      >
        <div style={{ fontWeight: 700, color: 'var(--color-ink)', marginBottom: '4px' }}>
          {lang === 'bn' ? 'তথ্যসূত্র, সীমাবদ্ধতা ও যাচাই নোটিশ:' : 'Data Source, Limitations & Verification Notice:'}
        </div>
        <div>
          {lang === 'bn'
            ? 'বাসের রুট এবং স্টপেজ তালিকা ঢাকা লোকাল বাস জরিপ ও ডিটিসিএ উন্মুক্ত নথি থেকে সংগৃহীত। বাস ভাড়া বিআরটিএ সরকারি প্রজ্ঞাপন (প্রতি কিমি ২.৭০ টাকা, সর্বনিম্ন ১০ টাকা) অনুযায়ী দূরত্ব ভিত্তিক আনুমানিক হিসাব। বাস্তব ক্ষেত্রে খুচরা ভাংতি বা সেকশন অনুযায়ী ±৫ টাকা কম-বেশি হতে পারে। সর্বশেষ যাচাই ও আপডেট: সেপ্টেম্বর ২০২৬।'
            : 'Bus routes and stoppage sequences are compiled from Dhaka local bus surveys and DTCA transit records. Fares are calculated estimates using the official BRTA gazette rate (Tk 2.70/km, minimum Tk 10). Actual fares may vary by ±5 Tk due to small change coin availability or stoppage sections. Last verified & updated: September 2026.'}
        </div>
      </div>
    </main>
  );
};
