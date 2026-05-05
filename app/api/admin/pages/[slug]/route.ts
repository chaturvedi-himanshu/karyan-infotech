import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/require-admin";
import { connectMongo } from "@/lib/mongodb";
import { SitePageModel } from "@/models/SitePage";

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
  await SitePageModel.findOneAndUpdate(
    { slug },
    {
      $set: {
        slug,
        metaTitle: body.metaTitle,
        metaDescription: body.metaDescription,
        payload: body.payload,
      },
    },
    { upsert: true }
  );
  revalidatePath(`/${slug}`);
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
