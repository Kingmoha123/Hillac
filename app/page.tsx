import { ContactSection } from "@/components/ContactSection";
import { CtaSection } from "@/components/CtaSection";
import { Hero } from "@/components/Hero";
import { IndustriesSection } from "@/components/IndustriesSection";
import { PortfolioSection } from "@/components/PortfolioSection";
import { ProcessSection } from "@/components/ProcessSection";
import { ServicesSection } from "@/components/ServicesSection";
import { TechSection } from "@/components/TechSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { WhyChooseUs } from "@/components/WhyChooseUs";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ServicesSection />
      <WhyChooseUs />
      <PortfolioSection />
      <IndustriesSection />
      <TechSection />
      <ProcessSection />
      <TestimonialsSection />
      <CtaSection />
      <ContactSection />
    </>
  );
}
