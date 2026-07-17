import { technologies } from "@/data/site";
import { SectionHeader } from "./SectionHeader";

export function TechSection() {
  return (
    <section className="section">
      <div className="container">
        <SectionHeader
          eyebrow="Technology Stack"
          title="Modern tools for reliable, scalable products"
          text="We choose proven technologies that support performance, maintainability, and long-term growth."
        />
        <div className="tech-cloud">
          {technologies.map((tech) => (
            <span key={tech}>{tech}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
