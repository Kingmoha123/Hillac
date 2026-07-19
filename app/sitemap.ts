import type { MetadataRoute } from "next";
import { absoluteUrl, sitemapEntries } from "@/lib/seo";

const legalPaths = new Set([
  "/privacy-policy",
  "/terms-of-service",
  "/cookie-policy",
  "/disclaimer"
]);

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return sitemapEntries.map((entry) => ({
    url: absoluteUrl(entry.path),
    lastModified: now,
    changeFrequency: legalPaths.has(entry.path)
      ? "yearly"
      : entry.path.startsWith("/portfolio/") || entry.path.startsWith("/blog/")
        ? "monthly"
        : "weekly",
    priority: entry.priority
  }));
}
