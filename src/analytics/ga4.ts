/**
 * Google Analytics 4 (GA4) Integration & Custom Transit Events
 */

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

const DEFAULT_MEASUREMENT_ID = (import.meta.env.VITE_GA_MEASUREMENT_ID as string) || '';

let isInitialized = false;

export function initGA(customId?: string): void {
  if (typeof window === 'undefined') return;
  const measurementId = customId || DEFAULT_MEASUREMENT_ID;

  if (!measurementId || isInitialized) return;

  // Initialize dataLayer
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };

  window.gtag('js', new Date());
  window.gtag('config', measurementId, {
    send_page_view: false, // We track manually for SPA router
    anonymize_ip: true,
  });

  // Inject async script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);

  isInitialized = true;
}

export function trackEvent(action: string, params: Record<string, any> = {}): void {
  if (typeof window === 'undefined') return;

  if (window.gtag) {
    window.gtag('event', action, params);
  }

  // Development debug log
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.debug(`[GA4 Event: ${action}]`, params);
  }
}

export function trackPageView(pagePath: string, pageTitle?: string): void {
  trackEvent('page_view', {
    page_path: pagePath,
    page_title: pageTitle || (typeof document !== 'undefined' ? document.title : ''),
  });
}

export function trackRouteSearch(fromStop: string, toStop: string, resultsCount: number): void {
  trackEvent('route_search', {
    from_stop: fromStop,
    to_stop: toStop,
    results_count: resultsCount,
  });
}

export function trackRouteView(busId: string, busName: string): void {
  trackEvent('route_view', {
    bus_id: busId,
    bus_name: busName,
  });
}

export function trackNoRouteFound(fromStop: string, toStop: string): void {
  trackEvent('no_route_found', {
    from_stop: fromStop,
    to_stop: toStop,
  });
}

export function trackFareCalculate(km: number, fareBdt: number): void {
  trackEvent('fare_calculate', {
    distance_km: km,
    fare_bdt: fareBdt,
  });
}

export function trackLanguageChange(lang: string): void {
  trackEvent('language_change', {
    selected_language: lang,
  });
}

export function trackThemeChange(theme: string): void {
  trackEvent('theme_change', {
    selected_theme: theme,
  });
}

