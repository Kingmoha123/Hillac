import type { MetadataRoute } from "next";
import { absoluteUrl, sitemapEntries } from "@/lib/seo";
import { getPublishedPortfolioSitemapEntries } from "@/lib/portfolio/repository";

const legalPaths = new Set([
  "/privacy-policy",
  "/terms-of-service",
  "/cookie-policy",
  "/disclaimer"
]);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const portfolioEntries = await getPublishedPortfolioSitemapEntries();
  const paths = new Set<string>();

  return [...sitemapEntries.filter((entry) => !entry.path.startsWith("/portfolio/")), ...portfolioEntries]
    .filter((entry) => {
      if (paths.has(entry.path)) {
        return false;
      }
      paths.add(entry.path);
      return true;
    })
    .map((entry) => ({
    url: absoluteUrl(entry.path),
    lastModified: "updatedAt" in entry && entry.updatedAt instanceof Date ? entry.updatedAt : now,
    changeFrequency: legalPaths.has(entry.path)
      ? "yearly"
      : entry.path.startsWith("/portfolio/") || entry.path.startsWith("/blog/")
        ? "monthly"
        : "weekly",
    priority: entry.priority
  }));
}
