"use client";

import { FormEvent, useEffect, useMemo, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import type { SerializedBlogPost } from "@/lib/blog/types";
import { slugifyBlogTitle } from "@/lib/blog/validation";

type BlogPostFormProps = {
  post?: SerializedBlogPost;
  mode: "create" | "edit";
  canPublish: boolean;
};

type FormSection = {
  heading: string;
  content: string;
  bullets: string;
};

type FormState = {
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  tags: string;
  authorName: string;
  authorRole: string;
  readingTimeMinutes: string;
  introduction: string;
  sections: FormSection[];
  conclusion: string;
  coverImageUrl: string;
  coverImageAlt: string;
  coverImageLabel: string;
  coverImagePublicId: string;
  status: string;
  featured: boolean;
  published: boolean;
  publishedAt: string;
  seoTitle: string;
  seoDescription: string;
};

const blankState: FormState = {
  title: "",
  slug: "",
  excerpt: "",
  category: "DIGITAL_STRATEGY",
  tags: "",
  authorName: "Hillaac ICT Solutions",
  authorRole: "Digital Solutions Team",
  readingTimeMinutes: "5",
  introduction: "",
  sections: [{ heading: "", content: "", bullets: "" }],
  conclusion: "",
  coverImageUrl: "",
  coverImageAlt: "",
  coverImageLabel: "",
  coverImagePublicId: "",
  status: "DRAFT",
  featured: false,
  published: false,
  publishedAt: "",
  seoTitle: "",
  seoDescription: ""
};

export function BlogPostForm({ post, mode, canPublish }: BlogPostFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(() => post ? stateFromPost(post) : blankState);
  const [dirty, setDirty] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const endpoint = mode === "create" ? "/api/admin/blog" : `/api/admin/blog/${post?.id}`;

  useEffect(() => {
    const handler = (event: BeforeUnloadEvent) => {
      if (dirty) event.preventDefault();
    };

    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  const payload = useMemo(() => toPayload(form), [form]);

  const update = (field: keyof FormState, value: string | boolean | FormSection[]) => {
    setForm((current) => {
      const next = { ...current, [field]: value };
      if (field === "title" && !current.slug) {
        next.slug = slugifyBlogTitle(String(value));
      }
      if (field === "published" && value === true) {
        next.status = "PUBLISHED";
        next.publishedAt = next.publishedAt || new Date().toISOString().slice(0, 10);
      }
      if (field === "status" && value !== "PUBLISHED") {
        next.published = false;
        next.featured = false;
      }
      return next;
    });
    setDirty(true);
    setStatus(null);
  };

  const updateSection = (index: number, field: keyof FormSection, value: string) => {
    update("sections", form.sections.map((section, sectionIndex) => sectionIndex === index ? { ...section, [field]: value } : section));
  };

  const uploadCover = async (file: File) => {
    setIsUploading(true);
    setStatus(null);
    const uploadData = new FormData();
    uploadData.set("file", file);

    try {
      const response = await fetch("/api/admin/uploads/blog-image", { method: "POST", body: uploadData });
      const result = (await response.json()) as { message?: string; image?: { url: string; publicId?: string | null } };
      if (!response.ok || !result.image) throw new Error(result.message || "Unable to upload image.");

      setForm((current) => ({
        ...current,
        coverImageUrl: result.image?.url || "",
        coverImagePublicId: result.image?.publicId || "",
        coverImageAlt: current.coverImageAlt || `${current.title || "Article"} cover image`,
        coverImageLabel: current.coverImageLabel || "Article"
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
        throw new Error(firstError || result.message || "Unable to save article.");
      }

      setDirty(false);
      setStatus({ type: "success", message: "Article saved." });
      router.refresh();
      if (result.redirectTo) router.push(result.redirectTo);
    } catch (error) {
      setStatus({ type: "error", message: error instanceof Error ? error.message : "Unable to save article." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="admin-project-form" onSubmit={handleSubmit}>
      <AdminFormSection title="Basic information">
        <AdminField label="Title"><input value={form.title} onChange={(event) => update("title", event.target.value)} required /></AdminField>
        <AdminField label="Slug"><input value={form.slug} onChange={(event) => update("slug", slugifyBlogTitle(event.target.value))} required /></AdminField>
        <AdminField label="Excerpt"><textarea value={form.excerpt} onChange={(event) => update("excerpt", event.target.value)} required rows={3} /></AdminField>
        <AdminField label="Category"><Select value={form.category} onChange={(value) => update("category", value)} options={["DIGITAL_STRATEGY", "OPERATIONS", "BRANDING", "TECHNOLOGY", "BUSINESS_SYSTEMS", "CLOUD", "DESIGN"]} /></AdminField>
        <AdminField label="Tags"><input value={form.tags} onChange={(event) => update("tags", event.target.value)} placeholder="websites, operations, branding" /></AdminField>
        <AdminField label="Reading time"><input type="number" min="1" max="60" value={form.readingTimeMinutes} onChange={(event) => update("readingTimeMinutes", event.target.value)} /></AdminField>
        <AdminField label="Author name"><input value={form.authorName} onChange={(event) => update("authorName", event.target.value)} required /></AdminField>
        <AdminField label="Author role"><input value={form.authorRole} onChange={(event) => update("authorRole", event.target.value)} required /></AdminField>
      </AdminFormSection>

      <AdminFormSection title="Article content">
        <AdminField label="Introduction"><textarea value={form.introduction} onChange={(event) => update("introduction", event.target.value)} required rows={7} /></AdminField>
        <div className="admin-form-wide">
          <div className="admin-section-toolbar">
            <h3>Sections</h3>
            <button type="button" onClick={() => update("sections", [...form.sections, { heading: "", content: "", bullets: "" }])}>Add Section</button>
          </div>
          {form.sections.map((section, index) => (
            <div className="admin-nested-card" key={index}>
              <AdminField label={`Section ${index + 1} heading`}><input value={section.heading} onChange={(event) => updateSection(index, "heading", event.target.value)} required /></AdminField>
              <AdminField label="Content"><textarea value={section.content} onChange={(event) => updateSection(index, "content", event.target.value)} required rows={7} /></AdminField>
              <AdminField label="Bullets"><textarea value={section.bullets} onChange={(event) => updateSection(index, "bullets", event.target.value)} rows={3} /></AdminField>
              <div className="admin-row-actions">
                <button type="button" disabled={index === 0} onClick={() => update("sections", moveSection(form.sections, index, index - 1))}>Move Up</button>
                <button type="button" disabled={index === form.sections.length - 1} onClick={() => update("sections", moveSection(form.sections, index, index + 1))}>Move Down</button>
                <button type="button" disabled={form.sections.length === 1} onClick={() => update("sections", form.sections.filter((_, sectionIndex) => sectionIndex !== index))}>Remove</button>
              </div>
            </div>
          ))}
        </div>
        <AdminField label="Conclusion"><textarea value={form.conclusion} onChange={(event) => update("conclusion", event.target.value)} required rows={6} /></AdminField>
      </AdminFormSection>

      <AdminFormSection title="Media">
        <AdminField label="Upload cover image"><input type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={(event) => event.target.files?.[0] ? uploadCover(event.target.files[0]) : undefined} /></AdminField>
        <AdminField label="Cover image URL"><input value={form.coverImageUrl} onChange={(event) => update("coverImageUrl", event.target.value)} /></AdminField>
        <AdminField label="Cover image alt text"><input value={form.coverImageAlt} onChange={(event) => update("coverImageAlt", event.target.value)} /></AdminField>
        <AdminField label="Cover label"><input value={form.coverImageLabel} onChange={(event) => update("coverImageLabel", event.target.value)} /></AdminField>
      </AdminFormSection>

      <AdminFormSection title="Publishing and SEO">
        {!canPublish ? <p className="admin-muted">Publishing controls are available to admin roles only.</p> : null}
        <AdminField label="Status"><Select value={form.status} onChange={(value) => update("status", value)} options={["DRAFT", "IN_REVIEW", "PUBLISHED", "ARCHIVED"]} /></AdminField>
        <AdminField label="Published date"><input type="date" value={form.publishedAt} disabled={!canPublish} onChange={(event) => update("publishedAt", event.target.value)} /></AdminField>
        <label className="admin-checkbox"><input type="checkbox" checked={form.published} disabled={!canPublish} onChange={(event) => update("published", event.target.checked)} /> Published</label>
        <label className="admin-checkbox"><input type="checkbox" checked={form.featured} disabled={!canPublish || !form.published} onChange={(event) => update("featured", event.target.checked)} /> Featured</label>
        <AdminField label="SEO title"><input value={form.seoTitle} onChange={(event) => update("seoTitle", event.target.value)} /></AdminField>
        <AdminField label="SEO description"><textarea value={form.seoDescription} onChange={(event) => update("seoDescription", event.target.value)} rows={3} /></AdminField>
      </AdminFormSection>

      {status ? <p className={`admin-form-status ${status.type === "success" ? "is-success" : ""}`} role="status">{status.message}</p> : null}
      <div className="admin-form-actions">
        {post ? <a href={`/admin/blog/${post.id}/preview`} target="_blank" rel="noreferrer">Preview draft</a> : null}
        <button type="submit" disabled={isSubmitting || isUploading}>{isSubmitting ? "Saving..." : isUploading ? "Uploading..." : "Save article"}</button>
      </div>
    </form>
  );
}

function AdminFormSection({ title, children }: { title: string; children: ReactNode }) {
  return <section className="admin-card admin-form-section"><h2>{title}</h2><div>{children}</div></section>;
}

function AdminField({ label, children }: { label: string; children: ReactNode }) {
  return <label>{label}{children}</label>;
}

function Select({ value, options, onChange }: { value: string; options: string[]; onChange: (value: string) => void }) {
  return <select value={value} onChange={(event) => onChange(event.target.value)}>{options.map((option) => <option key={option}>{option}</option>)}</select>;
}

function toPayload(form: FormState) {
  return {
    title: form.title,
    slug: form.slug,
    excerpt: form.excerpt,
    category: form.category,
    tags: splitList(form.tags),
    authorName: form.authorName,
    authorRole: form.authorRole,
    readingTimeMinutes: Number.parseInt(form.readingTimeMinutes || "5", 10),
    introduction: form.introduction,
    sections: form.sections.map((section) => ({
      heading: section.heading,
      content: section.content,
      bullets: splitLines(section.bullets)
    })),
    conclusion: form.conclusion,
    coverImage: form.coverImageUrl ? { url: form.coverImageUrl, alt: form.coverImageAlt, label: form.coverImageLabel || form.title, publicId: form.coverImagePublicId || null } : null,
    status: form.status,
    featured: form.featured,
    published: form.published,
    publishedAt: form.publishedAt || null,
    seoTitle: form.seoTitle || null,
    seoDescription: form.seoDescription || null
  };
}

function stateFromPost(post: SerializedBlogPost): FormState {
  return {
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    category: post.category,
    tags: post.tags.join(", "),
    authorName: post.authorName,
    authorRole: post.authorRole,
    readingTimeMinutes: String(post.readingTimeMinutes),
    introduction: post.introduction,
    sections: post.sections.length > 0 ? post.sections.map((section) => ({ heading: section.heading, content: section.content, bullets: section.bullets.join("\n") })) : blankState.sections,
    conclusion: post.conclusion,
    coverImageUrl: post.coverImage?.url || "",
    coverImageAlt: post.coverImage?.alt || "",
    coverImageLabel: post.coverImage?.label || "",
    coverImagePublicId: post.coverImage?.publicId || "",
    status: post.status,
    featured: post.featured,
    published: post.published,
    publishedAt: post.publishedAt ? post.publishedAt.slice(0, 10) : "",
    seoTitle: post.seoTitle || "",
    seoDescription: post.seoDescription || ""
  };
}

function moveSection(sections: FormSection[], from: number, to: number) {
  const next = [...sections];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

function splitList(value: string) {
  return value.split(",").map((item) => item.trim()).filter(Boolean);
}

function splitLines(value: string) {
  return value.split(/\r?\n/).map((item) => item.trim()).filter(Boolean);
}
