import { useEffect, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SERVICES } from '../data/services';
import './Services.css';

gsap.registerPlugin(ScrollTrigger);

export default function Services() {
  const sectionRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const rows = listRef.current?.querySelectorAll('.services__item');
      if (!rows?.length) return;

      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      gsap.from(rows, {
        opacity: 0,
        y: prefersReduced ? 0 : 36,
        duration: prefersReduced ? 0.001 : 0.85,
        stagger: prefersReduced ? 0 : 0.07,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: listRef.current,
          start: 'top 82%',
          once: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="services" ref={sectionRef} className="services" aria-label="EditingKart services">
      <div className="services__intro">
        <span className="services__eyebrow">Services</span>
        <h2 className="services__heading">Choose a craft lane</h2>
        <p className="services__copy">
          Each lane has its own page, scene, process, and visual mood so the work feels tailored from the first click.
        </p>
      </div>

      <div ref={listRef} className="services__list">
        {SERVICES.map((service, index) => (
          <a
            key={service.slug}
            href={`/services/${service.slug}`}
            className={`services__item services__item--${service.variant}`}
            style={{
              '--service-accent': service.accent,
              '--service-secondary': service.secondary,
            }}
            data-cursor="hover"
          >
            <span className="services__number">{String(index + 1).padStart(2, '0')}</span>
            <span className="services__name">{service.label}</span>
            <span className="services__tagline">{service.tagline}</span>
            <span className="services__signal" aria-hidden="true" />
            <span className="services__arrow" aria-hidden="true">
              <ArrowUpRight size={20} />
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
