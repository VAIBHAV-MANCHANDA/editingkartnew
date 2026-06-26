import { useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import VideoStory from '../components/VideoStory';
import './Reel.css';

// Replace with real path when showreel asset is available, e.g.:
// import reelVideo from '../assets/videos/showreel.mp4';
const VIDEO_SRC = '';

/**
 * Reel
 * 300vh scroll-driven section where a small video window expands to fullscreen.
 * - Text "Our Reel" fades out as expansion begins
 * - "EditingKart — 2025 Showreel" overlay fades in at 60% scroll progress
 */
export default function Reel() {
  const outerRef      = useRef(null);
  const labelRef      = useRef(null);
  const overlayRef    = useRef(null);

  // onProgress drives the text overlays without extra ScrollTriggers
  const handleProgress = useCallback((p) => {
    if (labelRef.current) {
      const fade = Math.max(0, 1 - p / 0.15);
      gsap.set(labelRef.current, { opacity: fade });
    }
    if (overlayRef.current) {
      const fadeFactor = Math.max(0, (p - 0.6) / 0.4);
      gsap.set(overlayRef.current, { opacity: fadeFactor });
    }
  }, []);

  return (
    <section
      id="reel"
      className="reel"
      ref={outerRef}
      aria-label="Our showreel"
    >
      {/* Inner sticky viewport — stays in view during 300vh scroll travel */}
      <div className="reel__sticky">

        {/* Video (or placeholder) — fills sticky container, animated by VideoStory */}
        <VideoStory
          src={VIDEO_SRC}
          scrollRef={outerRef}
          onProgress={handleProgress}
          ariaLabel="EditingKart showreel video"
        />

        {/* "Our Reel" label — fades out as video starts expanding */}
        <div ref={labelRef} className="reel__label" aria-hidden="true">
          <span className="reel__label-eyebrow">Watch</span>
          <p className="reel__label-title">Our Reel</p>
        </div>

        {/* "EditingKart — 2025 Showreel" overlay — fades in at 60% */}
        <div
          ref={overlayRef}
          className="reel__overlay-text"
          style={{ opacity: 0 }}
          aria-hidden="true"
        >
          EditingKart — 2025 Showreel
        </div>

      </div>
    </section>
  );
}
