import type { BlogPost } from "@/data/blog";

type ArticleBodyProps = {
  post: BlogPost;
};

export function ArticleBody({ post }: ArticleBodyProps) {
  return (
    <div className="article-body">
      {post.introduction.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
      {post.sections.map((section) => (
        <section key={section.heading} aria-labelledby={`${post.slug}-${slugify(section.heading)}`}>
          <h2 id={`${post.slug}-${slugify(section.heading)}`}>{section.heading}</h2>
          {section.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </section>
      ))}
      <section aria-labelledby={`${post.slug}-conclusion`}>
        <h2 id={`${post.slug}-conclusion`}>Conclusion</h2>
        {post.conclusion.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </section>
    </div>
  );
}

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
