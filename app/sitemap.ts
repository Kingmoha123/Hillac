import type { MetadataRoute } from "next";
import { absoluteUrl, sitemapEntries } from "@/lib/seo";
import { getPublishedPortfolioSitemapEntries } from "@/lib/portfolio/repository";
import { getPublishedBlogSitemapEntries } from "@/lib/blog/repository";

const legalPaths = new Set([
  "/privacy-policy",
  "/terms-of-service",
  "/cookie-policy",
  "/disclaimer"
]);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const portfolioEntries = await getPublishedPortfolioSitemapEntries().catch((error) => {
    console.warn("Skipping portfolio sitemap entries:", error instanceof Error ? error.message : "Unknown error");
    return [];
  });
  const blogEntries = await getPublishedBlogSitemapEntries().catch((error) => {
    console.warn("Skipping blog sitemap entries:", error instanceof Error ? error.message : "Unknown error");
    return [];
  });
  const paths = new Set<string>();

  return [
    ...sitemapEntries.filter((entry) => !entry.path.startsWith("/portfolio/") && !entry.path.startsWith("/blog/")),
    ...portfolioEntries,
    ...blogEntries
  ]
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
