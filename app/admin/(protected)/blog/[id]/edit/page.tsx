import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogPostForm } from "@/components/admin/blog/BlogPostForm";
import { requireAdminSession } from "@/lib/admin/session";
import { canManageBlog } from "@/lib/blog/permissions";
import { getAdminBlogPostById } from "@/lib/blog/repository";

type EditBlogPostPageProps = {
  params: {
    id: string;
  };
};

export const metadata = {
  title: "Edit Blog Article | Hillaac Admin"
};

export default async function EditBlogPostPage({ params }: EditBlogPostPageProps) {
  const admin = await requireAdminSession();
  const post = await getAdminBlogPostById(params.id).catch(() => null);

  if (!post) {
    notFound();
  }

  return (
    <section className="admin-page">
      <Link className="admin-back-link" href="/admin/blog">Back to Blog</Link>
      <div className="admin-page-heading">
        <div>
          <span className="admin-eyebrow">Blog CMS</span>
          <h1>Edit Article</h1>
          <p>Last updated {new Date(post.updatedAt).toLocaleString()}.</p>
        </div>
      </div>
      <BlogPostForm mode="edit" post={post} canPublish={canManageBlog(admin.role, "publish")} />
    </section>
  );
}
