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
          <span className="eyebrow">Somalia&apos;s Digital Solutions Partner</span>
          <h1>We Build Digital Solutions That Help Businesses Grow</h1>
          <p>
            {company.name} designs and develops professional websites, mobile
            apps, business systems, branding, and cloud solutions for companies
            and institutions in Somalia.
          </p>
          <div className="hero-actions">
            <ButtonLink
              href="/contact"
              analyticsEvent="hero_primary_cta_click"
              analyticsProperties={{ cta_location: "hero_primary" }}
            >
              Request a Free Consultation
            </ButtonLink>
            <ButtonLink
              href="/portfolio"
              variant="secondary"
              analyticsEvent="hero_portfolio_click"
              analyticsProperties={{ cta_location: "hero_secondary" }}
            >
              View Our Work
            </ButtonLink>
          </div>
          <div className="trust-strip">
            <span>Services for</span>
            <strong>Websites</strong>
            <strong>Mobile Apps</strong>
            <strong>Business Systems</strong>
            <strong>Branding</strong>
            <strong>Cloud Solutions</strong>
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
                <span>Delivery Approach</span>
                <strong>Client-Focused</strong>
              </div>
              <div className="metric-card">
                <Icon name="trend" className="icon-medium" />
                <span>Solution Model</span>
                <strong>Secure &amp; Scalable</strong>
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
          <div className="floating-note note-one">Custom digital solutions</div>
          <div className="floating-note note-two">Built for growth</div>
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
