import ProjectCard from "@/components/shared/ProjectCard";
import CTASection from "@/components/shared/CTASection";

export type ProjectsListPayload = {
  headerBgImage?: string;
  headerHeading?: string;
  headerSubheading?: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  projects: {
    title: string;
    description: string;
    image: string;
    href: string;
    type: string;
    location: string;
    status: string;
    featured: boolean;
  }[];
};

export default function ProjectsPageContent({ payload }: { payload: ProjectsListPayload }) {
  return (
    <>
      <section className="bg-[#f8f5f0] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#c9a84c]">
              {payload.eyebrow}
            </p>
            <h2 className="text-3xl font-bold text-[#1a1a2e] md:text-4xl">{payload.title}</h2>
            <div className="mx-auto mb-5 mt-4 h-1 w-14 bg-[#c9a84c]" />
            <p className="mx-auto max-w-2xl text-sm leading-relaxed text-[#7a7a7a]">
              {payload.subtitle}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2">
            {payload.projects.map((project, index) => (
              <ProjectCard key={project.title} {...project} imagePriority={index < 2} />
            ))}
          </div>
        </div>
      </section>
      <CTASection />
    </>
  );
}
