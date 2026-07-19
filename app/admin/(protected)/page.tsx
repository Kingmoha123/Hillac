import type { Metadata } from "next";
import Link from "next/link";
import { adminNavigation, getRoleDescription } from "@/lib/admin/roles";
import { requireAdminSession } from "@/lib/admin/session";

export const metadata: Metadata = {
  title: "Admin Dashboard | Hillaac ICT Solutions",
  robots: {
    index: false,
    follow: false
  }
};

export default async function AdminDashboardPage() {
  const admin = await requireAdminSession();
  const environment = process.env.VERCEL_ENV || process.env.NODE_ENV || "unknown";

  return (
    <section className="admin-page">
      <span className="admin-eyebrow">Dashboard</span>
      <h1>Welcome, {admin.name}</h1>
      <p>{getRoleDescription(admin.role)}</p>

      <div className="admin-card-grid">
        <article className="admin-card">
          <h2>System Status</h2>
          <dl className="admin-definition-list">
            <div>
              <dt>Admin session</dt>
              <dd>Active</dd>
            </div>
            <div>
              <dt>Application environment</dt>
              <dd>{environment}</dd>
            </div>
            <div>
              <dt>Database</dt>
              <dd>Required for admin modules</dd>
            </div>
          </dl>
        </article>

        <article className="admin-card">
          <h2>Planned CMS Modules</h2>
          <ul className="admin-list">
            <li>Portfolio projects</li>
            <li>Blog posts</li>
            <li>Careers content</li>
            <li>Contact leads</li>
            <li>Website content settings</li>
          </ul>
        </article>

        <article className="admin-card">
          <h2>Quick Links</h2>
          <div className="admin-quick-links">
            {adminNavigation.slice(1, 4).map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
            <Link href="/admin/settings">Account Settings</Link>
          </div>
        </article>
      </div>
    </section>
  );
}
