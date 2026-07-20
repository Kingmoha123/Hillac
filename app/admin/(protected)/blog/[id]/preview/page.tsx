import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleBody } from "@/components/ArticleBody";
import { BlogVisual } from "@/components/BlogVisual";
import { requireAdminSession } from "@/lib/admin/session";
import { getAdminBlogPostById } from "@/lib/blog/repository";
import type { PublicBlogPost, SerializedBlogPost } from "@/lib/blog/types";

type BlogPostPreviewPageProps = {
  params: {
    id: string;
  };
};

export const metadata = {
  title: "Preview Blog Article | Hillaac Admin",
  robots: {
    index: false,
    follow: false
  }
};

export default async function BlogPostPreviewPage({ params }: BlogPostPreviewPageProps) {
  await requireAdminSession();
  const post = await getAdminBlogPostById(params.id).catch(() => null);

  if (!post) {
    notFound();
  }

  const publicPost = mapSerializedToPublicPost(post);

  return (
    <article className="blog-detail">
      <section className="case-hero">
        <div className="container case-hero-grid">
          <div>
            <Link className="admin-back-link" href={`/admin/blog/${post.id}/edit`}>Back to Edit</Link>
            <span className="eyebrow">Draft Preview</span>
            <h1>{post.title}</h1>
            <p>{post.excerpt}</p>
            <div className="blog-meta">
              <span>{post.authorName}</span>
              <span>{post.readingTimeMinutes} min read</span>
              <span>{post.published ? "Published" : "Draft"}</span>
            </div>
          </div>
          <BlogVisual image={publicPost.featuredImage} title={publicPost.title} category={publicPost.category} priority />
        </div>
      </section>

      <section className="section">
        <div className="container article-layout">
          <ArticleBody post={publicPost} />
          <aside className="article-sidebar">
            <span className="eyebrow">Preview Status</span>
            <h2>{post.status}</h2>
            <p>This protected preview is visible only to signed-in administrators.</p>
          </aside>
        </div>
      </section>
    </article>
  );
}

function mapSerializedToPublicPost(post: SerializedBlogPost): PublicBlogPost {
  return {
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    publishedAt: (post.publishedAt || post.createdAt).slice(0, 10),
    updatedAt: post.updatedContentAt?.slice(0, 10) || post.updatedAt.slice(0, 10),
    authorName: post.authorName,
    authorRole: post.authorRole,
    category: post.category.replaceAll("_", " "),
    tags: post.tags,
    featuredImage: post.coverImage
      ? { src: post.coverImage.url, alt: post.coverImage.alt, label: post.coverImage.label }
      : { src: null, alt: `${post.title} article placeholder`, label: post.title },
    readingTimeMinutes: post.readingTimeMinutes,
    introduction: splitParagraphs(post.introduction),
    sections: post.sections.map((section) => ({
      heading: section.heading,
      paragraphs: splitParagraphs(section.content),
      bullets: section.bullets
    })),
    conclusion: splitParagraphs(post.conclusion),
    featured: post.featured,
    published: post.published
  };
}

function splitParagraphs(value: string) {
  return value.split(/\n{2,}/).map((paragraph) => paragraph.trim()).filter(Boolean);
}
