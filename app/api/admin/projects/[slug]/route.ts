import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/require-admin";
import {
  migrateProjectPayloadSlug,
  normalizeProjectSlug,
  slugFromProjectHref,
} from "@/lib/cms/projects";
import type { ProjectPayload } from "@/lib/cms/types";
import { connectMongo } from "@/lib/mongodb";
import { ProjectPageModel } from "@/models/ProjectPage";
import { SitePageModel } from "@/models/SitePage";

function parsePutBody(raw: unknown): {
  payload: ProjectPayload;
  nextSlug: string;
} {
  if (
    raw &&
    typeof raw === "object" &&
    "payload" in raw &&
    raw.payload &&
    typeof raw.payload === "object"
  ) {
    const nextSlug =
      "nextSlug" in raw && typeof raw.nextSlug === "string"
        ? normalizeProjectSlug(raw.nextSlug)
        : "";
    return { payload: raw.payload as ProjectPayload, nextSlug };
  }
  return { payload: raw as ProjectPayload, nextSlug: "" };
}

async function syncListingTitle(slug: string, projectTitle: string): Promise<void> {
  if (!projectTitle) return;
  const listingDoc = await SitePageModel.findOne({ slug: "projects" }).lean();
  const rawPayload = listingDoc?.payload;
  if (!rawPayload || typeof rawPayload !== "object" || Array.isArray(rawPayload)) return;
  const pl = rawPayload as { projects?: { title?: string; href?: string }[] };
  const rows = [...(pl.projects ?? [])];
  let changed = false;
  for (let i = 0; i < rows.length; i++) {
    const rowSlug = slugFromProjectHref(rows[i]?.href ?? "");
    if (rowSlug === slug && rows[i].title !== projectTitle) {
      rows[i] = { ...rows[i], title: projectTitle };
      changed = true;
      break;
    }
  }
  if (changed) {
    await SitePageModel.findOneAndUpdate(
      { slug: "projects" },
      { $set: { payload: { ...pl, projects: rows } } }
    );
  }
}

async function syncListingHref(oldSlug: string, newSlug: string): Promise<void> {
  const listingDoc = await SitePageModel.findOne({ slug: "projects" }).lean();
  const rawPayload = listingDoc?.payload;
  if (!rawPayload || typeof rawPayload !== "object" || Array.isArray(rawPayload)) return;
  const pl = rawPayload as { projects?: { title?: string; href?: string }[] };
  const rows = [...(pl.projects ?? [])];
  let changed = false;
  for (let i = 0; i < rows.length; i++) {
    const rowSlug = slugFromProjectHref(rows[i]?.href ?? "");
    if (rowSlug === oldSlug) {
      rows[i] = { ...rows[i], href: `/${newSlug}` };
      changed = true;
      break;
    }
  }
  if (changed) {
    await SitePageModel.findOneAndUpdate(
      { slug: "projects" },
      { $set: { payload: { ...pl, projects: rows } } }
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
  const normalized = slug.trim().toLowerCase();
  let doc =
    (await ProjectPageModel.findOne({ slug: normalized }).lean()) ??
    (await ProjectPageModel.findOne({
      slug: new RegExp(`^${slug.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i"),
    }).lean());
  return NextResponse.json({ slug: normalized, payload: doc?.payload ?? null });
}

export async function PUT(
  req: Request,
  ctx: { params: Promise<{ slug: string }> }
) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { slug } = await ctx.params;
  const normalizedCurrent = normalizeProjectSlug(slug);

  const rawBody = await req.json();
  const { payload, nextSlug: requestedNext } = parsePutBody(rawBody);

  await connectMongo();

  const projectTitle =
    typeof payload?.header?.title === "string" ? payload.header.title.trim() : "";

  const renameTo =
    requestedNext && requestedNext !== normalizedCurrent ? requestedNext : "";

  if (renameTo) {
    const taken = await ProjectPageModel.findOne({ slug: renameTo }).lean();
    if (taken) {
      return NextResponse.json(
        { ok: false, error: `The slug "${renameTo}" is already used by another project.` },
        { status: 409 }
      );
    }

    const migrated = migrateProjectPayloadSlug(payload, normalizedCurrent, renameTo);

    await ProjectPageModel.findOneAndUpdate(
      { slug: renameTo },
      { $set: { slug: renameTo, payload: migrated } },
      { upsert: true }
    );
    await ProjectPageModel.deleteOne({ slug: normalizedCurrent });

    await syncListingHref(normalizedCurrent, renameTo);
    if (projectTitle) await syncListingTitle(renameTo, projectTitle);

    revalidatePath(`/${normalizedCurrent}`);
    revalidatePath(`/${renameTo}`);
    revalidatePath("/projects");
    revalidatePath("/", "layout");

    return NextResponse.json({ ok: true, slug: renameTo });
  }

  await ProjectPageModel.findOneAndUpdate(
    { slug: normalizedCurrent },
    { $set: { slug: normalizedCurrent, payload } },
    { upsert: true }
  );

  if (projectTitle) await syncListingTitle(normalizedCurrent, projectTitle);

  revalidatePath(`/${normalizedCurrent}`);
  revalidatePath("/projects");
  revalidatePath("/", "layout");

  return NextResponse.json({ ok: true, slug: normalizedCurrent });
}
