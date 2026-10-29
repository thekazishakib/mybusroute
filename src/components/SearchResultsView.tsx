import React, { useState, useRef, useEffect } from 'react';
import type { JourneySearchResult, JourneyOption, Stop } from '../data/types';
import { useT, formatNumber } from '../i18n/useT';
import { getStopDisplayName, getRouteDisplayName } from '../data/load';
import { RouteMap } from './RouteMap';
import { RouteDetailsModal } from './RouteDetailsModal';
import { StopInput } from './StopInput';
import {
  SearchIcon,
  PinIcon,
  BusIcon,
  TransferIcon,
  WalletIcon,
  ShieldIcon,
  RefreshIcon,
  MapIcon,
  PrivacyIcon,
  FilterIcon,
} from './Icons';

interface SearchResultsViewProps {
  fromStop: Stop;
  toStop: Stop;
  result: JourneySearchResult;
  onSearchChange: (from: Stop, to: Stop) => void;
  autoScroll?: boolean;
}

export const SearchResultsView: React.FC<SearchResultsViewProps> = ({
  fromStop,
  toStop,
  result,
  onSearchChange,
  autoScroll = false,
}) => {
  const { lang, t } = useT();
  const rootContainerRef = useRef<HTMLDivElement>(null);
  const mapSectionRef = useRef<HTMLDivElement>(null);

  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number>(0);
  const [mapViewMode, setMapViewMode] = useState<'map' | 'list'>('map');
  const [isFullDetailsOpen, setIsFullDetailsOpen] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'transfers' | 'fare' | 'stops'>('transfers');
  const [isStudentFare, setIsStudentFare] = useState<boolean>(false);

  // Input edit state in top search bar
  const [isEditingSearch, setIsEditingSearch] = useState<boolean>(false);
  const [editFrom, setEditFrom] = useState<Stop | null>(fromStop);
  const [editTo, setEditTo] = useState<Stop | null>(toStop);

  const selectedOption: JourneyOption | undefined =
    result.options[selectedOptionIndex] ?? result.options[0];

  // Auto-scroll into view when results change
  useEffect(() => {
    if (autoScroll && typeof rootContainerRef.current?.scrollIntoView === 'function') {
      rootContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [fromStop.id, toStop.id, autoScroll]);

  // Stops of the selected option
  const selectedStops = React.useMemo(() => {
    if (!selectedOption) return [fromStop, toStop];
    return selectedOption.legs.flatMap((l, i) =>
      i === 0 ? l.stops : l.stops.slice(1)
    );
  }, [selectedOption, fromStop, toStop]);

  // Sorted options
  const sortedOptions = React.useMemo(() => {
    const list = [...result.options];
    if (sortBy === 'transfers') {
      return list.sort((a, b) => a.transferCount - b.transferCount);
    }
    if (sortBy === 'fare') {
      return list.sort((a, b) => a.totalFareTk - b.totalFareTk);
    }
    if (sortBy === 'stops') {
      return list.sort((a, b) => a.totalStopsRidden - b.totalStopsRidden);
    }
    return list;
  }, [result.options, sortBy]);

  const handleApplySearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (editFrom && editTo && editFrom.id !== editTo.id) {
      setIsEditingSearch(false);
      setIsFullDetailsOpen(false);
      setSelectedOptionIndex(0);
      onSearchChange(editFrom, editTo);
    }
  };

  const toBengaliNumber = (num: number): string => {
    return formatNumber(num, 'bn');
  };

  return (
    <div ref={rootContainerRef} style={{ maxWidth: '1280px', margin: '0 auto' }}>
      <div style={{ marginBottom: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
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
          }}
          lang={lang}
        >
          <SearchIcon size={14} color="var(--color-ink)" />
          <span>{lang === 'bn' ? 'রুট পরিবর্তন ও অনুসন্ধান' : 'Modify & Search Route'}</span>
        </div>
        <div style={{ fontSize: '13px', color: 'var(--color-ink-muted)' }}>
          {lang === 'bn' ? 'শুরুর স্থান বা গন্তব্য পরিবর্তন করে সাথে সাথে খুঁজুন' : 'Update origin or destination to search instantly'}
        </div>
      </div>

      <div className="results-search-bar">
        <form
          onSubmit={handleApplySearch}
          className="results-search-form"
        >
          <div className="search-input-col">
            <StopInput
              id="edit-from-stop"
              label={t('fromLabel')}
              placeholder={t('fromPlaceholder')}
              selectedStop={editFrom}
              onSelectStop={(st) => setEditFrom(st)}
              variant="dark"
            />
          </div>

          <span className="search-arrow-col">➔</span>

          <div className="search-input-col">
            <StopInput
              id="edit-to-stop"
              label={t('toLabel')}
              placeholder={t('toPlaceholder')}
              selectedStop={editTo}
              onSelectStop={(st) => setEditTo(st)}
              variant="dark"
            />
          </div>

          <div className="search-actions-col">
            <button
              type="submit"
              className="results-search-submit-btn"
              lang={lang}
            >
              <SearchIcon size={15} color="#0a0a0a" />
              <span>{t('searchButton')}</span>
            </button>

            {(editFrom || editTo) && (
              <button
                type="button"
                onClick={() => {
                  setEditFrom(null);
                  setEditTo(null);
                }}
                title={lang === 'bn' ? 'মুছে ফেলুন' : 'Clear search'}
                aria-label={lang === 'bn' ? 'মুছে ফেলুন' : 'Clear search'}
                className="results-search-clear-btn"
              >
                ✕
              </button>
            )}
          </div>
        </form>
      </div>

      {isFullDetailsOpen && selectedOption ? (
        <RouteDetailsModal
          option={selectedOption}
          fromStop={fromStop}
          toStop={toStop}
          onBack={() => setIsFullDetailsOpen(false)}
        />
      ) : (
        <>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px',
              flexWrap: 'wrap',
              gap: '16px',
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: '28px',
                  fontWeight: 800,
                  color: 'var(--color-ink)',
                  margin: '0 0 4px 0',
                }}
                lang={lang}
              >
                {lang === 'bn' ? 'খোঁজার ফলাফল' : 'Search Results'}
              </h1>
              <div style={{ fontSize: '14px', color: 'var(--color-ink-muted)' }} lang={lang}>
                <span style={{ fontWeight: 600, color: 'var(--color-ink)' }}>
                  {getStopDisplayName(fromStop, lang)} → {getStopDisplayName(toStop, lang)}
                </span>{' '}
                • {lang === 'bn' ? `মোট ${toBengaliNumber(sortedOptions.length)}টি রুট পাওয়া গেছে` : `${sortedOptions.length} routes found`}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-hairline)',
                  borderRadius: 'var(--radius-full)',
                  padding: '6px 14px',
                  fontSize: '13px',
                }}
              >
                <span style={{ color: 'var(--color-ink-muted)' }}>
                  {lang === 'bn' ? 'সাজান:' : 'Sort:'}
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: 'var(--color-ink)',
                    cursor: 'pointer',
                    outline: 'none',
                  }}
                >
                  <option value="transfers">{lang === 'bn' ? 'কম ট্রান্সফার' : 'Fewer Transfers'}</option>
                  <option value="fare">{lang === 'bn' ? 'কম ভাড়া' : 'Lowest Fare'}</option>
                  <option value="stops">{lang === 'bn' ? 'কম স্টপেজ' : 'Fewest Stops'}</option>
                </select>
              </div>

              <button
                type="button"
                title="Filters"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-hairline)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'var(--color-ink)',
                }}
              >
                <FilterIcon size={16} />
              </button>
            </div>
          </div>

          <div className="journey-options-3col-grid" style={{ marginBottom: '32px' }}>
            {sortedOptions.map((opt, idx) => {
              const isSelected = idx === selectedOptionIndex;
              const isDirect = opt.transferCount === 0;
              const allLegRoutes = opt.legs.flatMap((l) => l.routes);
              const busNames = Array.from(new Set(allLegRoutes.map((r) => getRouteDisplayName(r, lang)))).slice(0, 3).join(' / ');

              // If there are exactly 4 options, center the 4th card in the middle column
              const isFourthCardInFour = sortedOptions.length === 4 && idx === 3;

              return (
                <div
                  key={idx}
                  onClick={() => setSelectedOptionIndex(idx)}
                  style={{
                    backgroundColor: '#ffffff',
                    border: isSelected ? '2px solid #0a0a0a' : '1px solid var(--color-hairline)',
                    borderRadius: '20px',
                    padding: '20px',
                    cursor: 'pointer',
                    boxShadow: isSelected ? '0 8px 24px rgba(0,0,0,0.08)' : '0 2px 10px rgba(0,0,0,0.03)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: '260px',
                    gap: '16px',
                    transition: 'all 0.18s ease',
                    position: 'relative',
                    gridColumn: isFourthCardInFour ? '2 / 3' : undefined,
                  }}
                  className="results-journey-card"
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            backgroundColor: isSelected ? '#0a0a0a' : 'var(--color-hairline-soft)',
                            color: isSelected ? '#ffffff' : 'var(--color-ink)',
                            fontWeight: 700,
                            fontSize: '13px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          {lang === 'bn' ? toBengaliNumber(idx + 1) : idx + 1}
                        </div>
                        <span
                          style={{
                            fontSize: '12px',
                            fontWeight: 600,
                            padding: '3px 10px',
                            borderRadius: '9999px',
                            backgroundColor: 'var(--color-surface)',
                            color: 'var(--color-ink)',
                            border: '1px solid var(--color-hairline)',
                          }}
                        >
                          {isDirect
                            ? (lang === 'bn' ? 'সরাসরি বাস' : 'Direct Bus')
                            : opt.transferCount === 1
                              ? (lang === 'bn' ? 'বাস পরিবর্তন' : '1 Transfer')
                              : (lang === 'bn' ? 'বিকল্প রুট' : 'Alternative')}
                        </span>
                      </div>

                      {idx === 0 && (
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            color: 'var(--color-ink)',
                            backgroundColor: 'var(--color-hairline-soft)',
                            border: '1px solid var(--color-hairline)',
                            padding: '2px 8px',
                            borderRadius: '6px',
                          }}
                        >
                          {lang === 'bn' ? 'সেরা পছন্দ' : 'Best Choice'}
                        </span>
                      )}
                    </div>

                    <div style={{ fontWeight: 800, fontSize: '19px', color: 'var(--color-ink)', lineHeight: 1.3, marginBottom: '6px' }}>
                      {busNames || (lang === 'bn' ? 'লোকাল বাস' : 'Local Bus')}
                    </div>

                    <div style={{ fontSize: '13px', color: 'var(--color-ink-muted)', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                      <span>{getStopDisplayName(fromStop, lang)}</span>
                      <span style={{ color: 'var(--color-hairline-strong)' }}>➔</span>
                      <span>{getStopDisplayName(toStop, lang)}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '12px', fontSize: '13px', color: 'var(--color-ink-muted)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <PinIcon size={14} color="var(--color-ink-muted)" />
                        <span style={{ fontWeight: 600, color: 'var(--color-ink)' }}>
                          {formatNumber(opt.totalStopsRidden, lang)} {lang === 'bn' ? 'টি স্টপ পার হয়ে যাবে' : 'stops'}
                        </span>
                      </div>
                      <span>•</span>
                      <span>{formatNumber(opt.totalKm, lang)} {lang === 'bn' ? 'কিমি' : 'km'}</span>
                    </div>
                  </div>

                  <div style={{ borderTop: '1px solid var(--color-hairline-soft)', paddingTop: '12px', marginTop: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '10px', gap: '8px', flexWrap: 'wrap' }}>
                      <div>
                        <div style={{ fontSize: '11px', color: 'var(--color-ink-muted)', fontWeight: 500 }}>
                          {t('totalFareLabel')}
                        </div>
                        <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-ink)' }}>
                          {t('aboutFare')} {formatNumber(opt.totalFareTk, lang)}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--color-ink-muted)', marginTop: '2px', lineHeight: 1.3 }}>
                          * {lang === 'bn' ? 'শিক্ষার্থীদের হাফ ভাড়া শুধুমাত্র ছুটির দিন বাদে' : 'Student half fare (except holidays)'}
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedOptionIndex(idx);
                            setMapViewMode('map');
                            if (mapSectionRef.current) {
                              mapSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                            }
                          }}
                          style={{
                            backgroundColor: isSelected ? '#0a0a0a' : 'var(--color-surface)',
                            color: isSelected ? '#ffffff' : 'var(--color-ink)',
                            border: isSelected ? '1px solid #0a0a0a' : '1px solid var(--color-hairline-strong)',
                            borderRadius: 'var(--radius-full)',
                            padding: '7px 14px',
                            fontSize: '12.5px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            transition: 'all 0.15s ease',
                          }}
                          lang={lang}
                          title={lang === 'bn' ? 'ম্যাপে দেখুন' : 'View on map'}
                        >
                          <MapIcon size={14} color={isSelected ? '#ffffff' : 'var(--color-ink)'} />
                          <span>{lang === 'bn' ? 'ম্যাপ' : 'Map'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedOptionIndex(idx);
                            setIsFullDetailsOpen(true);
                          }}
                          style={{
                            backgroundColor: 'transparent',
                            color: 'var(--color-ink)',
                            border: '1px solid var(--color-hairline-strong)',
                            borderRadius: 'var(--radius-full)',
                            padding: '7px 14px',
                            fontSize: '12.5px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                            transition: 'all 0.15s ease',
                          }}
                          lang={lang}
                        >
                          {lang === 'bn' ? 'বিস্তারিত ⌵' : 'Details ⌵'}
                        </button>
                      </div>
                    </div>

                    <div
                      style={{
                        fontSize: '11px',
                        color: 'var(--color-ink)',
                        backgroundColor: 'var(--color-surface)',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        textAlign: 'center',
                        fontWeight: isSelected ? 600 : 400,
                      }}
                    >
                      {isSelected ? (lang === 'bn' ? '✓ ম্যাপে প্রদর্শিত হচ্ছে' : '✓ Showing on Map') : (lang === 'bn' ? 'ম্যাপে দেখতে ক্লিক করুন' : 'Click to view on map')}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div
            ref={mapSectionRef}
            style={{
              alignItems: 'start',
              marginBottom: '48px',
            }}
            className="results-split-grid"
          >
            <div>
              <RouteMap
                stops={selectedStops}
                fromStop={fromStop}
                toStop={toStop}
                transferStop={selectedOption?.transferStops?.[0] || null}
                viewMode={mapViewMode}
                onToggleViewMode={(m) => setMapViewMode(m)}
              />
            </div>

            {selectedOption && (
              <div
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '20px',
                  border: '1px solid var(--color-hairline)',
                  padding: '24px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--color-hairline-soft)', paddingBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: '#0a0a0a',
                        color: '#ffffff',
                        fontWeight: 700,
                        fontSize: '13px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {lang === 'bn' ? toBengaliNumber(selectedOptionIndex + 1) : selectedOptionIndex + 1}
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '16px', color: 'var(--color-ink)' }}>
                        {selectedOption.transferCount === 0
                          ? (lang === 'bn' ? 'সরাসরি বাস' : 'Direct Bus')
                          : (lang === 'bn' ? 'বাস পরিবর্তন করে' : 'With Transfer')}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--color-ink-muted)' }}>
                        {getStopDisplayName(fromStop, lang)} → {getStopDisplayName(toStop, lang)}
                      </div>
                    </div>
                  </div>

                  <span
                    style={{
                      backgroundColor: 'var(--color-surface)',
                      color: 'var(--color-ink)',
                      border: '1px solid var(--color-hairline)',
                      fontWeight: 600,
                      fontSize: '12px',
                      padding: '4px 10px',
                      borderRadius: '9999px',
                    }}
                  >
                    {lang === 'bn' ? 'সেরা বিকল্প' : 'Best Option'}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <div style={{ color: 'var(--color-ink-muted)', marginTop: '2px' }}>
                      <BusIcon size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', color: 'var(--color-ink-muted)' }}>{lang === 'bn' ? 'বাসের নাম' : 'Bus Name'}</div>
                      <strong style={{ color: 'var(--color-ink)' }}>
                        {selectedOption.legs.flatMap((l) => l.routes).map((r) => getRouteDisplayName(r, lang)).join(' / ')}
                      </strong>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <div style={{ color: 'var(--color-ink)', marginTop: '2px' }}>
                      <PinIcon size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', color: 'var(--color-ink-muted)' }}>{lang === 'bn' ? 'উৎস স্থান' : 'Origin'}</div>
                      <strong style={{ color: 'var(--color-ink)' }}>{getStopDisplayName(fromStop, lang)}</strong>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <div style={{ color: 'var(--color-ink)', marginTop: '2px' }}>
                      <PinIcon size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', color: 'var(--color-ink-muted)' }}>{lang === 'bn' ? 'নামার স্থান' : 'Destination'}</div>
                      <strong style={{ color: 'var(--color-ink)' }}>{getStopDisplayName(toStop, lang)}</strong>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <div style={{ color: 'var(--color-ink-muted)', marginTop: '2px' }}>
                      <PinIcon size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', color: 'var(--color-ink-muted)' }}>{lang === 'bn' ? 'স্টপেজ (সম্ভাব্য)' : 'Stoppages'}</div>
                      <strong style={{ color: 'var(--color-ink)' }}>
                        {formatNumber(selectedOption.totalStopsRidden, lang)} {t('stopsCount')} ({formatNumber(selectedOption.totalKm, lang)} {lang === 'bn' ? 'কিমি' : 'km'})
                      </strong>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <div style={{ color: 'var(--color-ink-muted)', marginTop: '2px' }}>
                      <WalletIcon size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', color: 'var(--color-ink-muted)' }}>{lang === 'bn' ? 'ভাড়া' : 'Fare'}</div>
                      <strong style={{ fontSize: '20px', color: 'var(--color-ink)' }}>
                        {t('aboutFare')} {formatNumber(selectedOption.totalFareTk, lang)}
                      </strong>
                      <div style={{ fontSize: '12px', color: 'var(--color-ink-muted)', marginTop: '2px' }}>
                        * {lang === 'bn' ? 'শিক্ষার্থীদের হাফ ভাড়া শুধুমাত্র ছুটির দিন বাদে' : 'Student half fare (except holidays)'}
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    backgroundColor: 'var(--color-surface)',
                    border: '1px solid var(--color-hairline)',
                    borderRadius: '12px',
                    padding: '12px 14px',
                    fontSize: '12px',
                    color: 'var(--color-ink-muted)',
                    lineHeight: 1.5,
                  }}
                  lang={lang}
                >
                  {t('fareEstimateDisclaimer')}
                </div>

                <button
                  type="button"
                  onClick={() => setIsFullDetailsOpen(true)}
                  className="btn-primary"
                  style={{
                    width: '100%',
                    borderRadius: 'var(--radius-full)',
                    padding: '12px',
                    fontSize: '14px',
                    fontWeight: 700,
                    textAlign: 'center',
                    justifyContent: 'center',
                    marginTop: '4px',
                  }}
                  lang={lang}
                >
                  {lang === 'bn' ? 'সম্পূর্ণ রুট দেখুন ⌵' : 'View Full Route ⌵'}
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
