type AdminComingSoonProps = {
  title: string;
  description: string;
};

export function AdminComingSoon({ title, description }: AdminComingSoonProps) {
  return (
    <section className="admin-page">
      <span className="admin-eyebrow">Coming Soon</span>
      <h1>{title}</h1>
      <p>{description}</p>
      <div className="admin-card">
        <h2>Foundation ready</h2>
        <p>This module is protected by admin authentication and ready for a future CMS implementation.</p>
      </div>
    </section>
  );
}
