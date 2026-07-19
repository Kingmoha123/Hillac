import { createPageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/PageHero";
import { jobs } from "@/data/site";

export const metadata = createPageMetadata({
  title: "Careers",
  description: "Share interest in future collaboration areas with Hillaac ICT Solutions for digital brands, websites, systems, design, and marketing.",
  path: "/careers"
});

export default function CareersPage() {
  return (
    <>
      <PageHero
        eyebrow="Careers"
        title="Join the talent pool for future Hillaac projects"
        text="Hillaac is collecting interest from people with taste, discipline, curiosity, and the energy to solve real business problems."
      />
      <section className="section">
        <div className="container jobs-list">
          <div className="career-note">
            <strong>Current status</strong>
            <p>
              These are future collaboration areas, not guaranteed open vacancies. Share your interest and Hillaac can
              follow up when a suitable project or role becomes available.
            </p>
          </div>
          {jobs.map((job) => (
            <article key={job.title} className="job-card">
              <div>
                <h2>{job.title}</h2>
                <p>{job.description}</p>
              </div>
              <div>
                <span>{job.location}</span>
                <strong>{job.type}</strong>
                <a href="/contact">Share Interest</a>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
