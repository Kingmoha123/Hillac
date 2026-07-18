"use client";

import { useMemo, useState } from "react";
import { portfolioCategories, type PortfolioCategory, type Project } from "@/data/site";
import { ProjectCard } from "./ProjectCard";

type FilterValue = PortfolioCategory | "All";

type PortfolioFilterProps = {
  projects: Project[];
};

export function PortfolioFilter({ projects }: PortfolioFilterProps) {
  const [activeCategory, setActiveCategory] = useState<FilterValue>("All");
  const filteredProjects = useMemo(
    () => activeCategory === "All" ? projects : projects.filter((project) => project.category === activeCategory),
    [activeCategory, projects]
  );

  return (
    <>
      <div className="portfolio-filters" aria-label="Filter portfolio projects">
        {portfolioCategories.map((category) => (
          <button
            key={category}
            type="button"
            className={category === activeCategory ? "is-active" : undefined}
            onClick={() => setActiveCategory(category)}
            aria-pressed={category === activeCategory}
          >
            {category}
          </button>
        ))}
      </div>
      {filteredProjects.length > 0 ? (
        <div className="portfolio-grid">
          {filteredProjects.map((project, index) => (
            <ProjectCard key={project.slug} project={project} priority={index === 0} />
          ))}
        </div>
      ) : (
        <p className="portfolio-empty">No projects are listed in this category yet.</p>
      )}
    </>
  );
}
