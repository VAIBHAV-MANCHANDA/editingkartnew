import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import TextReveal from '../components/TextReveal';
import './About.css';

gsap.registerPlugin(ScrollTrigger);

const BIO =
  'EditingKart is a video editing and motion design studio built on the belief that great storytelling lives in the details. We craft brand films, social content, and motion pieces that move audiences — literally and emotionally.';

const STATS = [
  { label: 'Projects Completed', target: 120, suffix: '+' },
  { label: 'Years of Experience', target: 5,   suffix: '+' },
  { label: 'Happy Clients',       target: 80,  suffix: '+' },
];

/**
 * About
 * Studio bio + animated count-up stat counters.
 */
export default function About() {
  const sectionRef = useRef(null);
  const statsRef   = useRef(null);
  const statRefs   = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      STATS.forEach((stat, i) => {
        const el = statRefs.current[i];
        if (!el) return;

        const obj = { val: 0 };

        gsap.to(obj, {
          val: stat.target,
          duration: prefersReduced ? 0.001 : 2,
          ease: 'power2.out',
          onUpdate: () => {
            el.textContent = Math.round(obj.val);
          },
          scrollTrigger: {
            trigger: statsRef.current,
            start: 'top 75%',
            once: true,
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      className="about"
      ref={sectionRef}
      aria-label="About EditingKart"
    >
      {/* Decorative radial gradient background */}
      <div className="about__bg" aria-hidden="true" />

      <div className="about__content">
        {/* Heading */}
        <TextReveal tag="h2" className="about__heading">
          About EditingKart
        </TextReveal>

        {/* Bio paragraph */}
        <TextReveal tag="p" className="about__bio" delay={0.12}>
          {BIO}
        </TextReveal>

        {/* Stat counters */}
        <div ref={statsRef} className="about__stats" aria-label="Studio statistics">
          {STATS.map((stat, i) => (
            <div key={stat.label} className="about__stat">
              <div className="about__stat-number-row">
                <span
                  className="about__stat-number"
                  ref={(el) => { statRefs.current[i] = el; }}
                  aria-label={`${stat.target}${stat.suffix}`}
                >
                  0
                </span>
                <span className="about__stat-suffix" aria-hidden="true">
                  {stat.suffix}
                </span>
              </div>
              <p className="about__stat-label">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
