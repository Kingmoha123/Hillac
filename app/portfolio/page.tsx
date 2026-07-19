import { CtaSection } from "@/components/CtaSection";
import { PageHero } from "@/components/PageHero";
import { PortfolioFilter } from "@/components/PortfolioFilter";
import { getPublishedPortfolioProjects } from "@/lib/portfolio/repository";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Portfolio",
  description: "Explore Hillaac ICT Solutions portfolio entries and case studies for websites, mobile apps, business systems, branding, and UI/UX work.",
  path: "/portfolio"
});

export const revalidate = 60;

export default async function PortfolioPage() {
  const projects = await getPublishedPortfolioProjects();

  return (
    <>
      <PageHero
        eyebrow="Portfolio"
        title="Professional case studies built around business outcomes"
        text="Explore Hillaac portfolio entries by service category. Each case study is structured to show the challenge, solution, technology, and verified outcomes without unsupported claims."
      />
      <section className="section portfolio-listing">
        <div className="container">
          <PortfolioFilter projects={projects} />
        </div>
      </section>
      <CtaSection />
    </>
  );
}
