import Fuse from 'fuse.js';
import {
  stops,
  routes,
  stopGroups,
  landmarks,
  getStopById,
  getStopByName,
  getRouteById,
  routesByStopId,
  isRouteIncomplete,
  isStopIncomplete,
  getBusOperatingHours,
  isBusRunningAtTime,
} from './load';
import { resolveLegFare, computeRouteSegmentFare } from './fare';
import type {
  Stop,
  Route,
  SearchSuggestion,
  JourneyLeg,
  JourneyOption,
  JourneySearchResult,
  Fare,
} from './types';

interface SearchableDocument {
  id: string;
  kind: 'stop' | 'group' | 'landmark' | 'adamjee_choice';
  primaryText: string;
  secondaryTexts: string[];
  stop?: Stop;
  group?: (typeof stopGroups)[number];
  landmark?: (typeof landmarks)[number];
  adamjeeStops?: Stop[];
}

const searchableDocs: SearchableDocument[] = [
  // Adamjee special query entry
  {
    id: 'adamjee_choice',
    kind: 'adamjee_choice' as const,
    primaryText: 'Adamjee',
    secondaryTexts: ['Adamijee', 'আদমজী', 'আদমজী স্কুল', 'আদমজী কলেজ', 'Adamjee School / College'],
    adamjeeStops: [
      getStopById('adamjee_school')!,
      getStopById('adamijee_college')!,
    ].filter(Boolean),
  },
  // Landmarks
  ...landmarks.map((lm) => ({
    id: `landmark:${lm.landmark_id}`,
    kind: 'landmark' as const,
    primaryText: lm.name_en,
    secondaryTexts: lm.query_names,
    landmark: lm,
  })),
  // Stop groups
  ...stopGroups.map((grp) => ({
    id: `group:${grp.id}`,
    kind: 'group' as const,
    primaryText: grp.name_en,
    secondaryTexts: [grp.id],
    group: grp,
  })),
  // Stops (including all aliases)
  ...stops.map((st) => ({
    id: `stop:${st.id}`,
    kind: 'stop' as const,
    primaryText: st.name_en,
    secondaryTexts: [...st.aliases, ...(st.name_bn ? [st.name_bn] : [])],
    stop: st,
  })),
];

const fuse = new Fuse(searchableDocs, {
  keys: [
    { name: 'primaryText', weight: 2.5 },
    { name: 'secondaryTexts', weight: 2 },
  ],
  threshold: 0.35,
  includeScore: true,
  ignoreLocation: true,
});

function toSuggestion(
  doc: SearchableDocument,
  query: string
): SearchSuggestion {
  const qLower = query.trim().toLowerCase();

  if (doc.kind === 'adamjee_choice') {
    const adamjeeStops = [
      getStopById('adamjee_school')!,
      getStopById('adamijee_college')!,
    ].filter(Boolean);
    return {
      kind: 'adamjee_choice',
      id: 'adamjee_choice',
      label_en: 'Adamjee (2 locations: School or College)',
      label_bn: 'আদমজী (২টি ভিন্ন স্থান: স্কুল বা কলেজ)',
      adamjeeStops,
    };
  }

  if (doc.kind === 'landmark' && doc.landmark) {
    const landmarkStops = doc.landmark.nearest_stop_ids
      .map((id) => getStopById(id))
      .filter((s): s is Stop => Boolean(s));
    return {
      kind: 'landmark',
      id: doc.landmark.landmark_id,
      label_en: doc.landmark.name_en,
      landmark: doc.landmark,
      landmarkStops,
      isSuggestionOnly: true,
    };
  }

  if (doc.kind === 'group' && doc.group) {
    const groupStops = doc.group.stop_ids
      .map((id) => getStopById(id))
      .filter((s): s is Stop => Boolean(s));
    return {
      kind: 'group',
      id: doc.group.id,
      label_en: doc.group.name_en,
      group: doc.group,
      groupStops,
    };
  }

  const st = doc.stop!;
  const matchedVariant = doc.secondaryTexts.find((v) =>
    v.toLowerCase().includes(qLower)
  );
  const exactCanonicalMatch = st.name_en.toLowerCase().includes(qLower);

  return {
    kind: 'stop',
    id: st.id,
    label_en: st.name_en,
    label_bn: st.name_bn || undefined,
    matchedAlias:
      !exactCanonicalMatch && matchedVariant ? matchedVariant : undefined,
    stop: st,
  };
}

/**
 * SECURE: Sanitize input query to prevent XSS, script injection, and ReDoS attacks.
 * Preserves standard alphanumeric, Bengali characters, spaces, and punctuation.
 */
export function sanitizeSearchQuery(input: string): string {
  if (typeof input !== 'string') return '';
  return input
    .slice(0, 100)
    .replace(/[<>'"`;\\]/g, '')
    .trim();
}

/**
 * Searches stops, spelling aliases, area groups, and landmarks using Fuse.js.
 * Resolves landmarks to nearest stops, and handles ambiguous queries like Adamjee.
 */
export function searchPlaces(query: string, limit = 12): SearchSuggestion[] {
  const trimmed = sanitizeSearchQuery(query);
  if (!trimmed) {
    return [];
  }

  const qLower = trimmed.toLowerCase();

  // Special handling for Adamjee
  if (qLower.includes('adamjee') || qLower.includes('adamijee') || qLower.includes('আদমজী')) {
    const adamjeeSchool = getStopById('adamjee_school');
    const adamijeeCollege = getStopById('adamijee_college');
    const suggestions: SearchSuggestion[] = [];

    suggestions.push({
      kind: 'adamjee_choice',
      id: 'adamjee_choice',
      label_en: 'Adamjee (2 locations: School or College)',
      label_bn: 'আদমজী (২টি স্থান: স্কুল বা কলেজ)',
      adamjeeStops: [adamjeeSchool!, adamijeeCollege!].filter(Boolean),
    });

    if (adamjeeSchool) {
      suggestions.push({
        kind: 'stop',
        id: adamjeeSchool.id,
        label_en: adamjeeSchool.name_en,
        stop: adamjeeSchool,
      });
    }
    if (adamijeeCollege) {
      suggestions.push({
        kind: 'stop',
        id: adamijeeCollege.id,
        label_en: adamijeeCollege.name_en,
        stop: adamijeeCollege,
      });
    }
    return suggestions;
  }

  // Exact match checks on stop name_en or aliases
  const exactStops: SearchSuggestion[] = [];
  for (const st of stops) {
    if (st.name_en.toLowerCase() === qLower) {
      exactStops.push({
        kind: 'stop',
        id: st.id,
        label_en: st.name_en,
        stop: st,
      });
      break;
    }
    const matchedAlias = st.aliases.find((a) => a.toLowerCase() === qLower);
    if (matchedAlias) {
      exactStops.push({
        kind: 'stop',
        id: st.id,
        label_en: st.name_en,
        matchedAlias,
        stop: st,
      });
      break;
    }
  }

  const fuseResults = fuse.search(trimmed, { limit: limit * 2 });

  // Prioritize exact/prefix matches on primaryText or secondaryTexts
  const sorted = [...fuseResults].sort((a, b) => {
    const aExact =
      a.item.primaryText.toLowerCase() === qLower ||
      a.item.secondaryTexts.some((t) => t.toLowerCase() === qLower);
    const bExact =
      b.item.primaryText.toLowerCase() === qLower ||
      b.item.secondaryTexts.some((t) => t.toLowerCase() === qLower);
    if (aExact !== bExact) return aExact ? -1 : 1;

    const aStarts = a.item.primaryText.toLowerCase().startsWith(qLower);
    const bStarts = b.item.primaryText.toLowerCase().startsWith(qLower);
    if (aStarts !== bStarts) return aStarts ? -1 : 1;

    return (a.score ?? 1) - (b.score ?? 1);
  });

  const fuseSuggestions = sorted.map((r) => toSuggestion(r.item, trimmed));
  const seenIds = new Set<string>();
  const combined: SearchSuggestion[] = [];

  for (const s of [...exactStops, ...fuseSuggestions]) {
    const key = `${s.kind}:${s.id}`;
    if (!seenIds.has(key)) {
      seenIds.add(key);
      combined.push(s);
    }
    if (combined.length >= limit) break;
  }

  return combined;
}

/**
 * Extracts ordered list of stop IDs along a route between fromStopId and toStopId (inclusive).
 * Buses run both ways (⇄).
 */
export function getLegStopSequence(
  routeId: string,
  fromStopId: string,
  toStopId: string
): { stopIds: string[] } | null {
  const fromStop = getStopById(fromStopId);
  const toStop = getStopById(toStopId);
  if (!fromStop || !toStop || fromStop.id === toStop.id) return null;

  const route = getRouteById(routeId);
  if (!route || !route.stops || route.stops.length === 0) return null;

  const fromIndices: number[] = [];
  const toIndices: number[] = [];

  for (let i = 0; i < route.stops.length; i++) {
    if (route.stops[i] === fromStop.id) fromIndices.push(i);
    if (route.stops[i] === toStop.id) toIndices.push(i);
  }

  if (fromIndices.length === 0 || toIndices.length === 0) return null;

  let bestSlice: string[] | null = null;
  for (const fi of fromIndices) {
    for (const ti of toIndices) {
      if (fi === ti) continue;
      const slice =
        fi < ti
          ? route.stops.slice(fi, ti + 1)
          : route.stops.slice(ti, fi + 1).reverse();
      if (!bestSlice || slice.length < bestSlice.length) {
        bestSlice = slice;
      }
    }
  }

  if (!bestSlice) return null;
  return { stopIds: bestSlice };
}

function buildLeg(
  routeList: Route[],
  stopIds: string[],
  fareTable?: Fare[]
): JourneyLeg {
  const legStops = stopIds
    .map((id) => getStopById(id))
    .filter((s): s is Stop => Boolean(s));
  const fromStop = legStops[0];
  const toStop = legStops[legStops.length - 1];

  const anyRouteIncomplete = routeList.some((r) => isRouteIncomplete(r));
  const anyStopIncomplete = legStops.some((s) => isStopIncomplete(s));

  const legFares: Record<string, ReturnType<typeof resolveLegFare>> = {};
  for (const r of routeList) {
    legFares[r.id] = resolveLegFare(r.id, fromStop.id, toStop.id, fareTable);
    if (r.cross_ref?.zip_route_id) {
      legFares[r.cross_ref.zip_route_id] = legFares[r.id];
    }
  }

  const primaryRoute = routeList[0];
  const { estKm, amountBdt } = computeRouteSegmentFare(
    primaryRoute.id,
    fromStop.id,
    toStop.id
  );

  const hoursInfo = getBusOperatingHours(primaryRoute, 'en');

  return {
    fromStop,
    toStop,
    stops: legStops,
    stopCount: legStops.length,
    stopsBetween: Math.max(0, legStops.length - 2),
    stopsRidden: Math.max(0, legStops.length - 1),
    routes: routeList,
    primaryRoute,
    hasIncompleteData: anyRouteIncomplete || anyStopIncomplete,
    legFares,
    estKm,
    estFareTk: amountBdt,
    hoursUnknown: hoursInfo.isUnknown,
    operatingHours: hoursInfo.hoursStr,
  };
}

export interface SearchOptions {
  viaStopId?: string;
  runningNowOnly?: boolean;
  targetTime?: string;
  fareTable?: Fare[];
}

/**
 * Finds all direct routes (0 transfers) between fromStopId and toStopId,
 * ranked by estimated fare and stoppage count.
 */
export function findDirectOptions(
  fromStopId: string,
  toStopId: string,
  options?: SearchOptions
): { options: JourneyOption[]; directRouteIds: string[] } {
  const fromStop = getStopById(fromStopId);
  const toStop = getStopById(toStopId);
  if (!fromStop || !toStop) {
    return { options: [], directRouteIds: [] };
  }

  const fromRoutes = routesByStopId.get(fromStop.id);
  const toRoutes = routesByStopId.get(toStop.id);
  if (!fromRoutes || !toRoutes) {
    return { options: [], directRouteIds: [] };
  }

  const sharedRouteIds = Array.from(fromRoutes).filter((rId) =>
    toRoutes.has(rId)
  );

  const directRouteIds: string[] = [];
  const groups = new Map<
    string,
    {
      stopIds: string[];
      routes: Route[];
    }
  >();

  const seenCanonicalBuses = new Set<string>();

  for (const routeId of sharedRouteIds) {
    const route = getRouteById(routeId);
    if (!route || seenCanonicalBuses.has(route.id)) continue;
    seenCanonicalBuses.add(route.id);

    // Filter out buses not currently running if runningNowOnly is set
    if (options?.runningNowOnly && !isBusRunningAtTime(route, options.targetTime)) {
      continue;
    }

    const seq = getLegStopSequence(route.id, fromStop.id, toStop.id);
    if (!seq) continue;

    directRouteIds.push(route.id);

    const key = seq.stopIds.join(',');
    const existing = groups.get(key);
    if (existing) {
      existing.routes.push(route);
    } else {
      groups.set(key, {
        stopIds: seq.stopIds,
        routes: [route],
      });
    }
  }

  const allOptions: JourneyOption[] = Array.from(groups.entries()).map(
    ([key, grp], idx) => {
      const leg = buildLeg(grp.routes, grp.stopIds, options?.fareTable);
      return {
        optionId: `direct-${idx}-${key}`,
        transferCount: 0,
        legs: [leg],
        transferStops: [],
        totalBuses: 1,
        totalStopsRidden: leg.stopsRidden,
        totalStopCount: leg.stopCount,
        hasAnyIncompleteData: leg.hasIncompleteData,
        totalKm: leg.estKm,
        totalFareTk: leg.estFareTk,
      };
    }
  );

  // Rank by estimated fare, then fewer stops
  allOptions.sort((a, b) => {
    if (a.totalFareTk !== b.totalFareTk) {
      return a.totalFareTk - b.totalFareTk;
    }
    return a.totalStopsRidden - b.totalStopsRidden;
  });

  return { options: allOptions, directRouteIds };
}

/**
 * Finds 1-transfer options between fromStopId and toStopId by identifying shared transfer stops.
 */
export function findOneTransferOptions(
  fromStopId: string,
  toStopId: string,
  directRouteIds: string[],
  options?: SearchOptions
): JourneyOption[] {
  const fromStop = getStopById(fromStopId);
  const toStop = getStopById(toStopId);
  if (!fromStop || !toStop) return [];

  const fromRoutesSet = routesByStopId.get(fromStop.id);
  const toRoutesSet = routesByStopId.get(toStop.id);
  if (!fromRoutesSet || !toRoutesSet) return [];

  const directSet = new Set(directRouteIds);
  const candidateTransfers = new Map<string, JourneyOption>();

  // Find candidate transfer stops
  for (const st of stops) {
    if (st.id === fromStop.id || st.id === toStop.id) continue;

    const stRoutes = routesByStopId.get(st.id);
    if (!stRoutes) continue;

    // Check if any bus goes from -> st and any bus goes st -> to
    const busesA: Route[] = [];
    for (const rId of stRoutes) {
      if (fromRoutesSet.has(rId) && !directSet.has(rId)) {
        const r = getRouteById(rId);
        if (r && !busesA.some((b) => b.id === r.id)) {
          if (!options?.runningNowOnly || isBusRunningAtTime(r, options.targetTime)) {
            busesA.push(r);
          }
        }
      }
    }
    if (busesA.length === 0) continue;

    const busesB: Route[] = [];
    for (const rId of stRoutes) {
      if (toRoutesSet.has(rId) && !directSet.has(rId)) {
        const r = getRouteById(rId);
        if (r && !busesB.some((b) => b.id === r.id)) {
          if (!options?.runningNowOnly || isBusRunningAtTime(r, options.targetTime)) {
            busesB.push(r);
          }
        }
      }
    }
    if (busesB.length === 0) continue;

    // Build leg 1 and leg 2 sequences
    const seqA = getLegStopSequence(busesA[0].id, fromStop.id, st.id);
    const seqB = getLegStopSequence(busesB[0].id, st.id, toStop.id);
    if (!seqA || !seqB) continue;

    const legA = buildLeg(busesA, seqA.stopIds, options?.fareTable);
    const legB = buildLeg(busesB, seqB.stopIds, options?.fareTable);

    // Each boarding leg incurs minimum fare calculation
    const totalKm = Math.round((legA.estKm + legB.estKm) * 10) / 10;
    const totalFareTk = legA.estFareTk + legB.estFareTk;

    const opt: JourneyOption = {
      optionId: `transfer-1-${st.id}`,
      transferCount: 1,
      legs: [legA, legB],
      transferStops: [st],
      totalBuses: 2,
      totalStopsRidden: legA.stopsRidden + legB.stopsRidden,
      totalStopCount: legA.stopCount + legB.stopCount - 1,
      hasAnyIncompleteData: legA.hasIncompleteData || legB.hasIncompleteData,
      totalKm,
      totalFareTk,
    };

    // Keep cheapest for this change stop
    const existing = candidateTransfers.get(st.id);
    if (!existing || opt.totalFareTk < existing.totalFareTk) {
      candidateTransfers.set(st.id, opt);
    }
  }

  const results = Array.from(candidateTransfers.values());
  results.sort((a, b) => {
    if (a.totalFareTk !== b.totalFareTk) {
      return a.totalFareTk - b.totalFareTk;
    }
    return a.totalStopsRidden - b.totalStopsRidden;
  });

  return results.slice(0, 10);
}

/**
 * Finds routes when a specific via/transfer stop is specified.
 */
export function findForcedChangeOptions(
  fromStopId: string,
  viaStopId: string,
  toStopId: string,
  options?: SearchOptions
): JourneyOption[] {
  const fromStop = getStopById(fromStopId);
  const viaStop = getStopById(viaStopId);
  const toStop = getStopById(toStopId);
  if (!fromStop || !viaStop || !toStop) return [];

  const leg1Direct = findDirectOptions(fromStop.id, viaStop.id, options);
  const leg2Direct = findDirectOptions(viaStop.id, toStop.id, options);

  if (leg1Direct.options.length === 0 || leg2Direct.options.length === 0) {
    return [];
  }

  const forcedOptions: JourneyOption[] = [];
  for (let i = 0; i < Math.min(3, leg1Direct.options.length); i++) {
    for (let j = 0; j < Math.min(3, leg2Direct.options.length); j++) {
      const leg1 = leg1Direct.options[i].legs[0];
      const leg2 = leg2Direct.options[j].legs[0];

      const totalKm = Math.round((leg1.estKm + leg2.estKm) * 10) / 10;
      const totalFareTk = leg1.estFareTk + leg2.estFareTk;

      forcedOptions.push({
        optionId: `forced-via-${viaStop.id}-${i}-${j}`,
        transferCount: 1,
        legs: [leg1, leg2],
        transferStops: [viaStop],
        totalBuses: 2,
        totalStopsRidden: leg1.stopsRidden + leg2.stopsRidden,
        totalStopCount: leg1.stopCount + leg2.stopCount - 1,
        hasAnyIncompleteData: leg1.hasIncompleteData || leg2.hasIncompleteData,
        totalKm,
        totalFareTk,
      });
    }
  }

  forcedOptions.sort((a, b) => a.totalFareTk - b.totalFareTk);
  return forcedOptions.slice(0, 5);
}

/**
 * Searches journeys from fromStopId to toStopId using the 11 rules of how_to_search.
 */
export function searchJourneys(
  fromStopId: string,
  toStopId: string,
  options?: SearchOptions
): JourneySearchResult {
  const fromStop = getStopById(fromStopId);
  const toStop = getStopById(toStopId);
  const viaStop = options?.viaStopId ? getStopById(options.viaStopId) : null;

  if (!fromStop || !toStop || fromStop.id === toStop.id) {
    return {
      fromStop: fromStop || null,
      toStop: toStop || null,
      viaStop: viaStop || null,
      activeTransferLevel: null,
      options: [],
      moreChangesOptions: [],
      hasMoreChangesAvailable: false,
      directRouteIds: [],
    };
  }

  // If a specific intermediate stop is requested, find routes via that stop
  if (viaStop && viaStop.id !== fromStop.id && viaStop.id !== toStop.id) {
    const forcedOptions = findForcedChangeOptions(fromStop.id, viaStop.id, toStop.id, options);
    return {
      fromStop,
      toStop,
      viaStop,
      activeTransferLevel: 1,
      options: forcedOptions,
      moreChangesOptions: [],
      hasMoreChangesAvailable: false,
      directRouteIds: [],
    };
  }

  // Find direct routes
  const { options: directOpts, directRouteIds } = findDirectOptions(
    fromStop.id,
    toStop.id,
    options
  );

  // Find single-transfer routes
  const oneTransferOpts = findOneTransferOptions(
    fromStop.id,
    toStop.id,
    directRouteIds,
    options
  );

  if (directOpts.length > 0) {
    return {
      fromStop,
      toStop,
      activeTransferLevel: 0,
      options: directOpts,
      moreChangesOptions: oneTransferOpts,
      hasMoreChangesAvailable: oneTransferOpts.length > 0,
      directRouteIds,
    };
  }

  if (oneTransferOpts.length > 0) {
    return {
      fromStop,
      toStop,
      activeTransferLevel: 1,
      options: oneTransferOpts,
      moreChangesOptions: [],
      hasMoreChangesAvailable: false,
      directRouteIds: [],
    };
  }

  // No matching direct or transfer routes found
  return {
    fromStop,
    toStop,
    activeTransferLevel: null,
    options: [],
    moreChangesOptions: [],
    hasMoreChangesAvailable: false,
    directRouteIds: [],
  };
}
