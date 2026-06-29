import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './VideoStory.css';

gsap.registerPlugin(ScrollTrigger);

/**
 * VideoStory
 * Scroll-driven video expansion + video scrubbing.
 *
 * Starting state  : small window, left-aligned, vertically centered
 * Ending state    : full-screen (100vw × 100vh), border-radius → 0
 * Video playback  : scrubbed forward/backward with scroll position
 *
 * Props:
 *  - src        — video file path; empty string → placeholder mode
 *  - poster     — poster image src (optional)
 *  - scrollRef  — ref to the outer scroll container (ScrollTrigger trigger)
 *  - onProgress — optional callback(0–1) each scrub tick
 *  - className  — extra class on wrapper div
 *  - ariaLabel  — accessible label on wrapper
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
    const video = videoRef.current;
    const isMobile = window.matchMedia('(max-width: 768px)').matches;

    // ── Calculate pixel start positions so GSAP has no CSS transform conflict ──
    // We position the frame using absolute pixel coords derived from viewport size.
    // This avoids mixing CSS `transform: translateY(-50%)` with GSAP `top` tweens.

    function getStartVars() {
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      if (isMobile) {
        // Mobile: 90vw wide, centered
        const w = vw * 0.9;
        const h = vh * 0.5;
        return {
          width:  w,
          height: h,
          left:   (vw - w) / 2,
          top:    (vh - h) / 2,
          borderRadius: 12,
        };
      }

      // Desktop: 40vw wide, left-aligned, vertically centered
      const w = vw * 0.40;
      const h = vh * 0.62;
      return {
        width:  w,
        height: h,
        left:   vw * 0.08,
        top:    (vh - h) / 2,
        borderRadius: 12,
      };
    }

    const startVars = getStartVars();

    // Remove CSS class centering — use inline pixels instead
    frame.style.transform = 'none';
    gsap.set(frame, startVars);

    // ── Video scrubbing ──────────────────────────────────────────────────────
    let videoReady = false;

    function scrubVideo(progress) {
      if (!video || !videoReady) return;
      const targetTime = progress * (video.duration - 0.05);
      // Only seek if the difference is meaningful (avoids jitter)
      if (Math.abs(video.currentTime - targetTime) > 0.02) {
        video.currentTime = targetTime;
      }
    }

    if (video && src) {
      video.pause();
      video.currentTime = 0;
      video.preload = 'auto';

      function onMetadata() {
        videoReady = true;
        ScrollTrigger.refresh();
      }

      if (video.readyState >= 1) {
        videoReady = true;
      } else {
        video.addEventListener('loadedmetadata', onMetadata, { once: true });
      }
      video.load();
    }

    // ── GSAP ScrollTrigger expansion ─────────────────────────────────────────
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: scrollRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: prefersReduced ? false : 1.2,
          onUpdate(self) {
            scrubVideo(self.progress);
            onProgress?.(self.progress);
          },
        },
      });

      // Animate from start vars → full viewport
      tl.to(frame, {
        width:        vw,
        height:       vh,
        left:         0,
        top:          0,
        borderRadius: 0,
        ease: 'none',
        duration: 1,
      });
    }, wrapperRef);

    // ── Resize: recalculate start position ───────────────────────────────────
    function onResize() {
      const s = getStartVars();
      // Only reset if not expanded (ScrollTrigger progress < 0.05)
      const st = ScrollTrigger.getAll().find(t => t.trigger === scrollRef.current);
      if (!st || st.progress < 0.05) {
        frame.style.transform = 'none';
        gsap.set(frame, s);
      }
    }
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      ctx.revert();
    };
  }, [scrollRef, onProgress, src]);

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
            muted
            playsInline
            preload="auto"
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
