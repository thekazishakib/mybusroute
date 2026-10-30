import React, { useState, useMemo } from 'react';
import type { Stop } from '../data/types';
import { useT, formatNumber } from '../i18n/useT';
import { getStopDisplayName } from '../data/load';
import { GoogleMapsIcon } from './Icons';

export type MapViewMode = 'map' | 'list';

interface RouteMapProps {
  stops: Stop[];
  fromStop: Stop | null;
  toStop: Stop | null;
  transferStop?: Stop | null;
  viewMode?: MapViewMode;
  onToggleViewMode?: (mode: MapViewMode) => void;
}

export const RouteMap: React.FC<RouteMapProps> = ({
  stops,
  fromStop,
  toStop,
  transferStop,
  viewMode: controlledViewMode,
  onToggleViewMode,
}) => {
  const { lang } = useT();
  const [internalViewMode, setInternalViewMode] = useState<MapViewMode>('map');
  const viewMode = controlledViewMode ?? internalViewMode;

  const handleToggleView = (mode: MapViewMode) => {
    if (onToggleViewMode) {
      onToggleViewMode(mode);
    } else {
      setInternalViewMode(mode);
    }
  };

  // Filter stops that have valid coordinates and maintain sequential order
  const validStops = useMemo(() => {
    let list = stops.filter((s) => s.lat != null && s.lng != null);

    // If list is empty but fromStop and toStop exist
    if (list.length === 0) {
      if (fromStop && fromStop.lat != null && fromStop.lng != null) list.push(fromStop);
      if (transferStop && transferStop.lat != null && transferStop.lng != null) list.push(transferStop);
      if (toStop && toStop.lat != null && toStop.lng != null && toStop.id !== fromStop?.id) list.push(toStop);
    } else {
      // If fromStop is specified, ensure it is the start of the list
      if (fromStop && fromStop.lat != null && fromStop.lng != null) {
        const fromIdx = list.findIndex((s) => s.id === fromStop.id);
        const toIdx = toStop ? list.findIndex((s) => s.id === toStop.id) : -1;
        if (fromIdx !== -1 && toIdx !== -1) {
          // If both from and to exist in list, take the slice between them in correct order
          if (fromIdx < toIdx) {
            list = list.slice(fromIdx, toIdx + 1);
          } else {
            list = list.slice(toIdx, fromIdx + 1).reverse();
          }
        } else if (fromIdx > 0) {
          list = list.slice(fromIdx);
        }
      }
    }

    return list;
  }, [stops, fromStop, toStop, transferStop]);

  const originName = fromStop
    ? getStopDisplayName(fromStop, lang)
    : validStops[0]
    ? getStopDisplayName(validStops[0], lang)
    : '';
  const destName = toStop
    ? getStopDisplayName(toStop, lang)
    : validStops.length > 1
    ? getStopDisplayName(validStops[validStops.length - 1], lang)
    : '';

  // Google Maps Direct Navigation Link with all intermediate stops as waypoints
  const { googleMapsUrl, googleMapsEmbedUrl } = useMemo(() => {
    if (validStops.length === 0) {
      return {
        googleMapsUrl: 'https://www.google.com/maps',
        googleMapsEmbedUrl: 'https://maps.google.com/maps?q=Dhaka,Bangladesh&output=embed',
      };
    }

    if (validStops.length === 1) {
      const single = validStops[0];
      const coord = `${single.lat.toFixed(5)},${single.lng.toFixed(5)}`;
      return {
        googleMapsUrl: `https://www.google.com/maps?q=${coord}`,
        googleMapsEmbedUrl: `https://maps.google.com/maps?q=${coord}&output=embed`,
      };
    }

    const actualStart = validStops[0];
    const actualEnd = validStops[validStops.length - 1];
    const intermediates = validStops.slice(1, validStops.length - 1);

    // Google Maps allows intermediate waypoints
    const maxWaypoints = 8;
    const sampledWaypoints: Stop[] = [];
    if (intermediates.length <= maxWaypoints) {
      sampledWaypoints.push(...intermediates);
    } else {
      const step = (intermediates.length - 1) / (maxWaypoints - 1);
      for (let i = 0; i < maxWaypoints; i++) {
        const idx = Math.round(i * step);
        sampledWaypoints.push(intermediates[idx]);
      }
    }

    const originCoord = `${actualStart.lat.toFixed(5)},${actualStart.lng.toFixed(5)}`;
    const destCoord = `${actualEnd.lat.toFixed(5)},${actualEnd.lng.toFixed(5)}`;
    const waypointsCoord = sampledWaypoints
      .map((s) => `${s.lat.toFixed(5)},${s.lng.toFixed(5)}`)
      .join('|');

    // External Google Maps directions URL with all intermediate stops along the highway
    const navUrl = `https://www.google.com/maps/dir/?api=1&origin=${originCoord}&destination=${destCoord}${
      waypointsCoord ? `&waypoints=${encodeURIComponent(waypointsCoord)}` : ''
    }&travelmode=driving`;

    // Google Maps live embedded directions URL with driving mode along the main road
    const daddrList = [...sampledWaypoints.map((s) => `${s.lat.toFixed(5)},${s.lng.toFixed(5)}`), destCoord];
    const embedUrl = `https://maps.google.com/maps?saddr=${originCoord}&daddr=${daddrList.join('+to:')}&dirflg=d&output=embed`;

    return { googleMapsUrl: navUrl, googleMapsEmbedUrl: embedUrl };
  }, [validStops]);

  return (
    <div
      className="route-map-container"
      style={{
        position: 'relative',
        borderRadius: '20px',
        overflow: 'hidden',
        border: '1px solid var(--color-hairline)',
        backgroundColor: '#f8fafc',
        height: '540px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Route Direction Header Banner */}
      <div
        className="map-direction-header"
        style={{
          padding: '12px 16px',
          backgroundColor: 'var(--color-surface-raised)',
          borderBottom: '1px solid var(--color-hairline)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px',
          zIndex: 15,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <span
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: '#16a34a',
                display: 'inline-block',
                boxShadow: '0 0 0 2px rgba(22, 163, 74, 0.2)',
              }}
            />
            <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--color-ink)' }}>
              {originName || (lang === 'bn' ? 'শুরুর স্থান' : 'Origin')}
            </span>
          </div>

          <span style={{ color: 'var(--color-ink-muted)', fontSize: '13px', fontWeight: 700 }}>➔</span>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <span
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: '#dc2626',
                display: 'inline-block',
                boxShadow: '0 0 0 2px rgba(220, 38, 38, 0.2)',
              }}
            />
            <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--color-ink)' }}>
              {destName || (lang === 'bn' ? 'গন্তব্য' : 'Destination')}
            </span>
          </div>

          <span
            style={{
              fontSize: '11px',
              fontWeight: 600,
              backgroundColor: 'var(--color-hairline-soft)',
              color: 'var(--color-ink-muted)',
              padding: '2px 8px',
              borderRadius: '9999px',
              border: '1px solid var(--color-hairline)',
            }}
          >
            {formatNumber(validStops.length, lang)} {lang === 'bn' ? 'টি স্টপ • প্রধান সড়ক' : 'stops • Main Road'}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'var(--color-surface)',
              borderRadius: '9999px',
              padding: '2px',
              border: '1px solid var(--color-hairline)',
              gap: '2px',
            }}
          >
            <button
              type="button"
              onClick={() => handleToggleView('map')}
              style={{
                border: 'none',
                borderRadius: '9999px',
                padding: '5px 12px',
                fontSize: '12px',
                fontWeight: 600,
                backgroundColor: viewMode === 'map' ? 'var(--color-button-primary-bg)' : 'transparent',
                color: viewMode === 'map' ? 'var(--color-button-primary-text)' : 'var(--color-ink-muted)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
              }}
              lang={lang}
            >
              <GoogleMapsIcon size={13} color={viewMode === 'map' ? 'var(--color-button-primary-text)' : '#2563eb'} />
              <span>{lang === 'bn' ? 'গুগল ম্যাপ' : 'Google Map'}</span>
            </button>

            <button
              type="button"
              onClick={() => handleToggleView('list')}
              style={{
                border: 'none',
                borderRadius: '9999px',
                padding: '5px 12px',
                fontSize: '12px',
                fontWeight: 600,
                backgroundColor: viewMode === 'list' ? 'var(--color-button-primary-bg)' : 'transparent',
                color: viewMode === 'list' ? 'var(--color-button-primary-text)' : 'var(--color-ink-muted)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              lang={lang}
            >
              <span>{lang === 'bn' ? 'স্টপ তালিকা' : 'Stop List'}</span>
            </button>
          </div>

          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            title={lang === 'bn' ? 'গুগল ম্যাপে লাইভ ডিরেকশন খুলুন' : 'Open in Google Maps'}
            style={{
              height: '30px',
              padding: '0 12px',
              borderRadius: '9999px',
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-hairline)',
              color: 'var(--color-ink)',
              fontSize: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              textDecoration: 'none',
              fontWeight: 600,
              whiteSpace: 'nowrap',
            }}
          >
            <GoogleMapsIcon size={13} color="#2563eb" />
            <span>{lang === 'bn' ? 'গুগল ম্যাপে খুলুন' : 'Open in Google Maps'}</span>
          </a>
        </div>
      </div>

      {viewMode === 'map' ? (
        <div style={{ flex: 1, width: '100%', position: 'relative' }}>
          {googleMapsEmbedUrl ? (
            <iframe
              src={googleMapsEmbedUrl}
              title={lang === 'bn' ? 'গুগল ম্যাপস লাইভ ডিরেকশন' : 'Google Maps Live Direction'}
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
              }}
              loading="lazy"
              allowFullScreen
            />
          ) : (
            <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--color-ink-muted)' }}>
              {lang === 'bn' ? 'গুগল ম্যাপস লোড হচ্ছে...' : 'Loading Google Maps...'}
            </div>
          )}

          {/* Stoppages Ribbon along the road corridor */}
          {validStops.length > 0 && (
            <div
              className="map-stoppages-ribbon"
              style={{
                position: 'absolute',
                bottom: '12px',
                left: '12px',
                right: '12px',
                zIndex: 10,
                backgroundColor: 'var(--color-surface-raised)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                borderRadius: '14px',
                border: '1px solid var(--color-hairline)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                padding: '8px 12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: 'var(--color-ink)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: '#2563eb',
                      display: 'inline-block',
                    }}
                  />
                  <span>
                    {originName} → {destName}
                  </span>
                </div>
                <span style={{ fontSize: '11px', color: 'var(--color-ink-muted)' }}>
                  {formatNumber(validStops.length, lang)} {lang === 'bn' ? 'টি স্টপেজ' : 'stoppages'}
                </span>
              </div>

              {/* Scrollable pills for each stoppage */}
              <div
                style={{
                  display: 'flex',
                  gap: '6px',
                  overflowX: 'auto',
                  paddingBottom: '2px',
                  scrollbarWidth: 'none',
                }}
              >
                {validStops.map((st, i) => {
                  const isStart = i === 0;
                  const isEnd = i === validStops.length - 1;
                  const isTransfer =
                    !isStart && !isEnd && transferStop && st.id === transferStop.id;

                  const stopCoord = `${st.lat?.toFixed(5)},${st.lng?.toFixed(5)}`;
                  const stopGoogleUrl = `https://www.google.com/maps?q=${stopCoord}`;

                  return (
                    <a
                      key={st.id || i}
                      href={stopGoogleUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={lang === 'bn' ? `${getStopDisplayName(st, lang)} গুগল ম্যাপে দেখুন` : `View ${getStopDisplayName(st, lang)} in Google Maps`}
                      style={{
                        backgroundColor: isStart
                          ? '#16a34a'
                          : isEnd
                          ? '#dc2626'
                          : isTransfer
                          ? '#2563eb'
                          : 'var(--color-surface)',
                        color: isStart || isEnd || isTransfer
                          ? '#ffffff'
                          : 'var(--color-ink)',
                        border: '1px solid var(--color-hairline)',
                        borderRadius: '9999px',
                        padding: '4px 12px',
                        fontSize: '11.5px',
                        fontWeight: isStart || isEnd || isTransfer ? 700 : 500,
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        whiteSpace: 'nowrap',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '10px',
                          opacity: 0.8,
                        }}
                      >
                        {formatNumber(i + 1, lang)}.
                      </span>
                      <span>{getStopDisplayName(st, lang)}</span>
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Sequential Stoppage List View Mode */
        <div
          style={{
            padding: '60px 16px 20px',
            overflowY: 'auto',
            height: '100%',
            backgroundColor: 'var(--color-surface-raised)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px',
            }}
          >
            <h3
              style={{
                fontSize: '16px',
                fontWeight: 700,
                margin: 0,
                color: 'var(--color-ink)',
              }}
              lang={lang}
            >
              {lang === 'bn'
                ? 'রুটের ক্রমানুযায়ী সকল স্টপেজ:'
                : 'Sequential Route Stoppages:'}
            </h3>
            <span
              style={{
                fontSize: '12px',
                color: 'var(--color-ink-muted)',
              }}
            >
              {formatNumber(validStops.length, lang)}{' '}
              {lang === 'bn' ? 'টি স্টপেজ' : 'stops total'}
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            {validStops.map((st, idx) => {
              const isStart = idx === 0;
              const isEnd = idx === validStops.length - 1;
              const isTransfer =
                !isStart && !isEnd && transferStop && st.id === transferStop.id;

              const stopName = getStopDisplayName(st, lang);
              const stopCoord = `${st.lat?.toFixed(5)},${st.lng?.toFixed(5)}`;
              const stopGoogleUrl = `https://www.google.com/maps?q=${stopCoord}`;

              return (
                <div
                  key={st.id || idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    backgroundColor: 'var(--color-surface)',
                    border: '1px solid var(--color-hairline)',
                    transition: 'background-color 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        backgroundColor: isStart
                          ? '#16a34a'
                          : isEnd
                          ? '#dc2626'
                          : isTransfer
                          ? '#2563eb'
                          : 'var(--color-surface-raised)',
                        color:
                          isStart || isEnd || isTransfer
                            ? '#ffffff'
                            : 'var(--color-ink)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '11px',
                        fontWeight: 700,
                        border: '1px solid var(--color-hairline)',
                      }}
                    >
                      {formatNumber(idx + 1, lang)}
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: '13.5px',
                          fontWeight: isStart || isEnd || isTransfer ? 700 : 500,
                          color: 'var(--color-ink)',
                        }}
                      >
                        {stopName}
                      </div>
                      {isStart && (
                        <div
                          style={{
                            fontSize: '11px',
                            color: '#16a34a',
                            fontWeight: 600,
                          }}
                        >
                          {lang === 'bn' ? 'শুরুর স্টপেজ' : 'Origin Stop'}
                        </div>
                      )}
                      {isEnd && (
                        <div
                          style={{
                            fontSize: '11px',
                            color: '#dc2626',
                            fontWeight: 600,
                          }}
                        >
                          {lang === 'bn' ? 'গন্তব্য স্টপেজ' : 'Destination Stop'}
                        </div>
                      )}
                      {isTransfer && (
                        <div
                          style={{
                            fontSize: '11px',
                            color: '#2563eb',
                            fontWeight: 600,
                          }}
                        >
                          {lang === 'bn'
                            ? 'বাস পরিবর্তন স্টপেজ'
                            : 'Transfer Stop'}
                        </div>
                      )}
                    </div>
                  </div>

                  <a
                    href={stopGoogleUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={lang === 'bn' ? `${stopName} গুগল ম্যাপে দেখুন` : `View ${stopName} in Google Maps`}
                    style={{
                      border: '1px solid var(--color-hairline)',
                      borderRadius: '6px',
                      padding: '4px 8px',
                      fontSize: '11px',
                      fontWeight: 600,
                      color: '#2563eb',
                      backgroundColor: 'var(--color-surface-raised)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      textDecoration: 'none',
                    }}
                  >
                    <GoogleMapsIcon size={12} color="#2563eb" />
                    <span>{lang === 'bn' ? 'ম্যাপ' : 'Map'}</span>
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
