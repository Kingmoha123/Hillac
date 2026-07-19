import { notFound } from "next/navigation";
import { LegalPageContent } from "@/components/LegalPageContent";
import { getLegalPage } from "@/data/legal";
import { createPageMetadata } from "@/lib/seo";

const page = getLegalPage("terms-of-service");

export const metadata = createPageMetadata({
  title: page?.title || "Terms of Service",
  description: page?.description || "Hillaac ICT Solutions website terms of service.",
  path: "/terms-of-service"
});

export default function TermsOfServicePage() {
  if (!page) {
    notFound();
  }

  return <LegalPageContent page={page} />;
}
