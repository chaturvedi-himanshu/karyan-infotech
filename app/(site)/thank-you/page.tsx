import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Home, Phone, Mail } from "lucide-react";
import SiteBrandLogo from "@/components/layout/SiteBrandLogo";
import { getSiteSettings } from "@/lib/cms/getters";

export const metadata: Metadata = {
  title: "Thank You",
  description: "Thank you for contacting Karyan Infratech.",
};

export default async function ThankYouPage() {
  const settings = await getSiteSettings();
  const contactPhone = settings.nav.topBar.phone || settings.footer.contactPhone;
  const contactPhoneHref = settings.nav.topBar.phoneHref || settings.footer.contactPhoneHref;

  return (
    <div className="min-h-screen bg-[#f8f5f0] flex items-center justify-center px-4 pt-20">
      <div className="max-w-2xl w-full text-center">
        <div className="mb-8 flex justify-center">
          <SiteBrandLogo
            variant="onLight"
            className="h-11 w-auto max-w-[220px] sm:h-12"
          />
        </div>
        {/* Success Icon */}
        <div className="w-24 h-24 bg-[#c9a84c]/10 rounded-full flex items-center justify-center mx-auto mb-8">
          <CheckCircle2 className="w-14 h-14 text-[#c9a84c]" />
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-[#1a1a2e] mb-4">
          Thank You!
        </h1>
        <div className="w-16 h-1 bg-[#c9a84c] mx-auto mb-6" />

        <p className="text-[#7a7a7a] text-lg leading-relaxed mb-4">
          We&apos;ve received your inquiry and our team will get back to you
          within 24 hours.
        </p>
        <p className="text-[#7a7a7a] text-sm mb-10">
          In the meantime, feel free to explore our projects or reach out to us
          directly.
        </p>

        {/* Contact options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10 text-left">
          <div className="bg-lux-ivory p-5 rounded-sm shadow-sm flex gap-4">
            <div className="w-11 h-11 bg-theme-bg rounded-sm flex items-center justify-center flex-shrink-0">
              <Phone className="w-5 h-5 text-[#c9a84c]" />
            </div>
            <div>
              <p className="text-[#1a1a2e] font-semibold text-sm mb-1">
                Call Us
              </p>
              <a
                href={contactPhoneHref}
                className="text-[#7a7a7a] text-sm hover:text-[#c9a84c] transition-colors"
              >
                {contactPhone}
              </a>
            </div>
          </div>
          <div className="bg-lux-ivory p-5 rounded-sm shadow-sm flex gap-4">
            <div className="w-11 h-11 bg-theme-bg rounded-sm flex items-center justify-center flex-shrink-0">
              <Mail className="w-5 h-5 text-[#c9a84c]" />
            </div>
            <div>
              <p className="text-[#1a1a2e] font-semibold text-sm mb-1">
                Email Us
              </p>
              <a
                href="mailto:info@karyaninfratech.co.in"
                className="text-[#7a7a7a] text-sm hover:text-[#c9a84c] transition-colors"
              >
                info@karyaninfratech.co.in
              </a>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-theme-bg text-white px-8 py-3.5 font-semibold uppercase tracking-wider text-sm hover:bg-[#c9a84c] transition-colors rounded-sm"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
          <Link
            href="/projects"
            className="inline-flex items-center justify-center gap-2 rounded-sm border-2 border-theme-bg px-8 py-3.5 text-sm font-semibold uppercase tracking-wider text-theme-fg transition-colors hover:bg-theme-bg hover:text-theme-on-bg"
          >
            View Our Projects
          </Link>
        </div>
      </div>
    </div>
  );
}
