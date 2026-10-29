import React from 'react';
import { Link } from 'react-router-dom';
import { useT, formatNumber } from '../i18n/useT';
import { getStopDisplayName, isStopIncomplete } from '../data/load';
import type { Stop } from '../data/types';

interface StopListProps {
  stops: Stop[];
  highlightStopIds?: Set<string>;
}

export const StopList: React.FC<StopListProps> = ({
  stops,
  highlightStopIds,
}) => {
  const { lang, t } = useT();

  return (
    <ol className="stop-list">
      {stops.map((stop, idx) => {
        const isHighlighted = highlightStopIds?.has(stop.stop_id);
        const incomplete = isStopIncomplete(stop);
        return (
          <li key={`${stop.stop_id}-${idx}`} className="stop-row">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <span className="stop-seq" lang={lang}>
                {formatNumber(idx + 1, lang)}.
              </span>
              <Link
                to={`/stop/${stop.stop_id}`}
                lang={lang}
                style={{
                  fontWeight: isHighlighted ? 700 : 400,
                  textDecoration: 'underline',
                  textUnderlineOffset: '4px',
                }}
              >
                {getStopDisplayName(stop, lang)}
              </Link>
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
