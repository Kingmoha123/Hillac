import assert from "node:assert/strict";
import { canManagePortfolio } from "../lib/portfolio/permissions";
import { validatePortfolioProjectPayload, slugifyProjectTitle } from "../lib/portfolio/validation";

const validPayload = {
  title: "Modern Business Website",
  slug: "modern-business-website",
  category: "WEBSITE",
  shortDescription: "A professional website case study for a business launch.",
  overview: "Overview",
  clientName: "Internal Project",
  clientType: "INTERNAL",
  services: ["Website Development"],
  technologies: ["Next.js"],
  challenges: ["Manual content"],
  solution: "Structured CMS-ready website.",
  keyFeatures: ["Responsive layout"],
  results: ["Launch-ready structure"],
  coverImage: null,
  galleryImages: [],
  liveUrl: "https://example.com",
  githubUrl: null,
  status: "COMPLETED",
  completionYear: "2026",
  featured: true,
  published: true,
  sortOrder: 1,
  seoTitle: "Modern Business Website",
  seoDescription: "A professional website case study for a business launch."
};

assert.equal(slugifyProjectTitle(" Hillaac: Premium Website! "), "hillaac-premium-website");
assert.equal(canManagePortfolio("SUPER_ADMIN", "delete"), true);
assert.equal(canManagePortfolio("ADMIN", "publish"), true);
assert.equal(canManagePortfolio("EDITOR", "delete"), false);
assert.equal(canManagePortfolio("EDITOR", "publish"), false);

const validation = validatePortfolioProjectPayload(validPayload);
assert.equal(validation.success, true);

const invalid = validatePortfolioProjectPayload({ ...validPayload, slug: "Bad Slug", liveUrl: "http://example.com" });
assert.equal(invalid.success, false);
if (!invalid.success) {
  assert.equal(Boolean(invalid.errors.liveUrl), true);
}

const duplicateSlugs = new Set<string>();
const localSlugs = ["deynraac-business-management", "deynraac-business-management"];
const created = localSlugs.filter((slug) => {
  if (duplicateSlugs.has(slug)) return false;
  duplicateSlugs.add(slug);
  return true;
});
assert.deepEqual(created, ["deynraac-business-management"]);

console.log("Portfolio tests passed.");
