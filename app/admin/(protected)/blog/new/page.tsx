import Link from "next/link";
import { BlogPostForm } from "@/components/admin/blog/BlogPostForm";
import { requireAdminSession } from "@/lib/admin/session";
import { canManageBlog } from "@/lib/blog/permissions";

export const metadata = {
  title: "New Blog Article | Hillaac Admin"
};

export default async function NewBlogPostPage() {
  const admin = await requireAdminSession();

  return (
    <section className="admin-page">
      <Link className="admin-back-link" href="/admin/blog">Back to Blog</Link>
      <div className="admin-page-heading">
        <div>
          <span className="admin-eyebrow">Blog CMS</span>
          <h1>New Article</h1>
          <p>Create a draft article for review, preview, and publishing.</p>
        </div>
      </div>
      <BlogPostForm mode="create" canPublish={canManageBlog(admin.role, "publish")} />
    </section>
  );
}
