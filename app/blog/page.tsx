import { createPageMetadata } from "@/lib/seo";
import { BlogCard } from "@/components/BlogCard";
import { PageHero } from "@/components/PageHero";
import { getPublishedBlogPosts } from "@/lib/blog/repository";

export const dynamic = "force-dynamic";

export const metadata = createPageMetadata({
  title: "Insights",
  description: "Read practical ideas from Hillaac ICT Solutions on digital growth, design, software, and stronger business operations in Somalia.",
  path: "/blog"
});

export default async function BlogPage() {
  const publishedBlogPosts = await getPublishedBlogPosts();
  const featuredPost = publishedBlogPosts.find((post) => post.featured) || publishedBlogPosts[0];
  const remainingPosts = featuredPost ? publishedBlogPosts.filter((post) => post.slug !== featuredPost.slug) : [];

  return (
    <>
      <PageHero
        eyebrow="Insights"
        title="Ideas on digital growth, design, software, and Somali enterprise"
        text="Practical thinking for founders, managers, institutions, and teams preparing for stronger digital operations."
      />
      <section className="section blog-listing">
        <div className="container">
          {featuredPost ? (
            <>
              <div className="featured-blog">
                <BlogCard post={featuredPost} featured priority />
              </div>
              <div className="blog-grid">
                {remainingPosts.map((post) => (
                  <BlogCard key={post.slug} post={post} />
                ))}
              </div>
            </>
          ) : (
            <div className="empty-state">
              <h2>Articles are being prepared</h2>
              <p>New insights will appear here after they are published by the Hillaac team.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
