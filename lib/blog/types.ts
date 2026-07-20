import type { BlogCategory, BlogImageDocument, BlogStatus } from "@/models/BlogPost";

export type BlogImage = {
  src: string | null;
  alt: string;
  label: string;
};

export type PublicBlogSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
};

export type PublicBlogPost = {
  title: string;
  slug: string;
  excerpt: string;
  publishedAt: string;
  updatedAt?: string | null;
  authorName: string;
  authorRole: string;
  category: string;
  tags: string[];
  featuredImage: BlogImage;
  readingTimeMinutes: number;
  introduction: string[];
  sections: PublicBlogSection[];
  conclusion: string[];
  featured: boolean;
  published: boolean;
};

export type BlogPostInput = {
  title: string;
  slug: string;
  excerpt: string;
  category: BlogCategory;
  tags: string[];
  authorName: string;
  authorRole: string;
  readingTimeMinutes: number;
  introduction: string;
  sections: {
    heading: string;
    content: string;
    bullets: string[];
  }[];
  conclusion: string;
  coverImage: BlogImageDocument | null;
  status: BlogStatus;
  featured: boolean;
  published: boolean;
  publishedAt: Date | null;
  seoTitle: string | null;
  seoDescription: string | null;
};

export type SerializedBlogPost = Omit<BlogPostInput, "publishedAt"> & {
  id: string;
  publishedAt: string | null;
  updatedContentAt: string | null;
  createdBy: string | null;
  updatedBy: string | null;
  createdAt: string;
  updatedAt: string;
};
