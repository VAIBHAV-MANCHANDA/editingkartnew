import { useRef, useLayoutEffect, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * TextReveal
 * Wraps children in an overflow:hidden mask and animates them
 * with a masked slide-up reveal.
 *
 * Two modes:
 *  1. triggerOnMount=false (default): hidden on mount, animates in when scrolled into view.
 *  2. triggerOnMount=true: animates in immediately (used after preloader completes).
 *
 * The parent controls the mode switch by passing `animateIn` (or similar) as triggerOnMount.
 * When triggerOnMount flips false→true, any pending scroll trigger is killed and the
 * immediate animation fires instead.
 *
 * Props:
 *  - children       — content to reveal
 *  - className      — extra class on the outer mask element
 *  - delay          — GSAP tween start delay in seconds (default 0)
 *  - stagger        — additional stagger offset added to delay (default 0)
 *  - tag            — HTML element for the outer wrapper (default "div")
 *  - triggerOnMount — when true, animate in immediately; when false, use scroll trigger
 *  - onComplete     — optional callback when tween completes
 */
export default function TextReveal({
  children,
  className = '',
  delay = 0,
  stagger = 0,
  tag: Tag = 'div',
  triggerOnMount = false,
  onComplete,
}) {
  const outerRef  = useRef(null);
  const innerRef  = useRef(null);
  const ctxRef    = useRef(null); // holds the gsap.context for cleanup

  const prefersReduced =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;

  // Set initial hidden position before first paint
  useLayoutEffect(() => {
    const inner = innerRef.current;
    if (inner) gsap.set(inner, { y: '101%' });
  }, []);

  useEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;

    // Kill any existing animation/trigger before setting up a new one
    if (ctxRef.current) {
      ctxRef.current.revert();
      ctxRef.current = null;
    }

    const duration = prefersReduced ? 0.001 : 0.9;
    const totalDelay = prefersReduced ? 0 : delay + stagger;

    if (triggerOnMount) {
      // Immediate reveal — used in Hero after preloader
      // Re-ensure hidden state in case it was partially animated
      gsap.set(inner, { y: '101%' });

      ctxRef.current = gsap.context(() => {
        gsap.to(inner, {
          y: 0,
          duration,
          ease: 'power3.out',
          delay: totalDelay,
          onComplete: onComplete || undefined,
        });
      });
    } else {
      // Scroll-triggered reveal
      ctxRef.current = gsap.context(() => {
        gsap.to(inner, {
          y: 0,
          duration,
          ease: 'power3.out',
          delay: totalDelay,
          onComplete: onComplete || undefined,
          scrollTrigger: {
            trigger: outer,
            start: 'top 90%',
            once: true,
          },
        });
      });
    }

    return () => {
      if (ctxRef.current) {
        ctxRef.current.revert();
        ctxRef.current = null;
      }
    };
  }, [triggerOnMount, delay, stagger, prefersReduced, onComplete]);

  return (
    <Tag
      ref={outerRef}
      className={`text-reveal-outer${className ? ` ${className}` : ''}`}
      style={{ overflow: 'hidden', display: 'block' }}
    >
      <span
        ref={innerRef}
        className="text-reveal-inner"
        style={{ display: 'block', willChange: 'transform' }}
      >
        {children}
      </span>
    </Tag>
  );
}
