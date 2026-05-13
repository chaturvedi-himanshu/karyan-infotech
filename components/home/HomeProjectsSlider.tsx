import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ProjectsListPayload } from "@/components/site/ProjectsPageContent";

type Project = ProjectsListPayload["projects"][number];

function PortfolioStackCard({
  project,
  imagePriority = false,
}: {
  project: Project;
  imagePriority?: boolean;
}) {
  return (
    <Link
      href={project.href}
      className="group flex h-full min-h-0 flex-col overflow-hidden rounded-3xl border border-stone-200/70 bg-lux-ivory shadow-[0_24px_50px_-28px_rgba(10,22,40,0.15)] ring-1 ring-black/[0.03] transition duration-300 hover:border-lux-gold/35 hover:shadow-[0_28px_60px_-24px_rgba(198,160,82,0.18)]"
    >
      <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-stone-100">
        <Image
          src={project.image}
          alt={project.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition duration-500 group-hover:scale-[1.03]"
          priority={imagePriority}
          referrerPolicy="no-referrer"
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-2 sm:left-4 sm:top-4">
          <span className="rounded-full bg-theme-bg/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-theme-on-bg backdrop-blur">
            {project.type}
          </span>
        </div>
        <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4">
          <span className="rounded-full bg-theme-bg/85 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-theme-on-bg backdrop-blur">
            {project.status}
          </span>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="text-xs font-medium uppercase tracking-wide text-lux-gold-dim">{project.location}</p>
        <h3 className="font-display mt-2 text-lg font-medium text-lux-navy group-hover:text-lux-gold-dim sm:text-xl">
          {project.title}
        </h3>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-stone-600 sm:line-clamp-4">
          {project.description}
        </p>
        <span className="mt-4 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-lux-navy">
          View project
          <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}

/** Portfolio cards in a responsive grid (3 columns on large screens). */
export default function HomeProjectsSlider({ projects }: { projects: Project[] }) {
  if (!projects.length) return null;

  return (
    <div className="relative mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project, index) => (
        <PortfolioStackCard key={project.href} project={project} imagePriority={index < 2} />
      ))}
    </div>
  );
}
