import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ChevronDown, Menu, X } from 'lucide-react';
import { SERVICES } from '../data/services';
import './Navbar.css';

const NAV_LINKS = [
  { label: 'Services', href: '#services' },
  { label: 'Work', href: '#work' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

/**
 * Navbar
 * Fixed top navigation with:
 *  - Scroll-hide / scroll-show behavior
 *  - Frosted-glass background after 20px scroll
 *  - Mobile full-screen overlay menu
 */
export default function Navbar() {
  const navRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);
  const isHomePage = typeof window !== 'undefined' && window.location.pathname === '/';

  // Scroll-based hide/show + background transition
  useEffect(() => {
    function handleScroll() {
      if (ticking.current) return;
      ticking.current = true;

      requestAnimationFrame(() => {
        const currentY = window.scrollY;
        const nav = navRef.current;
        if (!nav) { ticking.current = false; return; }

        // Show/hide based on scroll direction (only after 80px)
        if (currentY > 80) {
          if (currentY > lastScrollY.current) {
            // Scrolling down — hide
            gsap.to(nav, { yPercent: -100, duration: 0.3, ease: 'power2.inOut' });
          } else {
            // Scrolling up — show
            gsap.to(nav, { yPercent: 0, duration: 0.3, ease: 'power2.inOut' });
          }
        } else {
          gsap.to(nav, { yPercent: 0, duration: 0.3, ease: 'power2.inOut' });
        }

        // Background transparency
        if (currentY > 20) {
          nav.classList.add('navbar--scrolled');
        } else {
          nav.classList.remove('navbar--scrolled');
        }

        lastScrollY.current = currentY;
        ticking.current = false;
      });
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close overlay on ESC
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape' && menuOpen) setMenuOpen(false);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  // Prevent body scroll when overlay is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  function scrollTo(href) {
    setMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      const lenis = window.__lenis;
      if (lenis) {
        lenis.scrollTo(target, { duration: 1.2 });
      } else {
        target.scrollIntoView({ behavior: 'smooth' });
      }
      return true;
    }
    return false;
  }

  function getHref(href) {
    return isHomePage ? href : `/${href}`;
  }

  function getServiceHref(slug) {
    return `/services/${slug}`;
  }

  function handleAnchorClick(e, href) {
    if (scrollTo(href)) {
      e.preventDefault();
    }
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <>
      <nav ref={navRef} className="navbar" aria-label="Main navigation">
        {/* Logo */}
        <a href="/" className="navbar__logo" aria-label="EditingKart home">
          EditingKart
        </a>

        {/* Desktop links */}
        <ul className="navbar__links" role="list">
          {NAV_LINKS.map(({ label, href }) => (
            <li
              key={label}
              className={label === 'Services' ? 'navbar__item navbar__item--services' : 'navbar__item'}
            >
              {label === 'Services' ? (
                <>
                  <a
                    href={getHref(href)}
                    className="navbar__link navbar__link--services"
                    aria-haspopup="true"
                    onClick={(e) => handleAnchorClick(e, href)}
                  >
                    {label}
                    <ChevronDown size={14} aria-hidden="true" />
                  </a>
                  <div className="navbar__dropdown" aria-label="Services submenu">
                    {SERVICES.map((service) => (
                      <a
                        key={service.slug}
                        href={getServiceHref(service.slug)}
                        className="navbar__dropdown-link"
                        style={{ '--service-accent': service.accent }}
                        data-cursor="hover"
                      >
                        <span>{service.label}</span>
                        <small>{service.eyebrow}</small>
                      </a>
                    ))}
                  </div>
                </>
              ) : (
                <a
                  href={getHref(href)}
                  className="navbar__link"
                  onClick={(e) => handleAnchorClick(e, href)}
                >
                  {label}
                </a>
              )}
            </li>
          ))}
        </ul>

        {/* CTA button */}
        <a href={getHref('#contact')} className="navbar__cta" data-cursor="hover"
          onClick={(e) => handleAnchorClick(e, '#contact')}>
          Get in Touch
        </a>

        {/* Mobile hamburger */}
        <button
          className="navbar__hamburger"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile overlay */}
      <div
        className={`navbar__overlay${menuOpen ? ' navbar__overlay--open' : ''}`}
        aria-hidden={!menuOpen}
      >
        <ul className="navbar__overlay-links" role="list">
          {NAV_LINKS.map(({ label, href }) => (
            <li key={label} className={label === 'Services' ? 'navbar__overlay-item--services' : undefined}>
              <a
                href={getHref(href)}
                className="navbar__overlay-link"
                tabIndex={menuOpen ? 0 : -1}
                onClick={(e) => handleAnchorClick(e, href)}
              >
                {label}
              </a>
              {label === 'Services' && (
                <div className="navbar__overlay-services" aria-label="Service pages">
                  {SERVICES.map((service) => (
                    <a
                      key={service.slug}
                      href={getServiceHref(service.slug)}
                      className="navbar__overlay-service-link"
                      style={{ '--service-accent': service.accent }}
                      tabIndex={menuOpen ? 0 : -1}
                      onClick={closeMenu}
                    >
                      {service.label}
                    </a>
                  ))}
                </div>
              )}
            </li>
          ))}
          <li>
            <a
              href={getHref('#contact')}
              className="navbar__overlay-cta"
              tabIndex={menuOpen ? 0 : -1}
              onClick={(e) => handleAnchorClick(e, '#contact')}
            >
              Get in Touch
            </a>
          </li>
        </ul>
      </div>
    </>
  );
}
