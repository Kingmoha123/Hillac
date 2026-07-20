import type { PublicBlogPost } from "@/lib/blog/types";
import { BlogVisual } from "./BlogVisual";
import { TrackedLink } from "./TrackedLink";

type BlogCardProps = {
  post: PublicBlogPost;
  featured?: boolean;
  priority?: boolean;
};

export function BlogCard({ post, featured = false, priority = false }: BlogCardProps) {
  const href = `/blog/${post.slug}`;

  return (
    <article className={`blog-card ${featured ? "featured-blog-card" : ""}`}>
      <TrackedLink
        className="blog-card-visual"
        href={href}
        aria-label={`Read article: ${post.title}`}
        eventName="blog_article_click"
        eventProperties={{
          cta_location: featured ? "featured_article_visual" : "article_card_visual",
          blog_slug: post.slug,
          blog_category: post.category
        }}
      >
        <BlogVisual image={post.featuredImage} title={post.title} category={post.category} priority={priority} />
      </TrackedLink>
      <div className="blog-card-content">
        <div className="blog-meta-row">
          <span>{post.category}</span>
          <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
          <span>{post.readingTimeMinutes} min read</span>
        </div>
        <h2>{post.title}</h2>
        <p>{post.excerpt}</p>
        <TrackedLink
          className="read-link"
          href={href}
          eventName="blog_article_click"
          eventProperties={{
            cta_location: featured ? "featured_article_read_link" : "article_card_read_link",
            blog_slug: post.slug,
            blog_category: post.category
          }}
        >
          Read Article
        </TrackedLink>
      </div>
    </article>
  );
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric"
  }).format(new Date(`${value}T00:00:00Z`));
}
