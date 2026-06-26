import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * useSmoothScroll
 * Initializes Lenis smooth scroll and wires it to GSAP's ScrollTrigger.
 * Returns the lenis instance so callers can use lenis.scrollTo() etc.
 *
 * @returns {{ lenis: Lenis | null }}
 */
export function useSmoothScroll() {
  useEffect(() => {
    let lenis;

    try {
      lenis = new Lenis({
        lerp: 0.08,
        duration: 1.2,
        smoothWheel: true,
        autoRaf: false, // We drive it manually via GSAP ticker
      });

      // Sync Lenis with GSAP ticker so ScrollTrigger stays accurate
      // GSAP ticker passes elapsed time in seconds; Lenis.raf expects ms
      function onTick(time) {
        lenis.raf(time * 1000);
      }

      gsap.ticker.add(onTick);
      gsap.ticker.lagSmoothing(0); // Prevent large jumps after tab focus

      // Store reference for cleanup
      lenis._gTickerFn = onTick;

      // Update ScrollTrigger after first Lenis scroll event
      let refreshed = false;
      lenis.on('scroll', () => {
        if (!refreshed) {
          ScrollTrigger.refresh();
          refreshed = true;
        }
        ScrollTrigger.update();
      });

      // Expose lenis instance for any component that needs lenis.scrollTo()
      window.__lenis = lenis;
    } catch (err) {
      console.warn('[useSmoothScroll] Lenis failed to initialize, falling back to native scroll.', err);
    }

    return () => {
      if (lenis) {
        if (lenis._gTickerFn) {
          gsap.ticker.remove(lenis._gTickerFn);
        }
        lenis.destroy();
        window.__lenis = null;
      }
    };
  }, []);
}
