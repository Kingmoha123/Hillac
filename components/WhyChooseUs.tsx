import { whyChooseUs } from "@/data/site";
import { Icon } from "./Icon";
import { SectionHeader } from "./SectionHeader";

export function WhyChooseUs() {
  return (
    <section className="section muted-section">
      <div className="container">
        <SectionHeader
          eyebrow="Why Choose Us"
          title="Built for trust, speed, and serious business outcomes"
          text="We combine senior design taste, practical engineering, and local market understanding."
        />
        <div className="feature-grid">
          {whyChooseUs.map((item) => (
            <div className="feature-card" key={item.title}>
              <Icon name={item.title === "Security" ? "shield" : "check"} className="icon-small" />
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
