import { clientTypes, projectCategories, projectStatuses } from "@/models/PortfolioProject";
import type { PortfolioProjectInput } from "./types";

type ValidationResult =
  | { success: true; data: PortfolioProjectInput }
  | { success: false; errors: Record<string, string> };

export function slugifyProjectTitle(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 140);
}

export function validatePortfolioProjectPayload(payload: unknown): ValidationResult {
  const errors: Record<string, string> = {};
  const record = isRecord(payload) ? payload : {};
  const title = readString(record, "title").replace(/\s+/g, " ");
  const slug = slugifyProjectTitle(readString(record, "slug") || title);
  const category = readEnum(record, "category", projectCategories, "OTHER");
  const shortDescription = readString(record, "shortDescription");
  const overview = readString(record, "overview");
  const clientName = readString(record, "clientName") || "Internal Project";
  const clientType = readEnum(record, "clientType", clientTypes, "INTERNAL");
  const services = readStringArray(record, "services", 12);
  const technologies = readStringArray(record, "technologies", 16);
  const challenges = readStringArray(record, "challenges", 12);
  const solution = readString(record, "solution");
  const keyFeatures = readStringArray(record, "keyFeatures", 16);
  const results = readStringArray(record, "results", 12);
  const coverImage = readImage(record["coverImage"]);
  const galleryImages = readImageArray(record["galleryImages"]);
  const liveUrl = normalizeOptionalUrl(readString(record, "liveUrl"), errors, "liveUrl");
  const githubUrl = normalizeOptionalUrl(readString(record, "githubUrl"), errors, "githubUrl");
  const status = readEnum(record, "status", projectStatuses, "PLANNING");
  const completionYear = readString(record, "completionYear") || "Pending";
  const featured = Boolean(record["featured"]);
  const published = Boolean(record["published"]);
  const sortOrder = readNumber(record, "sortOrder", 0);
  const seoTitle = optionalMax(readString(record, "seoTitle"), 70, errors, "seoTitle");
  const seoDescription = optionalMax(readString(record, "seoDescription"), 180, errors, "seoDescription");

  if (title.length < 2 || title.length > 120) {
    errors.title = "Title must be between 2 and 120 characters.";
  }

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    errors.slug = "Slug must contain lowercase letters, numbers, and hyphens only.";
  }

  if (shortDescription.length < 20 || shortDescription.length > 240) {
    errors.shortDescription = "Short description must be between 20 and 240 characters.";
  }

  if (overview.length > 2000) {
    errors.overview = "Overview must be 2000 characters or fewer.";
  }

  if (solution.length > 2000) {
    errors.solution = "Solution must be 2000 characters or fewer.";
  }

  if (clientName.length > 120) {
    errors.clientName = "Client name must be 120 characters or fewer.";
  }

  if (completionYear !== "Pending" && !/^\d{4}$/.test(completionYear)) {
    errors.completionYear = "Completion year must be a four-digit year or Pending.";
  }

  if (!Number.isFinite(sortOrder) || sortOrder < -9999 || sortOrder > 9999) {
    errors.sortOrder = "Sort order must be between -9999 and 9999.";
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  return {
    success: true,
    data: {
      title,
      slug,
      category,
      shortDescription,
      overview,
      clientName,
      clientType,
      services,
      technologies,
      challenges,
      solution,
      keyFeatures,
      results,
      coverImage,
      galleryImages,
      liveUrl,
      githubUrl,
      status,
      completionYear,
      featured,
      published,
      sortOrder,
      seoTitle,
      seoDescription
    }
  };
}

export function normalizeOptionalUrl(value: string, errors: Record<string, string>, field: string) {
  if (!value) {
    return null;
  }

  try {
    const url = new URL(value);
    if (url.protocol !== "https:") {
      errors[field] = "URL must use HTTPS.";
      return null;
    }

    return url.toString();
  } catch {
    errors[field] = "Enter a valid HTTPS URL.";
    return null;
  }
}

function readImage(value: unknown) {
  if (!isRecord(value)) {
    return null;
  }

  const url = readString(value, "url");
  const alt = readString(value, "alt");
  const label = readString(value, "label") || "Project image";
  const publicId = readString(value, "publicId") || null;

  if (!url || !alt) {
    return null;
  }

  const errors: Record<string, string> = {};
  const normalizedUrl = normalizeOptionalUrl(url, errors, "image");
  if (!normalizedUrl) {
    return null;
  }

  return {
    url: normalizedUrl,
    alt: alt.slice(0, 160),
    label: label.slice(0, 80),
    publicId
  };
}

function readImageArray(value: unknown) {
  return Array.isArray(value) ? value.map(readImage).filter((image) => image !== null).slice(0, 12) : [];
}

function readStringArray(record: Record<string, unknown>, key: string, limit: number) {
  const value = record[key];
  const rawItems = Array.isArray(value) ? value : typeof value === "string" ? value.split(/\r?\n|,/) : [];
  return rawItems
    .map((item) => (typeof item === "string" ? item.trim().replace(/\s+/g, " ") : ""))
    .filter(Boolean)
    .slice(0, limit);
}

function optionalMax(value: string, max: number, errors: Record<string, string>, field: string) {
  if (!value) {
    return null;
  }

  if (value.length > max) {
    errors[field] = `Must be ${max} characters or fewer.`;
  }

  return value;
}

function readString(record: Record<string, unknown>, key: string) {
  const value = record[key];
  return typeof value === "string" ? value.trim() : "";
}

function readNumber(record: Record<string, unknown>, key: string, fallback: number) {
  const value = record[key];
  const numeric = typeof value === "number" ? value : Number.parseInt(String(value || ""), 10);
  return Number.isFinite(numeric) ? numeric : fallback;
}

function readEnum<const T extends readonly string[]>(
  record: Record<string, unknown>,
  key: string,
  values: T,
  fallback: T[number]
) {
  const value = record[key];
  return typeof value === "string" && values.includes(value) ? (value as T[number]) : fallback;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
