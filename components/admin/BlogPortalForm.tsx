"use client";

import { useCallback, useEffect, useState } from "react";
import type { BlogPostPayload } from "@/lib/cms/types";
import { DEFAULT_BLOG_POSTS } from "@/lib/cms/defaults/blogPosts";
import {
  CmsField,
  CmsGhostButton,
  CmsImageUpload,
  CmsInput,
  CmsItemCard,
  CmsPageIntro,
  CmsPrimaryButton,
  CmsSaveStatus,
} from "./cms-ui";
import BlogJoditEditor from "./BlogJoditEditor";
import { slugify } from "./form-helpers";

export default function BlogPortalForm() {
  const [posts, setPosts] = useState<BlogPostPayload[]>([]);
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetch("/api/admin/blog", { credentials: "include" })
      .then((r) => r.json())
      .then((j) => {
        const list = (j.posts?.length ? j.posts : DEFAULT_BLOG_POSTS) as BlogPostPayload[];
        setPosts(list.map((p, i) => ({ ...p, order: p.order ?? i })));
      });
  }, []);

  const patchAt = useCallback((index: number, fn: (row: BlogPostPayload) => BlogPostPayload) => {
    setPosts((prev) => {
      const next = [...prev];
      next[index] = fn(structuredClone(next[index]));
      return next;
    });
  }, []);

  async function save() {
    setStatus("Saving…");
    const normalized = posts.map((p, i) => {
      const finalSlug = (p.slug || slugify(p.title)).trim() || `post-${i}`;
      const href = (p.href || `/blog/${finalSlug}`).trim();
      return { ...p, slug: finalSlug, href, order: i };
    });
    const res = await fetch("/api/admin/blog", {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ posts: normalized }),
    });
    setStatus(res.ok ? "Saved successfully." : "Could not save. Try again.");
    if (res.ok) setPosts(normalized);
  }

  return (
    <div className="space-y-8">
      <CmsPageIntro
        title="Blog articles & cards"
        where="Cards appear on /blog and can surface on the home page “Journal” teaser. Each entry links to its article page."
      >
        Each block below is one article card. The “web address key” becomes part of the link — you can leave it
        blank and we will create one from the title when you save. Rich text uses the Jodit editor below.
      </CmsPageIntro>

      <div className="space-y-5">
        {posts.map((post, i) => (
          <CmsItemCard
            key={`${post.slug}-${i}`}
            title={`Article ${i + 1}`}
            onRemove={() => setPosts((p) => p.filter((_, j) => j !== i))}
          >
            <div className="grid gap-4 lg:grid-cols-2">
              <CmsField label="Title" hint="Headline visitors see on the card.">
                <CmsInput
                  value={post.title}
                  onChange={(e) => patchAt(i, (row) => ({ ...row, title: e.target.value }))}
                />
              </CmsField>
              <CmsField
                label="Web address key (slug)"
                hint="Lowercase, no spaces — optional; auto-filled from title if empty."
              >
                <CmsInput
                  value={post.slug}
                  onChange={(e) => patchAt(i, (row) => ({ ...row, slug: e.target.value }))}
                  placeholder="e.g. avenue-iv-opening"
                />
              </CmsField>
            </div>
            <CmsField
              label="Lead / excerpt"
              hint="Shown on blog cards and in search snippets. Rich text is stripped to plain text on small cards."
            >
              <BlogJoditEditor
                id={`blog-excerpt-${i}`}
                variant="excerpt"
                value={post.excerpt}
                onChange={(html) => patchAt(i, (row) => ({ ...row, excerpt: html }))}
              />
            </CmsField>
            <CmsField
              label="Full article (optional)"
              hint="Shown on /blog/your-slug. If empty, the lead above is used as the article."
            >
              <BlogJoditEditor
                id={`blog-body-${i}`}
                variant="article"
                value={post.body ?? ""}
                onChange={(html) =>
                  patchAt(i, (row) => ({
                    ...row,
                    body: html.trim() ? html : undefined,
                  }))
                }
              />
            </CmsField>
            <div className="grid gap-4 sm:grid-cols-2">
              <CmsField label="Date label" hint="Any text, e.g. December 2024">
                <CmsInput
                  value={post.date}
                  onChange={(e) => patchAt(i, (row) => ({ ...row, date: e.target.value }))}
                />
              </CmsField>
              <CmsField label="Category label">
                <CmsInput
                  value={post.category}
                  onChange={(e) => patchAt(i, (row) => ({ ...row, category: e.target.value }))}
                />
              </CmsField>
            </div>
            <CmsField
              label="Card image"
              hint="Upload a file or paste a URL — shown as the blog post thumbnail."
            >
              <CmsImageUpload
                value={post.image}
                onChange={(url) => patchAt(i, (row) => ({ ...row, image: url }))}
                folder="blog/covers"
              />
            </CmsField>
            <CmsField
              label="Full article link"
              hint="Usually /blog/your-slug — change only if you need a custom destination."
            >
              <CmsInput
                value={post.href}
                onChange={(e) => patchAt(i, (row) => ({ ...row, href: e.target.value }))}
                placeholder="/blog/your-slug"
              />
            </CmsField>
          </CmsItemCard>
        ))}
        <CmsGhostButton
          onClick={() =>
            setPosts((p) => [
              ...p,
              {
                slug: "",
                title: "New article",
                excerpt: "",
                body: undefined,
                date: "",
                category: "",
                href: "",
                image: "/images/avenue-iv.jpg",
                order: p.length,
              },
            ])
          }
        >
          + Add article
        </CmsGhostButton>
      </div>

      <div className="sticky bottom-4 z-10 rounded-2xl border border-stone-200 bg-white/95 p-4 shadow-lg backdrop-blur">
        <CmsPrimaryButton onClick={save}>Save blog</CmsPrimaryButton>
        <span className="ml-3">
          <CmsSaveStatus message={status} />
        </span>
      </div>
    </div>
  );
}
