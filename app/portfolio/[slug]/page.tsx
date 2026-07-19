import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/ButtonLink";
import { CtaSection } from "@/components/CtaSection";
import { JsonLd } from "@/components/JsonLd";
import { ProjectVisual } from "@/components/ProjectVisual";
import { TrackPageEvent } from "@/components/TrackPageEvent";
import { projects } from "@/data/site";
import { createPageMetadata } from "@/lib/seo";
import { createBreadcrumbJsonLd } from "@/lib/structured-data";

type CaseStudyPageProps = {
  params: {
    slug: string;
  };
};

function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export function generateMetadata({ params }: CaseStudyPageProps): Metadata {
  const project = getProject(params.slug);

  if (!project) {
    return {
      title: "Case Study Not Found | Hillaac ICT Solutions"
    };
  }

  return createPageMetadata({
    title: `${project.title} Case Study`,
    description: project.shortDescription,
    path: `/portfolio/${project.slug}`,
    keywords: [project.title, project.category, ...project.services],
    type: "article"
  });
}

export default function CaseStudyPage({ params }: CaseStudyPageProps) {
  const project = getProject(params.slug);

  if (!project) {
    notFound();
  }

  const breadcrumbJsonLd = createBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Portfolio", path: "/portfolio" },
    { name: project.title, path: `/portfolio/${project.slug}` }
  ]);

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <TrackPageEvent
        eventName="portfolio_case_study_view"
        properties={{
          project_slug: project.slug,
          project_title: project.title
        }}
      />
      <section className="case-hero">
        <div className="container case-hero-grid">
          <div>
            <span className="eyebrow">{project.category}</span>
            <h1>{project.title}</h1>
            <p>{project.shortDescription}</p>
            <dl className="case-meta">
              <div>
                <dt>Client</dt>
                <dd>{project.client}</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>{project.status}</dd>
              </div>
              <div>
                <dt>Year</dt>
                <dd>{project.completionYear}</dd>
              </div>
            </dl>
            <div className="case-actions">
              {project.liveProjectUrl ? (
                <ButtonLink
                  href={project.liveProjectUrl}
                  variant="secondary"
                  analyticsEvent="portfolio_project_click"
                  analyticsProperties={{
                    cta_location: "case_study_live_link",
                    link_type: "live_project",
                    project_slug: project.slug,
                    project_title: project.title
                  }}
                >
                  View Live Project
                </ButtonLink>
              ) : null}
              {project.githubUrl ? (
                <ButtonLink
                  href={project.githubUrl}
                  variant="secondary"
                  analyticsEvent="portfolio_project_click"
                  analyticsProperties={{
                    cta_location: "case_study_github_link",
                    link_type: "github",
                    project_slug: project.slug,
                    project_title: project.title
                  }}
                >
                  View GitHub
                </ButtonLink>
              ) : null}
            </div>
          </div>
          <div className="case-visual">
            <ProjectVisual image={project.coverImage} title={project.title} category={project.category} priority />
          </div>
        </div>
      </section>

      <section className="section case-study">
        <div className="container case-layout">
          <aside className="case-sidebar" aria-label="Project details">
            <div>
              <h2>Services</h2>
              <ul>
                {project.services.map((service) => (
                  <li key={service}>{service}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2>Technologies</h2>
              <div className="tag-row">
                {project.technologies.map((technology) => (
                  <span key={technology}>{technology}</span>
                ))}
              </div>
            </div>
          </aside>

          <div className="case-content">
            <section aria-labelledby="overview-heading">
              <h2 id="overview-heading">Project Overview</h2>
              <p>{project.overview}</p>
            </section>

            <section aria-labelledby="challenge-heading">
              <h2 id="challenge-heading">Challenge</h2>
              <ul className="case-list">
                {project.challenges.map((challenge) => (
                  <li key={challenge}>{challenge}</li>
                ))}
              </ul>
            </section>

            <section aria-labelledby="solution-heading">
              <h2 id="solution-heading">Solution</h2>
              <p>{project.solution}</p>
            </section>

            <section aria-labelledby="features-heading">
              <h2 id="features-heading">Key Features</h2>
              <div className="case-feature-grid">
                {project.keyFeatures.map((feature) => (
                  <div key={feature}>{feature}</div>
                ))}
              </div>
            </section>

            <section aria-labelledby="gallery-heading">
              <h2 id="gallery-heading">Project Gallery</h2>
              <div className="case-gallery">
                {project.galleryImages.map((image) => (
                  <ProjectVisual key={`${project.slug}-${image.label}`} image={image} title={project.title} category={project.category} />
                ))}
              </div>
            </section>

            <section aria-labelledby="results-heading">
              <h2 id="results-heading">Results</h2>
              <ul className="case-list">
                {project.results.map((result) => (
                  <li key={result}>{result}</li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </section>

      <CtaSection />
    </>
  );
}
