# Changelog

All notable changes to the **BusRoute (Dhaka Bus Route & Fare Finder)** project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.3.1] - 2026-10-29

### Added
- **Security Hardening:**
  - Content Security Policy (CSP), `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, and `Permissions-Policy` in `index.html`.
  - ReDoS and XSS input sanitization engine (`sanitizeSearchQuery`) in `src/data/search.ts`.
  - Automated security test suite (`tests/security.test.ts`).
- **SEO Optimization Suite:**
  - Canonical domain configuration for `https://mybusroute.vercel.app/`.
  - XML Sitemap (`public/sitemap.xml`) with bilingual `hreflang` alternate references.
  - Search crawler policy (`public/robots.txt`) with explicit permissions for AI engines (`GPTBot`, `ClaudeBot`, `PerplexityBot`, `Google-Extended`).
  - Native AI search knowledge files (`public/llms.txt` and `public/llms-full.txt`).
  - Schema.org JSON-LD structured data (`WebSite`, `WebApplication`, `TransitService`, `Organization`).
  - Automated SEO test suite (`tests/seo.test.ts`).
- **Data Freshness Notices:**
  - Added official data update timestamp: **September 2026** across Footer, Privacy Policy, Terms of Service, and Security guidelines.
- **Vercel SPA Deployment Configuration:**
  - Added `vercel.json` with clean URLs and client-side wildcard rewrites to prevent 404s on direct page reloads.

---

## [1.3.0] - 2026-10-29

### Added
- **Road-Accurate OSRM Mapping Engine:**
  - Replaced plain "A" and "B" nodes with road-accurate street geometries across metropolitan Dhaka.
  - Interactive numbered stoppage milestones (1, 2, 3...) with custom Leaflet markers and tooltips.
  - Interactive bottom stoppage ribbon showing sequential stop progression.
- **Enhanced Search Result Cards:**
  - Added direct **[ম্যাপ]** (Map) button alongside **[বিস্তারিত ⌵]** (Details) on every journey result card.
  - Clicking "ম্যাপ" selects the route and smoothly scrolls to the interactive map.
  - Opening "বিস্তারিত ⌵" (Route Details) embeds the interactive Leaflet road map alongside the stoppage timeline and fare breakdown.

---

## [1.2.0] - 2026-10-29

### Added
- **Mobile-First UI/UX Overhaul:**
  - Fixed mobile bottom navigation bar for viewports `< 768px`.
  - Eliminated horizontal scrollbar overflow on mobile devices (`scrollWidth: 390px = clientWidth: 390px`).
  - Restructured top search pill into a responsive card (`results-search-bar`) that stacks cleanly on mobile screens without clipping buttons.
  - Collapsible sticky header on the route page that morphs into a focused bus name pill when scrolled.

---

## [1.1.0] - 2026-10-29

### Added
- **Official BRTA Fare Engine:**
  - Per-kilometer bus fare calculation based on BRTA metropolitan circular (৳2.70/km).
  - Minimum fare enforcement (৳20 for large bus, ৳10 for minibus).
  - Student half-fare (50% concession) notice and holiday policy clarification.
- **Developer Attribution & Social Profile Links:**
  - Added developer credit: **Kazi Shakib is the developer** in Footer and About page.
  - Added sleek black SVG icon links (`#0a0a0a`) for Portfolio (`www.kazishakib.com`), LinkedIn (`bd.linkedin.com/in/kazishakib`), and GitHub (`github.com/thekazishakib`).
  - Official credit to Bangladesh Government portals (BRTA and DTCA) for raw transit data.

---

## [1.0.0] - 2026-10-29

### Initial Release
- **184 Dhaka Local Bus Routes:** Verified network data covering all major transit corridors.
- **260 Distinct Bus Stops:** Natural bilingual naming (Bangla and English) with geographic coordinates.
- **Bilingual Support:** Instant toggling between Bengali (বাংলা) and English.
- **Dark-Only Minimalist Aesthetic:** Editorial typographic style using Noto Serif Bengali and Average Sans.
- **Zero-Latency In-Memory Graph Routing:** Instant journey search for direct buses and 1-stop transfers.

