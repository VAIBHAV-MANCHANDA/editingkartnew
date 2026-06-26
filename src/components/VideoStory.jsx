import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './VideoStory.css';

gsap.registerPlugin(ScrollTrigger);

/**
 * VideoStory
 * Scroll-driven video expansion component.
 * Animates from a small left-aligned window → fullscreen as the user scrolls
 * through the parent 300vh container.
 *
 * Props:
 *  - src        — video file path; empty string → placeholder mode
 *  - poster     — poster image src (optional)
 *  - scrollRef  — ref to the outer 300vh scroll container (ScrollTrigger trigger)
 *  - onProgress — callback(0–1) called each scrub tick
 *  - className  — extra class on wrapper div
 *  - ariaLabel  — accessible label on wrapper (default "Showreel video")
 */
export default function VideoStory({
  src = '',
  poster = '',
  scrollRef,
  onProgress,
  className = '',
  ariaLabel = 'Showreel video',
}) {
  const wrapperRef = useRef(null);
  const frameRef   = useRef(null);
  const videoRef   = useRef(null);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame || !scrollRef?.current) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: scrollRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: prefersReduced ? false : 1.5,
          onUpdate: (self) => onProgress?.(self.progress),
        },
      });

      tl.to(frame, {
        width: '100vw',
        height: '100vh',
        left: '0vw',
        top: '0',
        xPercent: 0,  // override mobile centering transform
        yPercent: -50, // will be overridden to 0
        borderRadius: 0,
        ease: 'none',
      });
    }, wrapperRef);

    return () => ctx.revert();
  }, [scrollRef, onProgress]);

  return (
    <div
      ref={wrapperRef}
      className={`video-story${className ? ` ${className}` : ''}`}
      aria-label={ariaLabel}
    >
      <div ref={frameRef} className="video-story__frame">
        {src ? (
          <video
            ref={videoRef}
            className="video-story__video"
            src={src}
            poster={poster || undefined}
            autoPlay
            muted
            loop
            playsInline
            aria-hidden="true"
          />
        ) : (
          <div className="video-story__placeholder" aria-hidden="true">
            <span className="video-story__placeholder-label">Showreel Coming Soon</span>
          </div>
        )}
      </div>
    </div>
  );
}
