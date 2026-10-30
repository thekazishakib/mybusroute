import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import {
  stops,
  routes,
  routeStops,
  fares,
  stopAliases,
  stopGroups,
  landmarks,
  stopById,
  routeById,
  isRouteIncomplete,
} from '../src/data/load';

function collectFiles(dir: string, exts: string[]): string[] {
  const results: string[] = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...collectFiles(full, exts));
    } else if (exts.some((ext) => entry.name.endsWith(ext))) {
      results.push(full);
    }
  }
  return results;
}

describe('Data integrity & hard rules', () => {
  it('loads 184 routes, 260 stops, 13 stop groups, and 6 landmarks', () => {
    expect(routes.length).toBe(184);
    expect(stops.length).toBe(260);
    expect(landmarks.length).toBe(6);
    expect(stopGroups.length).toBe(13);
    expect(routeStops.length).toBeGreaterThan(0);
  });

  it('every stop_id in route_stops exists in stops', () => {
    for (const rs of routeStops) {
      expect(stopById.has(rs.stop_id)).toBe(true);
      expect(routeById.has(rs.route_id)).toBe(true);
    }
  });

  it('every stop has English name present', () => {
    for (const st of stops) {
      expect(typeof st.name_en).toBe('string');
      expect(st.name_en.length).toBeGreaterThan(0);
    }
  });

  it('preserves numbered same-name buses (Alif, BRTC)', () => {
    const ocrNames = new Set(
      routes.map((r) => r.cross_ref?.site_name_en).filter(Boolean)
    );
    for (let i = 1; i <= 4; i++) {
      expect(ocrNames.has(`Alif Bus ${i}`)).toBe(true);
    }
    for (let i = 1; i <= 9; i++) {
      expect(ocrNames.has(`BRTC Bus ${i}`)).toBe(true);
    }
  });

  it('has routes with page_gaps > 0 flagged as incomplete', () => {
    const gapRoutes = routes.filter((r) => (r.cross_ref?.ocr_page_gaps || 0) > 0);
    expect(gapRoutes.length).toBeGreaterThan(0);
    for (const r of gapRoutes) {
      expect(isRouteIncomplete(r)).toBe(true);
    }
  });

  it('curated tables have source and status on every entry and do not merge Adamjee School and Adamijee College', () => {
    for (const alias of stopAliases) {
      expect(alias.source).toBeTruthy();
      expect(alias.status).toBeTruthy();
      expect(stopById.has(alias.stop_id)).toBe(true);
    }
    for (const grp of stopGroups) {
      expect(grp.source).toBeTruthy();
      expect(grp.status).toBeTruthy();
      for (const sId of grp.stop_ids) {
        expect(stopById.has(sId)).toBe(true);
      }
    }
    for (const lm of landmarks) {
      expect(lm.source).toBeTruthy();
      expect(lm.status).toBe('suggestion, not from source data');
      for (const sId of lm.stop_ids ?? lm.nearest_stop_ids ?? []) {
        expect(stopById.has(sId)).toBe(true);
      }
    }

    const adamjeeSchool = stops.find((s) => s.name_en === 'Adamjee School');
    const adamijeeCollege = stops.find((s) => s.name_en === 'Adamijee College');
    expect(adamjeeSchool).toBeDefined();
    expect(adamijeeCollege).toBeDefined();
    expect(adamjeeSchool?.stop_id).not.toBe(adamijeeCollege?.stop_id);
  });

  it('grep test: fails if UI strings or src code contain travel-time words (minute, মিনিট, ETA, duration)', () => {
    const srcFiles = collectFiles(path.resolve(__dirname, '../src'), [
      '.ts',
      '.tsx',
      '.json',
      '.css',
    ]);
    expect(srcFiles.length).toBeGreaterThan(0);

    const forbiddenPattern = /\b(minute|minutes|ETA|duration)\b|মিনিট/i;

    for (const file of srcFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      const match = content.match(forbiddenPattern);
      expect(
        match,
        `Forbidden travel-time word found in ${path.basename(file)}: ${match?.[0]}`
      ).toBeNull();
    }
  });

  it('no route has duplicate stops and Alif / BRTC routes are accurate', () => {
    for (const route of routes) {
      const seen = new Set<string>();
      for (const sId of route.stops) {
        expect(
          seen.has(sId),
          `Duplicate stop ${sId} found in route ${route.id}`
        ).toBe(false);
        seen.add(sId);
      }
    }

    const alif2 = routeById.get('alif_route_2');
    expect(alif2).toBeDefined();
    expect(alif2!.stops[0]).toBe('shia_masjid');
    expect(alif2!.stops[alif2!.stops.length - 1]).toBe('banasree');

    const alif1 = routeById.get('alif_route_1');
    expect(alif1).toBeDefined();
    expect(alif1!.stops[0]).toBe('mirpur_14');
    expect(alif1!.stops[alif1!.stops.length - 1]).toBe('nandan_park');

    const brtcExp = routeById.get('brtc_elevated_expressway');
    expect(brtcExp).toBeDefined();
    expect(brtcExp!.stops[0]).toBe('rajlakshmi');
    expect(brtcExp!.stops[brtcExp!.stops.length - 1]).toBe('bijoy_sarani');
    expect(brtcExp!.stops.length).toBe(8);

    // Ensure no direct bus links Shia Masjid and Rajlakshmi
    const directShiaToRajlakshmi = routes.filter(
      (r) => r.stops.includes('shia_masjid') && r.stops.includes('rajlakshmi')
    );
    expect(directShiaToRajlakshmi.length).toBe(0);
  });
});
