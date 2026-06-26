import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import './Preloader.css';

/**
 * Preloader
 * Full-screen animated loading screen.
 * - Shows "EditingKart" wordmark + percentage counter
 * - Counts 0→100 over ~2s, then slides up off-screen
 * - Skipped on repeat visits (sessionStorage flag)
 *
 * Props:
 *  - onComplete — callback fired when the preloader exits
 */
export default function Preloader({ onComplete }) {
  const wrapperRef = useRef(null);
  const counterRef = useRef(null);
  const barRef = useRef(null);

  useEffect(() => {
    // Mark as visited so App skips preloader on next session load
    sessionStorage.setItem('ek_visited', '1');

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      onComplete?.();
      return;
    }

    const counter = counterRef.current;
    const wrapper = wrapperRef.current;
    const bar = barRef.current;

    const obj = { value: 0 };

    const tl = gsap.timeline({
      onComplete: () => {
        // Slide preloader up and off screen
        gsap.to(wrapper, {
          yPercent: -100,
          duration: 0.8,
          ease: 'power3.inOut',
          onComplete: () => {
            onComplete?.();
          },
        });
      },
    });

    tl.to(obj, {
      value: 100,
      duration: 2,
      ease: 'power1.inOut',
      onUpdate: () => {
        const v = Math.round(obj.value);
        if (counter) counter.textContent = `${v}%`;
        if (bar) bar.style.transform = `scaleX(${v / 100})`;
      },
    });

    return () => {
      tl.kill();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div ref={wrapperRef} className="preloader" role="status">
      {/* Wordmark */}
      <div className="preloader__wordmark" aria-label="EditingKart">
        <span className="preloader__logo-text">EditingKart</span>
      </div>

      {/* Progress bar */}
      <div className="preloader__bar-track" aria-hidden="true">
        <div ref={barRef} className="preloader__bar" />
      </div>

      {/* Counter */}
      <div
        ref={counterRef}
        className="preloader__counter"
        aria-live="polite"
        aria-atomic="true"
      >
        0%
      </div>
    </div>
  );
}
