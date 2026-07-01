import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import reelVideo from '../assets/videos/scrollingVideo.mp4';
import './Reel.css';

gsap.registerPlugin(ScrollTrigger);

/**
 * Reel - Full-screen looping showreel.
 */
export default function Reel() {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const overlayRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    const overlay = overlayRef.current;

    if (!section || !video) return;

    video.defaultMuted = true;
    video.muted = true;
    video.loop = true;

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

      if (overlay) {
        gsap.fromTo(
          overlay,
          { opacity: 0, y: 18 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 65%',
              once: true,
            },
          },
        );
      }
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

        <div
          ref={overlayRef}
          className="reel__caption"
        >
          <span>Watch</span>
          <p>EditingKart Showreel</p>
        </div>
      </div>
    </section>
  );
}
