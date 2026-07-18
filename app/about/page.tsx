import { createPageMetadata } from "@/lib/seo";
import { CtaSection } from "@/components/CtaSection";
import { PageHero } from "@/components/PageHero";
import { ProcessSection } from "@/components/ProcessSection";
import { SectionHeader } from "@/components/SectionHeader";
import { company, whyChooseUs } from "@/data/site";

export const metadata = createPageMetadata({
  title: "About Hillaac ICT Solutions",
  description: "Learn about Hillaac ICT Solutions, a Mogadishu technology company helping Somali organizations build stronger digital brands, products, and systems.",
  path: "/about"
});

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Hillaac"
        title="A Mogadishu technology company built for premium execution"
        text="Hillaac ICT Solutions helps ambitious organizations move from scattered manual workflows to polished digital brands, products, and systems."
      />
      <section className="section">
        <div className="container two-column">
          <div>
            <SectionHeader
              eyebrow="Vision"
              title="To make Somali companies globally competitive through digital excellence"
              text="We believe great design and reliable software should be available to local businesses, institutions, NGOs, and startups that are building the future."
            />
          </div>
          <div className="mission-card">
            <h3>Mission</h3>
            <p>
              Deliver modern branding, websites, applications, cloud systems,
              and consultancy with speed, creativity, quality, and long-term
              support. {company.slogan}
            </p>
          </div>
        </div>
      </section>
      <section className="section muted-section">
        <div className="container feature-grid">
          {whyChooseUs.map((item) => (
            <article className="feature-card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>
      <ProcessSection />
      <CtaSection />
    </>
  );
}
