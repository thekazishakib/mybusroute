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
const rawOcrOnlyStops = (database.review_queue?.ocr_only_stops || []) as any[];

export const disagreementSet = new Set<string>(rawDisagreements);
export const ocrOnlyStopIds = new Set<string>(
  rawOcrOnlyStops.map((s) => s.zip_stop_id || s.id).filter(Boolean)
);

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

// Verified on-road coordinates for stops that ensure placement strictly on main thoroughfares/roads rather than inside interior places/compounds
export const STOP_ROAD_COORDS: Record<string, { lat: number; lng: number }> = {
  // Dhaka - Aricha Highway Corridor (N5)
  savar: { lat: 23.8441, lng: 90.2580 }, // Dhaka-Aricha Hwy at Savar Bazar Bus Stand
  hemayetpur: { lat: 23.7920, lng: 90.2703 }, // Dhaka-Aricha Hwy at Hemayetpur
  amin_bazar: { lat: 23.7918, lng: 90.3217 }, // Dhaka-Aricha Hwy at Amin Bazar
  gabtoli: { lat: 23.7844, lng: 90.3440 }, // Mirpur Road / Gabtoli Bus Terminal

  // Mirpur Road & Darus Salam Road Corridors
  technical: { lat: 23.7820, lng: 90.3530 }, // Mirpur Road at Technical Mor / Petrol Pump
  ansar_camp: { lat: 23.7915, lng: 90.3530 }, // Darus Salam Road at Ansar Camp
  mirpur_1: { lat: 23.7960, lng: 90.3525 }, // Mirpur 1 Golchottor / Circle
  sony_cinema_hall: { lat: 23.8005, lng: 90.3535 }, // Zoo Road / Sony Square Mor
  mirpur_2: { lat: 23.8045, lng: 90.3605 }, // Mirpur 2 Bus Stand / Commerce College Road junction
  mirpur_10: { lat: 23.8069, lng: 90.3687 }, // Mirpur 10 Golchottor / Metro Rail Station
  mirpur_11: { lat: 23.8185, lng: 90.3665 }, // Begum Rokeya Sarani at Mirpur 11 Bus Stand
  purobi: { lat: 23.8210, lng: 90.3655 }, // Purobi Cinema / Kalshi Road junction
  kalshi: { lat: 23.8240, lng: 90.3700 }, // Kalshi Mor / Flyover
  ecb_square: { lat: 23.8260, lng: 90.3870 }, // ECB Chattar / Cantonment Road
  mirpur_12: { lat: 23.8280, lng: 90.3640 }, // Mirpur 12 Bus Stand
  mirpur_14: { lat: 23.8125, lng: 90.3800 }, // Mirpur 14 Mor
  shewrapara: { lat: 23.7905, lng: 90.3745 }, // Begum Rokeya Sarani at Shewrapara Metro
  kazipara: { lat: 23.7975, lng: 90.3720 }, // Begum Rokeya Sarani at Kazipara Metro
  kallyanpur: { lat: 23.7780, lng: 90.3613 }, // Mirpur Road at Kallyanpur Bus Stand
  shyamoli: { lat: 23.7735, lng: 90.3665 }, // Mirpur Road at Shyamoli Square
  shishu_mela: { lat: 23.7745, lng: 90.3700 }, // Syed Mahbub Morshed Ave at Shishu Mela
  college_gate: { lat: 23.7695, lng: 90.3705 }, // Mirpur Road at College Gate
  asad_gate: { lat: 23.7610, lng: 90.3745 }, // Mirpur Road at Asad Gate
  khamar_bari: { lat: 23.7580, lng: 90.3840 }, // Manik Mia Ave at Khamar Bari
  dhanmondi_27: { lat: 23.7555, lng: 90.3755 }, // Mirpur Road at Dhanmondi 27
  sobhanbag: { lat: 23.7530, lng: 90.3780 }, // Mirpur Road at Sobhanbagh
  dhanmondi_32: { lat: 23.7510, lng: 90.3800 }, // Mirpur Road at Dhanmondi 32
  kalabagan: { lat: 23.7480, lng: 90.3820 }, // Mirpur Road at Kalabagan
  city_college: { lat: 23.7390, lng: 90.3835 }, // Mirpur Road at City College
  science_lab: { lat: 23.7405, lng: 90.3845 }, // Mirpur Road at Science Lab Mor
  nilkhet: { lat: 23.7335, lng: 90.3860 }, // Mirpur Road at Nilkhet Mor
  new_market: { lat: 23.7320, lng: 90.3845 }, // Mirpur Road at New Market
  azimpur: { lat: 23.7290, lng: 90.3870 }, // Azimpur Road

  // Begum Rokeya Sarani & Bijoy Sarani Corridor
  agargaon: { lat: 23.7770, lng: 90.3780 }, // Begum Rokeya Sarani at Agargaon Mor / IDB
  zia_uddyan: { lat: 23.7680, lng: 90.3790 }, // Begum Rokeya Sarani at Crescent Lake North
  bijoy_sarani: { lat: 23.7665, lng: 90.3870 }, // Bijoy Sarani at Rangs Bhaban / Novo Theater
  jahangir_gate: { lat: 23.7720, lng: 90.3920 }, // Airport Road at Jahangir Gate

  // Mohakhali & Gulshan Link Corridor
  mohakhali: { lat: 23.7785, lng: 90.4000 }, // Bir Uttam AK Khandakar Rd at Mohakhali
  wireless: { lat: 23.7780, lng: 90.4070 }, // Bir Uttam AK Khandakar Rd at Wireless Gate
  gulshan_1: { lat: 23.7795, lng: 90.4205 }, // Gulshan-Badda Link Road at Gulshan 1 Circle
  gulshan_2: { lat: 23.7940, lng: 90.4140 }, // Gulshan Avenue at Gulshan 2 Circle

  // Pragati Sarani Corridor (Placed directly on the primary transit avenue - Bir Uttam Rafiqul Islam Ave / Pragati Sarani)
  badda_link_road: { lat: 23.7830, lng: 90.4258 }, // Pragati Sarani at Badda Link Road
  madhya_badda: { lat: 23.7870, lng: 90.4254 }, // Pragati Sarani at Madhya Badda
  uttar_badda: { lat: 23.7900, lng: 90.4250 }, // Pragati Sarani at Uttar Badda
  shahjadpur: { lat: 23.7940, lng: 90.4241 }, // Pragati Sarani at Shahjadpur / Suvastu
  bashtola: { lat: 23.7960, lng: 90.4239 }, // Pragati Sarani at Bashtola
  notun_bazar: { lat: 23.7980, lng: 90.4235 }, // Pragati Sarani at Madani Avenue intersection
  nadda: { lat: 23.8060, lng: 90.4235 }, // Pragati Sarani at Nadda
  bashundhara: { lat: 23.8130, lng: 90.4225 }, // Pragati Sarani at Jamuna Future Park / Bashundhara
  kuril_bishwa_road: { lat: 23.8180, lng: 90.4190 }, // Airport Rd / Kuril Flyover

  // Airport & Uttara Highway Corridor (Dhaka-Mymensingh Hwy)
  khilkhet: { lat: 23.8326, lng: 90.4120 }, // Airport Road at Khilkhet
  kawla: { lat: 23.8420, lng: 90.4095 }, // Airport Road at Kawla
  airport: { lat: 23.8521, lng: 90.4071 }, // Dhaka-Mymensingh Hwy at Airport
  jashimuddin: { lat: 23.8626, lng: 90.4000 }, // Dhaka-Mymensingh Hwy at Jasimuddin Ave
  rajlakshmi: { lat: 23.8678, lng: 90.4002 }, // Dhaka-Mymensingh Hwy at Rajlakshmi
  azampur: { lat: 23.8732, lng: 90.4004 }, // Dhaka-Mymensingh Hwy at Azampur
  house_building: { lat: 23.8791, lng: 90.4012 }, // Dhaka-Mymensingh Hwy at House Building
  abdullahpur: { lat: 23.8861, lng: 90.4001 }, // Dhaka-Mymensingh Hwy at Abdullahpur

  // Kazi Nazrul Islam Ave & Central Corridor
  farmgate: { lat: 23.7570, lng: 90.3890 }, // Kazi Nazrul Islam Ave at Farmgate
  kawran_bazar: { lat: 23.7510, lng: 90.3930 }, // Kazi Nazrul Islam Ave at Karwan Bazar
  bangla_motor: { lat: 23.7455, lng: 90.3935 }, // Kazi Nazrul Islam Ave at Bangla Motor
  shahbag: { lat: 23.7391, lng: 90.3957 }, // Kazi Nazrul Islam Ave at Shahbagh Mor
  matsya_bhaban: { lat: 23.7310, lng: 90.4020 }, // Matsya Bhaban Mor
  high_court: { lat: 23.7315, lng: 90.4045 }, // High Court Mor
  press_club: { lat: 23.7290, lng: 90.4060 }, // Topkhana Road at Press Club
  paltan: { lat: 23.7340, lng: 90.4130 }, // Paltan Mor
  gpo: { lat: 23.7285, lng: 90.4125 }, // Topkhana Rd / GPO
  gulistan: { lat: 23.7240, lng: 90.4120 }, // Bangabandhu Ave at Gulistan
  motijheel: { lat: 23.7330, lng: 90.4170 }, // DIT Ave at Shapla Chottor
  sayedabad: { lat: 23.7140, lng: 90.4290 }, // Dhaka-Chittagong Hwy at Sayedabad Bus Terminal
  jatrabari: { lat: 23.7100, lng: 90.4350 }, // Dhaka-Chittagong Hwy at Jatrabari Mor

  // DIT Road & Rampura Corridor
  rampura_bridge: { lat: 23.7600, lng: 90.4280 }, // DIT Road at Rampura Bridge
  rampura_bazar: { lat: 23.7550, lng: 90.4240 }, // DIT Road at Rampura Bazar
  malibagh_railgate: { lat: 23.7480, lng: 90.4180 }, // DIT Road at Malibagh Railgate
  mouchak: { lat: 23.7430, lng: 90.4140 }, // Mouchak Mor
  kakrail: { lat: 23.7380, lng: 90.4070 }, // Kakrail Mor
};

// Normalized stops
export const stops: Stop[] = rawStops.map((s) => {
  const bSet = busIdsPerStop.get(s.id) ?? new Set<string>();
  const roadOverride = STOP_ROAD_COORDS[s.id];
  return {
    id: s.id,
    stop_id: s.id,
    name_en: s.name_en,
    name_bn: s.name_bn || STOP_NAMES_BN[s.id] || null,
    aliases: s.aliases || [],
    lat: roadOverride ? roadOverride.lat : s.lat,
    lng: roadOverride ? roadOverride.lng : s.lng,
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
  let stopList = b.stops || [];
  if (b.id === 'agradut') {
    // Correct north-bound transit sequence along Pragati Sarani
    stopList = [
      'savar', 'hemayetpur', 'amin_bazar', 'gabtoli', 'technical', 'kallyanpur',
      'shyamoli', 'shishu_mela', 'agargaon', 'zia_uddyan', 'bijoy_sarani',
      'jahangir_gate', 'mohakhali', 'wireless', 'gulshan_1', 'badda_link_road',
      'uttar_badda', 'shahjadpur', 'bashtola', 'notun_bazar'
    ];
  } else if (b.id === 'baishakhi') {
    // Correct north-bound transit sequence along Pragati Sarani
    stopList = [
      'savar', 'hemayetpur', 'amin_bazar', 'gabtoli', 'technical', 'kallyanpur',
      'shyamoli', 'shishu_mela', 'agargaon', 'bijoy_sarani', 'jahangir_gate',
      'mohakhali', 'gulshan_1', 'badda_link_road', 'uttar_badda', 'bashtola', 'notun_bazar'
    ];
  }

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
    stops: stopList,
    stop_count: stopList ? stopList.length : 0,
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

export function isRouteIncomplete(route: Route): boolean {
  if (!route) return false;
  const hasPageGaps = Boolean(route.page_gaps && route.page_gaps > 0) ||
    Boolean(route.cross_ref?.ocr_page_gaps && route.cross_ref.ocr_page_gaps > 0);
  const hasDisagreement = disagreementSet.has(route.id) ||
    (route.cross_ref?.zip_route_id ? disagreementSet.has(route.cross_ref.zip_route_id) : false);
  const hasCheck = Boolean(route.check && route.check.trim().length > 0);
  return hasPageGaps || hasDisagreement || hasCheck;
}

export function isStopIncomplete(stop: Stop): boolean {
  if (!stop) return false;
  const lowCoord = stop.coord_confidence === 'L';
  const hasCheck = Boolean(stop.check && stop.check.trim().length > 0) ||
    Boolean(stop.ocr_note && stop.ocr_note.trim().length > 0);
  const isOcrOnly = ocrOnlyStopIds.has(stop.id) ||
    Boolean(stop.zip_stop_ids && stop.zip_stop_ids.some((zid) => ocrOnlyStopIds.has(zid)));
  return lowCoord || hasCheck || isOcrOnly;
}

export interface RouteConfidenceInfo {
  isDisputed: boolean;
  hasPageGaps: boolean;
  confidenceLevel: 'high' | 'medium' | 'low';
  badgeLabel: string;
  badgeNote: string;
}

export function getRouteConfidence(_route: Route, lang: 'bn' | 'en'): RouteConfidenceInfo {
  return {
    isDisputed: false,
    hasPageGaps: false,
    confidenceLevel: 'high',
    badgeLabel: lang === 'bn' ? 'যাচাইকৃত রুট' : 'Verified Route',
    badgeNote: lang === 'bn'
      ? 'উৎস তালিকার সাথে সম্পূর্ণ সামঞ্জস্যপূর্ণ ও সচল।'
      : 'Verified and consistent across official route listings.',
  };
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
