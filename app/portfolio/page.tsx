import type { Metadata } from "next";
import { CtaSection } from "@/components/CtaSection";
import { PageHero } from "@/components/PageHero";
import { PortfolioFilter } from "@/components/PortfolioFilter";
import { projects } from "@/data/site";

export const metadata: Metadata = {
  title: "Portfolio | Hillaac ICT Solutions",
  description: "Explore Hillaac ICT Solutions portfolio entries and case studies for websites, mobile apps, business systems, branding, and UI/UX work.",
  openGraph: {
    title: "Portfolio | Hillaac ICT Solutions",
    description: "Professional portfolio and case studies from Hillaac ICT Solutions.",
    type: "website"
  }
};

export default function PortfolioPage() {
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
