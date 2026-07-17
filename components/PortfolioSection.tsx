import { projects } from "@/data/site";
import { SectionHeader } from "./SectionHeader";

export function PortfolioSection() {
  return (
    <section className="section">
      <div className="container">
        <SectionHeader
          eyebrow="Featured Projects"
          title="Case studies shaped for high-trust organizations"
          text="A sample of the kind of polished systems, portals, and apps Hillaac builds for modern teams."
        />
        <div className="portfolio-grid">
          {projects.map((project, index) => (
            <article className="project-card" key={project.title}>
              <div className="project-preview">
                <span>0{index + 1}</span>
                <strong>{project.category}</strong>
              </div>
              <div className="project-content">
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <strong>{project.outcome}</strong>
                <div className="tag-row">
                  {project.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
