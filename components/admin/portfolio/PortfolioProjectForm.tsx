"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { SerializedPortfolioProject } from "@/lib/portfolio/types";
import { slugifyProjectTitle } from "@/lib/portfolio/validation";

type PortfolioProjectFormProps = {
  project?: SerializedPortfolioProject;
  mode: "create" | "edit";
  canPublish: boolean;
};

type FormState = {
  title: string;
  slug: string;
  category: string;
  shortDescription: string;
  overview: string;
  clientName: string;
  clientType: string;
  status: string;
  completionYear: string;
  services: string;
  technologies: string;
  challenges: string;
  solution: string;
  keyFeatures: string;
  results: string;
  coverImageUrl: string;
  coverImageAlt: string;
  coverImageLabel: string;
  coverImagePublicId: string;
  galleryImages: string;
  liveUrl: string;
  githubUrl: string;
  featured: boolean;
  published: boolean;
  sortOrder: string;
  seoTitle: string;
  seoDescription: string;
};

const blankState: FormState = {
  title: "",
  slug: "",
  category: "BUSINESS_SYSTEM",
  shortDescription: "",
  overview: "",
  clientName: "Internal Project",
  clientType: "INTERNAL",
  status: "PLANNING",
  completionYear: "Pending",
  services: "",
  technologies: "",
  challenges: "",
  solution: "",
  keyFeatures: "",
  results: "",
  coverImageUrl: "",
  coverImageAlt: "",
  coverImageLabel: "",
  coverImagePublicId: "",
  galleryImages: "",
  liveUrl: "",
  githubUrl: "",
  featured: false,
  published: false,
  sortOrder: "0",
  seoTitle: "",
  seoDescription: ""
};

export function PortfolioProjectForm({ project, mode, canPublish }: PortfolioProjectFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(() => project ? stateFromProject(project) : blankState);
  const [dirty, setDirty] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const endpoint = mode === "create" ? "/api/admin/portfolio" : `/api/admin/portfolio/${project?.id}`;

  useEffect(() => {
    const handler = (event: BeforeUnloadEvent) => {
      if (dirty) {
        event.preventDefault();
      }
    };

    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  const payload = useMemo(() => toPayload(form), [form]);

  const update = (field: keyof FormState, value: string | boolean) => {
    setForm((current) => {
      const next = { ...current, [field]: value };
      if (field === "title" && !current.slug) {
        next.slug = slugifyProjectTitle(String(value));
      }
      return next;
    });
    setDirty(true);
    setStatus(null);
  };

  const uploadCover = async (file: File) => {
    setIsUploading(true);
    setStatus(null);
    const uploadData = new FormData();
    uploadData.set("file", file);

    try {
      const response = await fetch("/api/admin/uploads/project-image", { method: "POST", body: uploadData });
      const result = (await response.json()) as { message?: string; image?: { url: string; publicId?: string | null } };
      if (!response.ok || !result.image) {
        throw new Error(result.message || "Unable to upload image.");
      }

      setForm((current) => ({
        ...current,
        coverImageUrl: result.image?.url || "",
        coverImagePublicId: result.image?.publicId || "",
        coverImageAlt: current.coverImageAlt || `${current.title || "Project"} cover image`,
        coverImageLabel: current.coverImageLabel || "Cover"
      }));
      setDirty(true);
    } catch (error) {
      setStatus({ type: "error", message: error instanceof Error ? error.message : "Unable to upload image." });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus(null);

    try {
      const response = await fetch(endpoint, {
        method: mode === "create" ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const result = (await response.json()) as { message?: string; redirectTo?: string; errors?: Record<string, string> };
      if (!response.ok) {
        const firstError = result.errors ? Object.values(result.errors)[0] : null;
        throw new Error(firstError || result.message || "Unable to save project.");
      }

      setDirty(false);
      setStatus({ type: "success", message: "Project saved." });
      router.refresh();
      if (result.redirectTo) {
        router.push(result.redirectTo);
      }
    } catch (error) {
      setStatus({ type: "error", message: error instanceof Error ? error.message : "Unable to save project." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="admin-project-form" onSubmit={handleSubmit}>
      <AdminFormSection title="Basic information">
        <AdminField label="Title"><input value={form.title} onChange={(event) => update("title", event.target.value)} required /></AdminField>
        <AdminField label="Slug"><input value={form.slug} onChange={(event) => update("slug", slugifyProjectTitle(event.target.value))} required /></AdminField>
        <AdminField label="Category"><Select value={form.category} onChange={(value) => update("category", value)} options={["WEBSITE", "MOBILE_APP", "BUSINESS_SYSTEM", "BRANDING", "UI_UX", "OTHER"]} /></AdminField>
        <AdminField label="Short description"><textarea value={form.shortDescription} onChange={(event) => update("shortDescription", event.target.value)} required rows={3} /></AdminField>
        <AdminField label="Client name"><input value={form.clientName} onChange={(event) => update("clientName", event.target.value)} /></AdminField>
        <AdminField label="Client type"><Select value={form.clientType} onChange={(value) => update("clientType", value)} options={["CLIENT", "INTERNAL", "CONFIDENTIAL"]} /></AdminField>
        <AdminField label="Status"><Select value={form.status} onChange={(value) => update("status", value)} options={["PLANNING", "IN_PROGRESS", "COMPLETED", "MAINTENANCE"]} /></AdminField>
        <AdminField label="Completion year"><input value={form.completionYear} onChange={(event) => update("completionYear", event.target.value)} /></AdminField>
      </AdminFormSection>

      <AdminFormSection title="Case study">
        <AdminField label="Overview"><textarea value={form.overview} onChange={(event) => update("overview", event.target.value)} rows={5} /></AdminField>
        <AdminField label="Challenges"><textarea value={form.challenges} onChange={(event) => update("challenges", event.target.value)} rows={4} /></AdminField>
        <AdminField label="Solution"><textarea value={form.solution} onChange={(event) => update("solution", event.target.value)} rows={5} /></AdminField>
        <AdminField label="Key features"><textarea value={form.keyFeatures} onChange={(event) => update("keyFeatures", event.target.value)} rows={4} /></AdminField>
        <AdminField label="Results"><textarea value={form.results} onChange={(event) => update("results", event.target.value)} rows={4} /></AdminField>
      </AdminFormSection>

      <AdminFormSection title="Technical">
        <AdminField label="Services"><textarea value={form.services} onChange={(event) => update("services", event.target.value)} rows={3} /></AdminField>
        <AdminField label="Technologies"><textarea value={form.technologies} onChange={(event) => update("technologies", event.target.value)} rows={3} /></AdminField>
        <AdminField label="Live URL"><input value={form.liveUrl} onChange={(event) => update("liveUrl", event.target.value)} placeholder="https://example.com" /></AdminField>
        <AdminField label="GitHub URL"><input value={form.githubUrl} onChange={(event) => update("githubUrl", event.target.value)} placeholder="https://github.com/..." /></AdminField>
      </AdminFormSection>

      <AdminFormSection title="Media">
        <AdminField label="Upload cover image"><input type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={(event) => event.target.files?.[0] ? uploadCover(event.target.files[0]) : undefined} /></AdminField>
        <AdminField label="Cover image URL"><input value={form.coverImageUrl} onChange={(event) => update("coverImageUrl", event.target.value)} /></AdminField>
        <AdminField label="Cover image alt text"><input value={form.coverImageAlt} onChange={(event) => update("coverImageAlt", event.target.value)} /></AdminField>
        <AdminField label="Cover label"><input value={form.coverImageLabel} onChange={(event) => update("coverImageLabel", event.target.value)} /></AdminField>
        <AdminField label="Gallery images JSON"><textarea value={form.galleryImages} onChange={(event) => update("galleryImages", event.target.value)} rows={5} /></AdminField>
      </AdminFormSection>

      <AdminFormSection title="Publishing">
        {!canPublish ? <p className="admin-muted">Publishing controls are available to admin roles only.</p> : null}
        <label className="admin-checkbox"><input type="checkbox" checked={form.featured} disabled={!canPublish} onChange={(event) => update("featured", event.target.checked)} /> Featured</label>
        <label className="admin-checkbox"><input type="checkbox" checked={form.published} disabled={!canPublish} onChange={(event) => update("published", event.target.checked)} /> Published</label>
        <AdminField label="Sort order"><input type="number" value={form.sortOrder} onChange={(event) => update("sortOrder", event.target.value)} /></AdminField>
        <AdminField label="SEO title"><input value={form.seoTitle} onChange={(event) => update("seoTitle", event.target.value)} /></AdminField>
        <AdminField label="SEO description"><textarea value={form.seoDescription} onChange={(event) => update("seoDescription", event.target.value)} rows={3} /></AdminField>
      </AdminFormSection>

      {status ? <p className={`admin-form-status ${status.type === "success" ? "is-success" : ""}`} role="status">{status.message}</p> : null}
      <div className="admin-form-actions">
        {project ? <a href={`/admin/portfolio/${project.id}/preview`} target="_blank" rel="noreferrer">Preview draft</a> : null}
        <button type="submit" disabled={isSubmitting || isUploading}>{isSubmitting ? "Saving..." : isUploading ? "Uploading..." : "Save project"}</button>
      </div>
    </form>
  );
}

function AdminFormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="admin-card admin-form-section"><h2>{title}</h2><div>{children}</div></section>;
}

function AdminField({ label, children }: { label: string; children: React.ReactNode }) {
  return <label>{label}{children}</label>;
}

function Select({ value, options, onChange }: { value: string; options: string[]; onChange: (value: string) => void }) {
  return <select value={value} onChange={(event) => onChange(event.target.value)}>{options.map((option) => <option key={option}>{option}</option>)}</select>;
}

function toPayload(form: FormState) {
  return {
    title: form.title,
    slug: form.slug,
    category: form.category,
    shortDescription: form.shortDescription,
    overview: form.overview,
    clientName: form.clientName,
    clientType: form.clientType,
    services: form.services.split(/\r?\n/).filter(Boolean),
    technologies: form.technologies.split(/\r?\n/).filter(Boolean),
    challenges: form.challenges.split(/\r?\n/).filter(Boolean),
    solution: form.solution,
    keyFeatures: form.keyFeatures.split(/\r?\n/).filter(Boolean),
    results: form.results.split(/\r?\n/).filter(Boolean),
    coverImage: form.coverImageUrl ? { url: form.coverImageUrl, alt: form.coverImageAlt, label: form.coverImageLabel || form.title, publicId: form.coverImagePublicId || null } : null,
    galleryImages: parseGalleryImages(form.galleryImages),
    liveUrl: form.liveUrl || null,
    githubUrl: form.githubUrl || null,
    status: form.status,
    completionYear: form.completionYear,
    featured: form.featured,
    published: form.published,
    sortOrder: Number.parseInt(form.sortOrder || "0", 10),
    seoTitle: form.seoTitle || null,
    seoDescription: form.seoDescription || null
  };
}

function parseGalleryImages(value: string) {
  if (!value.trim()) {
    return [];
  }

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function stateFromProject(project: SerializedPortfolioProject): FormState {
  return {
    title: project.title,
    slug: project.slug,
    category: project.category,
    shortDescription: project.shortDescription,
    overview: project.overview,
    clientName: project.clientName,
    clientType: project.clientType,
    status: project.status,
    completionYear: project.completionYear,
    services: project.services.join("\n"),
    technologies: project.technologies.join("\n"),
    challenges: project.challenges.join("\n"),
    solution: project.solution,
    keyFeatures: project.keyFeatures.join("\n"),
    results: project.results.join("\n"),
    coverImageUrl: project.coverImage?.url || "",
    coverImageAlt: project.coverImage?.alt || "",
    coverImageLabel: project.coverImage?.label || "",
    coverImagePublicId: project.coverImage?.publicId || "",
    galleryImages: JSON.stringify(project.galleryImages, null, 2),
    liveUrl: project.liveUrl || "",
    githubUrl: project.githubUrl || "",
    featured: project.featured,
    published: project.published,
    sortOrder: String(project.sortOrder),
    seoTitle: project.seoTitle || "",
    seoDescription: project.seoDescription || ""
  };
}
