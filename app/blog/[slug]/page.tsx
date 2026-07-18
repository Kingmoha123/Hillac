import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArticleBody } from "@/components/ArticleBody";
import { BlogCard, formatDate } from "@/components/BlogCard";
import { BlogVisual } from "@/components/BlogVisual";
import { ButtonLink } from "@/components/ButtonLink";
import { CtaSection } from "@/components/CtaSection";
import { JsonLd } from "@/components/JsonLd";
import { publishedBlogPosts } from "@/data/blog";
import { company } from "@/data/site";
import { absoluteUrl, createPageMetadata, defaultOgImage } from "@/lib/seo";
import { createArticleJsonLd, createBreadcrumbJsonLd } from "@/lib/structured-data";

type BlogArticlePageProps = {
  params: {
    slug: string;
  };
};

function getPost(slug: string) {
  return publishedBlogPosts.find((post) => post.slug === slug);
}

function getRelatedPosts(slug: string) {
  const post = getPost(slug);

  if (!post) {
    return [];
  }

  return publishedBlogPosts
    .filter((candidate) => candidate.slug !== slug)
    .sort((left, right) => Number(right.category === post.category) - Number(left.category === post.category))
    .slice(0, 2);
}

export function generateStaticParams() {
  return publishedBlogPosts.map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: BlogArticlePageProps): Metadata {
  const post = getPost(params.slug);

  if (!post) {
    return {
      title: "Article Not Found"
    };
  }

  const image = post.featuredImage.src
    ? { url: post.featuredImage.src, width: 1200, height: 630, alt: post.featuredImage.alt }
    : defaultOgImage;
  const metadata = createPageMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
    keywords: [post.category, ...post.tags],
    type: "article"
  });

  return {
    ...metadata,
    openGraph: {
      ...metadata.openGraph,
      type: "article",
      images: [image],
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt || post.publishedAt,
      authors: [post.authorName],
      tags: post.tags
    },
    twitter: {
      ...metadata.twitter,
      images: [image.url]
    }
  };
}

export default function BlogArticlePage({ params }: BlogArticlePageProps) {
  const post = getPost(params.slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = getRelatedPosts(post.slug);
  const articleUrl = absoluteUrl(`/blog/${post.slug}`);
  const articleJsonLd = createArticleJsonLd({
    title: post.title,
    description: post.excerpt,
    url: articleUrl,
    image: post.featuredImage.src ? absoluteUrl(post.featuredImage.src) : absoluteUrl("/og-image.svg"),
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    authorName: post.authorName,
    publisherName: company.name
  });
  const breadcrumbJsonLd = createBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Insights", path: "/blog" },
    { name: post.title, path: `/blog/${post.slug}` }
  ]);

  return (
    <>
      <JsonLd data={[articleJsonLd, breadcrumbJsonLd]} />
      <article className="article-page">
        <header className="article-hero">
          <div className="container article-hero-grid">
            <div>
              <Link className="article-back-link" href="/blog">All Articles</Link>
              <span className="eyebrow">{post.category}</span>
              <h1>{post.title}</h1>
              <p>{post.excerpt}</p>
              <div className="article-meta">
                <span>{post.authorName}</span>
                <span>{post.authorRole}</span>
                <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                <span>{post.readingTimeMinutes} min read</span>
              </div>
            </div>
            <div className="article-visual">
              <BlogVisual image={post.featuredImage} title={post.title} category={post.category} priority />
            </div>
          </div>
        </header>

        <section className="section article-section">
          <div className="container article-layout">
            <aside className="article-sidebar" aria-label="Article details">
              <div>
                <h2>Tags</h2>
                <div className="tag-row">
                  {post.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </div>
              <ButtonLink href="/contact" variant="secondary">Discuss a Project</ButtonLink>
            </aside>
            <ArticleBody post={post} />
          </div>
        </section>
      </article>

      <section className="section related-posts">
        <div className="container">
          <div className="section-header">
            <span>Related Insights</span>
            <h2>Continue reading</h2>
          </div>
          <div className="blog-grid">
            {relatedPosts.map((relatedPost) => (
              <BlogCard key={relatedPost.slug} post={relatedPost} />
            ))}
          </div>
        </div>
      </section>
      <CtaSection />
    </>
  );
}
