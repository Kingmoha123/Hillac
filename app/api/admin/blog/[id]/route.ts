import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getCurrentAdminFromRequest } from "@/lib/admin/session";
import { canManageBlog } from "@/lib/blog/permissions";
import { createBlogPostUpdate, getAdminBlogPostById, isBlogSlugAvailable, serializeBlogPost } from "@/lib/blog/repository";
import { validateBlogPostPayload } from "@/lib/blog/validation";
import { connectToDatabase } from "@/lib/db";
import { BlogPost } from "@/models/BlogPost";

type RouteContext = {
  params: {
    id: string;
  };
};

export async function GET(request: Request, { params }: RouteContext) {
  const admin = await getCurrentAdminFromRequest(request);
  if (!admin || !canManageBlog(admin.role, "read")) {
    return NextResponse.json({ message: "Authentication required." }, { status: 401 });
  }

  try {
    const post = await getAdminBlogPostById(params.id);
    if (!post) {
      return NextResponse.json({ message: "Article not found." }, { status: 404 });
    }

    return NextResponse.json({ post });
  } catch {
    return NextResponse.json({ message: "Invalid article id." }, { status: 400 });
  }
}

export async function PATCH(request: Request, { params }: RouteContext) {
  const admin = await getCurrentAdminFromRequest(request);
  if (!admin || !canManageBlog(admin.role, "update")) {
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

  try {
    await connectToDatabase();
    const existingPost = await BlogPost.findOne({ _id: params.id, archivedAt: null }).select("published featured status slug publishedAt").lean();
    if (!existingPost) {
      return NextResponse.json({ message: "Article not found." }, { status: 404 });
    }

    const changesPublishingState =
      validation.data.published !== existingPost.published ||
      validation.data.featured !== existingPost.featured ||
      validation.data.status !== existingPost.status;

    if (changesPublishingState && !canManageBlog(admin.role, "publish")) {
      return NextResponse.json({ message: "Not authorized to publish or feature articles." }, { status: 403 });
    }

    const slugAvailable = await isBlogSlugAvailable(validation.data.slug, params.id);
    if (!slugAvailable) {
      return NextResponse.json({ errors: { slug: "Slug is already in use." } }, { status: 409 });
    }

    const post = await BlogPost.findOneAndUpdate(
      { _id: params.id, archivedAt: null },
      { $set: createBlogPostUpdate(validation.data, admin.id, false, existingPost.publishedAt) },
      { new: true }
    );

    if (!post) {
      return NextResponse.json({ message: "Article not found." }, { status: 404 });
    }

    revalidateBlogPaths(existingPost.slug);
    revalidateBlogPaths(post.slug);

    return NextResponse.json({ post: serializeBlogPost(post.toObject()) });
  } catch (error) {
    console.error("Admin blog update failed:", error);
    return NextResponse.json({ message: "Unable to update article." }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteContext) {
  const admin = await getCurrentAdminFromRequest(request);
  if (!admin || !canManageBlog(admin.role, "delete")) {
    return NextResponse.json({ message: "Not authorized." }, { status: 403 });
  }

  try {
    await connectToDatabase();
    const post = await BlogPost.findOneAndUpdate(
      { _id: params.id, archivedAt: null },
      { $set: { archivedAt: new Date(), status: "ARCHIVED", updatedBy: admin.id, published: false, featured: false } },
      { new: true }
    );

    if (!post) {
      return NextResponse.json({ message: "Article not found." }, { status: 404 });
    }

    revalidateBlogPaths(post.slug);
    return NextResponse.json({ message: "Article archived." });
  } catch (error) {
    console.error("Admin blog archive failed:", error);
    return NextResponse.json({ message: "Unable to archive article." }, { status: 500 });
  }
}

function revalidateBlogPaths(slug: string) {
  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  revalidatePath("/sitemap.xml");
}
