import { notFound } from "next/navigation";
import { LegalPageContent } from "@/components/LegalPageContent";
import { getLegalPage } from "@/data/legal";
import { createPageMetadata } from "@/lib/seo";

const page = getLegalPage("disclaimer");

export const metadata = createPageMetadata({
  title: page?.title || "Disclaimer",
  description: page?.description || "Hillaac ICT Solutions website disclaimer.",
  path: "/disclaimer"
});

export default function DisclaimerPage() {
  if (!page) {
    notFound();
  }

  return <LegalPageContent page={page} />;
}
