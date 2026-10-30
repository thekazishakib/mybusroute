import React, { useState, useRef, useEffect } from 'react';
import { useT } from '../i18n/useT';
import { searchPlaces } from '../data/search';
import { stops, getStopById, getStopDisplayName } from '../data/load';
import { PinIcon } from './Icons';
import type {
  Stop,
  StopGroup,
  Landmark,
  SearchSuggestion,
} from '../data/types';

interface StopInputProps {
  id: string;
  label: string;
  placeholder: string;
  selectedStop: Stop | null;
  onSelectStop: (stop: Stop | null) => void;
  variant?: 'standard' | 'hero' | 'dark';
}

export const StopInput: React.FC<StopInputProps> = ({
  id,
  label,
  placeholder,
  selectedStop,
  onSelectStop,
  variant = 'standard',
}) => {
  const { lang, t } = useT();
  const [query, setQuery] = useState<string>(selectedStop ? getStopDisplayName(selectedStop, lang) : '');
  const [isOpen, setIsOpen] = useState(false);
  const [activeGroup, setActiveGroup] = useState<{
    group: StopGroup;
    groupStops: Stop[];
  } | null>(null);
  const [activeLandmark, setActiveLandmark] = useState<{
    landmark: Landmark;
    landmarkStops: Stop[];
  } | null>(null);
  const [activeAdamjee, setActiveAdamjee] = useState<Stop[] | null>(null);

  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuery(selectedStop ? getStopDisplayName(selectedStop, lang) : '');
  }, [selectedStop, lang]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const suggestions: SearchSuggestion[] = React.useMemo(() => {
    if (!query.trim()) {
      return stops.slice(0, 8).map((st) => ({
        kind: 'stop',
        id: st.id,
        label_en: st.name_en,
        label_bn: st.name_bn || undefined,
        stop: st,
      }));
    }
    return searchPlaces(query, 12);
  }, [query]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    setIsOpen(true);
    setActiveGroup(null);
    setActiveLandmark(null);
    setActiveAdamjee(null);
    if (
      selectedStop &&
      val.trim().toLowerCase() !== selectedStop.name_en.toLowerCase() &&
      val.trim() !== (selectedStop.name_bn || '')
    ) {
      onSelectStop(null);
    }
  };

  const handleSelectSuggestion = (item: SearchSuggestion) => {
    if (item.kind === 'adamjee_choice') {
      const adamjeeSchool = getStopById('adamjee_school');
      const adamijeeCollege = getStopById('adamijee_college');
      setActiveAdamjee([adamjeeSchool!, adamijeeCollege!].filter(Boolean));
      setActiveGroup(null);
      setActiveLandmark(null);
      setIsOpen(false);
      onSelectStop(null);
      return;
    }

    if (item.kind === 'stop' && item.stop) {
      setQuery(getStopDisplayName(item.stop, lang));
      setActiveGroup(null);
      setActiveLandmark(null);
      setActiveAdamjee(null);
      setIsOpen(false);
      onSelectStop(item.stop);
      return;
    }

    if (item.kind === 'group' && item.group && item.groupStops) {
      setQuery(item.group.name_en);
      setActiveGroup({ group: item.group, groupStops: item.groupStops });
      setActiveLandmark(null);
      setActiveAdamjee(null);
      setIsOpen(false);
      onSelectStop(null);
      return;
    }

    if (item.kind === 'landmark' && item.landmark && item.landmarkStops) {
      const primaryStop = item.landmarkStops[0];
      if (primaryStop) {
        setQuery(getStopDisplayName(primaryStop, lang));
        setActiveGroup(null);
        setActiveLandmark(null);
        setActiveAdamjee(null);
        setIsOpen(false);
        onSelectStop(primaryStop);
        return;
      }
    }
  };

  const handlePickSubStop = (st: Stop) => {
    setQuery(getStopDisplayName(st, lang));
    setActiveGroup(null);
    setActiveLandmark(null);
    setActiveAdamjee(null);
    setIsOpen(false);
    onSelectStop(st);
  };

  const isRounded = variant === 'hero' || variant === 'dark';
  const isDark = variant === 'dark';

  return (
    <div
      className={isRounded ? 'hero-input-field-wrapper' : 'input-field-wrapper'}
      ref={wrapperRef}
      style={isRounded ? { position: 'relative', flex: 1, display: 'flex', alignItems: 'center', gap: '10px' } : undefined}
    >
      {isRounded ? (
        <>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '24px', height: '24px', color: isDark ? '#ffffff' : 'var(--color-ink)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            <label htmlFor={id} style={{ fontSize: '11px', fontWeight: 600, color: isDark ? 'rgba(255, 255, 255, 0.75)' : 'var(--color-ink-muted)', letterSpacing: '0.2px' }} lang={lang}>
              {label}
            </label>
            <input
              id={id}
              type="text"
              lang={lang}
              value={query}
              placeholder={placeholder}
              autoComplete="off"
              onFocus={() => setIsOpen(true)}
              onChange={handleInputChange}
              aria-expanded={isOpen}
              aria-autocomplete="list"
              aria-controls={`${id}-suggestions`}
              style={{
                border: 'none',
                outline: 'none',
                background: 'transparent',
                fontSize: '15px',
                fontWeight: 600,
                color: isDark ? '#ffffff' : 'var(--color-ink)',
                padding: '2px 0 0 0',
                width: '100%',
              }}
            />
          </div>
        </>
      ) : (
        <>
          <label htmlFor={id} className="input-label" lang={lang}>
            {label}
          </label>
          <input
            id={id}
            type="text"
            className="text-input"
            lang="en"
            value={query}
            placeholder={placeholder}
            autoComplete="off"
            onFocus={() => setIsOpen(true)}
            onChange={handleInputChange}
            aria-expanded={isOpen}
            aria-autocomplete="list"
            aria-controls={`${id}-suggestions`}
          />
        </>
      )}

      {isOpen && suggestions.length > 0 && (
        <ul
          id={`${id}-suggestions`}
          className="suggestion-menu"
          role="listbox"
          data-testid={`${id}-suggestions`}
          style={
            isRounded
              ? {
                  position: 'absolute',
                  top: 'calc(100% + 14px)',
                  left: '-16px',
                  right: '-16px',
                  zIndex: 100,
                  boxShadow: '0 12px 36px rgba(0,0,0,0.18)',
                }
              : undefined
          }
        >
          {suggestions.map((item) => (
            <li
              key={`${item.kind}-${item.id}`}
              role="option"
              aria-selected={selectedStop?.id === item.id}
            >
              <button
                type="button"
                className="suggestion-item"
                onClick={() => handleSelectSuggestion(item)}
              >
                <div className="suggestion-item-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                  <span style={{ fontWeight: 600, fontSize: '15px', color: 'var(--color-ink)' }} lang={lang}>
                    {item.kind === 'landmark' && item.landmarkStops?.[0]?.id === 'shahbag'
                      ? (lang === 'bn' ? 'ঢাকা বিশ্ববিদ্যালয় (শাহবাগ)' : 'Dhaka University (Shahbag)')
                      : lang === 'bn' && (item.label_bn || item.stop?.name_bn)
                      ? (item.label_bn || item.stop?.name_bn)
                      : item.label_en}
                  </span>
                  {item.kind === 'group' && (
                    <span className="chip" style={{ fontSize: '11px', padding: '2px 8px' }} lang={lang}>
                      {lang === 'bn' ? 'এলাকা' : 'Area'}
                    </span>
                  )}
                  {item.kind === 'landmark' && (
                    <span className="chip" style={{ fontSize: '11px', padding: '2px 8px' }} lang={lang}>
                      {lang === 'bn' ? 'ক্যাম্পাস / স্থান' : 'Landmark'}
                    </span>
                  )}
                </div>
                {item.kind === 'landmark' && item.landmarkStops && (
                  <div className="suggestion-caption" style={{ fontSize: '12px', color: 'var(--color-ink-muted)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }} lang={lang}>
                    <PinIcon size={12} color="var(--color-ink-muted)" />
                    <span>{lang === 'bn' ? 'বাস স্টপ: ' : 'Bus stop: '}</span>
                    <span>{getStopDisplayName(item.landmarkStops[0], lang)}</span>
                  </div>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}

      {activeAdamjee && (
        <div className="picker-panel" data-testid={`${id}-adamjee-picker`}>
          <div className="chip chip-choice" style={{ marginBottom: '8px' }} lang={lang}>
            {t('adamjeeBadge')}
          </div>
          <p className="picker-title" lang={lang}>
            {t('adamjeeNotice')}
          </p>
          <div className="picker-chips">
            {activeAdamjee.map((st) => (
              <button
                key={st.id}
                type="button"
                lang={lang}
                className="btn-primary"
                style={{ padding: '8px 16px', fontSize: '15px' }}
                onClick={() => handlePickSubStop(st)}
              >
                {getStopDisplayName(st, lang)}
              </button>
            ))}
          </div>
        </div>
      )}

      {activeLandmark && (
        <div className="picker-panel" data-testid={`${id}-landmark-picker`}>
          <div className="chip chip-landmark" style={{ marginBottom: '8px' }} lang={lang}>
            {t('landmarkBadge')}
          </div>
          <p className="picker-title" lang={lang}>
            <strong>{activeLandmark.landmark.name_en}</strong> —{' '}
            {t('landmarkPrompt')}
          </p>
          <div className="picker-chips">
            {activeLandmark.landmarkStops.map((st) => (
              <button
                key={st.id}
                type="button"
                lang={lang}
                className="btn-secondary"
                onClick={() => handlePickSubStop(st)}
              >
                {getStopDisplayName(st, lang)}
              </button>
            ))}
          </div>
        </div>
      )}

      {activeGroup && (
        <div className="picker-panel" data-testid={`${id}-group-picker`}>
          <p className="picker-title" lang={lang}>
            <strong>{activeGroup.group.name_en}</strong> —{' '}
            {t('groupPrompt')}
          </p>
          <div className="picker-chips">
            {activeGroup.groupStops.map((st) => (
              <button
                key={st.id}
                type="button"
                lang={lang}
                className="btn-secondary"
                onClick={() => handlePickSubStop(st)}
              >
                {getStopDisplayName(st, lang)}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
