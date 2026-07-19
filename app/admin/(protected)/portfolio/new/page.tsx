import type { Metadata } from "next";
import { PortfolioProjectForm } from "@/components/admin/portfolio/PortfolioProjectForm";
import { requireAdminSession } from "@/lib/admin/session";
import { canManagePortfolio } from "@/lib/portfolio/permissions";

export const metadata: Metadata = {
  title: "New Portfolio Project | Hillaac Admin"
};

export default async function NewPortfolioProjectPage() {
  const admin = await requireAdminSession();

  return (
    <section className="admin-page">
      <span className="admin-eyebrow">Portfolio CMS</span>
      <h1>Add Project</h1>
      <p>Create a draft case study. Publishing can happen now only for roles with publishing access.</p>
      <PortfolioProjectForm mode="create" canPublish={canManagePortfolio(admin.role, "publish")} />
    </section>
  );
}
