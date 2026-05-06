/** Always read fresh home CMS data from Mongo (not a stale static snapshot). */
export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { getHomeContent } from "@/lib/cms/getters";
import { buildSeoMetadata } from "@/lib/seo/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getHomeContent();
  return buildSeoMetadata({
    title: data.metadata?.title || "Home",
    description: data.metadata?.description || "Home page",
    seo: data.seo,
  });
}

export { default } from "@/components/home/LuxuryHomePage";
