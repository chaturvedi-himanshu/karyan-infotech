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
    <section style={{ background: "#292929" }} className="py-12">
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
            <p style={{ color: "#aaa" }} className="text-sm">
              {description}
            </p>
          </div>
          <div className="flex flex-shrink-0 gap-3">
            {primaryHref ? (
              <Link
                href={primaryHref}
                className="px-7 py-3 text-sm font-semibold uppercase tracking-wider text-white transition-opacity hover:opacity-90"
                style={{ background: "#F7B90F" }}
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
                className="px-7 py-3 text-sm font-semibold uppercase tracking-wider text-white transition-opacity hover:opacity-90"
                style={{ background: "#F7B90F" }}
              >
                {primaryLabel}
              </button>
            )}
            <a
              href={secondaryHref}
              className="flex items-center gap-2 px-7 py-3 text-sm font-semibold uppercase tracking-wider transition-colors"
              style={{
                background: "transparent",
                border: "1px solid #555",
                color: "#aaa",
              }}
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
