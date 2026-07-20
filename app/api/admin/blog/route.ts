import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getCurrentAdminFromRequest } from "@/lib/admin/session";
import { canManageBlog } from "@/lib/blog/permissions";
import { createBlogPostUpdate, isBlogSlugAvailable, listAdminBlogPosts, serializeBlogPost } from "@/lib/blog/repository";
import { validateBlogPostPayload } from "@/lib/blog/validation";
import { connectToDatabase } from "@/lib/db";
import { BlogPost } from "@/models/BlogPost";

export async function GET(request: Request) {
  const admin = await getCurrentAdminFromRequest(request);
  if (!admin || !canManageBlog(admin.role, "read")) {
    return NextResponse.json({ message: "Authentication required." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const result = await listAdminBlogPosts({
    search: searchParams.get("search") || undefined,
    category: searchParams.get("category") || "ALL",
    status: searchParams.get("status") || "ALL",
    published: searchParams.get("published") || "ALL",
    featured: searchParams.get("featured") || "ALL",
    page: Number.parseInt(searchParams.get("page") || "1", 10)
  });

  return NextResponse.json(result);
}

export async function POST(request: Request) {
  const admin = await getCurrentAdminFromRequest(request);
  if (!admin || !canManageBlog(admin.role, "create")) {
    return NextResponse.json({ message: "Not authorized." }, { status: 403 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid article payload." }, { status: 400 });
  }

  const validation = validateBlogPostPayload(payload);
  if (!validation.success) {
    return NextResponse.json({ errors: validation.errors, message: "Please fix the highlighted fields." }, { status: 400 });
  }

  if ((validation.data.published || validation.data.featured || validation.data.status === "PUBLISHED") && !canManageBlog(admin.role, "publish")) {
    return NextResponse.json({ message: "Not authorized to publish or feature articles." }, { status: 403 });
  }

  try {
    await connectToDatabase();
    const slugAvailable = await isBlogSlugAvailable(validation.data.slug);
    if (!slugAvailable) {
      return NextResponse.json({ errors: { slug: "Slug is already in use." } }, { status: 409 });
    }

    const post = await BlogPost.create(createBlogPostUpdate(validation.data, admin.id, true));
    revalidateBlogPaths(post.slug);

    return NextResponse.json({ post: serializeBlogPost(post.toObject()), redirectTo: `/admin/blog/${post._id.toString()}/edit` }, { status: 201 });
  } catch (error) {
    console.error("Admin blog create failed:", error);
    return NextResponse.json({ message: "Unable to create article." }, { status: 500 });
  }
}

function revalidateBlogPaths(slug: string) {
  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  revalidatePath("/sitemap.xml");
}
