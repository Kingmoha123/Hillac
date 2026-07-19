import mongoose, { Model, Schema } from "mongoose";

export const projectCategories = ["WEBSITE", "MOBILE_APP", "BUSINESS_SYSTEM", "BRANDING", "UI_UX", "OTHER"] as const;
export const clientTypes = ["CLIENT", "INTERNAL", "CONFIDENTIAL"] as const;
export const projectStatuses = ["PLANNING", "IN_PROGRESS", "COMPLETED", "MAINTENANCE"] as const;

export type ProjectCategory = (typeof projectCategories)[number];
export type ClientType = (typeof clientTypes)[number];
export type ProjectStatus = (typeof projectStatuses)[number];

export type ProjectImageDocument = {
  url: string;
  alt: string;
  label: string;
  publicId?: string | null;
};

export type PortfolioProjectDocument = {
  _id: string;
  title: string;
  slug: string;
  category: ProjectCategory;
  shortDescription: string;
  overview: string;
  clientName: string;
  clientType: ClientType;
  services: string[];
  technologies: string[];
  challenges: string[];
  solution: string;
  keyFeatures: string[];
  results: string[];
  coverImage?: ProjectImageDocument | null;
  galleryImages: ProjectImageDocument[];
  liveUrl?: string | null;
  githubUrl?: string | null;
  status: ProjectStatus;
  completionYear: string;
  featured: boolean;
  published: boolean;
  sortOrder: number;
  seoTitle?: string | null;
  seoDescription?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  archivedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

const projectImageSchema = new Schema<ProjectImageDocument>(
  {
    url: { type: String, required: true, trim: true },
    alt: { type: String, required: true, trim: true, maxlength: 160 },
    label: { type: String, required: true, trim: true, maxlength: 80 },
    publicId: { type: String, default: null, trim: true }
  },
  { _id: false }
);

const portfolioProjectSchema = new Schema<PortfolioProjectDocument>(
  {
    title: { type: String, required: true, trim: true, minlength: 2, maxlength: 120 },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 140, index: true },
    category: { type: String, enum: projectCategories, required: true },
    shortDescription: { type: String, required: true, trim: true, minlength: 20, maxlength: 240 },
    overview: { type: String, default: "", trim: true, maxlength: 2000 },
    clientName: { type: String, default: "Internal Project", trim: true, maxlength: 120 },
    clientType: { type: String, enum: clientTypes, default: "INTERNAL", required: true },
    services: { type: [String], default: [] },
    technologies: { type: [String], default: [] },
    challenges: { type: [String], default: [] },
    solution: { type: String, default: "", trim: true, maxlength: 2000 },
    keyFeatures: { type: [String], default: [] },
    results: { type: [String], default: [] },
    coverImage: { type: projectImageSchema, default: null },
    galleryImages: { type: [projectImageSchema], default: [] },
    liveUrl: { type: String, default: null, trim: true },
    githubUrl: { type: String, default: null, trim: true },
    status: { type: String, enum: projectStatuses, default: "PLANNING", required: true },
    completionYear: { type: String, default: "Pending", trim: true, maxlength: 20 },
    featured: { type: Boolean, default: false },
    published: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 },
    seoTitle: { type: String, default: null, trim: true, maxlength: 70 },
    seoDescription: { type: String, default: null, trim: true, maxlength: 180 },
    createdBy: { type: String, default: null },
    updatedBy: { type: String, default: null },
    archivedAt: { type: Date, default: null }
  },
  {
    collection: "portfolio_projects",
    timestamps: true
  }
);

portfolioProjectSchema.index({ published: 1, featured: -1, sortOrder: 1, updatedAt: -1 });
portfolioProjectSchema.index({ archivedAt: 1 });

export const PortfolioProject =
  mongoose.modelNames().includes("PortfolioProject")
    ? mongoose.model<PortfolioProjectDocument>("PortfolioProject")
    : mongoose.model<PortfolioProjectDocument>("PortfolioProject", portfolioProjectSchema);
