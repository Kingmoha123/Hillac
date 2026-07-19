import type { ClientType, ProjectCategory, ProjectImageDocument, ProjectStatus } from "@/models/PortfolioProject";

export type PortfolioProjectInput = {
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
  coverImage: ProjectImageDocument | null;
  galleryImages: ProjectImageDocument[];
  liveUrl: string | null;
  githubUrl: string | null;
  status: ProjectStatus;
  completionYear: string;
  featured: boolean;
  published: boolean;
  sortOrder: number;
  seoTitle: string | null;
  seoDescription: string | null;
};

export type SerializedPortfolioProject = PortfolioProjectInput & {
  id: string;
  createdBy: string | null;
  updatedBy: string | null;
  createdAt: string;
  updatedAt: string;
};
