import { services } from "@/data/site";
import { Icon } from "./Icon";
import { SectionHeader } from "./SectionHeader";
import { TrackedLink } from "./TrackedLink";

export function ServicesSection() {
  return (
    <section className="section">
      <div className="container">
        <SectionHeader
          eyebrow="Our Services"
          title="Complete digital solutions under one sharp brand"
          text="From identity and design to custom software and cloud infrastructure, Hillaac gives growing organizations a premium technology partner."
        />
        <div className="card-grid service-grid">
          {services.map((service) => (
            <article className="service-card" key={service.title}>
              <div className="card-icon">
                <Icon name={service.icon} className="icon-medium" />
              </div>
              <h3>{service.title}</h3>
              <p>{service.summary}</p>
              <TrackedLink
                href="/services"
                eventName="service_interest_click"
                eventProperties={{
                  cta_location: "service_card",
                  service_name: service.title
                }}
              >
                Learn more
              </TrackedLink>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
