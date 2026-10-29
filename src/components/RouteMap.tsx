import React, { useEffect, useRef, useState, useMemo } from 'react';
import type { Stop } from '../data/types';
import { useT, formatNumber } from '../i18n/useT';
import { getStopDisplayName } from '../data/load';
import { MapIcon, PinIcon } from './Icons';

interface RouteMapProps {
  stops: Stop[];
  fromStop: Stop | null;
  toStop: Stop | null;
  transferStop?: Stop | null;
  viewMode?: 'map' | 'list';
  onToggleViewMode?: (mode: 'map' | 'list') => void;
}

// In-memory cache for OSRM road geometry to prevent repeated network requests
const roadGeometryCache = new Map<string, [number, number][]>();

export const RouteMap: React.FC<RouteMapProps> = ({
  stops,
  fromStop,
  toStop,
  transferStop,
  viewMode: controlledViewMode,
  onToggleViewMode,
}) => {
  const { lang } = useT();
  const [internalViewMode, setInternalViewMode] = useState<'map' | 'list'>('map');
  const viewMode = controlledViewMode ?? internalViewMode;

  const handleToggleView = (mode: 'map' | 'list') => {
    if (onToggleViewMode) {
      onToggleViewMode(mode);
    } else {
      setInternalViewMode(mode);
    }
  };

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const routePolylineRef = useRef<any>(null);

  // Filter stops that have valid coordinates and maintain sequential order
  const validStops = useMemo(() => {
    const list = stops.filter((s) => s.lat != null && s.lng != null);

    // If list is empty but fromStop and toStop exist
    if (list.length === 0) {
      if (fromStop && fromStop.lat != null && fromStop.lng != null) list.push(fromStop);
      if (transferStop && transferStop.lat != null && transferStop.lng != null) list.push(transferStop);
      if (toStop && toStop.lat != null && toStop.lng != null && toStop.id !== fromStop?.id) list.push(toStop);
    } else {
      // Ensure fromStop is first if not already present at index 0
      if (fromStop && fromStop.lat != null && fromStop.lng != null) {
        const idx = list.findIndex((s) => s.id === fromStop.id);
        if (idx > 0) {
          // slice from fromStop
          list.splice(0, idx);
        } else if (idx === -1) {
          list.unshift(fromStop);
        }
      }

      // Ensure toStop is last if not already present at end
      if (toStop && toStop.lat != null && toStop.lng != null) {
        const idx = list.findIndex((s) => s.id === toStop.id);
        if (idx !== -1 && idx < list.length - 1) {
          list.splice(idx + 1);
        } else if (idx === -1) {
          list.push(toStop);
        }
      }
    }

    return list;
  }, [stops, fromStop, toStop, transferStop]);

  // Leaflet map lifecycle
  useEffect(() => {
    if (viewMode !== 'map' || !mapContainerRef.current) return;
    let isCancelled = false;

    import('leaflet').then((LModule) => {
      if (isCancelled || !mapContainerRef.current) return;
      const L = LModule.default || LModule;

      try {
        if (!mapInstanceRef.current) {
          const map = L.map(mapContainerRef.current, {
            zoomControl: false,
            attributionControl: false,
            scrollWheelZoom: true,
            touchZoom: true,
            dragging: true,
          });

          // Google Maps Street Tile Layer
          L.tileLayer('https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
            maxZoom: 20,
            subdomains: ['0', '1', '2', '3'],
          }).addTo(map);

          mapInstanceRef.current = map;
        }

        const map = mapInstanceRef.current;
        map.invalidateSize();

        // Delayed invalidations to ensure zero clipping on mobile/desktop
        setTimeout(() => {
          if (!isCancelled && mapInstanceRef.current) {
            mapInstanceRef.current.invalidateSize();
          }
        }, 120);
        setTimeout(() => {
          if (!isCancelled && mapInstanceRef.current) {
            mapInstanceRef.current.invalidateSize();
          }
        }, 350);

        // Clear existing markers and lines
        map.eachLayer((layer: any) => {
          if (
            layer instanceof L.Polyline ||
            layer instanceof L.CircleMarker ||
            layer instanceof L.Marker
          ) {
            map.removeLayer(layer);
          }
        });

        if (validStops.length > 0) {
          const directLatLngs = validStops.map(
            (s) => [s.lat, s.lng] as [number, number]
          );

          // Function to render the route lines and markers
          const renderRouteOnMap = (roadPoints: [number, number][]) => {
            if (isCancelled || !mapInstanceRef.current) return;

            // Route casing line (shadow border for authentic street navigation look)
            L.polyline(roadPoints, {
              color: '#0f172a',
              weight: 8,
              opacity: 0.25,
              lineJoin: 'round',
              lineCap: 'round',
            }).addTo(map);

            // Active transit route line (vibrant emerald green)
            const polyline = L.polyline(roadPoints, {
              color: '#15803d',
              weight: 5,
              opacity: 0.95,
              lineJoin: 'round',
              lineCap: 'round',
            }).addTo(map);

            routePolylineRef.current = polyline;

            // Add markers for all stops along the route
            const lastIdx = validStops.length - 1;

            validStops.forEach((st, idx) => {
              const isStart = idx === 0;
              const isEnd = idx === lastIdx;
              const isTransfer =
                !isStart &&
                !isEnd &&
                transferStop &&
                st.id === transferStop.id;

              const stopName = getStopDisplayName(st, lang);
              const stopNum = idx + 1;

              if (isStart) {
                // Origin Pin with clear badge (no plain 'A')
                const startIcon = L.divIcon({
                  className: 'custom-map-pin start-pin',
                  html: `
                    <div style="display:flex;align-items:center;gap:6px;background:#15803d;color:#ffffff;padding:5px 12px;border-radius:9999px;box-shadow:0 4px 14px rgba(21,128,61,0.45);border:2px solid #ffffff;font-size:12px;font-weight:700;white-space:nowrap;cursor:pointer;">
                      <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#86efac;"></span>
                      <span>${lang === 'bn' ? 'শুরু: ' : 'Start: '}${stopName}</span>
                    </div>
                  `,
                  iconAnchor: [24, 18],
                });

                L.marker([st.lat, st.lng], { icon: startIcon, zIndexOffset: 1000 })
                  .bindPopup(
                    `<div style="font-family:inherit;padding:4px;">
                      <strong style="color:#15803d;font-size:13px;">${lang === 'bn' ? '🚩 শুরুর স্টপেজ' : '🚩 Origin Stop'}</strong>
                      <div style="font-size:14px;font-weight:700;margin:3px 0;">${stopName}</div>
                      ${st.name_bn && lang !== 'bn' ? `<div style="font-size:12px;color:#64748b;">${st.name_bn}</div>` : ''}
                      ${st.name_en && lang === 'bn' ? `<div style="font-size:12px;color:#64748b;">${st.name_en}</div>` : ''}
                    </div>`
                  )
                  .addTo(map);
              } else if (isEnd) {
                // Destination Pin with clear badge (no plain 'B')
                const endIcon = L.divIcon({
                  className: 'custom-map-pin end-pin',
                  html: `
                    <div style="display:flex;align-items:center;gap:6px;background:#dc2626;color:#ffffff;padding:5px 12px;border-radius:9999px;box-shadow:0 4px 14px rgba(220,38,38,0.45);border:2px solid #ffffff;font-size:12px;font-weight:700;white-space:nowrap;cursor:pointer;">
                      <span>🏁</span>
                      <span>${lang === 'bn' ? 'গন্তব্য: ' : 'Destination: '}${stopName}</span>
                    </div>
                  `,
                  iconAnchor: [24, 18],
                });

                L.marker([st.lat, st.lng], { icon: endIcon, zIndexOffset: 1000 })
                  .bindPopup(
                    `<div style="font-family:inherit;padding:4px;">
                      <strong style="color:#dc2626;font-size:13px;">${lang === 'bn' ? '🏁 গন্তব্য স্টপেজ' : '🏁 Destination Stop'}</strong>
                      <div style="font-size:14px;font-weight:700;margin:3px 0;">${stopName}</div>
                      ${st.name_bn && lang !== 'bn' ? `<div style="font-size:12px;color:#64748b;">${st.name_bn}</div>` : ''}
                      ${st.name_en && lang === 'bn' ? `<div style="font-size:12px;color:#64748b;">${st.name_en}</div>` : ''}
                    </div>`
                  )
                  .addTo(map);
              } else if (isTransfer) {
                // Transfer Stop Pin
                const transferIcon = L.divIcon({
                  className: 'custom-map-pin transfer-pin',
                  html: `
                    <div style="display:flex;align-items:center;gap:6px;background:#d97706;color:#ffffff;padding:5px 12px;border-radius:9999px;box-shadow:0 4px 14px rgba(217,119,6,0.45);border:2px solid #ffffff;font-size:12px;font-weight:700;white-space:nowrap;cursor:pointer;">
                      <span>🔄</span>
                      <span>${lang === 'bn' ? 'বাস পরিবর্তন: ' : 'Transfer: '}${stopName}</span>
                    </div>
                  `,
                  iconAnchor: [24, 18],
                });

                L.marker([st.lat, st.lng], { icon: transferIcon, zIndexOffset: 900 })
                  .bindPopup(
                    `<div style="font-family:inherit;padding:4px;">
                      <strong style="color:#d97706;font-size:13px;">${lang === 'bn' ? '🔄 বাস পরিবর্তনের স্থান' : '🔄 Transfer Stop'}</strong>
                      <div style="font-size:14px;font-weight:700;margin:3px 0;">${stopName}</div>
                    </div>`
                  )
                  .addTo(map);
              } else {
                // Intermediate stoppage node showing sequence number
                const nodeIcon = L.divIcon({
                  className: 'custom-map-pin node-pin',
                  html: `
                    <div style="width:22px;height:22px;border-radius:50%;background:#ffffff;border:2.5px solid #0f172a;color:#0f172a;font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 6px rgba(0,0,0,0.22);cursor:pointer;transition:transform 0.15s ease;">
                      ${stopNum}
                    </div>
                  `,
                  iconSize: [22, 22],
                  iconAnchor: [11, 11],
                });

                L.marker([st.lat, st.lng], { icon: nodeIcon })
                  .bindTooltip(
                    `<span style="font-weight:600;">#${stopNum} ${stopName}</span>`,
                    { direction: 'top', offset: [0, -10] }
                  )
                  .bindPopup(
                    `<div style="font-family:inherit;padding:4px;">
                      <div style="font-size:11px;font-weight:600;color:#64748b;">${lang === 'bn' ? `স্টপেজ ক্রম #${stopNum}` : `Stop #${stopNum}`}</div>
                      <div style="font-size:14px;font-weight:700;margin:2px 0 6px 0;">${stopName}</div>
                      <a href="/stop/${st.id}" style="color:#15803d;font-size:12px;font-weight:600;text-decoration:none;">
                        ${lang === 'bn' ? 'এই স্টপের সকল বাস দেখুন ➔' : 'View buses through this stop ➔'}
                      </a>
                    </div>`
                  )
                  .addTo(map);
              }
            });

            // Fit the whole route nicely into the map bounds
            const bounds = polyline.getBounds();
            if (bounds.isValid()) {
              const isMobile = window.innerWidth < 768;
              map.fitBounds(bounds, {
                padding: isMobile ? [32, 32] : [54, 54],
                maxZoom: 16,
              });
            }
          };

          // Check Cache for road geometry
          const cacheKey = directLatLngs
            .map((p) => `${p[0].toFixed(4)},${p[1].toFixed(4)}`)
            .join(';');

          if (roadGeometryCache.has(cacheKey)) {
            renderRouteOnMap(roadGeometryCache.get(cacheKey)!);
          } else if (validStops.length >= 2) {
            // Render direct polyline first for zero-latency instant rendering
            renderRouteOnMap(directLatLngs);

            // Fetch actual road geometry from OSRM following real Dhaka roads
            const sampleStops =
              validStops.length > 25
                ? validStops.filter(
                    (_, i) =>
                      i === 0 ||
                      i === validStops.length - 1 ||
                      i % Math.ceil(validStops.length / 20) === 0
                  )
                : validStops;

            const coordsParam = sampleStops
              .map((s) => `${s.lng.toFixed(5)},${s.lat.toFixed(5)}`)
              .join(';');

            const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${coordsParam}?overview=full&geometries=geojson`;

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 2500);

            fetch(osrmUrl, { signal: controller.signal })
              .then((res) => res.json())
              .then((data) => {
                clearTimeout(timeoutId);
                if (
                  data.code === 'Ok' &&
                  data.routes?.[0]?.geometry?.coordinates?.length > 0
                ) {
                  const roadCoords: [number, number][] =
                    data.routes[0].geometry.coordinates.map(
                      (c: [number, number]) => [c[1], c[0]] as [number, number]
                    );

                  roadGeometryCache.set(cacheKey, roadCoords);

                  if (!isCancelled && mapInstanceRef.current) {
                    // Clear previous layers & re-render with true road geometry
                    mapInstanceRef.current.eachLayer((layer: any) => {
                      if (
                        layer instanceof L.Polyline ||
                        layer instanceof L.CircleMarker ||
                        layer instanceof L.Marker
                      ) {
                        mapInstanceRef.current.removeLayer(layer);
                      }
                    });
                    renderRouteOnMap(roadCoords);
                  }
                }
              })
              .catch(() => {
                // Fallback direct line is already cleanly rendered!
              });
          } else {
            renderRouteOnMap(directLatLngs);
          }
        } else {
          // Default center Dhaka
          map.setView([23.777, 90.399], 12);
        }
      } catch (e) {
        console.warn('Map initialization error:', e);
      }
    });

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && mapContainerRef.current) {
      ro = new ResizeObserver(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      });
      ro.observe(mapContainerRef.current);
    }

    return () => {
      isCancelled = true;
      if (ro) ro.disconnect();
    };
  }, [validStops, fromStop, toStop, transferStop, viewMode, lang]);

  const handleZoomIn = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomIn();
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomOut();
  };

  const handleResetBounds = () => {
    if (mapInstanceRef.current && routePolylineRef.current) {
      const bounds = routePolylineRef.current.getBounds();
      if (bounds.isValid()) {
        const isMobile = window.innerWidth < 768;
        mapInstanceRef.current.fitBounds(bounds, {
          padding: isMobile ? [32, 32] : [54, 54],
          maxZoom: 16,
        });
      }
    }
  };

  const handleFocusStop = (st: Stop) => {
    if (mapInstanceRef.current && st.lat && st.lng) {
      mapInstanceRef.current.setView([st.lat, st.lng], 16, { animate: true });
    }
  };

  // Google Maps Direct Navigation Link
  const googleMapsUrl = useMemo(() => {
    const origin = fromStop
      ? fromStop.name_en
        ? `${fromStop.name_en}, Dhaka`
        : 'Dhaka'
      : 'Dhaka';
    const dest = toStop
      ? toStop.name_en
        ? `${toStop.name_en}, Dhaka`
        : 'Dhaka'
      : 'Dhaka';
    return `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
      origin
    )}&destination=${encodeURIComponent(dest)}&travelmode=transit`;
  }, [fromStop, toStop]);

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

  return (
    <div
      className="route-map-container"
      style={{
        position: 'relative',
        borderRadius: '20px',
        overflow: 'hidden',
        border: '1px solid var(--color-hairline)',
        backgroundColor: '#f8fafc',
        height: '520px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        className="map-top-bar"
        style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          right: '12px',
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '8px',
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            pointerEvents: 'auto',
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#ffffff',
            borderRadius: '9999px',
            padding: '3px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
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
              padding: '6px 14px',
              fontSize: '12.5px',
              fontWeight: 600,
              backgroundColor: viewMode === 'map' ? '#0a0a0a' : 'transparent',
              color: viewMode === 'map' ? '#ffffff' : 'var(--color-ink-muted)',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
            lang={lang}
          >
            <MapIcon size={14} />
            <span>{lang === 'bn' ? 'রুট ম্যাপ' : 'Route Map'}</span>
          </button>

          <button
            type="button"
            onClick={() => handleToggleView('list')}
            style={{
              border: 'none',
              borderRadius: '9999px',
              padding: '6px 14px',
              fontSize: '12.5px',
              fontWeight: 600,
              backgroundColor: viewMode === 'list' ? '#0a0a0a' : 'transparent',
              color: viewMode === 'list' ? '#ffffff' : 'var(--color-ink-muted)',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            lang={lang}
          >
            <span>{lang === 'bn' ? 'স্টপ তালিকা' : 'Stop List'}</span>
            <span
              style={{
                marginLeft: '4px',
                fontSize: '11px',
                opacity: 0.8,
                backgroundColor: viewMode === 'list' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.06)',
                padding: '1px 6px',
                borderRadius: '9999px',
              }}
            >
              {formatNumber(validStops.length, lang)}
            </span>
          </button>
        </div>

        {viewMode === 'map' && (
          <div
            style={{
              pointerEvents: 'auto',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <div style={{ display: 'flex', gap: '4px' }}>
              <button
                type="button"
                onClick={handleZoomIn}
                title="Zoom In"
                aria-label="Zoom In"
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  backgroundColor: '#ffffff',
                  border: '1px solid var(--color-hairline)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  color: 'var(--color-ink)',
                  fontSize: '18px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                +
              </button>
              <button
                type="button"
                onClick={handleZoomOut}
                title="Zoom Out"
                aria-label="Zoom Out"
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  backgroundColor: '#ffffff',
                  border: '1px solid var(--color-hairline)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  color: 'var(--color-ink)',
                  fontSize: '18px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                −
              </button>
              <button
                type="button"
                onClick={handleResetBounds}
                title={lang === 'bn' ? 'পুরো রুট দেখুন' : 'Fit Entire Route'}
                aria-label={lang === 'bn' ? 'পুরো রুট দেখুন' : 'Fit Entire Route'}
                style={{
                  height: '32px',
                  padding: '0 10px',
                  borderRadius: '8px',
                  backgroundColor: '#ffffff',
                  border: '1px solid var(--color-hairline)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  color: 'var(--color-ink)',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <span>◎</span>
                <span className="hide-on-mobile">{lang === 'bn' ? 'পুরো রুট' : 'Full Route'}</span>
              </button>
            </div>

            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              title={lang === 'bn' ? 'গুগল ম্যাপে লাইভ ডিরেকশন খুলুন' : 'Open in Google Maps'}
              style={{
                height: '32px',
                padding: '0 12px',
                borderRadius: '8px',
                backgroundColor: '#ffffff',
                border: '1px solid var(--color-hairline)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                color: 'var(--color-ink)',
                fontSize: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                textDecoration: 'none',
                fontWeight: 600,
              }}
            >
              <span>{lang === 'bn' ? 'গুগল ম্যাপ ↗' : 'Maps ↗'}</span>
            </a>
          </div>
        )}
      </div>

      {viewMode === 'map' ? (
        <>
          <div
            ref={mapContainerRef}
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: '#f8fafc',
            }}
          />

          {validStops.length > 0 && (
            <div
              className="map-stoppages-ribbon"
              style={{
                position: 'absolute',
                bottom: '12px',
                left: '12px',
                right: '12px',
                zIndex: 10,
                backgroundColor: 'rgba(255, 255, 255, 0.96)',
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
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      backgroundColor: '#15803d',
                      display: 'inline-block',
                    }}
                  />
                  <span>
                    {originName} ➔ {destName}
                  </span>
                </div>
                <span style={{ color: 'var(--color-ink-muted)', fontSize: '11.5px' }}>
                  {formatNumber(validStops.length, lang)} {lang === 'bn' ? 'টি স্টপেজ' : 'Stops'}
                </span>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  overflowX: 'auto',
                  paddingBottom: '2px',
                  WebkitOverflowScrolling: 'touch',
                }}
              >
                {validStops.map((st, i) => {
                  const isStart = i === 0;
                  const isEnd = i === validStops.length - 1;
                  const isTransfer =
                    !isStart &&
                    !isEnd &&
                    transferStop &&
                    st.id === transferStop.id;

                  return (
                    <button
                      key={st.id || i}
                      type="button"
                      onClick={() => handleFocusStop(st)}
                      title={getStopDisplayName(st, lang)}
                      style={{
                        flexShrink: 0,
                        border: '1px solid',
                        borderColor: isStart
                          ? '#15803d'
                          : isEnd
                          ? '#dc2626'
                          : isTransfer
                          ? '#d97706'
                          : 'var(--color-hairline)',
                        backgroundColor: isStart
                          ? 'rgba(21, 128, 61, 0.08)'
                          : isEnd
                          ? 'rgba(220, 38, 38, 0.08)'
                          : isTransfer
                          ? 'rgba(217, 119, 6, 0.08)'
                          : '#ffffff',
                        color: isStart
                          ? '#15803d'
                          : isEnd
                          ? '#dc2626'
                          : isTransfer
                          ? '#d97706'
                          : 'var(--color-ink)',
                        borderRadius: '9999px',
                        padding: '3px 10px',
                        fontSize: '11px',
                        fontWeight: isStart || isEnd || isTransfer ? 700 : 500,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '10px',
                          opacity: 0.8,
                        }}
                      >
                        {i + 1}.
                      </span>
                      <span>{getStopDisplayName(st, lang)}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </>
      ) : (
        /* Sequential Stoppage List View Mode */
        <div
          style={{
            padding: '60px 16px 20px',
            overflowY: 'auto',
            height: '100%',
            backgroundColor: '#ffffff',
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
            <span style={{ fontSize: '12px', color: 'var(--color-ink-muted)' }}>
              {formatNumber(validStops.length, lang)}{' '}
              {lang === 'bn' ? 'টি স্টপেজ' : 'stops'}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {validStops.map((st, idx) => {
              const isStart = idx === 0;
              const isEnd = idx === validStops.length - 1;
              const isTransfer =
                !isStart &&
                !isEnd &&
                transferStop &&
                st.id === transferStop.id;

              return (
                <div
                  key={st.id || idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 14px',
                    backgroundColor: isStart
                      ? 'rgba(21, 128, 61, 0.05)'
                      : isEnd
                      ? 'rgba(220, 38, 38, 0.05)'
                      : isTransfer
                      ? 'rgba(217, 119, 6, 0.05)'
                      : '#ffffff',
                    borderRadius: '12px',
                    border: '1px solid',
                    borderColor: isStart
                      ? '#86efac'
                      : isEnd
                      ? '#fca5a5'
                      : isTransfer
                      ? '#fde68a'
                      : 'var(--color-hairline)',
                  }}
                >
                  <span
                    style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      backgroundColor: isStart
                        ? '#15803d'
                        : isEnd
                        ? '#dc2626'
                        : isTransfer
                        ? '#d97706'
                        : '#0f172a',
                      color: '#ffffff',
                      fontSize: '11px',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {idx + 1}
                  </span>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontWeight: isStart || isEnd || isTransfer ? 700 : 600,
                        fontSize: '14px',
                        color: 'var(--color-ink)',
                      }}
                    >
                      {getStopDisplayName(st, lang)}
                    </div>
                    {st.name_bn && lang === 'bn' && (
                      <div
                        style={{
                          fontSize: '12px',
                          color: 'var(--color-ink-muted)',
                        }}
                      >
                        {st.name_en}
                      </div>
                    )}
                  </div>

                  {isStart && (
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '3px 10px',
                        borderRadius: '9999px',
                        backgroundColor: '#15803d',
                        color: '#ffffff',
                        flexShrink: 0,
                      }}
                    >
                      {lang === 'bn' ? 'শুরু স্থান' : 'Origin'}
                    </span>
                  )}

                  {isEnd && (
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '3px 10px',
                        borderRadius: '9999px',
                        backgroundColor: '#dc2626',
                        color: '#ffffff',
                        flexShrink: 0,
                      }}
                    >
                      {lang === 'bn' ? 'গন্তব্য' : 'Destination'}
                    </span>
                  )}

                  {isTransfer && (
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '3px 10px',
                        borderRadius: '9999px',
                        backgroundColor: '#d97706',
                        color: '#ffffff',
                        flexShrink: 0,
                      }}
                    >
                      {lang === 'bn' ? 'বাস পরিবর্তন' : 'Transfer'}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
