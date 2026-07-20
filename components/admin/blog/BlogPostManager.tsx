"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { SerializedBlogPost } from "@/lib/blog/types";

type ListResult = {
  posts: SerializedBlogPost[];
  page: number;
  totalPages: number;
  total: number;
};

type BlogPostManagerProps = {
  canPublish: boolean;
  canDelete: boolean;
};

export function BlogPostManager({ canPublish, canDelete }: BlogPostManagerProps) {
  const [posts, setPosts] = useState<SerializedBlogPost[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ALL");
  const [status, setStatus] = useState("ALL");
  const [published, setPublished] = useState("ALL");
  const [featured, setFeatured] = useState("ALL");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [postPendingDelete, setPostPendingDelete] = useState<SerializedBlogPost | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams({ page: String(page), category, status, published, featured });
    if (search.trim()) params.set("search", search.trim());

    setIsLoading(true);
    fetch(`/api/admin/blog?${params}`, { signal: controller.signal })
      .then(async (response) => {
        const result = (await response.json()) as ListResult & { message?: string };
        if (!response.ok) throw new Error(result.message || "Unable to load articles.");
        setPosts(result.posts);
        setTotalPages(result.totalPages);
        setError(null);
      })
      .catch((loadError) => {
        if (!controller.signal.aborted) setError(loadError instanceof Error ? loadError.message : "Unable to load articles.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });

    return () => controller.abort();
  }, [category, featured, page, published, search, status]);

  const togglePublished = async (post: SerializedBlogPost) => {
    const response = await fetch(`/api/admin/blog/${post.id}/publish`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !post.published })
    });
    const result = (await response.json()) as { post?: SerializedBlogPost; message?: string };
    if (!response.ok || !result.post) {
      setError(result.message || "Unable to update publishing state.");
      return;
    }

    setPosts((current) => current.map((item) => (item.id === post.id ? result.post as SerializedBlogPost : item)));
  };

  const archivePost = async () => {
    if (!postPendingDelete) return;

    setIsDeleting(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/blog/${postPendingDelete.id}`, { method: "DELETE" });
      if (!response.ok) {
        setError("Unable to archive article.");
        return;
      }

      setPosts((current) => current.filter((item) => item.id !== postPendingDelete.id));
      setPostPendingDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <section className="admin-page">
      <div className="admin-page-heading">
        <div>
          <span className="admin-eyebrow">Blog CMS</span>
          <h1>Blog Articles</h1>
          <p>Manage drafts, publishing state, featured articles, and protected previews.</p>
        </div>
        <Link className="admin-primary-link" href="/admin/blog/new">Add Article</Link>
      </div>

      <div className="admin-card admin-filter-bar">
        <input placeholder="Search title" value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} />
        <select value={category} onChange={(event) => { setCategory(event.target.value); setPage(1); }}><option>ALL</option><option>DIGITAL_STRATEGY</option><option>OPERATIONS</option><option>BRANDING</option><option>TECHNOLOGY</option><option>BUSINESS_SYSTEMS</option><option>CLOUD</option><option>DESIGN</option></select>
        <select value={status} onChange={(event) => { setStatus(event.target.value); setPage(1); }}><option>ALL</option><option>DRAFT</option><option>IN_REVIEW</option><option>PUBLISHED</option><option>ARCHIVED</option></select>
        <select value={published} onChange={(event) => { setPublished(event.target.value); setPage(1); }}><option value="ALL">Any publish state</option><option value="true">Published</option><option value="false">Draft</option></select>
        <select value={featured} onChange={(event) => { setFeatured(event.target.value); setPage(1); }}><option value="ALL">Any featured state</option><option value="true">Featured</option><option value="false">Not featured</option></select>
      </div>

      {isLoading ? <p className="admin-muted">Loading articles...</p> : null}
      {error ? <p className="admin-form-status" role="alert">{error}</p> : null}
      {!isLoading && !error && posts.length === 0 ? <p className="admin-muted">No articles match the current filters.</p> : null}

      {posts.length > 0 ? (
        <div className="admin-card admin-table-card">
          <table className="admin-table">
            <thead><tr><th>Title</th><th>Category</th><th>Status</th><th>Published</th><th>Featured</th><th>Author</th><th>Updated</th><th>Actions</th></tr></thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id}>
                  <td><strong>{post.title}</strong><span>{post.slug}</span></td>
                  <td>{post.category}</td>
                  <td>{post.status}</td>
                  <td>{post.published ? "Published" : "Draft"}</td>
                  <td>{post.featured ? "Featured" : "-"}</td>
                  <td>{post.authorName}</td>
                  <td>{new Date(post.updatedAt).toLocaleDateString()}</td>
                  <td>
                    <div className="admin-row-actions">
                      <Link href={`/admin/blog/${post.id}/edit`}>Edit</Link>
                      <Link href={`/admin/blog/${post.id}/preview`}>Preview</Link>
                      {post.published ? <Link href={`/blog/${post.slug}`}>Public</Link> : null}
                      {canPublish ? <button type="button" onClick={() => togglePublished(post)}>{post.published ? "Unpublish" : "Publish"}</button> : null}
                      {canDelete ? <button type="button" onClick={() => setPostPendingDelete(post)}>Delete</button> : null}
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

      {postPendingDelete ? (
        <div className="admin-modal-backdrop" role="presentation">
          <div className="admin-confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="delete-article-title" aria-describedby="delete-article-description">
            <span className="admin-dialog-eyebrow">Confirm Delete</span>
            <h2 id="delete-article-title">Delete this article?</h2>
            <p id="delete-article-description">
              You are about to remove <strong>{postPendingDelete.title}</strong> from the admin list and public blog.
              This action cannot be undone from this screen.
            </p>
            <div className="admin-dialog-actions">
              <button type="button" className="admin-secondary-action" onClick={() => setPostPendingDelete(null)} disabled={isDeleting}>
                Cancel
              </button>
              <button type="button" className="admin-danger-action" onClick={archivePost} disabled={isDeleting}>
                {isDeleting ? "Deleting..." : "Delete Article"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
