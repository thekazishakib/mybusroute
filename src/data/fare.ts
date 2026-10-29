import { getStopById, getRouteById, haversineDistance } from './load';
import type { Fare, FareBasis, ResolvedLegFare, Stop } from './types';

export interface JourneyFareSummary {
  hasTotalFare: boolean;
  totalAmountBdt: number | null;
  totalKm: number;
  basisList: FareBasis[];
  legFares: ResolvedLegFare[];
}

/**
 * Computes estimated distance and fare between two stops along a bus route
 * using the gazette formula from Dhaka Bus Route and Fare Database v0.2:
 *
 * ride_km = max(sum of hops x 1.2, straight-line distance x 1.35)
 * ride_fare_tk = max(10, ceil(2.70 x ride_km))
 */
export function computeRouteSegmentFare(
  routeId: string,
  fromStopId: string,
  toStopId: string
): { estKm: number; amountBdt: number } {
  const route = getRouteById(routeId);
  const fromStop = getStopById(fromStopId);
  const toStop = getStopById(toStopId);

  if (!route || !fromStop || !toStop) {
    return { estKm: 0, amountBdt: 10 };
  }

  // Find stop subsequence along the route
  const fi = route.stops.indexOf(fromStop.id);
  const ti = route.stops.indexOf(toStop.id);

  if (fi === -1 || ti === -1 || fi === ti) {
    // Fallback: straight-line distance between the two stops
    const directKm = haversineDistance(fromStop.lat, fromStop.lng, toStop.lat, toStop.lng);
    const estKm = Math.round(directKm * 1.35 * 10) / 10;
    const amountBdt = Math.max(10, Math.ceil(2.7 * estKm));
    return { estKm, amountBdt };
  }

  const slice =
    fi < ti ? route.stops.slice(fi, ti + 1) : route.stops.slice(ti, fi + 1).reverse();
  const stopObjects: Stop[] = slice
    .map((id) => getStopById(id))
    .filter((s): s is Stop => Boolean(s));

  if (stopObjects.length < 2) {
    const directKm = haversineDistance(fromStop.lat, fromStop.lng, toStop.lat, toStop.lng);
    const estKm = Math.round(directKm * 1.35 * 10) / 10;
    const amountBdt = Math.max(10, Math.ceil(2.7 * estKm));
    return { estKm, amountBdt };
  }

  let hopsKm = 0;
  for (let i = 0; i < stopObjects.length - 1; i++) {
    hopsKm += haversineDistance(
      stopObjects[i].lat,
      stopObjects[i].lng,
      stopObjects[i + 1].lat,
      stopObjects[i + 1].lng
    );
  }

  const directKm = haversineDistance(
    stopObjects[0].lat,
    stopObjects[0].lng,
    stopObjects[stopObjects.length - 1].lat,
    stopObjects[stopObjects.length - 1].lng
  );

  const rideKm = Math.max(hopsKm * 1.2, directKm * 1.35);
  const estKm = Math.round(rideKm * 10) / 10;
  const amountBdt = Math.max(10, Math.ceil(2.7 * estKm));

  return { estKm, amountBdt };
}

/**
 * Resolves the fare for a single leg.
 * If explicit fareTable is provided and non-empty, checks explicit fares.
 * Otherwise, computes fare using the v0.2 gazette formula.
 */
export function resolveLegFare(
  routeId: string,
  fromStopId: string,
  toStopId: string,
  fareTable?: Fare[]
): ResolvedLegFare {
  // If an explicit fare table is passed, strictly resolve against it
  if (fareTable !== undefined) {
    if (fareTable.length > 0) {
      const pairMatch = fareTable.find(
        (f) =>
          f.route_id === routeId &&
          ((f.from_stop_id === fromStopId && f.to_stop_id === toStopId) ||
            (f.from_stop_id === toStopId && f.to_stop_id === fromStopId)) &&
          typeof f.amount_bdt === 'number'
      );
      if (pairMatch) {
        return {
          hasFare: true,
          amountBdt: pairMatch.amount_bdt,
          estKm: 0,
          basis: pairMatch.basis,
        };
      }
      const flatMatch = fareTable.find(
        (f) =>
          f.route_id === routeId &&
          f.basis === 'flat' &&
          !f.from_stop_id &&
          !f.to_stop_id &&
          typeof f.amount_bdt === 'number'
      );
      if (flatMatch) {
        return {
          hasFare: true,
          amountBdt: flatMatch.amount_bdt,
          estKm: 0,
          basis: flatMatch.basis,
        };
      }
    }
    return {
      hasFare: false,
      amountBdt: null,
      estKm: 0,
      basis: null,
    };
  }

  // Compute via v0.2 gazette formula
  const { estKm, amountBdt } = computeRouteSegmentFare(routeId, fromStopId, toStopId);
  return {
    hasFare: true,
    amountBdt,
    estKm,
    basis: 'formula',
  };
}

/**
 * Computes per-leg fares and total fare for a multi-leg journey.
 * Every bus change pays a fresh minimum of Tk 10.
 */
export function resolveJourneyFare(
  legs: Array<{ routeId: string; fromStopId: string; toStopId: string }>,
  fareTable?: Fare[]
): JourneyFareSummary {
  if (!legs || legs.length === 0) {
    return {
      hasTotalFare: false,
      totalAmountBdt: null,
      totalKm: 0,
      basisList: [],
      legFares: [],
    };
  }

  const legFares = legs.map((leg) =>
    resolveLegFare(leg.routeId, leg.fromStopId, leg.toStopId, fareTable)
  );

  const hasTotalFare = legFares.every((lf) => lf.hasFare);
  const totalAmountBdt = hasTotalFare
    ? legFares.reduce((sum, lf) => sum + (lf.amountBdt ?? 0), 0)
    : null;
  const totalKm = Math.round(
    legFares.reduce((sum, lf) => sum + (lf.estKm ?? 0), 0) * 10
  ) / 10;

  const basisSet = new Set<FareBasis>();
  for (const lf of legFares) {
    if (lf.basis) basisSet.add(lf.basis);
  }

  return {
    hasTotalFare,
    totalAmountBdt,
    totalKm,
    basisList: Array.from(basisSet),
    legFares,
  };
}
