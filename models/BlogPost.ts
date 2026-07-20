import { Model, Schema, model, models } from "mongoose";

export const blogCategories = ["DIGITAL_STRATEGY", "OPERATIONS", "BRANDING", "TECHNOLOGY", "BUSINESS_SYSTEMS", "CLOUD", "DESIGN"] as const;
export const blogStatuses = ["DRAFT", "IN_REVIEW", "PUBLISHED", "ARCHIVED"] as const;

export type BlogCategory = (typeof blogCategories)[number];
export type BlogStatus = (typeof blogStatuses)[number];

export type BlogImageDocument = {
  url: string;
  alt: string;
  label: string;
  publicId?: string | null;
};

export type BlogSectionDocument = {
  heading: string;
  content: string;
  bullets: string[];
};

export type BlogPostDocument = {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: BlogCategory;
  tags: string[];
  authorName: string;
  authorRole: string;
  readingTimeMinutes: number;
  introduction: string;
  sections: BlogSectionDocument[];
  conclusion: string;
  coverImage?: BlogImageDocument | null;
  status: BlogStatus;
  featured: boolean;
  published: boolean;
  publishedAt?: Date | null;
  updatedContentAt?: Date | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  archivedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

const blogImageSchema = new Schema<BlogImageDocument>(
  {
    url: { type: String, required: true, trim: true },
    alt: { type: String, required: true, trim: true, maxlength: 180 },
    label: { type: String, required: true, trim: true, maxlength: 80 },
    publicId: { type: String, default: null, trim: true }
  },
  { _id: false }
);

const blogSectionSchema = new Schema<BlogSectionDocument>(
  {
    heading: { type: String, required: true, trim: true, minlength: 2, maxlength: 140 },
    content: { type: String, required: true, trim: true, minlength: 40, maxlength: 4000 },
    bullets: { type: [String], default: [] }
  },
  { _id: false }
);

const blogPostSchema = new Schema<BlogPostDocument>(
  {
    title: { type: String, required: true, trim: true, minlength: 5, maxlength: 140 },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 160, index: true },
    excerpt: { type: String, required: true, trim: true, minlength: 40, maxlength: 260 },
    category: { type: String, enum: blogCategories, default: "DIGITAL_STRATEGY", required: true },
    tags: { type: [String], default: [] },
    authorName: { type: String, required: true, trim: true, maxlength: 100 },
    authorRole: { type: String, required: true, trim: true, maxlength: 120 },
    readingTimeMinutes: { type: Number, required: true, min: 1, max: 60, default: 5 },
    introduction: { type: String, required: true, trim: true, minlength: 80, maxlength: 4000 },
    sections: { type: [blogSectionSchema], default: [] },
    conclusion: { type: String, required: true, trim: true, minlength: 60, maxlength: 3000 },
    coverImage: { type: blogImageSchema, default: null },
    status: { type: String, enum: blogStatuses, default: "DRAFT", required: true },
    featured: { type: Boolean, default: false },
    published: { type: Boolean, default: false },
    publishedAt: { type: Date, default: null },
    updatedContentAt: { type: Date, default: null },
    seoTitle: { type: String, default: null, trim: true, maxlength: 70 },
    seoDescription: { type: String, default: null, trim: true, maxlength: 180 },
    createdBy: { type: String, default: null },
    updatedBy: { type: String, default: null },
    archivedAt: { type: Date, default: null }
  },
  {
    collection: "blog_posts",
    timestamps: true
  }
);

blogPostSchema.index({ published: 1, status: 1, featured: -1, publishedAt: -1 });
blogPostSchema.index({ category: 1, tags: 1 });
blogPostSchema.index({ archivedAt: 1 });

export const BlogPost =
  (models?.BlogPost as Model<BlogPostDocument> | undefined) ||
  model<BlogPostDocument>("BlogPost", blogPostSchema);
