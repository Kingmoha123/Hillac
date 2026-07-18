import { projects } from "@/data/site";
import { ButtonLink } from "./ButtonLink";
import { ProjectCard } from "./ProjectCard";
import { SectionHeader } from "./SectionHeader";

export function PortfolioSection() {
  const featuredProjects = projects.filter((project) => project.featured).slice(0, 3);

  return (
    <section className="section">
      <div className="container">
        <SectionHeader
          eyebrow="Featured Projects"
          title="Structured case studies for real business needs"
          text="Explore selected portfolio entries prepared to show Hillaac's approach, services, technology choices, and verified outcomes as project details become available."
        />
        <div className="portfolio-grid">
          {featuredProjects.map((project, index) => (
            <ProjectCard key={project.slug} project={project} priority={index === 0} />
          ))}
        </div>
        <div className="portfolio-actions">
          <ButtonLink href="/portfolio" variant="secondary">View All Projects</ButtonLink>
        </div>
      </div>
    </section>
  );
}
