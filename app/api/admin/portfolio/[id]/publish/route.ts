import { NextResponse } from "next/server";
import { getCurrentAdminFromRequest } from "@/lib/admin/session";
import { canManagePortfolio } from "@/lib/portfolio/permissions";
import { serializeProject } from "@/lib/portfolio/repository";
import { connectToDatabase } from "@/lib/db";
import { PortfolioProject } from "@/models/PortfolioProject";

type RouteContext = {
  params: {
    id: string;
  };
};

export async function POST(request: Request, { params }: RouteContext) {
  const admin = await getCurrentAdminFromRequest(request);
  if (!admin || !canManagePortfolio(admin.role, "publish")) {
    return NextResponse.json({ message: "Not authorized." }, { status: 403 });
  }

  const payload = (await request.json().catch(() => null)) as { published?: boolean; featured?: boolean } | null;

  try {
    await connectToDatabase();
    const update: Record<string, unknown> = { updatedBy: admin.id };
    if (typeof payload?.published === "boolean") {
      update.published = payload.published;
    }
    if (typeof payload?.featured === "boolean" && canManagePortfolio(admin.role, "feature")) {
      update.featured = payload.featured;
    }

    const project = await PortfolioProject.findOneAndUpdate({ _id: params.id, archivedAt: null }, { $set: update }, { new: true });
    if (!project) {
      return NextResponse.json({ message: "Project not found." }, { status: 404 });
    }

    return NextResponse.json({ project: serializeProject(project.toObject()) });
  } catch (error) {
    console.error("Admin portfolio publish update failed:", error);
    return NextResponse.json({ message: "Unable to update publishing state." }, { status: 500 });
  }
}
