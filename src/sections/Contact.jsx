import { useRef } from 'react';
import TextReveal from '../components/TextReveal';
import './Contact.css';

/* ── Inline SVG icons (lucide-react v1 doesn't ship Instagram/Youtube/Behance) ── */
function InstagramIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function YoutubeIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
      <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" stroke="none" />
    </svg>
  );
}

function BehanceIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M1 6h8.5C11.4 6 13 7.3 13 9.3c0 1.2-.6 2.2-1.6 2.7 1.4.4 2.3 1.5 2.3 3 0 2.2-1.8 3.5-4 3.5H1V6z" />
      <path d="M1 12h7.5" />
      <path d="M15 10h8" />
      <path d="M23 14h-8c0 1.7 1.3 2.8 3 2.8 1 0 2-.4 2.5-1.3" />
      <path d="M15 14c0-2.2 1.8-4 4-4s4 1.8 4 4" />
      <path d="M16 6h5" />
    </svg>
  );
}

/**
 * Contact
 * Final section with CTA heading, email link, social icons, and footer.
 */
export default function Contact() {
  const sectionRef = useRef(null);

  return (
    <section
      id="contact"
      className="contact"
      ref={sectionRef}
      aria-label="Contact EditingKart"
    >
      {/* Radial gradient top decoration */}
      <div className="contact__bg" aria-hidden="true" />

      <div className="contact__content">
        {/* Large CTA heading */}
        <TextReveal tag="h2" className="contact__heading">
          Let&rsquo;s Create
        </TextReveal>
        <TextReveal tag="h2" className="contact__heading contact__heading--accent" delay={0.12}>
          Something Great
        </TextReveal>

        {/* Email link */}
        <a
          href="mailto:hello@editingkart.com"
          className="contact__email"
          data-cursor="hover"
          aria-label="Email us at hello@editingkart.com"
        >
          hello@editingkart.com
        </a>

        {/* Social links */}
        <nav className="contact__socials" aria-label="Social media links">
          <a
            href="https://instagram.com/editingkart"
            className="contact__social-link"
            data-cursor="hover"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="EditingKart on Instagram"
          >
          <InstagramIcon size={20} />
          </a>
          <a
            href="https://youtube.com/@editingkart"
            className="contact__social-link"
            data-cursor="hover"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="EditingKart on YouTube"
          >
          <YoutubeIcon size={20} />
          </a>
          <a
            href="https://behance.net/editingkart"
            className="contact__social-link"
            data-cursor="hover"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="EditingKart on Behance"
          >
          <BehanceIcon size={20} />
          </a>
        </nav>
      </div>

      {/* Footer line */}
      <footer className="contact__footer">
        <p>© 2025 EditingKart. All rights reserved.</p>
      </footer>
    </section>
  );
}
