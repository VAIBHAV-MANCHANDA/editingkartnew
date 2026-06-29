import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import reelVideo from '../assets/videos/scrollingVideo.mp4';
import './Reel.css';

gsap.registerPlugin(ScrollTrigger);

/**
 * Reel - Lusion-style scroll-driven video expansion.
 *
 * The video covers the sticky viewport and starts inside a clipped left-side
 * window. Scrolling expands the clip-path to full screen, while the video keeps
 * playing on a natural loop instead of being scrubbed by scroll progress.
 */
export default function Reel() {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const labelRef = useRef(null);
  const overlayRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    const label = labelRef.current;
    const overlay = overlayRef.current;

    if (!section || !video) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const startClip = 'inset(20% 50% 20% 8% round 12px)';
    const endClip = 'inset(0% 0% 0% 0% round 0px)';

    video.defaultMuted = true;
    video.muted = true;
    video.loop = true;
    gsap.set(video, { clipPath: startClip });

    function isSectionVisible() {
      const rect = section.getBoundingClientRect();
      return rect.bottom > 0 && rect.top < window.innerHeight;
    }

    function playVideo() {
      video.play().catch(() => {});
    }

    function pauseVideo() {
      video.pause();
    }

    function syncVideoPlayback() {
      if (isSectionVisible()) {
        playVideo();
      } else {
        pauseVideo();
      }
    }

    const ctx = gsap.context(() => {
      const playbackTrigger = ScrollTrigger.create({
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        onEnter: playVideo,
        onEnterBack: playVideo,
        onLeave: pauseVideo,
        onLeaveBack: pauseVideo,
        onRefresh: syncVideoPlayback,
      });

      if (playbackTrigger.isActive) {
        playVideo();
      }

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom bottom',
          scrub: prefersReduced ? false : 1.5,
          onUpdate(self) {
            const progress = self.progress;

            if (label) {
              label.style.opacity = String(Math.max(0, 1 - progress / 0.2));
            }

            if (overlay) {
              overlay.style.opacity = String(Math.max(0, (progress - 0.7) / 0.3));
            }
          },
        },
      });

      timeline.to(video, {
        clipPath: endClip,
        ease: 'none',
        duration: 1,
      });
    }, section);

    const syncFrame = requestAnimationFrame(syncVideoPlayback);
    const syncTimer = window.setTimeout(syncVideoPlayback, 250);

    return () => {
      cancelAnimationFrame(syncFrame);
      window.clearTimeout(syncTimer);
      pauseVideo();
      ctx.revert();
    };
  }, []);

  return (
    <section
      id="reel"
      ref={sectionRef}
      className="reel"
      aria-label="Our showreel"
    >
      <div className="reel__sticky">
        <video
          ref={videoRef}
          className="reel__video"
          src={reelVideo}
          muted
          loop
          autoPlay
          playsInline
          preload="auto"
          aria-label="EditingKart showreel"
        />

        <div ref={labelRef} className="reel__label">
          <span className="reel__label-eyebrow">Watch</span>
          <p className="reel__label-title">Our Reel</p>
        </div>

        <div
          ref={overlayRef}
          className="reel__overlay-text"
          style={{ opacity: 0 }}
          aria-hidden="true"
        >
          EditingKart - 2025 Showreel
        </div>
      </div>
    </section>
  );
}
