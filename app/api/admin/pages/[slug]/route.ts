import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/require-admin";
import {
  buildDefaultProjectPayload,
  normalizeProjectListingCards,
  slugFromProjectHref,
} from "@/lib/cms/projects";
import type { ProjectsListPayload } from "@/components/site/ProjectsPageContent";
import { connectMongo } from "@/lib/mongodb";
import { ProjectPageModel } from "@/models/ProjectPage";
import { SitePageModel } from "@/models/SitePage";

async function ensureProjectPageStubs(projects: ProjectsListPayload["projects"]) {
  for (const [index, card] of projects.entries()) {
    const slug = slugFromProjectHref(card.href);
    const title = card.title?.trim();
    if (!slug || !title) continue;
    const existing = await ProjectPageModel.findOne({ slug }).lean();
    if (existing?.payload) continue;
    const payload = buildDefaultProjectPayload(
      slug,
      title,
      typeof card.order === "number" ? card.order : index + 1,
    );
    await ProjectPageModel.findOneAndUpdate(
      { slug },
      { $set: { slug, payload } },
      { upsert: true },
    );
  }
}

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ slug: string }> }
) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { slug } = await ctx.params;
  await connectMongo();
  const doc = await SitePageModel.findOne({ slug }).lean();
  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({
    slug: doc.slug,
    metaTitle: doc.metaTitle,
    metaDescription: doc.metaDescription,
    seo: doc.seo ?? null,
    payload: doc.payload,
  });
}

export async function PUT(
  req: Request,
  ctx: { params: Promise<{ slug: string }> }
) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { slug } = await ctx.params;
  const body = await req.json();
  if (!body.metaTitle || !body.metaDescription || body.payload === undefined) {
    return NextResponse.json(
      { error: "metaTitle, metaDescription, payload required" },
      { status: 400 }
    );
  }
  await connectMongo();

  let payload = body.payload as Record<string, unknown>;
  if (slug === "projects") {
    const normalizedProjects = normalizeProjectListingCards(
      (payload.projects as unknown[] | undefined) ?? [],
    );
    payload = { ...payload, projects: normalizedProjects };
    await ensureProjectPageStubs(normalizedProjects);
  }

  await SitePageModel.findOneAndUpdate(
    { slug },
    {
      $set: {
        slug,
        metaTitle: body.metaTitle,
        metaDescription: body.metaDescription,
        seo: body.seo ?? null,
        payload,
      },
    },
    { upsert: true }
  );
  revalidatePath(`/${slug}`);
  if (slug === "projects") {
    revalidatePath("/projects");
  }
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
