import { ContactSection } from "@/components/ContactSection";
import { IndustriesSection } from "@/components/IndustriesSection";
import { PageHero } from "@/components/PageHero";

export default function IndustriesPage() {
  return (
    <>
      <PageHero
        eyebrow="Industries"
        title="Technology for organizations that need clarity and control"
        text="We work across finance, education, healthcare, public sector, NGOs, retail, logistics, hospitality, and startup environments."
      />
      <IndustriesSection />
      <ContactSection />
    </>
  );
}
