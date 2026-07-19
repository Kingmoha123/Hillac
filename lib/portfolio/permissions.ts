import type { AdminRole } from "@/models/AdminUser";

export type PortfolioAction = "create" | "read" | "update" | "publish" | "feature" | "delete";

const permissions: Record<AdminRole, PortfolioAction[]> = {
  SUPER_ADMIN: ["create", "read", "update", "publish", "feature", "delete"],
  ADMIN: ["create", "read", "update", "publish", "feature", "delete"],
  EDITOR: ["create", "read", "update"]
};

export function canManagePortfolio(role: AdminRole, action: PortfolioAction) {
  return permissions[role]?.includes(action) || false;
}
