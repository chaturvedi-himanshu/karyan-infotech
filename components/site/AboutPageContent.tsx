import Image from "next/image";
import CTASection from "@/components/shared/CTASection";
import InquirySection from "@/components/home/InquirySection";
import SiteBrandLogo from "@/components/layout/SiteBrandLogo";
import { CheckCircle2 } from "lucide-react";

export type AboutPayload = {
  headerEyebrow: string;
  headerTitle: string;
  imageSrc: string;
  imageAlt: string;
  paragraphs: string[];
  stats: { num: string; label: string }[];
  whyTitle: string;
  whySubtitle: string;
  whyInvest: string[];
  whyClosing: string;
  ctaTitle: string;
  ctaDescription: string;
  ctaPrimaryLabel: string;
  ctaPrimaryHref: string;
};

export default function AboutPageContent({ payload }: { payload: AboutPayload }) {
  return (
    <>
      <section style={{ background: "#fff" }} className="py-16">
        <div className="mx-auto max-w-[1200px] px-4">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div className="relative" style={{ height: "420px" }}>
              <Image
                src={payload.imageSrc}
                alt={payload.imageAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div>
              <div className="mb-6 flex justify-start">
                <SiteBrandLogo
                  variant="onLight"
                  asLink={false}
                  className="h-11 w-auto max-w-[220px] sm:h-12"
                />
              </div>
              <h4
                className="mb-2 text-xs font-bold uppercase tracking-widest"
                style={{ color: "#655E56" }}
              >
                {payload.headerEyebrow}
              </h4>
              <h2
                className="mb-4 font-bold"
                style={{ color: "#292929", fontSize: "clamp(22px, 3vw, 32px)" }}
              >
                {payload.headerTitle}
              </h2>
              <div className="mb-5 h-0.5 w-10" style={{ background: "#F7B90F" }} />
              {payload.paragraphs.map((p, i) => (
                <p
                  key={i}
                  className="mb-4 text-sm leading-relaxed last:mb-6"
                  style={{ color: "#5e646a" }}
                >
                  {p}
                </p>
              ))}
              <div className="mb-6 grid grid-cols-2 gap-4">
                {payload.stats.map((s) => (
                  <div key={s.label} className="p-3 text-center" style={{ background: "#f5f5f5" }}>
                    <div className="text-2xl font-bold" style={{ color: "#F7B90F" }}>
                      {s.num}
                    </div>
                    <p className="mt-1 text-xs uppercase tracking-wide" style={{ color: "#5e646a" }}>
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ background: "#f5f5f5" }} className="py-16">
        <div className="mx-auto max-w-[1200px] px-4">
          <div className="mb-10 text-center">
            <h2 className="mb-3 text-2xl font-bold" style={{ color: "#292929" }}>
              {payload.whyTitle}
            </h2>
            <p style={{ color: "#5e646a" }} className="text-sm">
              {payload.whySubtitle}
            </p>
            <div className="mx-auto mt-3 h-0.5 w-10" style={{ background: "#F7B90F" }} />
          </div>
          <div className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {payload.whyInvest.map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 p-5"
                style={{ background: "#fff", borderLeft: "3px solid #F7B90F" }}
              >
                <CheckCircle2 className="h-5 w-5 shrink-0" style={{ color: "#F7B90F" }} />
                <span className="text-sm font-medium" style={{ color: "#292929" }}>
                  {item}
                </span>
              </div>
            ))}
          </div>
          <div className="text-center">
            <p className="text-sm italic" style={{ color: "#5e646a" }}>
              {payload.whyClosing}
            </p>
          </div>
        </div>
      </section>

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
