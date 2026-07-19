import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CtaSection } from "@/components/CtaSection";
import { JsonLd } from "@/components/JsonLd";
import { ProjectVisual } from "@/components/ProjectVisual";
import { getAdminPortfolioProjectById, mapDocumentToPublicProject } from "@/lib/portfolio/repository";
import { createBreadcrumbJsonLd } from "@/lib/structured-data";
import { PortfolioProject } from "@/models/PortfolioProject";

type PreviewPageProps = {
  params: {
    id: string;
  };
};

export const metadata: Metadata = {
  title: "Draft Portfolio Preview | Hillaac Admin",
  robots: {
    index: false,
    follow: false
  }
};

export default async function AdminPortfolioPreviewPage({ params }: PreviewPageProps) {
  const serialized = await getAdminPortfolioProjectById(params.id).catch(() => null);
  const rawProject = serialized ? await PortfolioProject.findById(params.id).lean() : null;

  if (!serialized || !rawProject) {
    notFound();
  }

  const project = mapDocumentToPublicProject(rawProject);
  const breadcrumbJsonLd = createBreadcrumbJsonLd([
    { name: "Admin", path: "/admin" },
    { name: "Portfolio", path: "/admin/portfolio" },
    { name: project.title, path: `/admin/portfolio/${serialized.id}/preview` }
  ]);

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <section className="case-hero">
        <div className="container case-hero-grid">
          <div>
            <span className="eyebrow">Draft Preview</span>
            <h1>{project.title}</h1>
            <p>{project.shortDescription}</p>
            <dl className="case-meta">
              <div><dt>Client</dt><dd>{project.client}</dd></div>
              <div><dt>Status</dt><dd>{project.status}</dd></div>
              <div><dt>Year</dt><dd>{project.completionYear}</dd></div>
            </dl>
          </div>
          <div className="case-visual">
            <ProjectVisual image={project.coverImage} title={project.title} category={project.category} priority />
          </div>
        </div>
      </section>
      <section className="section case-study">
        <div className="container case-layout">
          <aside className="case-sidebar" aria-label="Project details">
            <div><h2>Services</h2><ul>{project.services.map((service) => <li key={service}>{service}</li>)}</ul></div>
            <div><h2>Technologies</h2><div className="tag-row">{project.technologies.map((technology) => <span key={technology}>{technology}</span>)}</div></div>
          </aside>
          <div className="case-content">
            <section><h2>Project Overview</h2><p>{project.overview}</p></section>
            <section><h2>Challenge</h2><ul className="case-list">{project.challenges.map((challenge) => <li key={challenge}>{challenge}</li>)}</ul></section>
            <section><h2>Solution</h2><p>{project.solution}</p></section>
            <section><h2>Key Features</h2><div className="case-feature-grid">{project.keyFeatures.map((feature) => <div key={feature}>{feature}</div>)}</div></section>
            <section><h2>Results</h2><ul className="case-list">{project.results.map((result) => <li key={result}>{result}</li>)}</ul></section>
          </div>
        </div>
      </section>
      <CtaSection />
    </>
  );
}
