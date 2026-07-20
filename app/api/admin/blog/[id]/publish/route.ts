import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getCurrentAdminFromRequest } from "@/lib/admin/session";
import { canManageBlog } from "@/lib/blog/permissions";
import { serializeBlogPost } from "@/lib/blog/repository";
import { connectToDatabase } from "@/lib/db";
import { BlogPost } from "@/models/BlogPost";

type RouteContext = {
  params: {
    id: string;
  };
};

export async function POST(request: Request, { params }: RouteContext) {
  const admin = await getCurrentAdminFromRequest(request);
  if (!admin || !canManageBlog(admin.role, "publish")) {
    return NextResponse.json({ message: "Not authorized." }, { status: 403 });
  }

  const payload = (await request.json().catch(() => null)) as { published?: boolean; featured?: boolean } | null;

  try {
    await connectToDatabase();
    const current = await BlogPost.findOne({ _id: params.id, archivedAt: null }).select("publishedAt slug").lean();
    if (!current) {
      return NextResponse.json({ message: "Article not found." }, { status: 404 });
    }

    const update: Record<string, unknown> = { updatedBy: admin.id, updatedContentAt: new Date() };
    if (typeof payload?.published === "boolean") {
      update.published = payload.published;
      update.status = payload.published ? "PUBLISHED" : "DRAFT";
      update.publishedAt = payload.published ? current.publishedAt || new Date() : null;
      if (!payload.published) update.featured = false;
    }

    if (typeof payload?.featured === "boolean" && canManageBlog(admin.role, "feature")) {
      update.featured = payload.featured;
    }

    const post = await BlogPost.findOneAndUpdate({ _id: params.id, archivedAt: null }, { $set: update }, { new: true });
    if (!post) {
      return NextResponse.json({ message: "Article not found." }, { status: 404 });
    }

    revalidateBlogPaths(current.slug);
    revalidateBlogPaths(post.slug);
    return NextResponse.json({ post: serializeBlogPost(post.toObject()) });
  } catch (error) {
    console.error("Admin blog publish failed:", error);
    return NextResponse.json({ message: "Unable to update publishing state." }, { status: 500 });
  }
}

function revalidateBlogPaths(slug: string) {
  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  revalidatePath("/sitemap.xml");
}
