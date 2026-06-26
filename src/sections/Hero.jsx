import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import Hero3D from '../components/Hero3D';
import TextReveal from '../components/TextReveal';
import './Hero.css';

/**
 * Hero
 * Full-viewport dark hero section with:
 *  - React Three Fiber 3D object (torus knot, mouse-reactive)
 *  - Masked text reveal animations (triggered after preloader)
 *  - Scroll indicator that fades on first scroll
 *
 * Props:
 *  - animateIn — boolean, set to true when preloader completes
 */
export default function Hero({ animateIn = false }) {
  const mouseRef = useRef({ x: 0, y: 0 });
  const sectionRef = useRef(null);
  const scrollIndicatorRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  // Detect mobile breakpoint
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    setIsMobile(mq.matches);
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Track normalised mouse position [-1, 1]
  useEffect(() => {
    function onMouseMove(e) {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    }
    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  // Fade out scroll indicator on first scroll past 100px
  useEffect(() => {
    function onScroll() {
      if (window.scrollY > 100 && !hasScrolled) {
        setHasScrolled(true);
        if (scrollIndicatorRef.current) {
          gsap.to(scrollIndicatorRef.current, {
            opacity: 0,
            y: 10,
            duration: 0.5,
            ease: 'power2.out',
          });
        }
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [hasScrolled]);

  return (
    <section
      ref={sectionRef}
      className="hero"
      aria-label="Hero section"
    >
      {/* 3D Background Canvas */}
      <Hero3D mouseRef={mouseRef} isMobile={isMobile} />

      {/* Gradient overlay to improve text legibility */}
      <div className="hero__gradient" aria-hidden="true" />

      {/* Typography overlay */}
      <div className="hero__content">
        {/* Eyebrow label */}
        <TextReveal
          tag="p"
          className="hero__eyebrow"
          delay={0}
          triggerOnMount={animateIn}
        >
          Motion Design Studio
        </TextReveal>

        {/* Main heading — two lines */}
        <h1 className="hero__heading" aria-label="We Tell Stories Through Motion">
          <TextReveal
            tag="span"
            className="hero__heading-line"
            delay={0.1}
            triggerOnMount={animateIn}
          >
            We Tell Stories
          </TextReveal>
          <TextReveal
            tag="span"
            className="hero__heading-line hero__heading-line--accent"
            delay={0.22}
            triggerOnMount={animateIn}
          >
            Through Motion
          </TextReveal>
        </h1>

        {/* Subtitle */}
        <TextReveal
          tag="p"
          className="hero__subtitle"
          delay={0.34}
          triggerOnMount={animateIn}
        >
          Video Editing&nbsp;&nbsp;·&nbsp;&nbsp;Color Grading&nbsp;&nbsp;·&nbsp;&nbsp;Motion Graphics
        </TextReveal>
      </div>

      {/* Decorative copyright tag — bottom right */}
      <span className="hero__tag" aria-hidden="true">
        © 2025 EditingKart
      </span>

      {/* Scroll indicator — bottom center */}
      <div
        ref={scrollIndicatorRef}
        className="hero__scroll-indicator"
        aria-label="Scroll to explore"
      >
        <span className="hero__scroll-label">Scroll</span>
        <div className="hero__scroll-line">
          <div className="hero__scroll-line-inner" />
        </div>
      </div>
    </section>
  );
}
