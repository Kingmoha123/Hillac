import { process } from "@/data/site";
import { SectionHeader } from "./SectionHeader";

export function ProcessSection() {
  return (
    <section className="section muted-section">
      <div className="container">
        <SectionHeader
          eyebrow="Our Process"
          title="A clear path from idea to launch"
          text="Every project follows a structured workflow so design quality and technical delivery stay aligned."
        />
        <div className="process-grid">
          {process.map((item) => (
            <article key={item.step} className="process-card">
              <span>{item.step}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
