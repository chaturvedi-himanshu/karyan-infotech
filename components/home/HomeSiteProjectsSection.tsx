import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ProjectsListPayload } from "@/components/site/ProjectsPageContent";
import SectionBgStack from "@/components/decor/SectionBgStack";
import HomeProjectsSlider from "@/components/home/HomeProjectsSlider";

export default function HomeSiteProjectsSection({ payload }: { payload: ProjectsListPayload }) {
  const { projects, eyebrow, title, subtitle } = payload;
  if (!projects?.length) return null;

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-lux-ivory via-lux-cream/70 to-lux-cream py-20 lg:py-28">
      <SectionBgStack
        grain
        bottomGlow
        layers={[
          {
            variant: "meshPremium",
            wrapClassName: "inset-0",
            opacityClassName: "opacity-[0.14] text-lux-navy",
          },
          {
            variant: "ribbonArcs",
            wrapClassName: "-right-1/4 top-0 h-2/3 w-2/3",
            opacityClassName: "opacity-[0.1]",
          },
        ]}
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-lux-gold-dim">{eyebrow}</p>
            <h2 className="font-display mt-3 text-3xl font-medium text-lux-navy sm:text-4xl">{title}</h2>
            {subtitle ? (
              <p className="mt-4 text-sm leading-relaxed text-stone-600 sm:text-base">{subtitle}</p>
            ) : null}
          </div>
          <Link
            href="/projects"
            className="inline-flex shrink-0 items-center gap-2 rounded-full border border-lux-navy/15 bg-lux-ivory px-6 py-3 text-xs font-semibold uppercase tracking-widest text-lux-navy shadow-sm transition hover:border-lux-gold/40 hover:bg-lux-cream"
          >
            Full portfolio
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <HomeProjectsSlider projects={projects} />
      </div>
    </section>
  );
}
