import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import './CustomCursor.css';

/**
 * CustomCursor
 * Desktop-only custom cursor:
 *  - Small dot: follows mouse instantly
 *  - Hollow ring: lerps behind at 0.12 factor per tick
 *  - Ring scales + recolors on hover over interactive elements
 *  - Returns null on mobile (≤ 768px)
 */
export default function CustomCursor() {
  const dotRef  = useRef(null);
  const ringRef = useRef(null);

  // Track mobile state reactively so re-renders on resize work
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth <= 768
  );

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Animation + event loop
  useEffect(() => {
    if (isMobile) return;

    const dot  = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    // Hide native cursor
    document.body.style.cursor = 'none';

    // Mouse position — dot follows this directly
    let mouseX = window.innerWidth  / 2;
    let mouseY = window.innerHeight / 2;

    // Lerped position — ring follows this
    let ringX = mouseX;
    let ringY = mouseY;

    function onMouseMove(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }
    window.addEventListener('mousemove', onMouseMove);

    // GSAP ticker drives the animation (same ticker as Lenis — no extra rAF)
    function onTick() {
      // Dot: instant update — offset by half size to center (4px = 8px / 2)
      dot.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`;

      // Ring: lerp toward mouse — offset by half size (18px = 36px / 2)
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      ring.style.transform = `translate(${ringX - 18}px, ${ringY - 18}px)`;
    }
    gsap.ticker.add(onTick);

    // Hover state via event delegation — avoid attaching to every element
    function onMouseOver(e) {
      if (e.target.closest('a, button, [data-cursor="hover"]')) {
        ring.classList.add('cursor-ring--hover');
        // Adjust centering for enlarged ring (90px / 2 = 45, original offset 18, delta = 27)
        // Handled in CSS via margin adjustment (see CustomCursor.css)
      }
    }
    function onMouseOut(e) {
      if (e.target.closest('a, button, [data-cursor="hover"]')) {
        ring.classList.remove('cursor-ring--hover');
      }
    }
    document.addEventListener('mouseover', onMouseOver);
    document.addEventListener('mouseout',  onMouseOut);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseout',  onMouseOut);
      gsap.ticker.remove(onTick);
      document.body.style.cursor = '';
    };
  }, [isMobile]);

  if (isMobile) return null;

  return (
    <>
      <div ref={dotRef}  className="cursor-dot"  aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
    </>
  );
}
