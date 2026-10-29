import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { I18nProvider } from './i18n/useT';
import { Nav } from './components/Nav';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { BusesPage } from './pages/BusesPage';
import { RoutePage } from './pages/RoutePage';
import { StopPage } from './pages/StopPage';
import { FarePage } from './pages/FarePage';
import { AboutPage } from './pages/AboutPage';
import { SEOHead } from './seo/SEOHead';

export function AppContent() {
  const location = useLocation();

  return (
    <div className="app-shell">
      <SEOHead />
      <Nav />
      <main key={location.pathname} className="page-transition-wrapper" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/routes" element={<BusesPage />} />
          <Route path="/buses" element={<BusesPage />} />
          <Route path="/fare" element={<FarePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/privacy" element={<AboutPage />} />
          <Route path="/terms" element={<AboutPage />} />
          <Route path="/security" element={<AboutPage />} />
          <Route path="/bus/:routeId" element={<RoutePage />} />
          <Route path="/stop/:stopId" element={<StopPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <I18nProvider initialLang="bn">
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </I18nProvider>
  );
}
