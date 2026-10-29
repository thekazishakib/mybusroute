import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useT } from '../i18n/useT';
import { LangToggle } from './LangToggle';
import { HomeIcon, BusIcon, WalletIcon, InfoIcon } from './Icons';

export const Nav: React.FC = () => {
  const { lang } = useT();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    {
      to: '/',
      label: lang === 'bn' ? 'হোম' : 'Home',
      icon: <HomeIcon size={18} />,
    },
    {
      to: '/routes',
      label: lang === 'bn' ? 'রুটসমূহ' : 'Routes',
      icon: <BusIcon size={18} />,
    },
    {
      to: '/fare',
      label: lang === 'bn' ? 'ভাড়া' : 'Fare',
      icon: <WalletIcon size={18} />,
    },
    {
      to: '/about',
      label: lang === 'bn' ? 'আমাদের সম্পর্কে' : 'About',
      icon: <InfoIcon size={18} />,
    },
  ];

  return (
    <>
      <div
        className="nav-wrapper-outer"
        style={{
          position: 'sticky',
          top: isScrolled ? '10px' : '16px',
          zIndex: 1000,
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          padding: '0 16px',
          pointerEvents: 'none',
          transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <header
          className="dynamic-island-navbar"
          style={{
            pointerEvents: 'auto',
            width: '100%',
            maxWidth: isScrolled ? '640px' : '1240px',
            height: '56px',
            backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.96)' : 'rgba(255, 255, 255, 0.92)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid var(--color-hairline)',
            borderRadius: '9999px',
            boxShadow: isScrolled
              ? '0 12px 36px rgba(0, 0, 0, 0.12), 0 2px 6px rgba(0,0,0,0.04)'
              : '0 4px 20px rgba(0, 0, 0, 0.05)',
            padding: '0 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            transition: 'max-width 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease, background-color 0.3s ease',
          }}
        >
          <Link
            to="/"
            className="brand-link"
            lang={lang}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              textDecoration: 'none',
              flexShrink: 0,
            }}
          >
            <img
              src="/logo.png"
              alt="BusRoute"
              style={{
                height: '32px',
                width: 'auto',
                display: 'block',
              }}
            />
          </Link>

          <nav
            className="desktop-nav-links"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: isScrolled ? '6px' : '12px',
              transition: 'gap 0.35s ease',
            }}
          >
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                style={({ isActive }) => ({
                  fontSize: '13.5px',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? '#ffffff' : 'var(--color-ink-muted)',
                  backgroundColor: isActive ? '#0a0a0a' : 'transparent',
                  borderRadius: '9999px',
                  padding: '6px 14px',
                  textDecoration: 'none',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  whiteSpace: 'nowrap',
                })}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div style={{ flexShrink: 0 }}>
            <LangToggle />
          </div>
        </header>
      </div>

      <nav
        className="mobile-bottom-nav"
        aria-label="Mobile Navigation"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          backgroundColor: 'rgba(255, 255, 255, 0.96)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderTop: '1px solid var(--color-hairline)',
          boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.08)',
          padding: '6px 8px calc(6px + env(safe-area-inset-bottom, 0px))',
          alignItems: 'center',
          justifyContent: 'space-around',
        }}
      >
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            style={({ isActive }) => ({
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '3px',
              padding: '6px 4px',
              borderRadius: '12px',
              textDecoration: 'none',
              color: isActive ? '#0a0a0a' : 'var(--color-ink-muted)',
              backgroundColor: isActive ? 'rgba(0, 0, 0, 0.06)' : 'transparent',
              transition: 'all 0.2s ease',
              minHeight: '48px',
            })}
          >
            {({ isActive }) => (
              <>
                <div
                  style={{
                    color: isActive ? '#0a0a0a' : 'inherit',
                    transform: isActive ? 'scale(1.1)' : 'scale(1)',
                    transition: 'transform 0.2s ease',
                  }}
                >
                  {item.icon}
                </div>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: isActive ? 700 : 500,
                    lineHeight: 1.1,
                    textAlign: 'center',
                  }}
                  lang={lang}
                >
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </>
  );
};
