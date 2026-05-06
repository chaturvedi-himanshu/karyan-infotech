import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHeader from "@/components/layout/PageHeader";
import BlogCard from "@/components/shared/BlogCard";
import CTASection from "@/components/shared/CTASection";
import { getBlogPosts, getSitePage } from "@/lib/cms/getters";
import SeoJsonLd from "@/components/seo/SeoJsonLd";
import { buildSeoMetadata } from "@/lib/seo/metadata";

type BlogIntroPayload = {
  headerBgImage?: string;
  headerHeading?: string;
  headerSubheading?: string;
  eyebrow?: string;
  title?: string;
};

export async function generateMetadata(): Promise<Metadata> {
  const doc = await getSitePage("blog");
  if (!doc) return { title: "Blog" };
  return buildSeoMetadata({
    title: doc.metaTitle,
    description: doc.metaDescription,
    seo: doc.seo,
  });
}

export default async function BlogPage() {
  const [doc, posts] = await Promise.all([getSitePage("blog"), getBlogPosts()]);
  if (!doc) notFound();
  const intro = doc.payload as BlogIntroPayload;
  return (
    <>
      <SeoJsonLd raw={doc.seo?.schemaJsonLd} />
      <PageHeader
        title={intro.headerHeading || doc.metaTitle}
        subheading={intro.headerSubheading}
        bgImage={intro.headerBgImage}
        breadcrumbs={[{ label: "Blog" }]}
      />

      <section className="bg-[#f8f5f0] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#c9a84c]">
              {intro.eyebrow ?? "Insights & Updates"}
            </p>
            <h2 className="text-3xl font-bold text-[#1a1a2e] md:text-4xl">
              {intro.title ?? "Real Estate News & Insights"}
            </h2>
            <div className="mx-auto mt-4 h-1 w-14 bg-[#c9a84c]" />
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <BlogCard
                key={post.slug}
                title={post.title}
                excerpt={post.excerpt}
                date={post.date}
                category={post.category}
                href={post.href}
                image={post.image}
              />
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
