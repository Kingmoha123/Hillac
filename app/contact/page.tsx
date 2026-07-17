import { ContactSection } from "@/components/ContactSection";
import { PageHero } from "@/components/PageHero";

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Tell us what you want to build"
        text="Use the form, send a WhatsApp message, or call directly. We are ready to help shape your next digital project."
      />
      <ContactSection />
    </>
  );
}
