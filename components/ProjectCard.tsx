import Link from "next/link";
import type { Project } from "@/data/site";
import { ButtonLink } from "./ButtonLink";
import { ProjectVisual } from "./ProjectVisual";

type ProjectCardProps = {
  project: Project;
  priority?: boolean;
};

export function ProjectCard({ project, priority = false }: ProjectCardProps) {
  return (
    <article className="project-card">
      <Link className="project-preview" href={`/portfolio/${project.slug}`} aria-label={`View case study for ${project.title}`}>
        <ProjectVisual
          image={project.coverImage}
          title={project.title}
          category={project.category}
          priority={priority}
        />
      </Link>
      <div className="project-content">
        <span className="project-category">{project.category}</span>
        <h3>{project.title}</h3>
        <p>{project.shortDescription}</p>
        <dl className="project-meta">
          <div>
            <dt>Status</dt>
            <dd>{project.status}</dd>
          </div>
          <div>
            <dt>Year</dt>
            <dd>{project.completionYear}</dd>
          </div>
        </dl>
        <div className="tag-row" aria-label={`${project.title} technologies`}>
          {project.technologies.slice(0, 4).map((technology) => (
            <span key={technology}>{technology}</span>
          ))}
        </div>
        <ButtonLink href={`/portfolio/${project.slug}`} variant="secondary">View Case Study</ButtonLink>
      </div>
    </article>
  );
}
