import { notFound } from "next/navigation";
import { LegalPageContent } from "@/components/LegalPageContent";
import { getLegalPage } from "@/data/legal";
import { createPageMetadata } from "@/lib/seo";

const page = getLegalPage("privacy-policy");

export const metadata = createPageMetadata({
  title: page?.title || "Privacy Policy",
  description: page?.description || "Hillaac ICT Solutions privacy policy.",
  path: "/privacy-policy"
});

export default function PrivacyPolicyPage() {
  if (!page) {
    notFound();
  }

  return <LegalPageContent page={page} />;
}
