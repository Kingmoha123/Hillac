import { ButtonLink } from "./ButtonLink";
import type { LegalPage } from "@/data/legal";

type LegalPageContentProps = {
  page: LegalPage;
};

export function LegalPageContent({ page }: LegalPageContentProps) {
  return (
    <>
      <section className="page-hero legal-hero">
        <div className="container narrow">
          <span className="eyebrow">Website Policy</span>
          <h1>{page.title}</h1>
          <p>{page.description}</p>
          <dl className="legal-dates">
            <div>
              <dt>Effective Date</dt>
              <dd>{page.effectiveDate}</dd>
            </div>
            <div>
              <dt>Last Updated</dt>
              <dd>{page.lastUpdated}</dd>
            </div>
          </dl>
        </div>
      </section>
      <section className="section legal-section">
        <div className="container legal-layout">
          <article className="legal-content">
            {page.sections.map((section) => (
              <section key={section.heading} aria-labelledby={`${page.slug}-${slugify(section.heading)}`}>
                <h2 id={`${page.slug}-${slugify(section.heading)}`}>{section.heading}</h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </section>
            ))}
          </article>
          <aside className="legal-sidebar" aria-label="Policy contact">
            <h2>Questions?</h2>
            <p>Contact Hillaac ICT Solutions if you need clarification or want to discuss a project.</p>
            <ButtonLink href="/contact" variant="secondary">Contact Hillaac</ButtonLink>
          </aside>
        </div>
      </section>
    </>
  );
}

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
