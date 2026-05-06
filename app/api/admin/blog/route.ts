import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/require-admin";
import { connectMongo } from "@/lib/mongodb";
import { BlogPostModel } from "@/models/BlogPost";
import type { BlogPostPayload } from "@/lib/cms/types";

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  await connectMongo();
  const rows = await BlogPostModel.find().sort({ order: 1 }).lean();
  return NextResponse.json({
    posts: rows.map((r) => ({
      slug: r.slug,
      title: r.title,
      excerpt: r.excerpt,
      body: r.body ?? undefined,
      date: r.date,
      category: r.category,
      href: r.href,
      image: r.image,
      order: r.order,
      seo: r.seo ?? undefined,
    })),
  });
}

export async function PUT(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const body = await req.json();
  const posts = body.posts as BlogPostPayload[] | undefined;
  if (!Array.isArray(posts)) {
    return NextResponse.json({ error: "posts array required" }, { status: 400 });
  }
  await connectMongo();
  await BlogPostModel.deleteMany({});
  if (posts.length) {
    await BlogPostModel.insertMany(
      posts.map((p, i) => ({
        slug: p.slug,
        title: p.title,
        excerpt: p.excerpt,
        body: p.body,
        date: p.date,
        category: p.category,
        href: p.href,
        image: p.image,
        order: p.order ?? i,
        seo: p.seo ?? undefined,
      }))
    );
  }
  return NextResponse.json({ ok: true });
}
