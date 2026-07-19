import { unstable_noStore as noStore } from "next/cache";
import { connectToDatabase } from "@/lib/db";
import { PortfolioProject, type PortfolioProjectDocument } from "@/models/PortfolioProject";
import { projects as localProjects, type Project as PublicProject, type PortfolioCategory } from "@/data/site";
import type { PortfolioProjectInput, SerializedPortfolioProject } from "./types";

const categoryLabels: Record<string, PortfolioCategory> = {
  WEBSITE: "Websites",
  MOBILE_APP: "Mobile Apps",
  BUSINESS_SYSTEM: "Business Systems",
  BRANDING: "Branding",
  UI_UX: "UI/UX",
  OTHER: "Business Systems"
};

const statusLabels: Record<string, string> = {
  PLANNING: "Planning",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
  MAINTENANCE: "Maintenance"
};

export async function getPublishedPortfolioProjects() {
  noStore();

  try {
    const mongoProjects = await getPublishedMongoProjects();
    if (mongoProjects.length > 0) {
      return mongoProjects.map(mapDocumentToPublicProject);
    }

    return shouldUseLocalFallback() ? localProjects : [];
  } catch (error) {
    if (shouldUseLocalFallback()) {
      console.warn("Using local portfolio fallback:", error instanceof Error ? error.message : "Unknown error");
      return localProjects;
    }

    throw error;
  }
}

export async function getPublishedPortfolioProjectBySlug(slug: string) {
  noStore();

  try {
    await connectToDatabase();
    const project = await PortfolioProject.findOne({ slug, published: true, archivedAt: null }).lean();
    return project ? mapDocumentToPublicProject(project) : shouldUseLocalFallback() ? localProjects.find((item) => item.slug === slug) || null : null;
  } catch (error) {
    if (shouldUseLocalFallback()) {
      console.warn("Using local portfolio fallback:", error instanceof Error ? error.message : "Unknown error");
      return localProjects.find((item) => item.slug === slug) || null;
    }

    throw error;
  }
}

export async function getPublishedPortfolioProjectMetadata(slug: string) {
  try {
    await connectToDatabase();
    const project = await PortfolioProject.findOne({ slug, published: true, archivedAt: null }).lean();
    return project
      ? {
          title: project.seoTitle || `${project.title} Case Study`,
          description: project.seoDescription || project.shortDescription,
          image: project.coverImage?.url || null,
          services: project.services,
          category: categoryLabels[project.category] || "Business Systems"
        }
      : null;
  } catch (error) {
    if (shouldUseLocalFallback()) {
      const project = localProjects.find((item) => item.slug === slug);
      return project
        ? {
            title: `${project.title} Case Study`,
            description: project.shortDescription,
            image: project.coverImage.src,
            services: project.services,
            category: project.category
          }
        : null;
    }

    throw error;
  }
}

export async function getAdminPortfolioProjectById(id: string) {
  await connectToDatabase();
  const project = await PortfolioProject.findOne({ _id: id, archivedAt: null }).lean();
  return project ? serializeProject(project) : null;
}

export async function getAdminPortfolioProjectBySlug(slug: string) {
  await connectToDatabase();
  const project = await PortfolioProject.findOne({ slug, archivedAt: null }).lean();
  return project ? serializeProject(project) : null;
}

export async function listAdminPortfolioProjects(filters: {
  search?: string;
  category?: string;
  status?: string;
  published?: string;
  featured?: string;
  page?: number;
  limit?: number;
}) {
  await connectToDatabase();
  const page = Math.max(1, filters.page || 1);
  const limit = Math.min(50, Math.max(1, filters.limit || 12));
  const query: Record<string, unknown> = { archivedAt: null };

  if (filters.search) {
    query.title = { $regex: escapeRegExp(filters.search), $options: "i" };
  }

  if (filters.category && filters.category !== "ALL") {
    query.category = filters.category;
  }

  if (filters.status && filters.status !== "ALL") {
    query.status = filters.status;
  }

  if (filters.published === "true" || filters.published === "false") {
    query.published = filters.published === "true";
  }

  if (filters.featured === "true" || filters.featured === "false") {
    query.featured = filters.featured === "true";
  }

  const [items, total] = await Promise.all([
    PortfolioProject.find(query)
      .sort({ featured: -1, sortOrder: 1, updatedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    PortfolioProject.countDocuments(query)
  ]);

  return {
    projects: items.map(serializeProject),
    page,
    limit,
    total,
    totalPages: Math.max(1, Math.ceil(total / limit))
  };
}

export async function isSlugAvailable(slug: string, currentId?: string) {
  await connectToDatabase();
  const existing = await PortfolioProject.findOne({ slug, archivedAt: null }).select("_id").lean();
  return !existing || existing._id.toString() === currentId;
}

export async function getPublishedPortfolioSitemapEntries() {
  try {
    const projects = await getPublishedMongoProjects();
    return projects.map((project) => ({
      path: `/portfolio/${project.slug}`,
      title: `${project.seoTitle || project.title} Case Study`,
      description: project.seoDescription || project.shortDescription,
      priority: 0.7,
      updatedAt: project.updatedAt
    }));
  } catch (error) {
    if (shouldUseLocalFallback()) {
      return localProjects.map((project) => ({
        path: `/portfolio/${project.slug}`,
        title: `${project.title} Case Study`,
        description: project.shortDescription,
        priority: 0.7,
        updatedAt: new Date()
      }));
    }

    throw error;
  }
}

export function mapDocumentToPublicProject(project: PortfolioProjectDocument): PublicProject {
  return {
    title: project.title,
    slug: project.slug,
    category: categoryLabels[project.category] || "Business Systems",
    shortDescription: project.shortDescription,
    overview: project.overview,
    client: project.clientType === "CONFIDENTIAL" ? "Confidential Client" : project.clientName,
    services: project.services,
    technologies: project.technologies,
    challenges: project.challenges,
    solution: project.solution,
    keyFeatures: project.keyFeatures,
    results: project.results,
    coverImage: project.coverImage
      ? { src: project.coverImage.url, alt: project.coverImage.alt, label: project.coverImage.label }
      : { src: null, alt: `${project.title} case study placeholder`, label: project.title },
    galleryImages: project.galleryImages.map((image) => ({
      src: image.url,
      alt: image.alt,
      label: image.label
    })),
    liveProjectUrl: project.liveUrl || null,
    githubUrl: project.githubUrl || null,
    status: statusLabels[project.status] || project.status,
    completionYear: project.completionYear,
    featured: project.featured
  };
}

export function serializeProject(project: PortfolioProjectDocument): SerializedPortfolioProject {
  return {
    id: project._id.toString(),
    title: project.title,
    slug: project.slug,
    category: project.category,
    shortDescription: project.shortDescription,
    overview: project.overview,
    clientName: project.clientName,
    clientType: project.clientType,
    services: project.services,
    technologies: project.technologies,
    challenges: project.challenges,
    solution: project.solution,
    keyFeatures: project.keyFeatures,
    results: project.results,
    coverImage: project.coverImage || null,
    galleryImages: project.galleryImages || [],
    liveUrl: project.liveUrl || null,
    githubUrl: project.githubUrl || null,
    status: project.status,
    completionYear: project.completionYear,
    featured: project.featured,
    published: project.published,
    sortOrder: project.sortOrder,
    seoTitle: project.seoTitle || null,
    seoDescription: project.seoDescription || null,
    createdBy: project.createdBy || null,
    updatedBy: project.updatedBy || null,
    createdAt: project.createdAt.toISOString(),
    updatedAt: project.updatedAt.toISOString()
  };
}

export function createProjectUpdate(input: PortfolioProjectInput, adminId: string, isCreate: boolean) {
  const update = {
    ...input,
    updatedBy: adminId
  };

  return isCreate ? { ...update, createdBy: adminId } : update;
}

async function getPublishedMongoProjects() {
  await connectToDatabase();
  return PortfolioProject.find({ published: true, archivedAt: null })
    .sort({ featured: -1, sortOrder: 1, updatedAt: -1 })
    .lean();
}

function shouldUseLocalFallback() {
  return !process.env.MONGODB_URI || process.env.NODE_ENV !== "production";
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
