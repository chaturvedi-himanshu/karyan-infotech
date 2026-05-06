import type { Metadata } from "next";
import Image from "next/image";
import PageHeader from "@/components/layout/PageHeader";
import CTASection from "@/components/shared/CTASection";
import ContactForm from "@/components/shared/ContactForm";
import { Building2, CheckCircle2, Download } from "lucide-react";
import type { ProjectPayload } from "@/lib/cms/types";
import { getLucideIcon, projectIcon } from "@/lib/cms/icons";
import ProjectVideoPlayer from "@/components/projects/ProjectVideoPlayer";
import ProjectGalleryCarousel from "@/components/projects/ProjectGalleryCarousel";
import ProjectFloorPlansLightbox from "@/components/projects/ProjectFloorPlansLightbox";
import SeoJsonLd from "@/components/seo/SeoJsonLd";
import { buildSeoMetadata } from "@/lib/seo/metadata";

export function projectMetadata(data: ProjectPayload): Metadata {
  return buildSeoMetadata({
    title: data.metadata.title,
    description: data.metadata.description,
    seo: data.seo,
  });
}

export default function ProjectPageView({ data }: { data: ProjectPayload }) {
  const {
    header,
    investmentHighlights,
    mainTitle,
    introParagraphs,
    benefits,
    benefitsTitle,
    unitTypes,
    unitTypesTitle,
    architects,
    architectsTitle,
    gallery,
    floorPlans,
    floorPlansTitle,
    downloads,
    videoSection,
    leasingBox,
    specs,
    locationSidebar,
    sidebarFormTitle,
    cta,
  } = data;

  return (
    <>
      <SeoJsonLd raw={data.seo?.schemaJsonLd} />
      <PageHeader title={header.title} breadcrumbs={header.breadcrumbs} bgImage={header.bgImage} />

      <section className="bg-lux-ivory py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="-mt-8 mb-16 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {investmentHighlights.map((item) => {
              const Icon = projectIcon(item.icon);
              return (
                <div
                  key={item.title}
                  className="flex gap-4 rounded-sm border-t-4 border-[#c9a84c] bg-lux-ivory p-6 shadow-lg"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-sm bg-theme-bg">
                    <Icon className="h-5 w-5 text-[#c9a84c]" />
                  </div>
                  <div>
                    <p className="mb-1 text-xs font-medium uppercase tracking-wider text-[#7a7a7a]">
                      {item.title}
                    </p>
                    <p className="text-lg font-bold text-[#1a1a2e]">{item.value}</p>
                    <p className="mt-1 text-xs text-[#7a7a7a]">{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <h2 className="mb-4 text-3xl font-bold text-[#1a1a2e]">{mainTitle}</h2>
              <div className="mb-6 h-1 w-14 bg-[#c9a84c]" />
              <div className="space-y-4 leading-relaxed text-[#7a7a7a]">
                {introParagraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
               {(downloads?.brochureUrl?.trim() || downloads?.priceListUrl?.trim()) ? (
                <div className="mt-8 flex flex-wrap justify-end gap-3">
                  {downloads?.brochureUrl?.trim() ? (
                    <a
                      href={downloads.brochureUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-sm bg-theme-bg px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                    >
                      <Download className="h-4 w-4" />
                      {downloads.brochureLabel?.trim() || "Download Brochure"}
                    </a>
                  ) : null}
                  {downloads?.priceListUrl?.trim() ? (
                    <a
                      href={downloads.priceListUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-sm border border-theme-bg px-5 py-3 text-sm font-semibold text-theme-bg transition hover:bg-theme-bg hover:text-white"
                    >
                      <Download className="h-4 w-4" />
                      {downloads.priceListLabel?.trim() || "Download Price List"}
                    </a>
                  ) : null}
                </div>
              ) : null}

              {unitTypes?.length ? (
                <>
                  <h3 className="mb-5 mt-10 text-xl font-bold text-[#1a1a2e]">
                    {unitTypesTitle ?? "Available Unit Types"}
                  </h3>
                  <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {unitTypes.map((unit) => (
                      <div
                        key={unit.size}
                        className="rounded-sm border-t-4 border-[#c9a84c] bg-[#f8f5f0] p-5"
                      >
                        <h4 className="mb-1 text-sm font-bold text-[#1a1a2e]">{unit.size}</h4>
                        <p className="mb-2 text-base font-semibold text-[#c9a84c]">{unit.area}</p>
                        <p className="text-xs text-[#7a7a7a]">{unit.ideal}</p>
                      </div>
                    ))}
                  </div>
                </>
              ) : null}

              {benefits?.length ? (
                <>
                  <h3 className="mb-5 mt-10 text-xl font-bold text-[#1a1a2e]">
                    {benefitsTitle ?? "Key Benefits"}
                  </h3>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {benefits.map((item) => (
                      <div key={item} className="flex items-start gap-3">
                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#c9a84c]" />
                        <span className="text-sm text-[#5e646a]">{item}</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : null}

              {architects?.length ? (
                <>
                  <h3 className="mb-5 mt-10 text-xl font-bold text-[#1a1a2e]">
                    {architectsTitle ?? "The Design Team"}
                  </h3>
                  <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {architects.map((arch) => (
                      <div
                        key={arch.name}
                        className="rounded-sm border-t-4 border-[#c9a84c] bg-[#f8f5f0] p-5"
                      >
                        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-sm bg-theme-bg">
                          <Building2 className="h-5 w-5 text-[#c9a84c]" />
                        </div>
                        <h4 className="mb-1 text-sm font-bold text-[#1a1a2e]">{arch.name}</h4>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#c9a84c]">
                          {arch.role}
                        </p>
                        <p className="text-xs leading-relaxed text-[#7a7a7a]">{arch.description}</p>
                      </div>
                    ))}
                  </div>
                </>
              ) : null}

              {gallery.length ? (
                <>
                  <div className="mt-10">
                    <ProjectGalleryCarousel title="Project Gallery" images={gallery} />
                  </div>
                </>
              ) : null}

              {floorPlans?.length ? (
                <>
                  <ProjectFloorPlansLightbox
                    title={floorPlansTitle ?? "Floor Plans"}
                    images={floorPlans}
                  />
                </>
              ) : null}

             

              {videoSection?.videoUrl?.trim() ? (
                <>
                  <h3 className="mb-5 mt-10 text-xl font-bold text-[#1a1a2e]">
                    {videoSection.title?.trim() || "Project Video"}
                  </h3>
                  {videoSection.description?.trim() ? (
                    <p className="mb-4 text-sm leading-relaxed text-[#7a7a7a]">
                      {videoSection.description}
                    </p>
                  ) : null}
                  <div className="overflow-hidden rounded-sm border border-stone-200 bg-black">
                    <ProjectVideoPlayer
                      src={videoSection.videoUrl}
                      poster={videoSection.posterImage?.trim() || undefined}
                    />
                  </div>
                </>
              ) : null}

              {leasingBox ? (
                <>
                  <h3 className="mb-5 mt-10 text-xl font-bold text-[#1a1a2e]">{leasingBox.title}</h3>
                  <div className="rounded-sm bg-[#f8f5f0] p-6">
                    <p className="mb-4 text-sm leading-relaxed text-[#7a7a7a]">{leasingBox.intro}</p>
                    <ul className="space-y-3">
                      {leasingBox.bullets.map((item) => (
                        <li key={item} className="flex items-start gap-3 text-sm">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#c9a84c]" />
                          <span className="text-[#5e646a]">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              ) : null}
            </div>

            <div className="space-y-6">
              <div className="rounded-sm bg-[#f8f5f0] p-6">
                <h3 className="mb-4 text-base font-bold uppercase tracking-wider text-[#1a1a2e]">
                  Project Details
                </h3>
                <dl className="space-y-3">
                  {specs.map((spec) => (
                    <div
                      key={spec.label}
                      className="flex items-start justify-between border-b border-gray-200 pb-3 last:border-0 last:pb-0"
                    >
                      <dt className="text-xs font-medium uppercase tracking-wider text-[#7a7a7a]">
                        {spec.label}
                      </dt>
                      <dd className="max-w-[55%] text-right text-sm font-semibold text-[#1a1a2e]">
                        {spec.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>

              {locationSidebar ? (
                <div className="rounded-sm bg-theme-bg p-6 text-white">
                  <h3 className="mb-4 flex items-center gap-2 text-base font-bold uppercase tracking-wider">
                    {(() => {
                      const Mp = getLucideIcon("MapPin");
                      return <Mp className="h-4 w-4 text-[#c9a84c]" />;
                    })()}
                    {locationSidebar.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-gray-300">{locationSidebar.body}</p>
                  {locationSidebar.badges?.length ? (
                    <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-gray-400">
                      {locationSidebar.badges.map((b) => {
                        const Ic = getLucideIcon(b.icon);
                        return (
                          <span key={b.text} className="flex items-center gap-1">
                            <Ic className="h-3.5 w-3.5 text-[#c9a84c]" />
                            {b.text}
                          </span>
                        );
                      })}
                    </div>
                  ) : null}
                </div>
              ) : null}

              <div className="overflow-hidden rounded-2xl border border-stone-200/90 bg-gradient-to-b from-white to-[#f8f5f0] p-6 lg:sticky lg:top-28">
                <h3 className="mb-2 text-base font-bold text-[#1a1a2e]">{sidebarFormTitle}</h3>
                <p className="mb-5 text-xs uppercase tracking-[0.15em] text-stone-500">
                  We respond within one business day
                </p>
                <ContactForm fixedProject={header.title} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <CTASection
        title={cta.title}
        description={cta.description}
        enquiryProject={cta.enquiryProject}
        primaryLabel={cta.primaryLabel}
        secondaryLabel={cta.secondaryLabel}
        secondaryHref={cta.secondaryHref}
      />
    </>
  );
}
