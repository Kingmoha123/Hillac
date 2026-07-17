import { company, stats } from "@/data/site";
import { ButtonLink } from "./ButtonLink";
import { Icon } from "./Icon";
import { Logo } from "./Logo";

export function Hero() {
  return (
    <section className="hero">
      <div className="hero-bg" />
      <div className="container hero-grid">
        <div className="hero-copy reveal">
          <span className="eyebrow">Premium Somali technology company</span>
          <h1>Transforming Ideas Into Powerful Digital Solutions</h1>
          <p>
            {company.name} builds elegant brands, high-performance websites,
            mobile apps, cloud platforms, and custom business systems for the
            next generation of Somali enterprise.
          </p>
          <div className="hero-actions">
            <ButtonLink href="/contact">Get Started</ButtonLink>
            <ButtonLink href="/portfolio" variant="secondary">View Portfolio</ButtonLink>
          </div>
          <div className="trust-strip">
            <span>Trusted for</span>
            <strong>Branding</strong>
            <strong>Web</strong>
            <strong>Apps</strong>
            <strong>Systems</strong>
          </div>
        </div>
        <div className="hero-visual reveal">
          <div className="dashboard-card">
            <div className="mockup-top">
              <span />
              <span />
              <span />
              <strong>Hillaac Command Center</strong>
            </div>
            <div className="mockup-body">
              <div className="metric-card dark-card">
                <Logo compact />
                <span>System Health</span>
                <strong>99.98%</strong>
              </div>
              <div className="metric-card">
                <Icon name="trend" className="icon-medium" />
                <span>Growth Pipeline</span>
                <strong>+148%</strong>
              </div>
              <div className="chart-card">
                {[44, 70, 58, 84, 52, 96, 76, 118, 88, 132].map((height, index) => (
                  <i key={index} style={{ height }} />
                ))}
              </div>
              <div className="phone-mock">
                <div className="phone-screen">
                  <Icon name="bolt" className="phone-bolt" />
                  <span>{company.slogan}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="floating-note note-one">Launch-ready platforms</div>
          <div className="floating-note note-two">Secure cloud systems</div>
        </div>
      </div>
      <div className="container stats-row">
        {stats.map((item) => (
          <div key={item.label}>
            <strong>{item.value}</strong>
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
