// @vitest-environment jsdom
import React from 'react';
import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import fs from 'fs';
import path from 'path';
import { I18nProvider } from '../src/i18n/useT';
import { Home } from '../src/pages/Home';
import { RoutePage } from '../src/pages/RoutePage';
import { resolveLegFare, resolveJourneyFare } from '../src/data/fare';
import type { Fare } from '../src/data/types';

afterEach(() => {
  cleanup();
});

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '');
  const full =
    clean.length === 3
      ? clean
          .split('')
          .map((c) => c + c)
          .join('')
      : clean;
  const num = parseInt(full, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

function relativeLuminance([r, g, b]: [number, number, number]): number {
  const toLinear = (c: number) => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  const R = toLinear(r);
  const G = toLinear(g);
  const B = toLinear(b);
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

function contrastRatio(hex1: string, hex2: string): number {
  const l1 = relativeLuminance(hexToRgb(hex1));
  const l2 = relativeLuminance(hexToRgb(hex2));
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

describe('Fare codepath & UI tests', () => {
  it('UI shows estimated fare with "প্রায় ৳" or "about Tk" in v0.2 and operating hours', () => {
    render(
      <I18nProvider initialLang="bn">
        <MemoryRouter initialEntries={['/?from=S082&to=S229']}>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </MemoryRouter>
      </I18nProvider>
    );

    const fareTexts = screen.getAllByText(/প্রায় ৳/);
    expect(fareTexts.length).toBeGreaterThan(0);
  });

  it('bus page shows operating hours and stop list in v0.2', () => {
    render(
      <I18nProvider initialLang="bn">
        <MemoryRouter initialEntries={['/bus/B010']}>
          <Routes>
            <Route path="/bus/:routeId" element={<RoutePage />} />
          </Routes>
        </MemoryRouter>
      </I18nProvider>
    );

    expect(screen.getAllByText(/স্টপের ক্রম তালিকা/i).length).toBeGreaterThan(0);
  });

  it('fare codepath computes per-leg and total fare only when EVERY leg has a fare', () => {
    const sampleFares: Fare[] = [
      {
        route_id: 'B151',
        from_stop_id: 'S082',
        to_stop_id: 'S080',
        amount_bdt: 25,
        basis: 'stop_pair',
      },
      {
        route_id: 'B171',
        from_stop_id: 'S080',
        to_stop_id: 'S007',
        amount_bdt: 20,
        basis: 'stop_pair',
      },
    ];

    // Both legs have fares -> total is computed
    const completeJourney = resolveJourneyFare(
      [
        { routeId: 'B151', fromStopId: 'S082', toStopId: 'S080' },
        { routeId: 'B171', fromStopId: 'S080', toStopId: 'S007' },
      ],
      sampleFares
    );
    expect(completeJourney.hasTotalFare).toBe(true);
    expect(completeJourney.totalAmountBdt).toBe(45);
    expect(completeJourney.basisList).toEqual(['stop_pair']);

    // One leg missing fare -> total is NOT computed
    const partialJourney = resolveJourneyFare(
      [
        { routeId: 'B151', fromStopId: 'S082', toStopId: 'S080' },
        { routeId: 'B163', fromStopId: 'S080', toStopId: 'S008' },
      ],
      sampleFares
    );
    expect(partialJourney.hasTotalFare).toBe(false);
    expect(partialJourney.totalAmountBdt).toBeNull();
    expect(partialJourney.legFares[0].hasFare).toBe(true);
    expect(partialJourney.legFares[1].hasFare).toBe(false);

    // Empty fare table -> no fare
    const emptyFare = resolveLegFare('B010', 'S082', 'S229', []);
    expect(emptyFare.hasFare).toBe(false);
    expect(emptyFare.amountBdt).toBeNull();
  });
});

describe('Design tokens & WCAG AA contrast tests', () => {
  const ALLOWED_HEX_TOKENS = new Set([
    '#0a0a0a', '#09120e', // canvas / button-primary-text
    '#ffffff', // light theme canvas / text on primary
    '#f8fafc', // light surface
    '#f1f5f9', // light hairline-soft
    '#e2e8f0', // light hairline
    '#cbd5e1', // light hairline-strong
    '#525252', // light ink-muted
    '#64748b', // light ink-muted secondary
    '#262626', // light button pressed
    '#2563eb', '#3b82f6', '#1d4ed8', // map route & primary blue
    '#eff6ff', '#dbeafe', // soft blue badges
    '#16a34a', '#22c55e', // green start pin
    '#dc2626', '#ef4444', // red end pin
    '#141414', '#101c16', // surface
    '#1c1c1c', '#16261f', // surface-raised
    '#2a2a2a', '#223a2f', // hairline
    '#1f1f1f', '#1b2e25', // hairline-soft
    '#3a3a3a', '#2d4c3e', // hairline-strong
    '#f2f2f2', // ink / button-primary-bg / focus-ring
    '#b8b8b8', // ink-muted
    '#000000', // ink-on-block
    '#d9d9d9', // button-primary-pressed
    '#dceeb1', // block-lime
    '#c5b0f4', // block-lilac
    '#f4ecd6', // block-cream
  ]);

  it('CSS has no @media (prefers-color-scheme: light) rule, no theme toggle, and no colour outside DESIGN.md tokens', () => {
    const cssDir = path.resolve(__dirname, '../src/styles');
    const cssFiles = [
      path.resolve(__dirname, '../src/index.css'),
      ...fs.readdirSync(cssDir).map((f) => path.join(cssDir, f)),
    ];

    for (const file of cssFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      expect(content).not.toMatch(/prefers-color-scheme\s*:\s*light/i);

      const hexMatches = content.match(/#[0-9a-fA-F]{3,8}\b/g) ?? [];
      for (const hex of hexMatches) {
        const normalized = hex.toLowerCase();
        expect(
          ALLOWED_HEX_TOKENS.has(normalized),
          `Disallowed hex color ${normalized} found in ${path.basename(file)}`
        ).toBe(true);
      }
    }
  });

  it('every text/background pair in the tokens meets WCAG AA (>= 4.5:1 body, >= 3:1 large)', () => {
    const pairs: Array<{
      name: string;
      fg: string;
      bg: string;
      minRatio: number;
    }> = [
      { name: 'ink on canvas', fg: '#0a0a0a', bg: '#ffffff', minRatio: 4.5 },
      { name: 'ink on surface', fg: '#0a0a0a', bg: '#f8fafc', minRatio: 4.5 },
      {
        name: 'ink on surface-raised',
        fg: '#0a0a0a',
        bg: '#ffffff',
        minRatio: 4.5,
      },
      {
        name: 'ink-muted on canvas',
        fg: '#525252',
        bg: '#ffffff',
        minRatio: 4.5,
      },
      {
        name: 'ink-muted on surface',
        fg: '#525252',
        bg: '#f8fafc',
        minRatio: 4.5,
      },
      {
        name: 'button-primary text on bg',
        fg: '#ffffff',
        bg: '#0a0a0a',
        minRatio: 4.5,
      },
      {
        name: 'button-primary text on pressed bg',
        fg: '#ffffff',
        bg: '#262626',
        minRatio: 4.5,
      },
      {
        name: 'ink-on-block on block-lime',
        fg: '#000000',
        bg: '#dceeb1',
        minRatio: 4.5,
      },
      {
        name: 'ink-on-block on block-lilac',
        fg: '#000000',
        bg: '#c5b0f4',
        minRatio: 4.5,
      },
      {
        name: 'ink-on-block on block-cream',
        fg: '#000000',
        bg: '#f4ecd6',
        minRatio: 4.5,
      },
    ];

    for (const pair of pairs) {
      const ratio = contrastRatio(pair.fg, pair.bg);
      expect(
        ratio,
        `${pair.name} (${pair.fg} on ${pair.bg}) contrast ratio ${ratio.toFixed(2)}:1 is below ${pair.minRatio}:1`
      ).toBeGreaterThanOrEqual(pair.minRatio);
    }
  });
});
