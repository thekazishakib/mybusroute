import { describe, it, expect } from 'vitest';
import { getStopByName } from '../src/data/load';
import { searchPlaces, searchJourneys } from '../src/data/search';

describe('Journey search & place search rules', () => {
  it('Gabtoli -> Shahbag returns exactly 16 direct buses in v0.2 database', () => {
    const gabtoli = getStopByName('Gabtoli');
    const shahbag = getStopByName('Shahbag');
    expect(gabtoli).toBeDefined();
    expect(shahbag).toBeDefined();

    const res = searchJourneys(gabtoli!.stop_id, shahbag!.stop_id);
    expect(res.activeTransferLevel).toBe(0);
    expect(res.directRouteIds.length).toBe(16);
    expect(res.directRouteIds).toContain('super');
    expect(res.directRouteIds).toContain('d_one_transport');
    expect(res.directRouteIds).toContain('al_madina_plus_one');
    expect(res.directRouteIds).toContain('brtc_route_1');
    expect(res.directRouteIds).toContain('lal_sabuj');
    expect(res.directRouteIds).toContain('one_transport');
    expect(res.directRouteIds).toContain('swajan_paribahan');
    expect(res.directRouteIds).toContain('welcome');

    // Also verify all 16 buses are present across the grouped direct options
    const routesInOptions = res.options
      .flatMap((o) => o.legs[0].routes.map((r) => r.id))
      .sort();
    expect(routesInOptions.length).toBe(16);
  });

  it('Gabtoli -> Adamijee College: no direct bus; options include a change at Farmgate (or Bijoy Sarani/Jahangir Gate/Bangla Motor/Shahbag) then bus 4 No. Alike (B171)', () => {
    const gabtoli = getStopByName('Gabtoli')!;
    const adamijee = getStopByName('Adamijee College')!;

    const res = searchJourneys(gabtoli.stop_id, adamijee.stop_id);
    expect(res.directRouteIds).toEqual([]);
    expect(res.activeTransferLevel).toBe(1);
    expect(res.options.length).toBeGreaterThan(0);
    expect(res.options.length).toBeLessThanOrEqual(10);

    const allowedChangeStops = new Set([
      'Farmgate',
      'Bijoy Sarani',
      'Jahangir Gate',
      'Bangla Motor',
      'Shahbag',
    ]);

    const matchingOptions = res.options.filter(
      (opt) =>
        opt.transferStops.length === 1 &&
        allowedChangeStops.has(opt.transferStops[0].name_en) &&
        opt.legs[1].routes.some(
          (r) =>
            r.id === '4_no_alike' ||
            r.route_id === '4_no_alike' ||
            r.cross_ref?.zip_route_id === 'B171'
        )
    );
    expect(matchingOptions.length).toBeGreaterThan(0);
  });

  it('Gabtoli -> Adamjee School: no direct; options include a change at Kalshi, ECB Square, Jahangir Gate or Farmgate then bus Trust Transport Services Route 3 (B163)', () => {
    const gabtoli = getStopByName('Gabtoli')!;
    const adamjeeSchool = getStopByName('Adamjee School')!;

    const res = searchJourneys(gabtoli.stop_id, adamjeeSchool.stop_id);
    expect(res.directRouteIds).toEqual([]);
    expect(res.activeTransferLevel).toBe(1);
    expect(res.options.length).toBeGreaterThan(0);

    const allowedChangeStops = new Set([
      'Kalshi',
      'ECB Square',
      'Jahangir Gate',
      'Farmgate',
    ]);
    const matchingOptions = res.options.filter(
      (opt) =>
        opt.transferStops.length === 1 &&
        allowedChangeStops.has(opt.transferStops[0].name_en) &&
        opt.legs[1].routes.some(
          (r) =>
            r.id === 'trust_transport_services_route_3' ||
            r.route_id === 'trust_transport_services_route_3' ||
            r.cross_ref?.zip_route_id === 'B163'
        )
    );
    expect(matchingOptions.length).toBeGreaterThan(0);
  });

  it('no option goes through Mirpur 14 to reach Adamijee College (no data support)', () => {
    const gabtoli = getStopByName('Gabtoli')!;
    const adamijee = getStopByName('Adamijee College')!;
    const mirpur14 = getStopByName('Mirpur 14')!;

    const res = searchJourneys(gabtoli.stop_id, adamijee.stop_id);
    for (const opt of res.options) {
      const allStopIdsInOption = opt.legs.flatMap((l) =>
        l.stops.map((s) => s.stop_id)
      );
      expect(allStopIdsInOption).not.toContain(mirpur14.stop_id);
    }
  });

  it('"Dhaka University" shows the landmark suggestion, not a stop', () => {
    const suggestions = searchPlaces('Dhaka University');
    expect(suggestions.length).toBeGreaterThan(0);
    const first = suggestions[0];
    expect(first.kind).toBe('landmark');
    expect(first.label_en).toBe('Dhaka University');
    expect(first.landmark?.status).toBe('suggestion, not from source data');
    expect(first.landmarkStops?.map((s) => s.name_en)).toEqual([
      'Shahbag',
      'Nilkhet',
      'Azimpur',
      'High Court',
    ]);
    // Verify Dhaka University does not exist as a stop
    expect(getStopByName('Dhaka University')).toBeUndefined();
  });

  it('searching "Adamjee" shows both Adamjee School and Adamijee College', () => {
    const suggestions = searchPlaces('Adamjee');
    const stopLabels = suggestions
      .filter((s) => s.kind === 'stop')
      .map((s) => s.label_en);
    expect(stopLabels).toContain('Adamjee School');
    expect(stopLabels).toContain('Adamijee College');
  });

  it('searching "Mirpur" includes the Mirpur area group as well as individual Mirpur stops', () => {
    const suggestions = searchPlaces('Mirpur');
    const groupHit = suggestions.find(
      (s) => s.kind === 'group' && s.label_en === 'Mirpur'
    );
    expect(groupHit).toBeDefined();
    expect(groupHit?.groupStops?.length).toBeGreaterThanOrEqual(7);
  });
});
