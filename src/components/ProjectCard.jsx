import { useRef, useEffect } from 'react';
import { ArrowUpRight } from 'lucide-react';
import cx from 'classnames';
import './ProjectCard.css';

/**
 * ProjectCard
 * Reusable project card with:
 *  - Static thumbnail (image or gradient placeholder)
 *  - Hover video crossfade on desktop (preload="none" for performance)
 *  - CSS scale-up on hover
 *  - Arrow icon reveals on hover
 *
 * Props:
 *  - title     — project title
 *  - category  — tag label, e.g. "Brand Film"
 *  - year      — e.g. "2024"
 *  - thumb     — thumbnail img src; empty → gradient placeholder
 *  - videoSrc  — hover preview video; empty → no video hover
 *  - href      — destination link (default "#")
 *  - index     — card index (used by parent for stagger reference)
 */
export default function ProjectCard({
  title,
  category,
  year,
  thumb = '',
  videoSrc = '',
  href = '#',
  index = 0,
}) {
  const cardRef  = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const card  = cardRef.current;
    const video = videoRef.current;
    if (!card || !video) return;

    // Only wire hover video on desktop
    const mq = window.matchMedia('(max-width: 768px)');
    if (mq.matches) return;

    function onEnter() {
      video.load();                         // begin network fetch on first hover
      video.play().catch(() => {});         // swallow autoplay policy rejections
      video.style.opacity = '1';
    }

    function onLeave() {
      video.style.opacity = '0';
      // Pause after CSS fade transition completes (400ms + buffer)
      setTimeout(() => {
        if (video.style.opacity === '0') video.pause();
      }, 420);
    }

    card.addEventListener('mouseenter', onEnter);
    card.addEventListener('mouseleave', onLeave);
    return () => {
      card.removeEventListener('mouseenter', onEnter);
      card.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <a
      ref={cardRef}
      href={href}
      className="project-card"
      data-cursor="hover"
      aria-label={`${title} — ${category} project`}
    >
      {/* Media area */}
      <div className="project-card__media">
        {/* Gradient placeholder — always rendered, hidden when real thumb exists */}
        <div
          className={cx('project-card__placeholder', { 'project-card__placeholder--hidden': !!thumb })}
          aria-hidden="true"
        >
          <span className="project-card__placeholder-title">{title}</span>
        </div>

        {/* Thumbnail image */}
        {thumb && (
          <img
            className="project-card__thumb"
            src={thumb}
            alt={`${title} project thumbnail`}
          />
        )}

        {/* Video layer — desktop hover preview */}
        {videoSrc && (
          <video
            ref={videoRef}
            className="project-card__video"
            src={videoSrc}
            muted
            loop
            playsInline
            preload="none"
            aria-hidden="true"
          />
        )}

        {/* Arrow icon — reveals on hover via CSS */}
        <span className="project-card__arrow" aria-hidden="true">
          <ArrowUpRight size={18} />
        </span>
      </div>

      {/* Info area */}
      <div className="project-card__info">
        <span className="project-card__category">{category}</span>
        <h3 className="project-card__title">{title}</h3>
        <span className="project-card__year">{year}</span>
      </div>
    </a>
  );
}
