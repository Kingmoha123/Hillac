import { CtaSection } from "@/components/CtaSection";
import { PageHero } from "@/components/PageHero";
import { PortfolioSection } from "@/components/PortfolioSection";

export default function PortfolioPage() {
  return (
    <>
      <PageHero
        eyebrow="Portfolio"
        title="Digital work designed to create trust quickly"
        text="Explore sample case studies that show how Hillaac approaches apps, portals, systems, and business platforms."
      />
      <PortfolioSection />
      <CtaSection />
    </>
  );
}
