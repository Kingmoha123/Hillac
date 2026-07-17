import { PageHero } from "@/components/PageHero";
import { blogPosts } from "@/data/site";

export default function BlogPage() {
  return (
    <>
      <PageHero
        eyebrow="Insights"
        title="Ideas on digital growth, design, software, and Somali enterprise"
        text="Practical thinking for founders, managers, institutions, and teams preparing for stronger digital operations."
      />
      <section className="section">
        <div className="container blog-grid">
          {blogPosts.map((post) => (
            <article className="blog-card" key={post.title}>
              <span>{post.date}</span>
              <h2>{post.title}</h2>
              <p>{post.excerpt}</p>
              <a href="/contact">Discuss this topic</a>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
