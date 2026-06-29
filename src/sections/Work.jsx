import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ProjectCard from '../components/ProjectCard';
import './Work.css';

gsap.registerPlugin(ScrollTrigger);

const PROJECTS = [
  {
    id: 'p1',
    title: 'Brand Story',
    category: 'Brand Film',
    year: '2024',
    thumb: '',
    videoSrc: '',
    href: '#',
  },
  {
    id: 'p2',
    title: 'Product Launch',
    category: 'Motion Graphics',
    year: '2024',
    thumb: '',
    videoSrc: '',
    href: '#',
  },
  {
    id: 'p3',
    title: 'Fashion Reel',
    category: 'Color Grade',
    year: '2023',
    thumb: '',
    videoSrc: '',
    href: '#',
  },
  {
    id: 'p4',
    title: 'Event Recap',
    category: 'Event Film',
    year: '2023',
    thumb: '',
    videoSrc: '',
    href: '#',
  },
  {
    id: 'p5',
    title: 'Lyric Video',
    category: 'Music Video',
    year: '2023',
    thumb: '',
    videoSrc: '',
    href: '#',
  },
  {
    id: 'p6',
    title: 'Social Campaign',
    category: 'Social Media',
    year: '2022',
    thumb: '',
    videoSrc: '',
    href: '#',
  },
];

/**
 * Work
 * Featured projects grid with staggered GSAP entrance animation.
 */
export default function Work() {
  const sectionRef = useRef(null);
  const headerRef  = useRef(null);
  const gridRef    = useRef(null);

  useEffect(() => {
    let headerObserver;

    const ctx = gsap.context(() => {
      const headerItems = headerRef.current?.querySelectorAll('.work__reveal');
      const cards = gridRef.current?.querySelectorAll('.project-card');
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (headerItems?.length) {
        gsap.set(headerItems, { opacity: 0, y: 42 });

        const revealHeader = () => {
          gsap.to(headerItems, {
            opacity: 1,
            y: 0,
            duration: prefersReduced ? 0.001 : 0.9,
            stagger: prefersReduced ? 0 : 0.12,
            ease: 'power3.out',
          });
        };

        if (prefersReduced || !('IntersectionObserver' in window)) {
          revealHeader();
        } else {
          headerObserver = new IntersectionObserver(
            ([entry]) => {
              if (!entry.isIntersecting) return;
              revealHeader();
              headerObserver?.disconnect();
            },
            { threshold: 0.35 },
          );

          headerObserver.observe(headerRef.current);
        }
      }

      if (!cards?.length) return;

      gsap.from(cards, {
        opacity: 0,
        y: 40,
        duration: prefersReduced ? 0.001 : 0.8,
        stagger: prefersReduced ? 0 : 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: gridRef.current,
          start: 'top 80%',
          once: true,
        },
      });

      requestAnimationFrame(() => ScrollTrigger.refresh());
    }, sectionRef);

    return () => {
      headerObserver?.disconnect();
      ctx.revert();
    };
  }, []);

  return (
    <section
      id="work"
      className="work"
      ref={sectionRef}
      aria-label="Selected work"
    >
      <div ref={headerRef} className="work__header">
        <h2 className="work__heading work__reveal">
          Selected Work
        </h2>
        <p className="work__subheading work__reveal">
          A selection of projects across brand film, motion graphics, and color.
        </p>
      </div>

      <div ref={gridRef} className="work__grid">
        {PROJECTS.map((project, i) => (
          <ProjectCard key={project.id} {...project} index={i} />
        ))}
      </div>
    </section>
  );
}
