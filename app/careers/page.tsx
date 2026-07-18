import { createPageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/PageHero";
import { jobs } from "@/data/site";

export const metadata = createPageMetadata({
  title: "Careers",
  description: "Explore career opportunities with Hillaac ICT Solutions for people who want to build premium digital brands and systems in Somalia.",
  path: "/careers"
});

export default function CareersPage() {
  return (
    <>
      <PageHero
        eyebrow="Careers"
        title="Join the team building Somalia's next digital brands and systems"
        text="We look for people with taste, discipline, curiosity, and the energy to solve real business problems."
      />
      <section className="section">
        <div className="container jobs-list">
          {jobs.map((job) => (
            <article key={job.title} className="job-card">
              <div>
                <h2>{job.title}</h2>
                <p>{job.description}</p>
              </div>
              <div>
                <span>{job.location}</span>
                <strong>{job.type}</strong>
                <a href="/contact">Apply Now</a>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
