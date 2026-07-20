import { blogCategories, blogStatuses } from "@/models/BlogPost";
import type { BlogPostInput } from "./types";

type ValidationResult =
  | { success: true; data: BlogPostInput }
  | { success: false; errors: Record<string, string> };

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function slugifyBlogTitle(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 160);
}

export function validateBlogPostPayload(payload: unknown): ValidationResult {
  const value = payload as Record<string, unknown>;
  const errors: Record<string, string> = {};

  const title = cleanString(value.title, 140);
  const slug = slugifyBlogTitle(cleanString(value.slug, 180));
  const excerpt = cleanString(value.excerpt, 280);
  const category = cleanEnum(value.category, blogCategories, "DIGITAL_STRATEGY");
  const tags = cleanStringArray(value.tags, 12, 40);
  const authorName = cleanString(value.authorName, 100);
  const authorRole = cleanString(value.authorRole, 120);
  const readingTimeMinutes = cleanNumber(value.readingTimeMinutes, 1, 60, 5);
  const introduction = cleanString(value.introduction, 4000);
  const sections = cleanSections(value.sections);
  const conclusion = cleanString(value.conclusion, 3000);
  const coverImage = cleanImage(value.coverImage);
  const status = cleanEnum(value.status, blogStatuses, "DRAFT");
  const featured = Boolean(value.featured);
  const published = Boolean(value.published);
  const publishedAt = cleanDate(value.publishedAt);
  const seoTitle = nullableString(value.seoTitle, 70);
  const seoDescription = nullableString(value.seoDescription, 180);

  if (title.length < 5) errors.title = "Title must be at least 5 characters.";
  if (!slug || !slugPattern.test(slug)) errors.slug = "Slug must use lowercase letters, numbers, and hyphens only.";
  if (excerpt.length < 40) errors.excerpt = "Excerpt must be at least 40 characters.";
  if (authorName.length < 2) errors.authorName = "Author name is required.";
  if (authorRole.length < 2) errors.authorRole = "Author role is required.";
  if (introduction.length < 80) errors.introduction = "Introduction must be at least 80 characters.";
  if (sections.length === 0) errors.sections = "Add at least one article section.";
  if (conclusion.length < 60) errors.conclusion = "Conclusion must be at least 60 characters.";
  if (published && status !== "PUBLISHED") errors.status = "Published articles must use PUBLISHED status.";
  if (status === "PUBLISHED" && !published) errors.published = "PUBLISHED status requires the article to be published.";
  if (seoDescription && seoDescription.length < 50) errors.seoDescription = "SEO description should be at least 50 characters.";

  sections.forEach((section, index) => {
    if (section.heading.length < 2) errors[`sections.${index}.heading`] = "Section heading is required.";
    if (section.content.length < 40) errors[`sections.${index}.content`] = "Section content must be at least 40 characters.";
  });

  if (coverImage && !isHttpsUrl(coverImage.url)) {
    errors.coverImage = "Cover image URL must be a valid HTTPS URL.";
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  return {
    success: true,
    data: {
      title,
      slug,
      excerpt,
      category,
      tags,
      authorName,
      authorRole,
      readingTimeMinutes,
      introduction,
      sections,
      conclusion,
      coverImage,
      status,
      featured,
      published,
      publishedAt,
      seoTitle,
      seoDescription
    }
  };
}

function cleanString(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().replace(/\s+\n/g, "\n").slice(0, maxLength) : "";
}

function nullableString(value: unknown, maxLength: number) {
  const cleaned = cleanString(value, maxLength);
  return cleaned || null;
}

function cleanEnum<T extends readonly string[]>(value: unknown, options: T, fallback: T[number]): T[number] {
  return typeof value === "string" && options.includes(value) ? value : fallback;
}

function cleanNumber(value: unknown, min: number, max: number, fallback: number) {
  const parsed = typeof value === "number" ? value : Number.parseInt(String(value || ""), 10);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(max, Math.max(min, parsed));
}

function cleanStringArray(value: unknown, maxItems: number, maxLength: number) {
  if (!Array.isArray(value)) return [];
  return Array.from(new Set(value.map((item) => cleanString(item, maxLength)).filter(Boolean))).slice(0, maxItems);
}

function cleanSections(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value
    .slice(0, 12)
    .map((item) => {
      const section = item as Record<string, unknown>;
      return {
        heading: cleanString(section.heading, 140),
        content: cleanString(section.content, 4000),
        bullets: cleanStringArray(section.bullets, 10, 140)
      };
    })
    .filter((section) => section.heading || section.content || section.bullets.length > 0);
}

function cleanImage(value: unknown) {
  if (!value || typeof value !== "object") return null;
  const image = value as Record<string, unknown>;
  const url = cleanString(image.url, 500);
  if (!url) return null;
  return {
    url,
    alt: cleanString(image.alt, 180) || "Blog article cover image",
    label: cleanString(image.label, 80) || "Article",
    publicId: nullableString(image.publicId, 200)
  };
}

function cleanDate(value: unknown) {
  if (!value) return null;
  const date = new Date(String(value));
  return Number.isNaN(date.getTime()) ? null : date;
}

function isHttpsUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:";
  } catch {
    return false;
  }
}
