import { unstable_noStore as noStore } from "next/cache";
import { connectToDatabase } from "@/lib/db";
import { blogPosts as localBlogPosts } from "@/data/blog";
import { BlogPost, type BlogPostDocument } from "@/models/BlogPost";
import type { BlogPostInput, PublicBlogPost, SerializedBlogPost } from "./types";

const categoryLabels: Record<string, string> = {
  DIGITAL_STRATEGY: "Digital Strategy",
  OPERATIONS: "Operations",
  BRANDING: "Branding",
  TECHNOLOGY: "Technology",
  BUSINESS_SYSTEMS: "Business Systems",
  CLOUD: "Cloud",
  DESIGN: "Design"
};

const localCategoryMap: Record<string, string> = {
  "Digital Strategy": "DIGITAL_STRATEGY",
  Operations: "OPERATIONS",
  Branding: "BRANDING"
};

export async function getPublishedBlogPosts() {
  noStore();

  try {
    const mongoPosts = await getPublishedMongoPosts();
    if (mongoPosts.length > 0) {
      return mongoPosts.map(mapDocumentToPublicBlogPost);
    }

    return shouldUseLocalFallback() ? localBlogPosts : [];
  } catch (error) {
    if (shouldUseLocalFallback()) {
      console.warn("Using local blog fallback:", error instanceof Error ? error.message : "Unknown error");
      return localBlogPosts;
    }

    throw error;
  }
}

export async function getPublishedBlogPostBySlug(slug: string) {
  noStore();

  try {
    await connectToDatabase();
    const post = await BlogPost.findOne({ slug, published: true, status: "PUBLISHED", archivedAt: null }).lean();
    return post ? mapDocumentToPublicBlogPost(post) : shouldUseLocalFallback() ? localBlogPosts.find((item) => item.slug === slug) || null : null;
  } catch (error) {
    if (shouldUseLocalFallback()) {
      console.warn("Using local blog fallback:", error instanceof Error ? error.message : "Unknown error");
      return localBlogPosts.find((item) => item.slug === slug) || null;
    }

    throw error;
  }
}

export async function getPublishedBlogPostMetadata(slug: string) {
  try {
    await connectToDatabase();
    const post = await BlogPost.findOne({ slug, published: true, status: "PUBLISHED", archivedAt: null }).lean();
    return post
      ? {
          title: post.seoTitle || post.title,
          description: post.seoDescription || post.excerpt,
          image: post.coverImage?.url || null,
          category: categoryLabels[post.category] || "Insights",
          publishedAt: post.publishedAt,
          updatedAt: post.updatedContentAt || post.updatedAt
        }
      : null;
  } catch (error) {
    if (shouldUseLocalFallback()) {
      const post = localBlogPosts.find((item) => item.slug === slug);
      return post
        ? {
            title: post.title,
            description: post.excerpt,
            image: post.featuredImage.src,
            category: post.category,
            publishedAt: new Date(post.publishedAt),
            updatedAt: post.updatedAt ? new Date(post.updatedAt) : null
          }
        : null;
    }

    throw error;
  }
}

export async function getRelatedPublishedBlogPosts(post: PublicBlogPost, limit = 3) {
  const posts = await getPublishedBlogPosts();
  return rankRelatedPosts(posts, post).slice(0, limit);
}

export async function getAdminBlogPostById(id: string) {
  await connectToDatabase();
  const post = await BlogPost.findOne({ _id: id, archivedAt: null }).lean();
  return post ? serializeBlogPost(post) : null;
}

export async function listAdminBlogPosts(filters: {
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
    BlogPost.find(query)
      .sort({ featured: -1, publishedAt: -1, updatedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    BlogPost.countDocuments(query)
  ]);

  return {
    posts: items.map(serializeBlogPost),
    page,
    limit,
    total,
    totalPages: Math.max(1, Math.ceil(total / limit))
  };
}

export async function isBlogSlugAvailable(slug: string, currentId?: string) {
  await connectToDatabase();
  const existing = await BlogPost.findOne({ slug, archivedAt: null }).select("_id").lean();
  return !existing || existing._id.toString() === currentId;
}

export async function getPublishedBlogSitemapEntries() {
  try {
    const posts = await getPublishedMongoPosts();
    if (posts.length === 0 && shouldUseLocalFallback()) {
      return localBlogPosts.map((post) => ({
        path: `/blog/${post.slug}`,
        title: post.title,
        description: post.excerpt,
        priority: post.featured ? 0.8 : 0.7,
        updatedAt: new Date(post.updatedAt || post.publishedAt)
      }));
    }

    return posts.map((post) => ({
      path: `/blog/${post.slug}`,
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.excerpt,
      priority: post.featured ? 0.8 : 0.7,
      updatedAt: post.updatedContentAt || post.updatedAt
    }));
  } catch (error) {
    if (shouldUseLocalFallback()) {
      return localBlogPosts.map((post) => ({
        path: `/blog/${post.slug}`,
        title: post.title,
        description: post.excerpt,
        priority: post.featured ? 0.8 : 0.7,
        updatedAt: new Date(post.updatedAt || post.publishedAt)
      }));
    }

    throw error;
  }
}

export function createBlogPostUpdate(input: BlogPostInput, adminId: string, isCreate: boolean, previousPublishedAt?: Date | null) {
  const isPublished = input.published && input.status === "PUBLISHED";
  const update = {
    ...input,
    featured: isPublished ? input.featured : false,
    published: isPublished,
    publishedAt: isPublished ? input.publishedAt || previousPublishedAt || new Date() : null,
    updatedContentAt: new Date(),
    updatedBy: adminId
  };

  return isCreate ? { ...update, createdBy: adminId } : update;
}

export function mapDocumentToPublicBlogPost(post: BlogPostDocument): PublicBlogPost {
  return {
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    publishedAt: (post.publishedAt || post.createdAt).toISOString().slice(0, 10),
    updatedAt: (post.updatedContentAt || post.updatedAt)?.toISOString().slice(0, 10) || null,
    authorName: post.authorName,
    authorRole: post.authorRole,
    category: categoryLabels[post.category] || "Insights",
    tags: post.tags || [],
    featuredImage: post.coverImage
      ? { src: post.coverImage.url, alt: post.coverImage.alt, label: post.coverImage.label }
      : { src: null, alt: `${post.title} article placeholder`, label: post.title },
    readingTimeMinutes: post.readingTimeMinutes,
    introduction: splitParagraphs(post.introduction),
    sections: post.sections.map((section) => ({
      heading: section.heading,
      paragraphs: splitParagraphs(section.content),
      bullets: section.bullets || []
    })),
    conclusion: splitParagraphs(post.conclusion),
    featured: post.featured,
    published: post.published
  };
}

export function serializeBlogPost(post: BlogPostDocument): SerializedBlogPost {
  return {
    id: post._id.toString(),
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    category: post.category,
    tags: post.tags || [],
    authorName: post.authorName,
    authorRole: post.authorRole,
    readingTimeMinutes: post.readingTimeMinutes,
    introduction: post.introduction,
    sections: post.sections || [],
    conclusion: post.conclusion,
    coverImage: post.coverImage || null,
    status: post.status,
    featured: post.featured,
    published: post.published,
    publishedAt: post.publishedAt?.toISOString() || null,
    seoTitle: post.seoTitle || null,
    seoDescription: post.seoDescription || null,
    updatedContentAt: post.updatedContentAt?.toISOString() || null,
    createdBy: post.createdBy || null,
    updatedBy: post.updatedBy || null,
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString()
  };
}

export function mapLocalBlogPostToInput(post: (typeof localBlogPosts)[number]): BlogPostInput {
  return {
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    category: (localCategoryMap[post.category] || "DIGITAL_STRATEGY") as BlogPostInput["category"],
    tags: post.tags,
    authorName: post.authorName,
    authorRole: post.authorRole,
    readingTimeMinutes: post.readingTimeMinutes,
    introduction: post.introduction.join("\n\n"),
    sections: post.sections.map((section) => ({
      heading: section.heading,
      content: section.paragraphs.join("\n\n"),
      bullets: []
    })),
    conclusion: post.conclusion.join("\n\n"),
    coverImage: post.featuredImage.src
      ? { url: post.featuredImage.src, alt: post.featuredImage.alt, label: post.featuredImage.label, publicId: null }
      : null,
    status: "DRAFT",
    featured: false,
    published: false,
    publishedAt: null,
    seoTitle: post.title,
    seoDescription: post.excerpt
  };
}

export function rankRelatedPosts(posts: PublicBlogPost[], currentPost: PublicBlogPost) {
  return posts
    .filter((post) => post.slug !== currentPost.slug)
    .map((post) => ({
      post,
      score:
        (post.category === currentPost.category ? 3 : 0) +
        post.tags.filter((tag) => currentPost.tags.includes(tag)).length
    }))
    .sort((left, right) => right.score - left.score || right.post.publishedAt.localeCompare(left.post.publishedAt))
    .map((item) => item.post);
}

async function getPublishedMongoPosts() {
  await connectToDatabase();
  return BlogPost.find({ published: true, status: "PUBLISHED", archivedAt: null })
    .sort({ featured: -1, publishedAt: -1, updatedAt: -1 })
    .lean();
}

function shouldUseLocalFallback() {
  return !process.env.MONGODB_URI || process.env.NODE_ENV !== "production";
}

function splitParagraphs(value: string) {
  return value.split(/\n{2,}/).map((paragraph) => paragraph.trim()).filter(Boolean);
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
