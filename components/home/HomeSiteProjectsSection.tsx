import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ProjectsListPayload } from "@/components/site/ProjectsPageContent";
import SectionBgStack from "@/components/decor/SectionBgStack";
import HomeProjectsSlider from "@/components/home/HomeProjectsSlider";
import HomeSectionHeading from "@/components/home/HomeSectionHeading";

export default function HomeSiteProjectsSection({ payload }: { payload: ProjectsListPayload }) {
  const { projects, eyebrow, title, subtitle } = payload;
  if (!projects?.length) return null;

  return (
    <section className="section-y relative overflow-x-hidden bg-gradient-to-b from-lux-ivory via-lux-cream/70 to-lux-cream">
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
          <HomeSectionHeading
            eyebrow={eyebrow}
            title={title}
            description={subtitle}
          />
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
