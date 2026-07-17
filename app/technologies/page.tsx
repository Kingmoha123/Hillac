import { PageHero } from "@/components/PageHero";
import { TechSection } from "@/components/TechSection";
import { CtaSection } from "@/components/CtaSection";

export default function TechnologiesPage() {
  return (
    <>
      <PageHero
        eyebrow="Technologies"
        title="A modern stack for performance, security, and scale"
        text="Our tooling supports clean interfaces, stable backends, mobile products, cloud deployments, and design systems."
      />
      <TechSection />
      <CtaSection />
    </>
  );
}
