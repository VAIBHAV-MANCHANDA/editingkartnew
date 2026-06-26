import { useState } from 'react';
import './index.css';

import { useSmoothScroll } from './hooks/useSmoothScroll';
import CustomCursor from './components/CustomCursor';
import Preloader    from './components/Preloader';
import Navbar       from './components/Navbar';
import Hero         from './sections/Hero';
import Reel         from './sections/Reel';
import Work         from './sections/Work';
import About        from './sections/About';
import Contact      from './sections/Contact';

/**
 * App
 * Root component wiring:
 *  - Lenis smooth scroll (via hook)
 *  - Custom cursor (desktop only)
 *  - Preloader → Hero animation trigger
 *  - All page sections in order
 */
export default function App() {
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
      <main>
        <Hero    animateIn={heroAnimateIn} />
        <Reel    />
        <Work    />
        <About   />
        <Contact />
      </main>
    </>
  );
}
