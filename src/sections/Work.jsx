import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Work.css';

gsap.registerPlugin(ScrollTrigger);

const FEATURED_VIDEO = {
  id: '4vm0QR8v9zY',
  title: 'Featured Edit',
  category: 'Signature Cut',
  description: 'A widescreen hero placement for the strongest long-form piece in the collection.',
};

const PROJECTS = [
  {
    id: 'n5K5fgYkSeY',
    title: 'Brand Momentum',
    category: 'Commercial Edit',
    description: 'Pacing, transitions, and sound-led storytelling for campaigns that need instant clarity.',
  },
  {
    id: 'R-_4bBhn618',
    title: 'Social Energy',
    category: 'Promo Film',
    description: 'A sharp visual rhythm built for attention, retention, and repeat viewing.',
  },
  {
    id: 'gRsFFZuOyFo',
    title: 'Motion Story',
    category: 'Motion Graphics',
    description: 'Graphic movement, structure, and polish shaped around the message.',
  },
  {
    id: 'nlW-jTL4qO0',
    title: 'Visual Finish',
    category: 'Edit + Grade',
    description: 'Clean sequencing and final polish for work that needs to feel premium.',
  },
];

const SHORTS = [
  {
    id: 'm1fF3Zp-NK0',
    title: 'Reel Cut 01',
    category: 'Short-form',
  },
  {
    id: 'cpkShIh0VUg',
    title: 'Reel Cut 02',
    category: 'Short-form',
  },
];

function youtubeEmbed(id) {
  return `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1&playsinline=1`;
}

function YouTubeFrame({ id, title, orientation = 'landscape' }) {
  return (
    <div className={`work__video-frame work__video-frame--${orientation}`}>
      <iframe
        src={youtubeEmbed(id)}
        title={title}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  );
}

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
      const cards = sectionRef.current?.querySelectorAll('.work__featured, .work-video-card, .work-short-card');
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
        immediateRender: false,
        scrollTrigger: {
          trigger: sectionRef.current,
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
          Long-form edits, campaign films, motion pieces, and vertical reels placed in their natural formats.
        </p>
      </div>

      <article className="work__featured" aria-label={`${FEATURED_VIDEO.title} featured video`}>
        <div className="work__featured-copy">
          <span className="work__eyebrow">{FEATURED_VIDEO.category}</span>
          <h3>{FEATURED_VIDEO.title}</h3>
          <p>{FEATURED_VIDEO.description}</p>
        </div>
        <YouTubeFrame id={FEATURED_VIDEO.id} title={FEATURED_VIDEO.title} />
      </article>

      <div ref={gridRef} className="work__grid">
        {PROJECTS.map((project) => (
          <article key={project.id} className="work-video-card">
            <YouTubeFrame id={project.id} title={project.title} />
            <div className="work-video-card__copy">
              <span className="work__eyebrow">{project.category}</span>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="work__shorts" aria-label="Vertical reel edits">
        <div className="work__shorts-copy">
          <span className="work__eyebrow">Reels</span>
          <h3>Built for vertical attention</h3>
          <p>
            Quick cuts get their own space, sized like the platforms they are made for.
          </p>
        </div>
        <div className="work__shorts-grid">
          {SHORTS.map((short) => (
            <article key={short.id} className="work-short-card">
              <YouTubeFrame id={short.id} title={short.title} orientation="short" />
              <div className="work-short-card__meta">
                <span>{short.category}</span>
                <strong>{short.title}</strong>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
