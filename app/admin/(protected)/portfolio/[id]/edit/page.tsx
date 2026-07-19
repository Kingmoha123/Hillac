import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PortfolioProjectForm } from "@/components/admin/portfolio/PortfolioProjectForm";
import { requireAdminSession } from "@/lib/admin/session";
import { canManagePortfolio } from "@/lib/portfolio/permissions";
import { getAdminPortfolioProjectById } from "@/lib/portfolio/repository";

type EditPortfolioProjectPageProps = {
  params: {
    id: string;
  };
};

export const metadata: Metadata = {
  title: "Edit Portfolio Project | Hillaac Admin"
};

export default async function EditPortfolioProjectPage({ params }: EditPortfolioProjectPageProps) {
  const admin = await requireAdminSession();
  const project = await getAdminPortfolioProjectById(params.id).catch(() => null);

  if (!project) {
    notFound();
  }

  return (
    <section className="admin-page">
      <Link className="admin-back-link" href="/admin/portfolio" aria-label="Back to portfolio projects">
        <span aria-hidden="true">←</span>
        Back to Portfolio
      </Link>
      <span className="admin-eyebrow">Portfolio CMS</span>
      <h1>Edit Project</h1>
      <p>Last updated {new Date(project.updatedAt).toLocaleString()}.</p>
      <PortfolioProjectForm mode="edit" project={project} canPublish={canManagePortfolio(admin.role, "publish")} />
    </section>
  );
}
