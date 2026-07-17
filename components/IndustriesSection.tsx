import { industries } from "@/data/site";
import { SectionHeader } from "./SectionHeader";

export function IndustriesSection() {
  return (
    <section className="section muted-section">
      <div className="container">
        <SectionHeader
          eyebrow="Industries"
          title="Built for the organizations moving Somalia forward"
          text="Hillaac supports public, private, nonprofit, and startup teams with digital systems that match their workflows."
        />
        <div className="industry-grid">
          {industries.map((industry) => (
            <div key={industry}>{industry}</div>
          ))}
        </div>
      </div>
    </section>
  );
}
