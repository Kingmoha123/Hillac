import type { MetadataRoute } from "next";
import { absoluteUrl, sitemapEntries } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return sitemapEntries.map((entry) => ({
    url: absoluteUrl(entry.path),
    lastModified: now,
    changeFrequency: entry.path.startsWith("/portfolio/") ? "monthly" : "weekly",
    priority: entry.priority
  }));
}
