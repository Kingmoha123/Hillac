import fs from "node:fs";
import path from "node:path";
import mongoose from "mongoose";
import { projects } from "../data/site";
import { PortfolioProject } from "../models/PortfolioProject";
import { connectToDatabase } from "../lib/db";
import { slugifyProjectTitle } from "../lib/portfolio/validation";

loadEnvFile();

async function main() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is required.");
  }

  await connectToDatabase();

  let created = 0;
  let skipped = 0;

  for (const project of projects) {
    const existing = await PortfolioProject.findOne({ slug: project.slug }).lean();
    if (existing) {
      skipped += 1;
      continue;
    }

    await PortfolioProject.create({
      title: project.title,
      slug: project.slug || slugifyProjectTitle(project.title),
      category: mapCategory(project.category),
      shortDescription: project.shortDescription,
      overview: project.overview,
      clientName: project.client,
      clientType: project.client === "Internal Project" ? "INTERNAL" : "CLIENT",
      services: project.services,
      technologies: project.technologies,
      challenges: project.challenges,
      solution: project.solution,
      keyFeatures: project.keyFeatures,
      results: project.results,
      coverImage: project.coverImage.src
        ? { url: project.coverImage.src, alt: project.coverImage.alt, label: project.coverImage.label }
        : null,
      galleryImages: project.galleryImages
        .filter((image) => image.src)
        .map((image) => ({ url: image.src as string, alt: image.alt, label: image.label })),
      liveUrl: project.liveProjectUrl,
      githubUrl: project.githubUrl,
      status: project.status === "Information Needed" ? "PLANNING" : "COMPLETED",
      completionYear: project.completionYear,
      featured: project.featured,
      published: false,
      sortOrder: 0,
      seoTitle: `${project.title} Case Study`,
      seoDescription: project.shortDescription,
      createdBy: "seed:portfolio",
      updatedBy: "seed:portfolio"
    });
    created += 1;
  }

  console.log(`Portfolio seed complete. Created ${created}; skipped ${skipped}.`);
}

main()
  .catch((error) => {
    console.error("Portfolio seed failed:", error instanceof Error ? error.message : "Unknown error");
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });

function mapCategory(category: string) {
  const map: Record<string, string> = {
    Websites: "WEBSITE",
    "Mobile Apps": "MOBILE_APP",
    "Business Systems": "BUSINESS_SYSTEM",
    Branding: "BRANDING",
    "UI/UX": "UI_UX"
  };
  return map[category] || "OTHER";
}

function loadEnvFile() {
  const envPath = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
    const [key, ...rest] = trimmed.split("=");
    if (key && process.env[key] === undefined) {
      process.env[key] = rest.join("=").trim().replace(/^['"]|['"]$/g, "");
    }
  }
}
