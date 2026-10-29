export interface Stop {
  id: string;
  stop_id: string; // Alias to id for compatibility
  name_en: string;
  name_bn: string | null;
  aliases: string[];
  lat: number;
  lng: number;
  coord_confidence: 'H' | 'M' | 'L';
  bus_count: number;
  bus_ids: string[];
  zip_stop_ids?: string[];
  ocr_note?: string;
  check: string | null;
}

export interface RouteCrossRef {
  zip_route_id?: string;
  site_name_en?: string;
  site_name_bn?: string;
  service_type_site?: string | null;
  ocr_page_gaps?: number;
  ocr_note?: string | null;
  stop_overlap_with_ocr?: number;
}

export interface Route {
  id: string;
  route_id: string; // Alias to id for compatibility
  name_en: string;
  name_bn: string | null;
  route_no: string | null;
  type: string;
  first_bus: string | null;
  last_bus: string | null;
  time_raw: string | null;
  stops: string[]; // stop IDs in order
  stop_count: number;
  notes?: string[];
  cross_ref?: RouteCrossRef | null;
  service_type: string | null;
  page_gaps: number;
  direction?: string;
  check: string | null;
}

export interface RouteStop {
  route_id: string;
  stop_id: string;
  sequence: number;
  check: string | null;
}

export type FareBasis = 'distance' | 'formula' | 'flat' | 'stop_pair' | 'section';

export interface Fare {
  route_id: string;
  from_stop_id?: string | null;
  to_stop_id?: string | null;
  amount_bdt: number;
  basis: FareBasis;
}

export interface StopAlias {
  alias_id: string;
  stop_id: string;
  canonical_name_en: string;
  variants: string[];
  source: string;
  status: string;
}

export interface StopGroup {
  id: string;
  group_id: string;
  name_en: string;
  stop_ids: string[];
  source?: string;
  status?: string;
}

export interface Landmark {
  landmark_id: string;
  name_en: string;
  query_names: string[];
  nearest_stop_ids: string[];
  stop_ids?: string[];
  source?: string;
  status?: string;
  note: string;
}

export type SuggestionKind = 'stop' | 'group' | 'landmark' | 'adamjee_choice';

export interface SearchSuggestion {
  kind: SuggestionKind;
  id: string;
  label_en: string;
  label_bn?: string;
  matchedAlias?: string;
  stop?: Stop;
  group?: StopGroup;
  groupStops?: Stop[];
  landmark?: Landmark;
  landmarkStops?: Stop[];
  adamjeeStops?: Stop[];
  isSuggestionOnly?: boolean;
}

export interface ResolvedLegFare {
  hasFare: boolean;
  amountBdt: number | null;
  estKm: number;
  basis: FareBasis | null;
}

export interface JourneyLeg {
  fromStop: Stop;
  toStop: Stop;
  stops: Stop[];
  stopCount: number;
  stopsBetween: number;
  stopsRidden: number;
  routes: Route[];
  primaryRoute: Route;
  hasIncompleteData: boolean;
  legFares: Record<string, ResolvedLegFare>;
  estKm: number;
  estFareTk: number;
  hoursUnknown: boolean;
  operatingHours: string;
}

export interface JourneyOption {
  optionId: string;
  transferCount: number;
  legs: JourneyLeg[];
  transferStops: Stop[];
  totalBuses: number;
  totalStopsRidden: number;
  totalStopCount: number;
  hasAnyIncompleteData: boolean;
  totalKm: number;
  totalFareTk: number;
}

export interface JourneySearchResult {
  fromStop: Stop | null;
  toStop: Stop | null;
  viaStop?: Stop | null;
  activeTransferLevel: number | null;
  options: JourneyOption[];
  moreChangesOptions: JourneyOption[];
  hasMoreChangesAvailable: boolean;
  directRouteIds: string[];
  isOriginSuggestion?: boolean;
  isDestinationSuggestion?: boolean;
}
