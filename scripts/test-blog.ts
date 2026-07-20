import assert from "node:assert/strict";
import { canManageBlog } from "../lib/blog/permissions";
import { rankRelatedPosts } from "../lib/blog/repository";
import { slugifyBlogTitle, validateBlogPostPayload } from "../lib/blog/validation";
import type { PublicBlogPost } from "../lib/blog/types";

assert.equal(slugifyBlogTitle("Why Somali Businesses Need Premium Digital Systems!"), "why-somali-businesses-need-premium-digital-systems");
assert.equal(canManageBlog("SUPER_ADMIN", "delete"), true);
assert.equal(canManageBlog("ADMIN", "publish"), true);
assert.equal(canManageBlog("EDITOR", "publish"), false);
assert.equal(canManageBlog("EDITOR", "update"), true);

const validPayload = {
  title: "How Digital Systems Improve Daily Operations",
  slug: "how-digital-systems-improve-daily-operations",
  excerpt: "A practical article about using digital systems to make daily business operations clearer, faster, and easier to manage.",
  category: "OPERATIONS",
  tags: ["operations", "cloud"],
  authorName: "Hillaac ICT Solutions",
  authorRole: "Digital Solutions Team",
  readingTimeMinutes: 7,
  introduction: "Digital tools become valuable when they reduce confusion, clarify ownership, and make common work easier to repeat. This article explains how teams can approach that change.",
  sections: [
    {
      heading: "Start With the Workflow",
      content: "A useful system starts by understanding the real workflow before screens are designed. Teams should document steps, responsibilities, handoffs, approvals, and the information each person needs.",
      bullets: ["Map the current process", "Remove duplicate entry"]
    }
  ],
  conclusion: "The best digital systems are practical, maintainable, and aligned with how the organization already works. Hillaac can help plan that transition carefully.",
  coverImage: null,
  status: "DRAFT",
  featured: false,
  published: false,
  publishedAt: null,
  seoTitle: "How Digital Systems Improve Daily Operations",
  seoDescription: "Learn how practical digital systems can make everyday business operations clearer, easier to manage, and more reliable."
};

const validation = validateBlogPostPayload(validPayload);
assert.equal(validation.success, true);

const invalidPublish = validateBlogPostPayload({ ...validPayload, status: "PUBLISHED", published: false });
assert.equal(invalidPublish.success, false);

const invalidSlug = validateBlogPostPayload({ ...validPayload, slug: "!!!" });
assert.equal(invalidSlug.success, false);

const current = makePost("current", "Operations", ["cloud", "systems"], "2026-01-03");
const sameCategory = makePost("same", "Operations", ["process"], "2026-01-02");
const sameTag = makePost("tag", "Branding", ["cloud"], "2026-01-01");
const unrelated = makePost("other", "Branding", ["identity"], "2026-01-04");
const related = rankRelatedPosts([unrelated, sameTag, sameCategory, current], current);

assert.deepEqual(related.map((post) => post.slug), ["same", "tag", "other"]);

console.log("Blog CMS tests passed.");

function makePost(slug: string, category: string, tags: string[], date: string): PublicBlogPost {
  return {
    title: slug,
    slug,
    excerpt: "Example excerpt for blog test data that is long enough to act as realistic content.",
    publishedAt: date,
    updatedAt: date,
    authorName: "Hillaac ICT Solutions",
    authorRole: "Digital Solutions Team",
    category,
    tags,
    featuredImage: { src: null, alt: "Placeholder", label: "Placeholder" },
    readingTimeMinutes: 5,
    introduction: ["Intro"],
    sections: [],
    conclusion: ["Conclusion"],
    featured: false,
    published: true
  };
}
