import Image from "next/image";
import CTASection from "@/components/shared/CTASection";
import InquirySection from "@/components/home/InquirySection";

export type AboutStorySection = {
  eyebrow?: string;
  heading: string;
  subheading?: string;
  paragraphs: string[];
  imageSrc: string;
  imageAlt: string;
  stats?: { num: string; label: string }[];
};

export type AboutPayload = {
  headerBgImage?: string;
  headerHeading?: string;
  headerSubheading?: string;
  /** Legacy fields retained only for backwards compatibility */
  headerEyebrow?: string;
  headerTitle?: string;
  imageSrc?: string;
  imageAlt?: string;
  paragraphs?: string[];
  stats?: { num: string; label: string }[];
  storySections?: AboutStorySection[];
  ctaTitle: string;
  ctaDescription: string;
  ctaPrimaryLabel: string;
  ctaPrimaryHref: string;
};

export default function AboutPageContent({ payload }: { payload: AboutPayload }) {
  const storySections: AboutStorySection[] =
    payload.storySections !== undefined
      ? payload.storySections
      : [
          {
            eyebrow: payload.headerEyebrow ?? "",
            heading: payload.headerTitle ?? "About Karyan Infratech",
            subheading: "",
            paragraphs: payload.paragraphs ?? [],
            imageSrc: payload.imageSrc ?? "",
            imageAlt: payload.imageAlt ?? "Karyan Infratech",
            stats: payload.stats ?? [],
          },
        ];

  return (
    <>
      {storySections.map((section, idx) => {
        const imageLeft = idx % 2 === 0;
        return (
          <section key={`${section.heading}-${idx}`} className={idx % 2 === 0 ? "bg-white py-16" : "bg-[#f8f5f0] py-16"}>
            <div className="mx-auto max-w-[1200px] px-4">
              <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
                <div className={`relative h-[420px] overflow-hidden ${imageLeft ? "lg:order-1" : "lg:order-2"}`}>
                  <Image
                    src={section.imageSrc}
                    alt={section.imageAlt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className={imageLeft ? "lg:order-2" : "lg:order-1"}>
                  {section.eyebrow ? (
                    <h4 className="mb-2 text-xs font-bold uppercase tracking-widest" style={{ color: "#655E56" }}>
                      {section.eyebrow}
                    </h4>
                  ) : null}

                  <h2 className="mb-4 font-bold" style={{ color: "#292929", fontSize: "clamp(22px, 3vw, 32px)" }}>
                    {section.heading}
                  </h2>

                  <div className="mb-5 h-0.5 w-10" style={{ background: "#F7B90F" }} />

                  {section.subheading ? (
                    <p className="mb-4 text-sm leading-relaxed" style={{ color: "#5e646a" }}>
                      {section.subheading}
                    </p>
                  ) : null}

                  {section.paragraphs.map((p, i) => (
                    <p key={i} className="mb-4 text-sm leading-relaxed" style={{ color: "#5e646a" }}>
                      {p}
                    </p>
                  ))}

                  {section.stats?.length ? (
                    <div className="mt-6 grid grid-cols-2 gap-4">
                      {section.stats.map((s, i) => (
                        <div key={`${s.label}-${i}`} className="p-3 text-center" style={{ background: "#f5f5f5" }}>
                          <div className="text-2xl font-bold" style={{ color: "#F7B90F" }}>
                            {s.num}
                          </div>
                          <p className="mt-1 text-xs uppercase tracking-wide" style={{ color: "#5e646a" }}>
                            {s.label}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </section>
        );
      })}

      <InquirySection />
      <CTASection
        title={payload.ctaTitle}
        description={payload.ctaDescription}
        primaryLabel={payload.ctaPrimaryLabel}
        primaryHref={payload.ctaPrimaryHref}
      />
    </>
  );
}
