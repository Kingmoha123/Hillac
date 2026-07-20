import type { AdminRole } from "@/models/AdminUser";

export type BlogAction = "create" | "read" | "update" | "submit" | "publish" | "feature" | "delete" | "upload";

const rolePermissions: Record<AdminRole, BlogAction[]> = {
  SUPER_ADMIN: ["create", "read", "update", "submit", "publish", "feature", "delete", "upload"],
  ADMIN: ["create", "read", "update", "submit", "publish", "feature", "delete", "upload"],
  EDITOR: ["create", "read", "update", "submit", "upload"]
};

export function canManageBlog(role: AdminRole, action: BlogAction) {
  return rolePermissions[role]?.includes(action) || false;
}
