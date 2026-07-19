import { testimonials } from "@/data/site";
import { SectionHeader } from "./SectionHeader";

export function TestimonialsSection() {
  return (
    <section className="section">
      <div className="container">
        <SectionHeader
          eyebrow="Trust Signals"
          title="Designed to earn confidence before the first meeting"
          text="The Hillaac experience is built around clear expectations, careful delivery, and verified public claims."
        />
        <div className="testimonial-grid">
          {testimonials.map((item) => (
            <figure className="testimonial-card" key={item.name}>
              <div className="stars" aria-hidden="true">Trust check</div>
              <blockquote>{item.quote}</blockquote>
              <figcaption>
                <strong>{item.name}</strong>
                <span>{item.role}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
