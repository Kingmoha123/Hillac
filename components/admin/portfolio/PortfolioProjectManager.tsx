"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { SerializedPortfolioProject } from "@/lib/portfolio/types";

type ListResult = {
  projects: SerializedPortfolioProject[];
  page: number;
  totalPages: number;
  total: number;
};

type PortfolioProjectManagerProps = {
  canPublish: boolean;
  canDelete: boolean;
};

export function PortfolioProjectManager({ canPublish, canDelete }: PortfolioProjectManagerProps) {
  const [projects, setProjects] = useState<SerializedPortfolioProject[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ALL");
  const [status, setStatus] = useState("ALL");
  const [published, setPublished] = useState("ALL");
  const [featured, setFeatured] = useState("ALL");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [projectPendingDelete, setProjectPendingDelete] = useState<SerializedPortfolioProject | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams({ page: String(page), category, status, published, featured });
    if (search.trim()) params.set("search", search.trim());

    setIsLoading(true);
    fetch(`/api/admin/portfolio?${params}`, { signal: controller.signal })
      .then(async (response) => {
        const result = (await response.json()) as ListResult & { message?: string };
        if (!response.ok) throw new Error(result.message || "Unable to load projects.");
        setProjects(result.projects);
        setTotalPages(result.totalPages);
        setError(null);
      })
      .catch((loadError) => {
        if (!controller.signal.aborted) setError(loadError instanceof Error ? loadError.message : "Unable to load projects.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });

    return () => controller.abort();
  }, [category, featured, page, published, search, status]);

  const togglePublished = async (project: SerializedPortfolioProject) => {
    const response = await fetch(`/api/admin/portfolio/${project.id}/publish`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !project.published })
    });
    const result = (await response.json()) as { project?: SerializedPortfolioProject; message?: string };
    if (!response.ok || !result.project) {
      setError(result.message || "Unable to update publishing state.");
      return;
    }

    const updatedProject = result.project;
    setProjects((current) => current.map((item) => (item.id === project.id ? updatedProject : item)));
  };

  const deleteProject = async () => {
    if (!projectPendingDelete) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/portfolio/${projectPendingDelete.id}`, { method: "DELETE" });
      if (!response.ok) {
        setError("Unable to delete project.");
        return;
      }

      setProjects((current) => current.filter((item) => item.id !== projectPendingDelete.id));
      setProjectPendingDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <section className="admin-page">
      <div className="admin-page-heading">
        <div>
          <span className="admin-eyebrow">Portfolio CMS</span>
          <h1>Portfolio Projects</h1>
          <p>Manage case studies, publishing state, featured projects, and draft previews.</p>
        </div>
        <Link className="admin-primary-link" href="/admin/portfolio/new">Add Project</Link>
      </div>

      <div className="admin-card admin-filter-bar">
        <input placeholder="Search title" value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} />
        <select value={category} onChange={(event) => { setCategory(event.target.value); setPage(1); }}><option>ALL</option><option>WEBSITE</option><option>MOBILE_APP</option><option>BUSINESS_SYSTEM</option><option>BRANDING</option><option>UI_UX</option><option>OTHER</option></select>
        <select value={status} onChange={(event) => { setStatus(event.target.value); setPage(1); }}><option>ALL</option><option>PLANNING</option><option>IN_PROGRESS</option><option>COMPLETED</option><option>MAINTENANCE</option></select>
        <select value={published} onChange={(event) => { setPublished(event.target.value); setPage(1); }}><option value="ALL">Any publish state</option><option value="true">Published</option><option value="false">Draft</option></select>
        <select value={featured} onChange={(event) => { setFeatured(event.target.value); setPage(1); }}><option value="ALL">Any featured state</option><option value="true">Featured</option><option value="false">Not featured</option></select>
      </div>

      {isLoading ? <p className="admin-muted">Loading projects...</p> : null}
      {error ? <p className="admin-form-status" role="alert">{error}</p> : null}
      {!isLoading && !error && projects.length === 0 ? <p className="admin-muted">No projects match the current filters.</p> : null}

      {projects.length > 0 ? (
        <div className="admin-card admin-table-card">
          <table className="admin-table">
            <thead><tr><th>Title</th><th>Category</th><th>Status</th><th>Published</th><th>Featured</th><th>Year</th><th>Updated</th><th>Actions</th></tr></thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id}>
                  <td><strong>{project.title}</strong><span>{project.slug}</span></td>
                  <td>{project.category}</td>
                  <td>{project.status}</td>
                  <td>{project.published ? "Published" : "Draft"}</td>
                  <td>{project.featured ? "Featured" : "-"}</td>
                  <td>{project.completionYear}</td>
                  <td>{new Date(project.updatedAt).toLocaleDateString()}</td>
                  <td>
                    <div className="admin-row-actions">
                      <Link href={`/admin/portfolio/${project.id}/edit`}>Edit</Link>
                      <Link href={`/admin/portfolio/${project.id}/preview`}>Preview</Link>
                      {project.published ? <Link href={`/portfolio/${project.slug}`}>Public</Link> : null}
                      {canPublish ? <button type="button" onClick={() => togglePublished(project)}>{project.published ? "Unpublish" : "Publish"}</button> : null}
                      {canDelete ? <button type="button" onClick={() => setProjectPendingDelete(project)}>Delete</button> : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      <div className="admin-pagination">
        <button type="button" disabled={page <= 1} onClick={() => setPage((value) => Math.max(1, value - 1))}>Previous</button>
        <span>Page {page} of {totalPages}</span>
        <button type="button" disabled={page >= totalPages} onClick={() => setPage((value) => value + 1)}>Next</button>
      </div>

      {projectPendingDelete ? (
        <div className="admin-modal-backdrop" role="presentation">
          <div
            className="admin-confirm-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-project-title"
            aria-describedby="delete-project-description"
          >
            <span className="admin-dialog-eyebrow">Confirm Delete</span>
            <h2 id="delete-project-title">Delete this project?</h2>
            <p id="delete-project-description">
              You are about to remove <strong>{projectPendingDelete.title}</strong> from the admin list and public portfolio.
              This action cannot be undone from this screen.
            </p>
            <div className="admin-dialog-actions">
              <button type="button" className="admin-secondary-action" onClick={() => setProjectPendingDelete(null)} disabled={isDeleting}>
                Cancel
              </button>
              <button type="button" className="admin-danger-action" onClick={deleteProject} disabled={isDeleting}>
                {isDeleting ? "Deleting..." : "Delete Project"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
