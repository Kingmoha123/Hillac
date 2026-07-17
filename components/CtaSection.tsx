import { ButtonLink } from "./ButtonLink";

export function CtaSection() {
  return (
    <section className="cta-band">
      <div className="container cta-inner">
        <div>
          <span className="eyebrow">Hillaac ICT Solutions</span>
          <h2>Let your company look, feel, and operate like a global technology brand.</h2>
        </div>
        <ButtonLink href="/contact">Start Your Project</ButtonLink>
      </div>
    </section>
  );
}
