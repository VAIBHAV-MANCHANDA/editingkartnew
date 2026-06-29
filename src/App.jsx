import { useState } from 'react';
import './index.css';

import { useSmoothScroll } from './hooks/useSmoothScroll';
import CustomCursor from './components/CustomCursor';
import Preloader    from './components/Preloader';
import Navbar       from './components/Navbar';
import Hero         from './sections/Hero';
import Services     from './sections/Services';
import Reel         from './sections/Reel';
import Work         from './sections/Work';
import About        from './sections/About';
import Contact      from './sections/Contact';
import ServicePage  from './pages/ServicePage';
import { getServiceBySlug } from './data/services';

function getServiceRoute() {
  if (typeof window === 'undefined') return null;
  const match = window.location.pathname.match(/^\/services\/([^/]+)\/?$/);
  return match ? decodeURIComponent(match[1]) : null;
}

/**
 * App
 * Root component wiring:
 *  - Lenis smooth scroll (via hook)
 *  - Custom cursor (desktop only)
 *  - Preloader → Hero animation trigger
 *  - All page sections in order
 */
export default function App() {
  const serviceSlug = getServiceRoute();
  const service = serviceSlug ? getServiceBySlug(serviceSlug) : null;
  const isServicePath = !!serviceSlug;

  // If session flag is already set, skip preloader entirely and show hero immediately
  const alreadyVisited = typeof sessionStorage !== 'undefined' && !!sessionStorage.getItem('ek_visited');

  const [showPreloader, setShowPreloader] = useState(!alreadyVisited);
  const [heroAnimateIn, setHeroAnimateIn] = useState(alreadyVisited);

  // Initialize Lenis + GSAP ScrollTrigger sync
  useSmoothScroll();

  function handlePreloaderComplete() {
    setShowPreloader(false);
    setHeroAnimateIn(true);
  }

  return (
    <>
      {/* Custom cursor — renders null on mobile automatically */}
      <CustomCursor />

      {/* Preloader — fixed overlay, exits on completion */}
      {showPreloader && (
        <Preloader onComplete={handlePreloaderComplete} />
      )}

      {/* Fixed navigation */}
      <Navbar />

      {/* Main page content — all sections in order */}
      {service && <ServicePage service={service} />}

      {isServicePath && !service && (
        <main className="service-page">
          <section className="service-hero">
            <div className="service-hero__content">
              <a href="/#services" className="service-page__back" data-cursor="hover">
                Back to services
              </a>
              <p className="service-hero__eyebrow">Page not found</p>
              <h1 className="service-hero__title">Service unavailable</h1>
              <p className="service-hero__summary">
                This service page does not exist yet. Head back to the services list to pick another craft lane.
              </p>
            </div>
          </section>
        </main>
      )}

      {!isServicePath && (
        <main>
          <Hero     animateIn={heroAnimateIn} />
          <Services />
          <Reel     />
          <Work     />
          <About    />
          <Contact  />
        </main>
      )}
    </>
  );
}
