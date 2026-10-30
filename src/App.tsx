import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useParams, useLocation } from 'react-router-dom';
import { I18nProvider } from './i18n/useT';
import { ThemeProvider } from './theme/ThemeContext';
import { Nav } from './components/Nav';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { BusesPage } from './pages/BusesPage';
import { FarePage } from './pages/FarePage';
import { AboutPage } from './pages/AboutPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { SEOHead } from './seo/SEOHead';
import { initGA, trackPageView } from './analytics/ga4';

function BusRedirect() {
  const { routeId } = useParams<{ routeId: string }>();
  return <Navigate to={routeId ? `/routes?bus=${routeId}` : '/routes'} replace />;
}

export function AppContent() {
  const location = useLocation();

  useEffect(() => {
    initGA();
    trackPageView(location.pathname + location.search);
  }, [location]);

  // Automatically scroll to the top of the page on route change (solves mobile & desktop scroll retention)
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant',
    });
  }, [location.pathname]);

  return (
    <div className="app-shell">
      <SEOHead />
      <Nav />
      <main key={location.pathname} className="page-transition-wrapper" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Routes location={location}>
          {/* Core Pages */}
          <Route path="/" element={<Home />} />
          <Route path="/routes" element={<BusesPage />} />
          <Route path="/fare" element={<FarePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />

          {/* Graceful redirects for legacy URLs */}
          <Route path="/buses" element={<Navigate to="/routes" replace />} />
          <Route path="/bus/:routeId" element={<BusRedirect />} />
          <Route path="/stop/:stopId" element={<Navigate to="/routes" replace />} />
          <Route path="/security" element={<Navigate to="/about" replace />} />
          
          {/* True 404 Page */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <I18nProvider initialLang="bn">
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </I18nProvider>
    </ThemeProvider>
  );
}
