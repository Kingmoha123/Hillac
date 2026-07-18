import { company } from "@/data/site";
import { absoluteUrl, siteUrl } from "./seo";

export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: company.name,
  url: siteUrl,
  email: company.email,
  telephone: company.phone,
  slogan: company.slogan,
  address: {
    "@type": "PostalAddress",
    streetAddress: company.location,
    addressLocality: "Mogadishu",
    addressCountry: "SO"
  }
};

export const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: company.name,
  url: siteUrl,
  publisher: {
    "@type": "Organization",
    name: company.name
  }
};

export const professionalServiceJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: company.name,
  url: siteUrl,
  email: company.email,
  telephone: company.phone,
  areaServed: {
    "@type": "Country",
    name: "Somalia"
  },
  address: {
    "@type": "PostalAddress",
    streetAddress: company.location,
    addressLocality: "Mogadishu",
    addressCountry: "SO"
  },
  serviceType: [
    "Website Development",
    "Mobile App Development",
    "Custom Software Systems",
    "Branding and Graphic Design",
    "Cloud and IT Solutions",
    "UI/UX Design"
  ]
};

export function createBreadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path)
    }))
  };
}
