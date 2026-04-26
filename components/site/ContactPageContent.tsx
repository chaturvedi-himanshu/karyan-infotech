import ContactForm from "@/components/shared/ContactForm";
import { EnquiryTrigger } from "@/components/enquiry/EnquiryProvider";
import SiteBrandLogo from "@/components/layout/SiteBrandLogo";
import { getLucideIcon } from "@/lib/cms/icons";

export type ContactPayload = {
  heroTitle: string;
  contactHeading: string;
  formHeading: string;
  contactItems: { icon: string; label: string; value: string; href: string }[];
  mapIframeSrc: string;
  mapTitle: string;
};

export default function ContactPageContent({ payload }: { payload: ContactPayload }) {
  return (
    <section style={{ background: "#fff" }} className="py-16">
      <div className="mx-auto max-w-[1200px] px-4">
        <div className="mb-10 text-center">
          <div className="mb-6 flex justify-center">
            <SiteBrandLogo
              variant="onLight"
              asLink={false}
              className="h-11 w-auto max-w-[220px] sm:h-12"
            />
          </div>
          <h2 className="mb-2 text-2xl font-bold" style={{ color: "#292929" }}>
            {payload.heroTitle}
          </h2>
          <div className="mx-auto mt-3 h-0.5 w-10" style={{ background: "#F7B90F" }} />
          <EnquiryTrigger className="mx-auto mt-6 inline-flex items-center justify-center rounded-md bg-[#292929] px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white transition hover:opacity-90">
            Quick enquiry (popup)
          </EnquiryTrigger>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div>
            <h3 className="mb-6 text-lg font-bold" style={{ color: "#292929" }}>
              {payload.contactHeading}
            </h3>
            <div className="space-y-4">
              {payload.contactItems.map((info) => {
                const Icon = getLucideIcon(info.icon);
                return (
                  <div key={info.label} className="flex items-start gap-4">
                    <div
                      className="flex h-10 w-10 flex-shrink-0 items-center justify-center"
                      style={{ background: "#F7B90F" }}
                    >
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p
                        className="mb-0.5 text-xs font-bold uppercase tracking-wide"
                        style={{ color: "#292929" }}
                      >
                        {info.label}
                      </p>
                      <a href={info.href} className="text-sm" style={{ color: "#5e646a" }}>
                        {info.value}
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-8 overflow-hidden" style={{ height: "220px", border: "1px solid #eee" }}>
              <iframe
                src={payload.mapIframeSrc}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={payload.mapTitle}
              />
            </div>
          </div>
          <div>
            <h3 className="mb-6 text-lg font-bold" style={{ color: "#292929" }}>
              {payload.formHeading}
            </h3>
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
