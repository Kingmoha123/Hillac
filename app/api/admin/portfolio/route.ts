import { NextResponse } from "next/server";
import { getCurrentAdminFromRequest } from "@/lib/admin/session";
import { canManagePortfolio } from "@/lib/portfolio/permissions";
import {
  createProjectUpdate,
  isSlugAvailable,
  listAdminPortfolioProjects,
  serializeProject
} from "@/lib/portfolio/repository";
import { validatePortfolioProjectPayload } from "@/lib/portfolio/validation";
import { connectToDatabase } from "@/lib/db";
import { PortfolioProject } from "@/models/PortfolioProject";

export async function GET(request: Request) {
  const admin = await getCurrentAdminFromRequest(request);
  if (!admin || !canManagePortfolio(admin.role, "read")) {
    return NextResponse.json({ message: "Authentication required." }, { status: 401 });
  }

  const url = new URL(request.url);
  const page = Number.parseInt(url.searchParams.get("page") || "1", 10);

  try {
    const result = await listAdminPortfolioProjects({
      search: url.searchParams.get("search") || undefined,
      category: url.searchParams.get("category") || undefined,
      status: url.searchParams.get("status") || undefined,
      published: url.searchParams.get("published") || undefined,
      featured: url.searchParams.get("featured") || undefined,
      page
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Admin portfolio list failed:", error);
    return NextResponse.json({ message: "Unable to load projects." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const admin = await getCurrentAdminFromRequest(request);
  if (!admin || !canManagePortfolio(admin.role, "create")) {
    return NextResponse.json({ message: "Not authorized." }, { status: 403 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid project payload." }, { status: 400 });
  }

  const validation = validatePortfolioProjectPayload(payload);
  if (!validation.success) {
    return NextResponse.json({ errors: validation.errors, message: "Please fix the highlighted fields." }, { status: 400 });
  }

  if ((validation.data.published || validation.data.featured) && !canManagePortfolio(admin.role, "publish")) {
    return NextResponse.json({ message: "Not authorized to publish or feature projects." }, { status: 403 });
  }

  try {
    await connectToDatabase();
    const slugAvailable = await isSlugAvailable(validation.data.slug);
    if (!slugAvailable) {
      return NextResponse.json({ errors: { slug: "Slug is already in use." } }, { status: 409 });
    }

    const project = await PortfolioProject.create(createProjectUpdate(validation.data, admin.id, true));
    return NextResponse.json({ project: serializeProject(project.toObject()), redirectTo: `/admin/portfolio/${project._id}/edit` }, { status: 201 });
  } catch (error) {
    console.error("Admin portfolio create failed:", error);
    return NextResponse.json({ message: "Unable to create project." }, { status: 500 });
  }
}
