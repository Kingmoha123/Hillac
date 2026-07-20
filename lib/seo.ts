import type { Metadata } from "next";
import { legalPages } from "@/data/legal";
import { company, projects } from "@/data/site";

const fallbackSiteUrl = "https://hillac-ict-solutions.vercel.app";
const configuredSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "") ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "");

export const siteUrl = (configuredSiteUrl || fallbackSiteUrl).replace(/\/$/, "");

export const defaultDescription =
  "Hillaac ICT Solutions designs and develops professional websites, mobile apps, business systems, branding, cloud solutions, and digital products for companies and institutions in Somalia.";

export const defaultKeywords = [
  "Hillaac ICT Solutions",
  "Somalia technology company",
  "Mogadishu web development",
  "web development Somalia",
  "mobile app development Somalia",
  "business systems Somalia",
  "branding Somalia",
  "cloud solutions Somalia",
  "UI UX design Somalia"
];

export const defaultOgImage = {
  url: "/og-image.svg",
  width: 1200,
  height: 630,
  alt: `${company.name} social preview`
};

export const sitePages = [
  {
    path: "/",
    title: "Digital Solutions That Help Businesses Grow",
    description: defaultDescription,
    priority: 1
  },
  {
    path: "/about",
    title: "About Hillaac ICT Solutions",
    description: "Learn about Hillaac ICT Solutions, a Mogadishu technology company helping Somali organizations build stronger digital brands, products, and systems.",
    priority: 0.8
  },
  {
    path: "/services",
    title: "Services",
    description: "Explore Hillaac ICT Solutions services for websites, mobile apps, custom software, branding, cloud solutions, UI/UX, marketing, and video.",
    priority: 0.9
  },
  {
    path: "/portfolio",
    title: "Portfolio",
    description: "Explore Hillaac ICT Solutions portfolio entries and case studies for websites, mobile apps, business systems, branding, and UI/UX work.",
    priority: 0.9
  },
  {
    path: "/industries",
    title: "Industries",
    description: "See the industries Hillaac ICT Solutions supports, including finance, education, healthcare, NGOs, retail, logistics, startups, and public sector teams.",
    priority: 0.7
  },
  {
    path: "/technologies",
    title: "Technologies",
    description: "Review the modern technology stack Hillaac ICT Solutions uses to build secure, scalable websites, apps, systems, and cloud platforms.",
    priority: 0.7
  },
  {
    path: "/blog",
    title: "Insights",
    description: "Read practical ideas from Hillaac ICT Solutions on digital growth, design, software, and stronger business operations in Somalia.",
    priority: 0.6
  },
  {
    path: "/careers",
    title: "Careers",
    description: "Explore career opportunities with Hillaac ICT Solutions for people who want to build premium digital brands and systems in Somalia.",
    priority: 0.5
  },
  {
    path: "/contact",
    title: "Contact",
    description: "Contact Hillaac ICT Solutions to discuss a website, mobile app, business system, brand, cloud project, or digital product.",
    priority: 0.9
  },
  ...legalPages.map((page) => ({
    path: `/${page.slug}`,
    title: page.title,
    description: page.description,
    priority: 0.3
  }))
] as const;

export function absoluteUrl(path = "/") {
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

export function createPageMetadata({
  title,
  description,
  path,
  keywords = [],
  type = "website"
}: {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  type?: "website" | "article";
}): Metadata {
  return {
    title,
    description,
    keywords: [...defaultKeywords, ...keywords],
    alternates: {
      canonical: path
    },
    openGraph: {
      title,
      description,
      url: path,
      siteName: company.name,
      locale: "en_US",
      type,
      images: [defaultOgImage]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [defaultOgImage.url]
    }
  };
}

export const sitemapEntries = [
  ...sitePages,
  ...projects.map((project) => ({
    path: `/portfolio/${project.slug}`,
    title: `${project.title} Case Study`,
    description: project.shortDescription,
    priority: 0.7
  }))
];
