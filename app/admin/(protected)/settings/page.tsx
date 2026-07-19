import type { Metadata } from "next";
import { SettingsNameForm } from "@/components/admin/SettingsNameForm";
import { requireAdminSession } from "@/lib/admin/session";

export const metadata: Metadata = {
  title: "Admin Settings | Hillaac ICT Solutions",
  robots: {
    index: false,
    follow: false
  }
};

export default async function AdminSettingsPage() {
  const admin = await requireAdminSession();

  return (
    <section className="admin-page">
      <span className="admin-eyebrow">Settings</span>
      <h1>Account Settings</h1>
      <p>Update your display name. Role, status, email, and password changes will be added in future admin work.</p>

      <div className="admin-settings-grid">
        <article className="admin-card">
          <h2>Profile</h2>
          <dl className="admin-definition-list">
            <div>
              <dt>Name</dt>
              <dd>{admin.name}</dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>{admin.email}</dd>
            </div>
            <div>
              <dt>Role</dt>
              <dd>{admin.role}</dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd>{admin.status}</dd>
            </div>
            <div>
              <dt>Last login</dt>
              <dd>{formatDate(admin.lastLoginAt)}</dd>
            </div>
            <div>
              <dt>Created</dt>
              <dd>{formatDate(admin.createdAt)}</dd>
            </div>
          </dl>
        </article>

        <article className="admin-card">
          <h2>Update Name</h2>
          <SettingsNameForm initialName={admin.name} />
        </article>
      </div>
    </section>
  );
}

function formatDate(value?: string | null) {
  if (!value) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}
