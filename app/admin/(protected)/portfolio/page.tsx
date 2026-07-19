import type { Metadata } from "next";
import { PortfolioProjectManager } from "@/components/admin/portfolio/PortfolioProjectManager";
import { requireAdminSession } from "@/lib/admin/session";
import { canManagePortfolio } from "@/lib/portfolio/permissions";

export const metadata: Metadata = {
  title: "Portfolio Management | Hillaac Admin"
};

export default async function AdminPortfolioPage() {
  const admin = await requireAdminSession();

  return (
    <PortfolioProjectManager
      canPublish={canManagePortfolio(admin.role, "publish")}
      canDelete={canManagePortfolio(admin.role, "delete")}
    />
  );
}
