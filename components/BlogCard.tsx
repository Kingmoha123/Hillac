import Link from "next/link";
import type { BlogPost } from "@/data/blog";
import { BlogVisual } from "./BlogVisual";

type BlogCardProps = {
  post: BlogPost;
  featured?: boolean;
  priority?: boolean;
};

export function BlogCard({ post, featured = false, priority = false }: BlogCardProps) {
  const href = `/blog/${post.slug}`;

  return (
    <article className={`blog-card ${featured ? "featured-blog-card" : ""}`}>
      <Link className="blog-card-visual" href={href} aria-label={`Read article: ${post.title}`}>
        <BlogVisual image={post.featuredImage} title={post.title} category={post.category} priority={priority} />
      </Link>
      <div className="blog-card-content">
        <div className="blog-meta-row">
          <span>{post.category}</span>
          <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
          <span>{post.readingTimeMinutes} min read</span>
        </div>
        <h2>{post.title}</h2>
        <p>{post.excerpt}</p>
        <Link className="read-link" href={href}>
          Read Article
        </Link>
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
