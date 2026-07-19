import { notFound } from "next/navigation";
import { LegalPageContent } from "@/components/LegalPageContent";
import { getLegalPage } from "@/data/legal";
import { createPageMetadata } from "@/lib/seo";

const page = getLegalPage("cookie-policy");

export const metadata = createPageMetadata({
  title: page?.title || "Cookie Policy",
  description: page?.description || "Hillaac ICT Solutions cookie and browser storage policy.",
  path: "/cookie-policy"
});

export default function CookiePolicyPage() {
  if (!page) {
    notFound();
  }

  return <LegalPageContent page={page} />;
}
