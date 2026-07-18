import { createPageMetadata } from "@/lib/seo";
import { BlogCard } from "@/components/BlogCard";
import { PageHero } from "@/components/PageHero";
import { publishedBlogPosts } from "@/data/blog";

export const metadata = createPageMetadata({
  title: "Insights",
  description: "Read practical ideas from Hillaac ICT Solutions on digital growth, design, software, and stronger business operations in Somalia.",
  path: "/blog"
});

export default function BlogPage() {
  const featuredPost = publishedBlogPosts.find((post) => post.featured) || publishedBlogPosts[0];
  const remainingPosts = publishedBlogPosts.filter((post) => post.slug !== featuredPost.slug);

  return (
    <>
      <PageHero
        eyebrow="Insights"
        title="Ideas on digital growth, design, software, and Somali enterprise"
        text="Practical thinking for founders, managers, institutions, and teams preparing for stronger digital operations."
      />
      <section className="section blog-listing">
        <div className="container">
          <div className="featured-blog">
            <BlogCard post={featuredPost} featured priority />
          </div>
          <div className="blog-grid">
            {remainingPosts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
