"use client";

import Link from "next/link";
import { Phone } from "lucide-react";
import { useEnquiry } from "@/components/enquiry/EnquiryProvider";
import SiteBrandLogo from "@/components/layout/SiteBrandLogo";

interface CTASectionProps {
  title?: string;
  description?: string;
  primaryLabel?: string;
  /** When set, primary opens enquiry modal with this project (trevana, citywalk, square, avenue-iv). */
  enquiryProject?: string;
  /** When set, primary is a link instead of opening the modal (e.g. /projects). */
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}

export default function CTASection({
  title = "Schedule A Free Site Visit",
  description = "Our team is ready to assist you. Schedule a free site visit today.",
  primaryLabel = "Book Now",
  enquiryProject,
  primaryHref,
  secondaryLabel = "Call Us",
  secondaryHref = "tel:+919206001002",
}: CTASectionProps) {
  const { openEnquiry } = useEnquiry();

  return (
    <section className="bg-theme-bg py-12">
      <div className="mx-auto max-w-[1200px] px-4">
        <div className="flex flex-col items-center justify-between gap-6 text-center lg:flex-row lg:text-left">
          <div>
            <div className="mb-4 flex justify-center lg:justify-start">
              <SiteBrandLogo
                variant="onDark"
                asLink={false}
                className="h-9 w-auto max-w-[200px] opacity-95 sm:h-10"
              />
            </div>
            <h2 className="mb-2 text-2xl font-bold text-white md:text-3xl">
              {title}
            </h2>
            <p className="text-sm text-theme-on-bg-muted">
              {description}
            </p>
          </div>
          <div className="flex flex-shrink-0 gap-3">
            {primaryHref ? (
              <Link
                href={primaryHref}
                className="bg-lux-gold px-7 py-3 text-sm font-semibold uppercase tracking-wider text-white transition-colors hover:bg-lux-gold-dim"
              >
                {primaryLabel}
              </Link>
            ) : (
              <button
                type="button"
                onClick={() =>
                  openEnquiry(
                    enquiryProject ? { project: enquiryProject } : undefined
                  )
                }
                className="bg-lux-gold px-7 py-3 text-sm font-semibold uppercase tracking-wider text-white transition-colors hover:bg-lux-gold-dim"
              >
                {primaryLabel}
              </button>
            )}
            <a
              href={secondaryHref}
              className="flex items-center gap-2 border border-theme-bg-elevated px-7 py-3 text-sm font-semibold uppercase tracking-wider text-theme-on-bg-muted transition-colors hover:border-lux-gold/45 hover:text-white"
            >
              <Phone className="h-4 w-4" />
              {secondaryLabel}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
