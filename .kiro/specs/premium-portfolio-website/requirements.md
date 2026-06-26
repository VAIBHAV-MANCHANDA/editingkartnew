# Requirements Document

## Introduction

EditingKart is a premium video editing and motion design studio. This feature defines the complete requirements for building their portfolio website — a dark, motion-rich, single-page application inspired by the aesthetic of high-end creative agency sites (e.g., Lusion.co), but distinct in identity.

The site is built with Vite + React using Three.js (via React Three Fiber), GSAP, Lenis, and Framer Motion. It must communicate craft, precision, and creativity through every scroll, animation, and interaction.

The implementation follows a section-by-section approach, beginning with the Hero section and progressing through all sections to a fully integrated, responsive site.

---

## Glossary

- **Site**: The complete EditingKart single-page portfolio website.
- **Preloader**: The full-screen animated loading screen shown on first visit before the Site is revealed.
- **Navbar**: The fixed top navigation bar containing the logo, nav links, and CTA button.
- **Hero**: The first full-viewport section visible after the Preloader dismisses.
- **Hero3D**: The React Three Fiber canvas component rendering the interactive 3D object inside the Hero.
- **Reel_Section**: The scroll-driven video expansion section ("Our Reel").
- **Work_Section**: The featured projects grid section.
- **About_Section**: The studio biography and animated statistics section.
- **Contact_Section**: The final contact call-to-action section.
- **TextReveal**: The reusable animated text component that reveals lines via a masked slide-up effect.
- **CustomCursor**: The custom cursor component rendered as a dot and a trailing ring on desktop viewports.
- **SmoothScroll**: The globally integrated Lenis smooth-scroll instance synced with GSAP ScrollTrigger.
- **ScrollTrigger**: GSAP's scroll-based animation plugin, configured to use the Lenis scroll position.
- **Viewport**: The visible browser window area.
- **Breakpoint_Mobile**: Screen widths ≤ 768 px.
- **Breakpoint_Desktop**: Screen widths > 768 px.
- **Accent_Color**: Electric purple `#9b5de5` used for highlights, CTAs, and decorative elements.
- **Brand_Black**: Near-black background color `#0a0a0a`.
- **Display_Font**: A large-scale serif or editorial typeface used for headings (e.g., Playfair Display or similar).
- **UI_Font**: A clean sans-serif typeface used for body text, labels, and navigation (e.g., Inter or system-ui).

---

## Requirements

---

### Requirement 1: Global CSS Reset and Design System

**User Story:** As a developer, I want a global CSS foundation that enforces the dark creative style system, so that all sections share a consistent visual language from the start.

#### Acceptance Criteria

1. THE Site SHALL use `#0a0a0a` as the `background-color` of the `body` and `#root` elements.
2. THE Site SHALL remove all default margin and padding from the `body` element and set `box-sizing: border-box` globally.
3. THE Site SHALL define CSS custom properties for `--brand-black`, `--accent`, `--text-primary`, `--text-secondary`, `--display-font`, and `--ui-font` on the `:root` selector.
4. THE Site SHALL set `overflow-x: hidden` on the `html` and `body` elements to prevent horizontal scroll.
5. THE Site SHALL apply `-webkit-font-smoothing: antialiased` globally.
6. THE Site SHALL NOT use the existing light/dark `prefers-color-scheme` media query; the design is always dark.
7. THE `#root` element SHALL occupy `100%` width with no `max-width` constraint or centered margin, so full-bleed sections are possible.

---

### Requirement 2: Smooth Scroll Integration

**User Story:** As a visitor, I want buttery-smooth scroll behavior throughout the site, so that navigation feels premium and cinematic.

#### Acceptance Criteria

1. THE SmoothScroll SHALL be initialized via Lenis in `main.jsx` or a top-level `App.jsx` `useEffect` with a `lerp` value of `0.08` and `duration` of `1.2`.
2. WHEN SmoothScroll is initialized, THE SmoothScroll SHALL register its `raf` callback with GSAP's `Ticker` so that ScrollTrigger animations stay in sync with the Lenis scroll position.
3. THE SmoothScroll SHALL call `lenis.raf(time)` inside the GSAP ticker callback on every frame.
4. WHEN the component that initialized SmoothScroll unmounts, THE SmoothScroll SHALL destroy the Lenis instance and remove the GSAP ticker callback to prevent memory leaks.
5. THE SmoothScroll SHALL be configured with `smoothWheel: true`.

---

### Requirement 3: Preloader

**User Story:** As a visitor, I want to see an animated loading screen on first visit, so that the site makes a strong first impression before the main content is revealed.

#### Acceptance Criteria

1. WHEN the Site first loads, THE Preloader SHALL cover the full Viewport with `position: fixed`, `z-index: 9999`, and `background: #0a0a0a`.
2. THE Preloader SHALL display an animated percentage counter that increments from `0` to `100` over a duration of approximately 2 seconds using a GSAP tween.
3. WHEN the counter reaches `100`, THE Preloader SHALL animate out by sliding upward (translateY from 0 to -100%) over 800 ms using a GSAP ease of `power3.inOut`.
4. WHEN the Preloader animation completes, THE Preloader SHALL be unmounted from the DOM or set to `display: none`.
5. WHEN the Preloader animation completes, THE Hero SHALL become visible and its entrance animations SHALL begin.
6. THE Preloader SHALL display the "EditingKart" wordmark centered on screen during the loading sequence.
7. IF the user has already visited the site in the same browser session, THEN THE Preloader SHALL skip its animation and immediately reveal the Site (using `sessionStorage` to track this).

---

### Requirement 4: Navbar

**User Story:** As a visitor, I want a minimal fixed navigation bar, so that I can access any section of the site at any time without losing context.

#### Acceptance Criteria

1. THE Navbar SHALL be `position: fixed` at the top of the Viewport with `z-index: 100` and full width.
2. THE Navbar SHALL contain the "EditingKart" logo/wordmark on the left, navigation links ("Work", "About", "Contact") in the center or right, and a "Get in Touch" CTA button on the far right.
3. WHEN the user scrolls down more than 80 px from the top, THE Navbar SHALL hide by animating `translateY(-100%)` over 300 ms.
4. WHEN the user scrolls back up (scroll direction reverses to upward), THE Navbar SHALL reappear by animating `translateY(0)` over 300 ms.
5. THE Navbar SHALL start fully transparent (`background: transparent`) and transition to a semi-transparent dark background (`background: rgba(10, 10, 10, 0.85)` with `backdrop-filter: blur(12px)`) after the user scrolls more than 20 px.
6. WHILE the Viewport width is at Breakpoint_Mobile, THE Navbar SHALL replace the desktop nav links with a hamburger icon button.
7. WHEN the hamburger icon is tapped on Breakpoint_Mobile, THE Navbar SHALL display a full-screen overlay menu with all navigation links and the CTA button.
8. WHEN a navigation link inside the mobile overlay is tapped, THE Navbar SHALL close the overlay and scroll to the corresponding section.
9. THE "Get in Touch" CTA button SHALL have a border in Accent_Color and animate with a background fill on hover.

---

### Requirement 5: Hero Section

**User Story:** As a visitor, I want to see a dramatic dark hero section with a 3D object and animated text on first view, so that I immediately understand the studio's premium quality.

#### Acceptance Criteria

1. THE Hero SHALL occupy 100 viewport height (`100vh`) with `background: #0a0a0a`.
2. THE Hero SHALL render the Hero3D component as a full-bleed canvas that fills the entire Hero section area.
3. THE Hero SHALL overlay editorial typography on top of the Hero3D canvas using absolute positioning.
4. THE Hero SHALL display the following copy hierarchy: a small eyebrow label ("Motion Design Studio"), a large display heading split into two lines ("We Tell Stories / Through Motion"), and a subtitle line ("Video Editing · Color Grading · Motion Graphics").
5. WHEN the Hero enters the Viewport after the Preloader completes, THE TextReveal component SHALL animate each line of the heading with a masked slide-up reveal, staggered by 120 ms per line.
6. THE Hero SHALL display a scroll indicator at the bottom center (animated bouncing arrow or "Scroll" label with a line) that fades out once the user scrolls past 100 px.
7. THE Hero SHALL position a decorative tag or label element near the 3D canvas indicating "© 2025 EditingKart".

---

### Requirement 6: Hero 3D Object

**User Story:** As a visitor, I want to see an interactive 3D object in the hero, so that the site feels alive and technologically impressive.

#### Acceptance Criteria

1. THE Hero3D SHALL render a React Three Fiber `<Canvas>` that fills its parent container with `style={{ position: 'absolute', inset: 0 }}`.
2. THE Hero3D SHALL render a `TorusKnotGeometry` (or parametric mesh) as the primary 3D object with a custom `MeshStandardMaterial` using a dark metallic finish (color `#1a1a2e`, roughness `0.2`, metalness `0.8`).
3. WHEN the user moves the mouse over the Hero, THE Hero3D SHALL smoothly rotate the 3D object toward the cursor direction using linear interpolation (`lerp`) with a factor of `0.05` per frame, creating a parallax-like tracking effect.
4. THE Hero3D SHALL animate the 3D object with a slow continuous auto-rotation on the Y-axis at `0.003` radians per frame when no mouse interaction is occurring.
5. THE Hero3D SHALL add two `PointLight` sources — one in Accent_Color (`#9b5de5`) and one warm white (`#ffffff`) — positioned on opposite sides of the 3D object.
6. THE Hero3D SHALL use React Three Fiber's `useFrame` hook to drive all per-frame animations.
7. THE Hero3D SHALL include an ambient light with intensity `0.3` to avoid fully dark surfaces.
8. WHEN the Hero3D canvas is rendered on Breakpoint_Mobile, THE Hero3D SHALL reduce the 3D object scale to `0.65` to fit the smaller viewport.

---

### Requirement 7: TextReveal Component

**User Story:** As a developer, I want a reusable TextReveal component, so that I can apply consistent masked text reveal animations across all sections.

#### Acceptance Criteria

1. THE TextReveal SHALL accept `children`, `className`, `delay` (in seconds, default `0`), and `tag` (HTML element name, default `"div"`) as props.
2. THE TextReveal SHALL wrap its children in a `div` with `overflow: hidden` to create the mask effect.
3. WHEN TextReveal enters the Viewport, THE TextReveal SHALL animate its children from `translateY(100%)` to `translateY(0)` over `0.9s` using a GSAP tween with ease `power3.out`.
4. THE TextReveal SHALL use a GSAP ScrollTrigger with `start: "top 85%"` so the animation triggers before the element is fully visible.
5. THE TextReveal SHALL respect the `delay` prop by adding it to the GSAP tween's delay.
6. WHEN TextReveal is used multiple times in a staggered group, THE TextReveal SHALL support a `stagger` prop (in seconds) that offsets each line's animation start time.

---

### Requirement 8: Reel Section (Scroll-driven Video Expansion)

**User Story:** As a visitor, I want to see the studio's showreel expand dramatically as I scroll, so that the video reveal feels like a cinematic event.

#### Acceptance Criteria

1. THE Reel_Section SHALL have a scroll height of `300vh` to provide sufficient scroll distance for the animation.
2. THE Reel_Section SHALL use `position: sticky` with `top: 0` on its inner container so the visuals remain in the Viewport while the user scrolls through the 300vh.
3. THE Reel_Section SHALL render a video element initially sized at `35vw × 55vh`, horizontally left-aligned with `margin-left: 10vw`.
4. WHEN the user scrolls through the Reel_Section, THE Reel_Section SHALL use a GSAP ScrollTrigger to progressively scale the video element from its initial size to `100vw × 100vh` (full-screen), ending when the scroll progress reaches `1`.
5. THE Reel_Section SHALL simultaneously animate the video's border-radius from `12px` to `0px` as it expands.
6. THE Reel_Section SHALL display a text label ("Our Reel") that fades out as the video begins expanding (at scroll progress `0.15`).
7. THE Reel_Section SHALL display a second text overlay ("EditingKart — 2025 Showreel") that fades in when scroll progress reaches `0.6`.
8. THE video element SHALL have `autoPlay`, `muted`, `loop`, and `playsInline` attributes set.
9. IF no showreel video file is available in `src/assets/videos/`, THEN THE Reel_Section SHALL display a dark gradient placeholder with the label "Showreel Coming Soon" at the same dimensions.
10. THE Reel_Section ScrollTrigger SHALL use `scrub: 1.5` for smooth, lag-compensated animation tied to scroll position.

---

### Requirement 9: Work Section (Featured Projects)

**User Story:** As a visitor, I want to browse EditingKart's featured projects in an engaging grid, so that I can evaluate the studio's range and quality.

#### Acceptance Criteria

1. THE Work_Section SHALL display a minimum of 3 and maximum of 6 project cards in a responsive grid layout.
2. THE Work_Section SHALL display a section heading ("Selected Work") animated with TextReveal when the section enters the Viewport.
3. EACH project card SHALL display a project thumbnail (image), project title, category tag (e.g., "Brand Film", "Motion Graphics"), and year.
4. WHEN the user hovers over a project card on Breakpoint_Desktop, THE project card SHALL reveal a video preview by transitioning the thumbnail image to a looping video clip using a smooth crossfade over `0.4s`.
5. WHEN the user hovers over a project card on Breakpoint_Desktop, THE project card SHALL scale up by `1.04` with a smooth transition of `0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)`.
6. THE Work_Section SHALL animate its project cards into view using a GSAP ScrollTrigger stagger, with each card fading in and translating upward from `40px` to `0`, staggered by `0.1s`.
7. EACH project card SHALL include an arrow icon link that becomes visible on hover, indicating the card is clickable.
8. WHERE placeholder content is used (no real project assets), THE project card SHALL display a dark gradient rectangle as the thumbnail with the project title overlaid.

---

### Requirement 10: About Section

**User Story:** As a visitor, I want to learn about the EditingKart studio and see key statistics, so that I can build trust in their expertise.

#### Acceptance Criteria

1. THE About_Section SHALL display the studio name, a two-to-three sentence bio paragraph, and three animated stat counters.
2. THE About_Section SHALL display the following stat counters: "Projects Completed" (target value `120+`), "Years of Experience" (target value `5+`), and "Happy Clients" (target value `80+`).
3. WHEN the About_Section enters the Viewport, THE About_Section SHALL animate each stat counter by counting up from `0` to its target value over `2s` using a GSAP tween with ease `power2.out`.
4. THE About_Section SHALL animate the bio paragraph text into view using TextReveal when the section enters the Viewport.
5. THE About_Section SHALL display an artistic full-bleed background element (e.g., a large subtle grain texture or radial gradient in Accent_Color at `5%` opacity) to add depth.

---

### Requirement 11: Contact Section

**User Story:** As a visitor who is ready to hire EditingKart, I want a clear and beautiful contact area at the bottom of the page, so that reaching out feels easy and inviting.

#### Acceptance Criteria

1. THE Contact_Section SHALL display a large display-font heading ("Let's Create Something Great") animated with TextReveal.
2. THE Contact_Section SHALL display a clickable `mailto:` email link (`hello@editingkart.com`) styled as a large underline-hover text link.
3. THE Contact_Section SHALL display social media icon links (Instagram, YouTube, Behance) using Lucide React icons or custom SVGs.
4. THE Contact_Section SHALL display a footer line at the bottom with "© 2025 EditingKart. All rights reserved."
5. THE Contact_Section SHALL have a minimum height of `80vh` to give it visual breathing room.
6. THE Contact_Section background SHALL use a subtle noise/grain CSS effect or a radial gradient from Accent_Color (`#9b5de5` at `8%` opacity) at the top-center to Brand_Black at the bottom.

---

### Requirement 12: Custom Cursor

**User Story:** As a visitor on a desktop device, I want to see a custom cursor, so that every mouse movement reinforces the premium creative feel.

#### Acceptance Criteria

1. THE CustomCursor SHALL render two elements: a small filled dot (8 px diameter) and a larger hollow ring (36 px diameter), both absolutely positioned relative to the Viewport.
2. WHEN the user moves the mouse, THE CustomCursor dot SHALL follow the cursor position immediately (no lag), and THE CustomCursor ring SHALL follow with a lerp factor of `0.12` per frame (smooth trailing effect).
3. THE CustomCursor dot SHALL use `background: #ffffff` and the ring SHALL use `border: 1.5px solid rgba(255, 255, 255, 0.5)`.
4. WHEN the user hovers over any interactive element (`a`, `button`, or elements with `data-cursor="hover"`), THE CustomCursor ring SHALL scale up to `2.5×` its normal size and change `border-color` to Accent_Color.
5. THE CustomCursor SHALL set `cursor: none` on the `body` to hide the native browser cursor.
6. WHILE the Viewport width is at Breakpoint_Mobile, THE CustomCursor SHALL not render (return `null`) and SHALL NOT set `cursor: none`.

---

### Requirement 13: Responsive Layout

**User Story:** As a visitor on a mobile device, I want the site to look and function correctly on small screens, so that I can experience the portfolio regardless of my device.

#### Acceptance Criteria

1. THE Site SHALL implement a mobile-first CSS approach where base styles target Breakpoint_Mobile and `@media (min-width: 769px)` media queries add desktop enhancements.
2. WHILE the Viewport width is at Breakpoint_Mobile, THE Hero typography heading font-size SHALL be `clamp(2.5rem, 8vw, 4rem)`.
3. WHILE the Viewport width is at Breakpoint_Mobile, THE Work_Section grid SHALL switch from a multi-column layout to a single-column layout.
4. WHILE the Viewport width is at Breakpoint_Mobile, THE Reel_Section initial video width SHALL be `90vw` centered in the Viewport instead of left-aligned.
5. WHILE the Viewport width is at Breakpoint_Mobile, THE About_Section stat counters SHALL be arranged in a single column with center alignment.
6. THE Site SHALL use `clamp()` for typography font-sizes on headings to fluidly scale between mobile and desktop Viewports.

---

### Requirement 14: Build Sequence and File Structure

**User Story:** As a developer, I want a defined file structure and implementation order, so that I can build the site section-by-section without confusion.

#### Acceptance Criteria

1. THE implementation SHALL proceed in the following order: (1) Global CSS reset, (2) SmoothScroll setup, (3) Preloader, (4) Navbar, (5) Hero + Hero3D + TextReveal, (6) Reel, (7) Work, (8) About, (9) Contact, (10) CustomCursor, (11) Final responsive pass.
2. THE Site SHALL use the following file structure:

```
src/
├── components/
│   ├── CustomCursor.jsx      ← custom cursor (dot + ring)
│   ├── Hero3D.jsx            ← R3F canvas with torus knot
│   ├── Navbar.jsx            ← fixed nav with scroll hide/show
│   ├── Preloader.jsx         ← full-screen animated preloader
│   ├── ProjectCard.jsx       ← reusable project card with hover video
│   ├── TextReveal.jsx        ← masked GSAP line reveal component
│   └── VideoStory.jsx        ← scroll-driven video expansion wrapper
├── sections/
│   ├── About.jsx             ← bio + stat counters
│   ├── Contact.jsx           ← CTA + email + socials + footer
│   ├── Hero.jsx              ← full-viewport hero composing Hero3D + TextReveal
│   ├── Reel.jsx              ← scroll-driven reel section using VideoStory
│   └── Work.jsx              ← featured projects grid
├── hooks/
│   └── useSmoothScroll.js    ← custom hook initializing Lenis + GSAP ticker
├── App.jsx                   ← root component composing all sections
├── index.css                 ← global dark design system CSS
└── main.jsx                  ← React entry point
```

3. THE implementation SHALL NOT introduce any npm packages beyond those already listed in `package.json`.
4. WHEN a section is not yet implemented, THE App.jsx SHALL include a visible placeholder element so the page layout can be tested at any stage.

---

### Requirement 15: Performance and Accessibility

**User Story:** As a visitor with accessibility needs or on a slow connection, I want the site to be usable and performant, so that I'm not excluded from the experience.

#### Acceptance Criteria

1. THE Site SHALL use `<video>` elements with a `<source>` tag and a descriptive `aria-label` on the wrapper.
2. THE Site SHALL provide `alt` text on all `<img>` elements.
3. THE Site SHALL ensure all navigation links and buttons have accessible focus states visible in high-contrast mode.
4. THE Preloader counter element SHALL include `aria-live="polite"` so screen readers announce the loading progress.
5. IF the user's OS has `prefers-reduced-motion: reduce` set, THEN THE Site SHALL disable GSAP and Framer Motion animations (set duration to `0.001s`) and skip the Preloader animation sequence.
6. THE Site SHALL target a Lighthouse Performance score of ≥ 80 on desktop by lazy-loading off-screen images and deferring non-critical scripts.
7. THE Hero3D canvas SHALL include an `aria-hidden="true"` attribute since it is purely decorative.
