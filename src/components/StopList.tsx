import React from 'react';
import { useT, formatNumber } from '../i18n/useT';
import { getStopDisplayName } from '../data/load';
import type { Stop } from '../data/types';

interface StopListProps {
  stops: Stop[];
  highlightStopIds?: Set<string>;
}

export const StopList: React.FC<StopListProps> = ({
  stops,
  highlightStopIds,
}) => {
  const { lang } = useT();

  return (
    <ol className="stop-list">
      {stops.map((stop, idx) => {
        const isHighlighted = highlightStopIds?.has(stop.stop_id);
        return (
          <li key={`${stop.stop_id}-${idx}`} className="stop-row">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <span className="stop-seq" lang={lang}>
                {formatNumber(idx + 1, lang)}.
              </span>
              <span
                lang={lang}
                style={{
                  fontWeight: isHighlighted ? 700 : 500,
                  color: isHighlighted ? 'var(--color-ink)' : 'inherit',
                }}
              >
                {getStopDisplayName(stop, lang)}
              </span>
            </div>
            <span className="caption" lang="en">
              {stop.stop_id}
            </span>
          </li>
        );
      })}
    </ol>
  );
};
