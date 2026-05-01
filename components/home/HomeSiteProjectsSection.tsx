import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ProjectsListPayload } from "@/components/site/ProjectsPageContent";
import SectionBgStack from "@/components/decor/SectionBgStack";

type Project = ProjectsListPayload["projects"][number];

function chunkProjects<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) chunks.push(arr.slice(i, i + size));
  return chunks;
}

/** One row spanning full width of the 2-column grid, then two halves, then full — “1-2-1”. */
function BentoProjectCard({ project, layout }: { project: Project; layout: "wide" | "tall" }) {
  const isWide = layout === "wide";

  return (
    <Link
      href={project.href}
      className={`group relative flex flex-col overflow-hidden rounded-3xl border border-stone-200/70 bg-lux-ivory shadow-[0_24px_50px_-28px_rgba(10,22,40,0.15)] ring-1 ring-black/[0.03] transition duration-300 hover:-translate-y-1 hover:border-lux-gold/35 hover:shadow-[0_28px_60px_-24px_rgba(198,160,82,0.18)] sm:col-span-1 ${
        isWide ? "sm:col-span-2 sm:min-h-[260px] sm:flex-row" : ""
      }`}
    >
      <div
        className={`relative shrink-0 overflow-hidden bg-stone-100 ${
          isWide ? "h-52 sm:h-auto sm:w-[46%] sm:min-h-[240px] lg:min-h-[280px]" : "h-52"
        }`}
      >
        <Image
          src={project.image}
          alt={project.title}
          fill
          sizes={isWide ? "(max-width: 640px) 100vw, 45vw" : "(max-width: 640px) 100vw, 50vw"}
          className="object-cover transition duration-500 group-hover:scale-[1.03]"
        />
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-theme-bg/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-theme-on-bg backdrop-blur">
            {project.type}
          </span>
        </div>
        <div className="absolute bottom-4 left-4">
          <span className="rounded-full bg-theme-bg/85 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-theme-on-bg backdrop-blur">
            {project.status}
          </span>
        </div>
      </div>
      <div
        className={`flex flex-1 flex-col justify-center p-6 sm:p-8 ${isWide ? "sm:py-10 sm:pl-2 sm:pr-10" : ""}`}
      >
        <p className="text-xs font-medium uppercase tracking-wide text-lux-gold-dim">{project.location}</p>
        <h3 className="font-display mt-2 text-xl font-medium text-lux-navy group-hover:text-lux-gold-dim sm:text-2xl">
          {project.title}
        </h3>
        <p
          className={`mt-3 text-sm leading-relaxed text-stone-600 ${
            isWide ? "line-clamp-4 sm:line-clamp-5" : "line-clamp-3 sm:line-clamp-4"
          }`}
        >
          {project.description}
        </p>
        <span className="mt-6 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-lux-navy">
          View project
          <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}

function BentoChunk({ chunk }: { chunk: Project[] }) {
  const n = chunk.length;
  const [a, b, c, d] = chunk;
  if (n === 0) return null;
  if (n === 1) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:gap-8">
        <BentoProjectCard project={a} layout="wide" />
      </div>
    );
  }
  if (n === 2) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:gap-8">
        <BentoProjectCard project={a} layout="wide" />
        <BentoProjectCard project={b!} layout="wide" />
      </div>
    );
  }
  if (n === 3) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:gap-8">
        <BentoProjectCard project={a} layout="wide" />
        <BentoProjectCard project={b!} layout="tall" />
        <BentoProjectCard project={c!} layout="tall" />
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:gap-8">
      <BentoProjectCard project={a} layout="wide" />
      <BentoProjectCard project={b!} layout="tall" />
      <BentoProjectCard project={c!} layout="tall" />
      <BentoProjectCard project={d!} layout="wide" />
    </div>
  );
}

export default function HomeSiteProjectsSection({ payload }: { payload: ProjectsListPayload }) {
  const { projects, eyebrow, title, subtitle } = payload;
  if (!projects?.length) return null;

  const chunks = chunkProjects(projects, 4);

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
            <p className="mt-3 text-xs text-stone-500">
              Layout: one wide card, two side by side, then another wide card (1-2-1) for each group of four
              projects.
            </p>
          </div>
          <Link
            href="/projects"
            className="inline-flex shrink-0 items-center gap-2 rounded-full border border-lux-navy/15 bg-lux-ivory px-6 py-3 text-xs font-semibold uppercase tracking-widest text-lux-navy shadow-sm transition hover:border-lux-gold/40 hover:bg-lux-cream"
          >
            Full portfolio
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-14 flex flex-col gap-12 lg:gap-16">
          {chunks.map((chunk, i) => (
            <BentoChunk key={chunk.map((p) => p.href).join("-") || String(i)} chunk={chunk} />
          ))}
        </div>
      </div>
    </section>
  );
}
