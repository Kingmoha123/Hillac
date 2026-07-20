import { BlogPostManager } from "@/components/admin/blog/BlogPostManager";
import { requireAdminSession } from "@/lib/admin/session";
import { canManageBlog } from "@/lib/blog/permissions";

export const metadata = {
  title: "Blog Management | Hillaac Admin"
};

export default async function AdminBlogPage() {
  const admin = await requireAdminSession();

  return (
    <BlogPostManager
      canPublish={canManageBlog(admin.role, "publish")}
      canDelete={canManageBlog(admin.role, "delete")}
    />
  );
}
