import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/AdminShell";
import { requireAdminSession } from "@/lib/admin/session";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false
  }
};

export default async function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdminSession();

  return <AdminShell admin={admin}>{children}</AdminShell>;
}
