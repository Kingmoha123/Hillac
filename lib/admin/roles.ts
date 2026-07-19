import type { AdminRole } from "@/models/AdminUser";

export const adminNavigation = [
  { label: "Dashboard", href: "/admin", module: "dashboard" },
  { label: "Portfolio", href: "/admin/portfolio", module: "portfolio" },
  { label: "Blog", href: "/admin/blog", module: "blog" },
  { label: "Careers", href: "/admin/careers", module: "careers" },
  { label: "Contact Leads", href: "/admin/contact-leads", module: "contact-leads" },
  { label: "Website Content", href: "/admin/content", module: "content" },
  { label: "Settings", href: "/admin/settings", module: "settings" }
] as const;

export type AdminModule = (typeof adminNavigation)[number]["module"];

const rolePermissions: Record<AdminRole, AdminModule[]> = {
  SUPER_ADMIN: ["dashboard", "portfolio", "blog", "careers", "contact-leads", "content", "settings"],
  ADMIN: ["dashboard", "portfolio", "blog", "careers", "contact-leads", "content", "settings"],
  EDITOR: ["dashboard", "portfolio", "blog", "settings"]
};

export function canAccessModule(role: AdminRole, module: AdminModule) {
  return rolePermissions[role]?.includes(module) || false;
}

export function getRoleDescription(role: AdminRole) {
  if (role === "SUPER_ADMIN") {
    return "Full future administrative access.";
  }

  if (role === "ADMIN") {
    return "Future content and lead management access.";
  }

  return "Future portfolio and blog content access.";
}
