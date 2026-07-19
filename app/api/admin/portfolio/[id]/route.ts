import { NextResponse } from "next/server";
import { getCurrentAdminFromRequest } from "@/lib/admin/session";
import { canManagePortfolio } from "@/lib/portfolio/permissions";
import { createProjectUpdate, getAdminPortfolioProjectById, isSlugAvailable, serializeProject } from "@/lib/portfolio/repository";
import { validatePortfolioProjectPayload } from "@/lib/portfolio/validation";
import { connectToDatabase } from "@/lib/db";
import { PortfolioProject } from "@/models/PortfolioProject";

type RouteContext = {
  params: {
    id: string;
  };
};

export async function GET(request: Request, { params }: RouteContext) {
  const admin = await getCurrentAdminFromRequest(request);
  if (!admin || !canManagePortfolio(admin.role, "read")) {
    return NextResponse.json({ message: "Authentication required." }, { status: 401 });
  }

  try {
    const project = await getAdminPortfolioProjectById(params.id);
    if (!project) {
      return NextResponse.json({ message: "Project not found." }, { status: 404 });
    }

    return NextResponse.json({ project });
  } catch {
    return NextResponse.json({ message: "Invalid project id." }, { status: 400 });
  }
}

export async function PATCH(request: Request, { params }: RouteContext) {
  const admin = await getCurrentAdminFromRequest(request);
  if (!admin || !canManagePortfolio(admin.role, "update")) {
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

  try {
    await connectToDatabase();
    const existingProject = await PortfolioProject.findOne({ _id: params.id, archivedAt: null }).select("published featured").lean();
    if (!existingProject) {
      return NextResponse.json({ message: "Project not found." }, { status: 404 });
    }

    const changesPublishingState =
      validation.data.published !== existingProject.published || validation.data.featured !== existingProject.featured;

    if (changesPublishingState && !canManagePortfolio(admin.role, "publish")) {
      return NextResponse.json({ message: "Not authorized to publish or feature projects." }, { status: 403 });
    }

    const slugAvailable = await isSlugAvailable(validation.data.slug, params.id);
    if (!slugAvailable) {
      return NextResponse.json({ errors: { slug: "Slug is already in use." } }, { status: 409 });
    }

    const project = await PortfolioProject.findOneAndUpdate(
      { _id: params.id, archivedAt: null },
      { $set: createProjectUpdate(validation.data, admin.id, false) },
      { new: true }
    );

    if (!project) {
      return NextResponse.json({ message: "Project not found." }, { status: 404 });
    }

    return NextResponse.json({ project: serializeProject(project.toObject()) });
  } catch (error) {
    console.error("Admin portfolio update failed:", error);
    return NextResponse.json({ message: "Unable to update project." }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteContext) {
  const admin = await getCurrentAdminFromRequest(request);
  if (!admin || !canManagePortfolio(admin.role, "delete")) {
    return NextResponse.json({ message: "Not authorized." }, { status: 403 });
  }

  try {
    await connectToDatabase();
    const project = await PortfolioProject.findOneAndUpdate(
      { _id: params.id, archivedAt: null },
      { $set: { archivedAt: new Date(), updatedBy: admin.id, published: false, featured: false } },
      { new: true }
    );

    if (!project) {
      return NextResponse.json({ message: "Project not found." }, { status: 404 });
    }

    return NextResponse.json({ message: "Project archived." });
  } catch (error) {
    console.error("Admin portfolio archive failed:", error);
    return NextResponse.json({ message: "Unable to archive project." }, { status: 500 });
  }
}
