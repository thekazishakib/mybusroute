import database from '../../data/dhaka_bus_database_v2.json';
import { STOP_NAMES_BN } from './stopNamesBn';
import type {
  Stop,
  Route,
  RouteStop,
  Fare,
  StopGroup,
  Landmark,
} from './types';

// Load raw data from dhaka_bus_database_v2.json
const rawStops = database.stops as any[];
const rawBuses = database.buses as any[];
const rawLandmarks = database.landmarks as any[];
const rawGroups = (database.stop_groups || []) as any[];
const rawDisagreements = (database.review_queue?.bus_stop_disagreements || []) as string[];

export const disagreementSet = new Set<string>(rawDisagreements);

// Collect bus ids per stop
const busIdsPerStop = new Map<string, Set<string>>();
for (const b of rawBuses) {
  for (const sId of b.stops) {
    const set = busIdsPerStop.get(sId) ?? new Set<string>();
    set.add(b.id);
    if (b.cross_ref?.zip_route_id) {
      set.add(b.cross_ref.zip_route_id);
    }
    busIdsPerStop.set(sId, set);
  }
}

// Normalized stops
export const stops: Stop[] = rawStops.map((s) => {
  const bSet = busIdsPerStop.get(s.id) ?? new Set<string>();
  return {
    id: s.id,
    stop_id: s.id,
    name_en: s.name_en,
    name_bn: s.name_bn || STOP_NAMES_BN[s.id] || null,
    aliases: s.aliases || [],
    lat: s.lat,
    lng: s.lng,
    coord_confidence: s.coord_confidence || 'M',
    bus_count: s.bus_count || bSet.size,
    bus_ids: Array.from(bSet),
    zip_stop_ids: s.zip_stop_ids || [],
    ocr_note: s.ocr_note,
    check: s.ocr_note || null,
  };
});

// Normalized routes/buses
export const routes: Route[] = rawBuses.map((b) => {
  return {
    id: b.id,
    route_id: b.id,
    name_en: b.name_en,
    name_bn: b.id === 'achim_paribahan' ? 'অসীম পরিবহন' : (b.name_bn || null),
    route_no: b.route_no || null,
    type: b.type || 'Semi-Seating',
    first_bus: b.first_bus || null,
    last_bus: b.last_bus || null,
    time_raw: b.time_raw || null,
    stops: b.stops || [],
    stop_count: b.stops ? b.stops.length : 0,
    notes: b.notes || [],
    cross_ref: b.cross_ref || null,
    service_type: b.cross_ref?.service_type_site || b.type || null,
    page_gaps: b.cross_ref?.ocr_page_gaps || 0,
    direction: 'both (⇄)',
    check: b.cross_ref?.ocr_note || null,
  };
});

export const buses = routes;

// Normalized landmarks
export const landmarks: Landmark[] = rawLandmarks.map((lm, idx) => ({
  landmark_id: `LM_${idx + 1}`,
  name_en: lm.query_names[0],
  query_names: lm.query_names || [],
  nearest_stop_ids: lm.nearest_stop_ids || [],
  stop_ids: lm.nearest_stop_ids || [],
  source: 'dhaka_bus_database_v2',
  status: 'suggestion, not from source data',
  note: lm.note || 'Suggestion, not source data (পরামর্শ, উৎস ডেটা নয়).',
}));

// Normalized stop groups
export const stopGroups: StopGroup[] = rawGroups.map((grp) => ({
  id: grp.id,
  group_id: grp.id,
  name_en: grp.name_en,
  stop_ids: grp.stop_ids || [],
  source: 'dhaka_bus_database_v2',
  status: 'curated',
}));

// Normalized stop aliases
export const stopAliases = stops.flatMap((s) =>
  (s.aliases || []).map((alias) => ({
    alias,
    stop_id: s.id,
    source: 'dhaka_bus_database_v2',
    status: 'curated',
  }))
);

// Generate routeStops for sequence compatibility
export const routeStops: RouteStop[] = [];
for (const b of routes) {
  for (let i = 0; i < b.stops.length; i++) {
    routeStops.push({
      route_id: b.id,
      stop_id: b.stops[i],
      sequence: i + 1,
      check: null,
    });
  }
}

// Empty explicit fare table - fares in v0.2 are computed dynamically from formula
export const fares: Fare[] = [];

// Index maps
export const stopById = new Map<string, Stop>();
export const stopByNameEn = new Map<string, Stop>();

for (const stop of stops) {
  stopById.set(stop.id, stop);
  stopById.set(stop.id.toLowerCase(), stop);
  stopByNameEn.set(stop.name_en.toLowerCase(), stop);
  if (stop.zip_stop_ids) {
    for (const zid of stop.zip_stop_ids) {
      stopById.set(zid, stop);
      stopById.set(zid.toLowerCase(), stop);
    }
  }
}

export const routeById = new Map<string, Route>();
export const routesByStopId = new Map<string, Set<string>>();

for (const route of routes) {
  routeById.set(route.id, route);
  routeById.set(route.id.toLowerCase(), route);
  if (route.cross_ref?.zip_route_id) {
    routeById.set(route.cross_ref.zip_route_id, route);
    routeById.set(route.cross_ref.zip_route_id.toLowerCase(), route);
  }

  for (const sId of route.stops) {
    const rSet = routesByStopId.get(sId) ?? new Set<string>();
    rSet.add(route.id);
    if (route.cross_ref?.zip_route_id) {
      rSet.add(route.cross_ref.zip_route_id);
    }
    routesByStopId.set(sId, rSet);
  }
}

export const routeStopsByRouteId = new Map<string, RouteStop[]>();
for (const rs of routeStops) {
  const list = routeStopsByRouteId.get(rs.route_id) ?? [];
  list.push(rs);
  routeStopsByRouteId.set(rs.route_id, list);
}

export function getStopById(stopId: string): Stop | undefined {
  if (!stopId) return undefined;
  return stopById.get(stopId) ?? stopById.get(stopId.toLowerCase());
}

export function getStopByName(nameEn: string): Stop | undefined {
  if (!nameEn) return undefined;
  return stopByNameEn.get(nameEn.trim().toLowerCase());
}

export function getRouteById(routeId: string): Route | undefined {
  if (!routeId) return undefined;
  return routeById.get(routeId) ?? routeById.get(routeId.toLowerCase());
}

export function getRouteDisplayName(route: Route, lang: 'bn' | 'en'): string {
  if (lang === 'bn' && route.name_bn && route.name_bn.trim().length > 0) {
    return route.name_bn;
  }
  return route.name_en;
}

export function getStopDisplayName(stop: Stop | null | undefined, lang: 'bn' | 'en'): string {
  if (!stop) return '';
  if (stop.id === 'shahbag') {
    return lang === 'bn' ? 'শাহবাগ (ঢাকা বিশ্ববিদ্যালয়)' : 'Shahbag (Dhaka University)';
  }
  if (lang === 'bn' && stop.name_bn && stop.name_bn.trim().length > 0) {
    return stop.name_bn;
  }
  return stop.name_en;
}

export function isRouteIncomplete(_route: Route): boolean {
  // All route data is treated as complete
  return false;
}

export function isStopIncomplete(_stop: Stop): boolean {
  // All stop data is treated as complete
  return false;
}

export function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function getBusOperatingHours(
  route: Route,
  lang: 'bn' | 'en'
): { hoursStr: string; isUnknown: boolean } {
  if (!route.first_bus || !route.last_bus) {
    return {
      hoursStr: lang === 'bn' ? 'সময়সূচি অজানা' : 'hours unknown',
      isUnknown: true,
    };
  }
  return {
    hoursStr: route.time_raw || `${route.first_bus} – ${route.last_bus}`,
    isUnknown: false,
  };
}

export function isBusRunningAtTime(route: Route, timeStr?: string): boolean {
  if (!route.first_bus || !route.last_bus) {
    // If operating hours are not documented, treat as active
    return true;
  }
  let nowMinutes: number;
  if (timeStr) {
    const [h, m] = timeStr.split(':').map(Number);
    nowMinutes = h * 60 + m;
  } else {
    const now = new Date();
    nowMinutes = now.getHours() * 60 + now.getMinutes();
  }

  const [fH, fM] = route.first_bus.split(':').map(Number);
  const [lH, lM] = route.last_bus.split(':').map(Number);
  const firstMinutes = fH * 60 + fM;
  let lastMinutes = lH * 60 + lM;
  if (lastMinutes < firstMinutes) {
    lastMinutes += 24 * 60; // Crosses midnight (e.g. 06:00 to 00:00)
    if (nowMinutes < firstMinutes) {
      nowMinutes += 24 * 60;
    }
  }

  return nowMinutes >= firstMinutes && nowMinutes <= lastMinutes;
}
