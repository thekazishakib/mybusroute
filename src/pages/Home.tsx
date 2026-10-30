import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useT, formatNumber } from '../i18n/useT';
import {
  getStopById,
  getStopByName,
  getStopDisplayName,
} from '../data/load';
import { searchJourneys } from '../data/search';
import { trackRouteSearch, trackNoRouteFound } from '../analytics/ga4';
import { StopInput } from '../components/StopInput';
import { Notice } from '../components/Notice';
import { SearchResultsView } from '../components/SearchResultsView';
import {
  SearchIcon,
  PinIcon,
  SwapIcon,
  ClockIcon,
  WalletIcon,
  LightningIcon,
  ShieldIcon,
  CloseIcon,
} from '../components/Icons';
import type { Stop, JourneySearchResult } from '../data/types';

export const Home: React.FC = () => {
  const { lang, t } = useT();
  const [searchParams, setSearchParams] = useSearchParams();
  const resultsSectionRef = useRef<HTMLDivElement>(null);

  const resolveStopParam = (param: string | null): Stop | null => {
    if (!param) return null;
    return getStopById(param) ?? getStopByName(param) ?? null;
  };

  const [fromStop, setFromStop] = useState<Stop | null>(() =>
    resolveStopParam(searchParams.get('from'))
  );
  const [toStop, setToStop] = useState<Stop | null>(() =>
    resolveStopParam(searchParams.get('to'))
  );
  const [runningNowOnly, setRunningNowOnly] = useState<boolean>(false);

  const [hasSearched, setHasSearched] = useState<boolean>(() =>
    Boolean(searchParams.get('from') && searchParams.get('to'))
  );

  const [result, setResult] = useState<JourneySearchResult | null>(() => {
    const f = resolveStopParam(searchParams.get('from'));
    const dest = resolveStopParam(searchParams.get('to'));
    if (f && dest && f.id !== dest.id) {
      return searchJourneys(f.id, dest.id, {
        runningNowOnly: false,
      });
    }
    return null;
  });

  const scrollToResults = () => {
    setTimeout(() => {
      if (typeof resultsSectionRef.current?.scrollIntoView === 'function') {
        resultsSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  useEffect(() => {
    const f = resolveStopParam(searchParams.get('from'));
    const dest = resolveStopParam(searchParams.get('to'));
    if (f && dest) {
      setFromStop(f);
      setToStop(dest);
      setHasSearched(true);
      if (f.id !== dest.id) {
        setResult(
          searchJourneys(f.id, dest.id, {
            runningNowOnly,
          })
        );
      } else {
        setResult(null);
      }
    }
  }, [searchParams, runningNowOnly]);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setHasSearched(true);

    if (!fromStop || !toStop) {
      setResult(null);
      return;
    }

    setSearchParams({
      from: fromStop.id,
      to: toStop.id,
    });

    if (fromStop.id === toStop.id) {
      setResult(null);
      return;
    }

    const res = searchJourneys(fromStop.id, toStop.id, {
      runningNowOnly,
    });
    setResult(res);
    if (res.options.length > 0) {
      trackRouteSearch(fromStop.name_en, toStop.name_en, res.options.length);
    } else {
      trackNoRouteFound(fromStop.name_en, toStop.name_en);
    }
    scrollToResults();
  };

  const handleSwapStops = () => {
    const prevFrom = fromStop;
    const prevTo = toStop;
    setFromStop(prevTo);
    setToStop(prevFrom);

    if (prevTo && prevFrom) {
      setHasSearched(true);
      setSearchParams({
        from: prevTo.id,
        to: prevFrom.id,
      });
      const res = searchJourneys(prevTo.id, prevFrom.id, {
        runningNowOnly,
      });
      setResult(res);
      scrollToResults();
    }
  };

  const handleClear = () => {
    setFromStop(null);
    setToStop(null);
    setResult(null);
    setHasSearched(false);
    setSearchParams({});
  };

  const selectQuickRoute = (fromId: string, toId: string) => {
    const f = getStopById(fromId);
    const dest = getStopById(toId);
    if (f && dest) {
      setFromStop(f);
      setToStop(dest);
      setHasSearched(true);
      setSearchParams({ from: f.id, to: dest.id });
      const res = searchJourneys(f.id, dest.id, {
        runningNowOnly,
      });
      setResult(res);
      scrollToResults();
    }
  };

  return (
    <main className="container-wide" style={{ padding: '56px 20px 80px' }}>
      <section aria-labelledby="home-hero-heading" style={{ marginBottom: '44px' }}>
        <div className="hero-grid">
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '7px 18px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-hairline)',
                fontSize: '14px',
                fontWeight: 600,
                color: 'var(--color-ink)',
                marginBottom: '20px',
              }}
              lang={lang}
            >
              <PinIcon size={15} color="var(--color-ink)" />
              <span>{t('mockupEyebrow')}</span>
            </div>

            <h1
              id="home-hero-heading"
              style={{
                fontSize: 'clamp(28px, 5vw, 44px)',
                fontWeight: 800,
                color: 'var(--color-ink)',
                lineHeight: 1.22,
                margin: '0 0 16px 0',
                letterSpacing: '-0.5px',
              }}
              lang={lang}
            >
              {t('mockupTitle')}
            </h1>

            <p
              style={{
                fontSize: '15.5px',
                color: 'var(--color-ink-muted)',
                lineHeight: 1.6,
                margin: '0 0 28px 0',
                maxWidth: '520px',
              }}
              lang={lang}
            >
              {t('mockupSubtitle')}
            </p>

            <form
              onSubmit={handleSearchSubmit}
              data-testid="home-search-block"
              className="home-search-form"
            >
              <div className="search-input-col" style={{ flex: 1, minWidth: '160px' }}>
                <StopInput
                  id="from-stop-input"
                  label={t('fromLabel')}
                  placeholder={t('fromPlaceholder')}
                  selectedStop={fromStop}
                  onSelectStop={(st) => setFromStop(st)}
                  variant="hero"
                />
              </div>

              <div className="search-swap-col" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  type="button"
                  onClick={handleSwapStops}
                  title={t('swapStops')}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    border: '1px solid var(--color-hairline)',
                    backgroundColor: 'var(--color-surface)',
                    color: 'var(--color-ink)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <SwapIcon size={14} />
                </button>
                <div className="hide-on-mobile" style={{ width: '1px', height: '32px', backgroundColor: 'var(--color-hairline)' }} />
              </div>

              <div className="search-input-col" style={{ flex: 1, minWidth: '160px' }}>
                <StopInput
                  id="to-stop-input"
                  label={t('toLabel')}
                  placeholder={t('toPlaceholder')}
                  selectedStop={toStop}
                  onSelectStop={(st) => setToStop(st)}
                  variant="hero"
                />
              </div>

              <div className="search-actions-col" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  type="submit"
                  className="btn-primary"
                  data-testid="search-submit-button"
                  lang={lang}
                  style={{
                    borderRadius: 'var(--radius-full)',
                    padding: '12px 26px',
                    fontSize: '15px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    whiteSpace: 'nowrap',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <SearchIcon size={16} />
                  <span>{t('searchButton')}</span>
                </button>

                {(fromStop || toStop) && (
                  <button
                    type="button"
                    onClick={handleClear}
                    title={lang === 'bn' ? 'মুছে ফেলুন' : 'Clear search'}
                    aria-label={lang === 'bn' ? 'মুছে ফেলুন' : 'Clear search'}
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      border: '1px solid var(--color-hairline)',
                      backgroundColor: 'var(--color-surface)',
                      color: 'var(--color-ink-muted)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.15s ease',
                      flexShrink: 0,
                    }}
                  >
                    <CloseIcon size={14} color="var(--color-ink-muted)" />
                  </button>
                )}
              </div>
            </form>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                marginTop: '12px',
                padding: '0 8px',
              }}
            >
              <button
                type="button"
                onClick={() => setRunningNowOnly(!runningNowOnly)}
                style={{
                  border: '1px solid',
                  borderColor: runningNowOnly ? 'var(--color-button-primary-bg)' : 'var(--color-hairline)',
                  borderRadius: '9999px',
                  padding: '5px 14px',
                  backgroundColor: runningNowOnly ? 'var(--color-button-primary-bg)' : 'var(--color-surface)',
                  color: runningNowOnly ? 'var(--color-button-primary-text)' : 'var(--color-ink-muted)',
                  fontSize: '12.5px',
                  fontWeight: runningNowOnly ? 600 : 500,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.15s ease',
                }}
                lang={lang}
              >
                <ClockIcon size={13} color="currentColor" />
                <span>{lang === 'bn' ? 'শুধু এখন চালু বাস' : 'Currently Active Buses'}</span>
              </button>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginTop: '22px',
                flexWrap: 'wrap',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13.5px', fontWeight: 600, color: 'var(--color-ink)' }}>
                <ClockIcon size={15} color="var(--color-ink)" />
                <span>{t('popularRoutesLabel')}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                {[
                  { fromId: 'gulistan', toId: 'mirpur_10', labelBn: 'গুলিস্তান → মিরপুর', labelEn: 'Gulistan → Mirpur' },
                  { fromId: 'motijheel', toId: 'abdullahpur', labelBn: 'মতিঝিল → উত্তরা', labelEn: 'Motijheel → Uttara' },
                  { fromId: 'savar', toId: 'gulistan', labelBn: 'সাভার → গুলিস্তান', labelEn: 'Savar → Gulistan' },
                ].map((r, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => selectQuickRoute(r.fromId, r.toId)}
                    style={{
                      backgroundColor: 'var(--color-hairline-soft)',
                      border: '1px solid var(--color-hairline)',
                      borderRadius: 'var(--radius-full)',
                      padding: '6px 16px',
                      fontSize: '13px',
                      fontWeight: 500,
                      color: 'var(--color-ink)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                    lang={lang}
                  >
                    {lang === 'bn' ? r.labelBn : r.labelEn}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div
              style={{
                position: 'relative',
                borderRadius: 'var(--radius-xl)',
                overflow: 'hidden',
                boxShadow: '0 12px 32px rgba(0, 0, 0, 0.05)',
                border: '1px solid var(--color-hairline)',
                backgroundColor: 'var(--color-surface)',
                aspectRatio: '1.08 / 1',
                maxHeight: '420px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img
                src="/hero-bus.png"
                alt="Dhaka BRTC Bus and City Route"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
            </div>
          </div>

        </div>
      </section>

      {!hasSearched && (
        <section
          aria-label="Features"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '24px',
            paddingTop: '36px',
            paddingBottom: '36px',
            borderTop: '1px solid var(--color-hairline)',
            marginBottom: '0',
          }}
        >
          {[
            {
              icon: <PinIcon size={20} color="var(--color-ink)" />,
              title: t('feature1Title'),
              desc: t('feature1Desc'),
            },
            {
              icon: <WalletIcon size={20} color="var(--color-ink)" />,
              title: t('feature2Title'),
              desc: t('feature2Desc'),
            },
            {
              icon: <LightningIcon size={20} color="var(--color-ink)" />,
              title: t('feature3Title'),
              desc: t('feature3Desc'),
            },
            {
              icon: <ShieldIcon size={20} color="var(--color-ink)" />,
              title: t('feature4Title'),
              desc: t('feature4Desc'),
            },
          ].map((feat, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '14px',
              }}
            >
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-hairline)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {feat.icon}
              </div>
              <div>
                <h3
                  style={{
                    fontSize: '15px',
                    fontWeight: 700,
                    color: 'var(--color-ink)',
                    margin: '0 0 4px 0',
                  }}
                  lang={lang}
                >
                  {feat.title}
                </h3>
                <p
                  style={{
                    fontSize: '13px',
                    color: 'var(--color-ink-muted)',
                    lineHeight: 1.5,
                    margin: 0,
                  }}
                  lang={lang}
                >
                  {feat.desc}
                </p>
              </div>
            </div>
          ))}
        </section>
      )}

      <section
        ref={resultsSectionRef}
        aria-live="polite"
        data-testid="search-results-section"
        style={{ marginTop: '24px', minHeight: hasSearched ? '300px' : 'auto' }}
      >
        {hasSearched && (!fromStop || !toStop) && (
          <Notice testId="notice-select-both">{t('selectBothStops')}</Notice>
        )}

        {hasSearched && fromStop && toStop && fromStop.id === toStop.id && (
          <Notice testId="notice-same-stop">{t('sameOriginDest')}</Notice>
        )}

        {hasSearched && fromStop && toStop && fromStop.id !== toStop.id && result && (
          <div style={{ marginTop: '16px' }}>
            <SearchResultsView
              fromStop={fromStop}
              toStop={toStop}
              result={result}
              autoScroll={true}
              onSearchChange={(newF, newT) => {
                setFromStop(newF);
                setToStop(newT);
                setSearchParams({ from: newF.id, to: newT.id });
                const res = searchJourneys(newF.id, newT.id, {
                  runningNowOnly,
                });
                setResult(res);
                scrollToResults();
              }}
            />
          </div>
        )}
      </section>
    </main>
  );
};
