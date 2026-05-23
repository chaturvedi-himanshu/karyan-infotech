import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import CTASection from "@/components/shared/CTASection";
import { getBlogPostBySlug, getBlogPosts } from "@/lib/cms/getters";
import { stripHtml } from "@/lib/html/stripHtml";
import BlogArticleBody from "@/components/blog/BlogArticleBody";
import { Calendar, Clock3 } from "lucide-react";
import SeoJsonLd from "@/components/seo/SeoJsonLd";
import { buildSeoMetadata } from "@/lib/seo/metadata";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return { title: "Article" };
  return buildSeoMetadata({
    title: post.title,
    description: stripHtml(post.excerpt).slice(0, 200),
    seo: post.seo,
  });
}

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = true;

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();
  const allPosts = await getBlogPosts();
  const otherPosts = allPosts.filter((p) => p.slug !== slug).slice(0, 10);

  const mainContent = (post.body?.trim() ? post.body : post.excerpt) ?? "";
  const excerpt = stripHtml(post.excerpt || "").trim();
  const heroImage = post.image?.trim() || "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1920&auto=format&fit=crop";

  return (
    <>
      <SeoJsonLd raw={post.seo?.schemaJsonLd} />
      <section
        data-aos-skip
        className="relative h-[min(72vh,760px)] w-full overflow-hidden bg-theme-bg"
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${heroImage}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-black/20" />
      </section>

      <article data-aos-skip className="bg-[#f8f5f0] pb-20 pt-0">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div
            data-aos-skip
            className="-mt-24 mb-10 rounded-3xl border border-white/80 bg-white/95 p-6 backdrop-blur-sm sm:p-8 lg:p-10"
          >
            <div className="mb-4 flex flex-wrap items-center gap-3 text-sm" style={{ color: "#7a7a7a" }}>
              <span
                className="text-xs font-bold uppercase px-2.5 py-1 text-white"
                style={{ background: "#F7B90F" }}
              >
                {post.category}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {post.date}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock3 className="h-4 w-4" />
                5 min read
              </span>
            </div>
            <h1 className="text-3xl font-semibold leading-tight text-lux-navy sm:text-4xl lg:text-[2.7rem]">
              {post.title}
            </h1>
            {excerpt ? (
              <p className="mt-4 max-w-4xl text-base leading-relaxed text-stone-600 sm:text-lg">
                {excerpt}
              </p>
            ) : null}
          </div>

          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px]">
            <div className="bg-lux-ivory p-6 shadow-sm sm:p-10">
              <BlogArticleBody html={mainContent} />
              <div className="mt-6 text-center">
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider hover:opacity-80"
                  style={{ color: "#F7B90F" }}
                >
                  ← Back to all articles
                </Link>
              </div>
            </div>

            <aside className="lg:sticky lg:top-28 lg:self-start">
              <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
                <h2 className="text-lg font-semibold text-lux-navy">
                  More from the blog
                </h2>
                <p className="mt-1 text-sm text-stone-500">
                  Explore more insights and project updates.
                </p>
                <div className="mt-5 space-y-3">
                  {otherPosts.map((item) => (
                    <Link
                      key={item.slug}
                      href={`/blog/${item.slug}`}
                      className="block rounded-xl border border-stone-200 bg-stone-50/70 p-3 transition hover:border-lux-gold/40 hover:bg-lux-ivory"
                    >
                      <p className="line-clamp-2 text-sm font-semibold text-lux-navy">
                        {item.title}
                      </p>
                      <p className="mt-1 text-xs text-stone-500">{item.date}</p>
                    </Link>
                  ))}
                </div>
              </div>
            </aside>
          </div>

        </div>
      </article>

      <CTASection />
    </>
  );
}
