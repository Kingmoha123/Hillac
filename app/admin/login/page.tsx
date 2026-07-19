import type { Metadata } from "next";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { Logo } from "@/components/Logo";
import { redirectAuthenticatedAdmin } from "@/lib/admin/session";

export const metadata: Metadata = {
  title: "Admin Login | Hillaac ICT Solutions",
  robots: {
    index: false,
    follow: false
  }
};

export default async function AdminLoginPage() {
  await redirectAuthenticatedAdmin();

  return (
    <section className="admin-login-page">
      <div className="admin-login-card">
        <Logo />
        <div>
          <span className="admin-eyebrow">Secure Admin</span>
          <h1>Sign in to Hillaac Admin</h1>
          <p>Use your administrator email and password to continue.</p>
        </div>
        <AdminLoginForm />
      </div>
    </section>
  );
}
