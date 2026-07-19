"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminNavigation } from "@/lib/admin/roles";
import type { AdminSession } from "@/lib/admin/session";
import { Logo } from "@/components/Logo";

type AdminShellProps = {
  admin: AdminSession;
  children: React.ReactNode;
};

export function AdminShell({ admin, children }: AdminShellProps) {
  const pathname = usePathname();
  const [navOpen, setNavOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const logout = async () => {
    setIsLoggingOut(true);
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.assign("/admin/login");
  };

  return (
    <div className="admin-shell">
      <aside className={`admin-sidebar ${navOpen ? "is-open" : ""}`} aria-label="Admin navigation">
        <div className="admin-brand">
          <Logo />
          <button type="button" className="admin-nav-toggle" onClick={() => setNavOpen(false)}>
            Close
          </button>
        </div>
        <nav>
          {adminNavigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={pathname === item.href ? "is-active" : ""}
              onClick={() => setNavOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="admin-main">
        <header className="admin-topbar">
          <button type="button" className="admin-nav-toggle" onClick={() => setNavOpen((value) => !value)}>
            Menu
          </button>
          <div>
            <strong>{admin.name}</strong>
            <span>{admin.role}</span>
          </div>
          <button type="button" onClick={logout} disabled={isLoggingOut}>
            {isLoggingOut ? "Signing out..." : "Logout"}
          </button>
        </header>
        <main className="admin-content">{children}</main>
      </div>
    </div>
  );
}
