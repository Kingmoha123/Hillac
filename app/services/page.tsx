import { ContactSection } from "@/components/ContactSection";
import { Icon } from "@/components/Icon";
import { PageHero } from "@/components/PageHero";
import { services } from "@/data/site";

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Everything your company needs to launch, grow, and operate digitally"
        text="Choose one service or bring us a full business challenge. We design the solution around your actual workflow."
      />
      <section className="section">
        <div className="container service-list">
          {services.map((service) => (
            <article key={service.title} className="service-detail">
              <div className="card-icon"><Icon name={service.icon} className="icon-medium" /></div>
              <div>
                <h2>{service.title}</h2>
                <p>{service.details}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
      <ContactSection />
    </>
  );
}
