import { useEffect } from 'react';
import { ArrowLeft, ArrowRight, Check, Sparkles } from 'lucide-react';
import ServiceScene3D from '../components/ServiceScene3D';
import { getAdjacentServices } from '../data/services';
import './ServicePage.css';

export default function ServicePage({ service }) {
  const { previous, next } = getAdjacentServices(service.slug);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = `${service.title} | EditingKart`;
    window.scrollTo(0, 0);

    return () => {
      document.title = previousTitle;
    };
  }, [service.title]);

  return (
    <main
      className={`service-page service-page--${service.variant}`}
      style={{
        '--service-accent': service.accent,
        '--service-secondary': service.secondary,
      }}
    >
      <section className="service-hero" aria-label={`${service.title} service`}>
        <div className="service-hero__texture" aria-hidden="true" />

        <div className="service-hero__visual" aria-hidden="true">
          <ServiceScene3D
            variant={service.variant}
            accent={service.accent}
            secondary={service.secondary}
          />
        </div>

        <div className="service-hero__content">
          <a href="/#services" className="service-page__back" data-cursor="hover">
            <ArrowLeft size={18} />
            Services
          </a>

          <p className="service-hero__eyebrow">{service.eyebrow}</p>
          <h1 className="service-hero__title">{service.title}</h1>
          <p className="service-hero__tagline">{service.tagline}</p>
          <p className="service-hero__summary">{service.summary}</p>

          <div className="service-hero__actions">
            <a href="#service-flow" className="service-button service-button--primary" data-cursor="hover">
              Explore process
            </a>
            <a href="/#contact" className="service-button" data-cursor="hover">
              Start a project
            </a>
          </div>
        </div>

        <div className="service-hero__stats" aria-label={`${service.title} service highlights`}>
          {service.stats.map((stat) => (
            <div key={stat.label} className="service-hero__stat">
              <span className="service-hero__stat-value">{stat.value}</span>
              <span className="service-hero__stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="service-story" aria-label={`${service.title} approach`}>
        <div className="service-story__label">
          <Sparkles size={18} />
          Craft approach
        </div>
        <p className="service-story__intro">{service.intro}</p>
        <p className="service-story__signature">{service.signature}</p>
      </section>

      <section id="service-flow" className="service-flow" aria-label={`${service.title} process and deliverables`}>
        <div className="service-flow__column">
          <h2 className="service-flow__heading">What you get</h2>
          <div className="service-flow__deliverables">
            {service.deliverables.map((item) => (
              <div key={item} className="service-flow__deliverable">
                <Check size={18} />
                <p>{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="service-flow__column service-flow__column--process">
          <h2 className="service-flow__heading">How it moves</h2>
          <ol className="service-flow__steps">
            {service.process.map((step, index) => (
              <li key={step} className="service-flow__step">
                <span>{String(index + 1).padStart(2, '0')}</span>
                <p>{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <nav className="service-next" aria-label="Browse service pages">
        <a href={`/services/${previous.slug}`} className="service-next__link" data-cursor="hover">
          <span>Previous</span>
          <strong>{previous.label}</strong>
        </a>
        <a href={`/services/${next.slug}`} className="service-next__link service-next__link--next" data-cursor="hover">
          <span>Next</span>
          <strong>{next.label}</strong>
          <ArrowRight size={18} />
        </a>
      </nav>
    </main>
  );
}
