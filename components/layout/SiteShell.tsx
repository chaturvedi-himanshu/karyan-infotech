import { getSiteSettings } from "@/lib/cms/getters";
import { EnquiryProvider } from "@/components/enquiry/EnquiryProvider";
import CallNowFab from "@/components/layout/CallNowFab";
import NavbarClient from "@/components/layout/NavbarClient";
import FooterClient from "@/components/layout/FooterClient";

export default async function SiteShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();
  return (
    <EnquiryProvider
      brandLogoSrc={settings.nav.headerLogoSrc}
      brandLogoAlt={settings.nav.headerLogoAlt}
    >
      <NavbarClient nav={settings.nav} />
      {children}
      <FooterClient
        footer={settings.footer}
        logoSrc={settings.nav.headerLogoSrc}
        logoAlt={settings.nav.headerLogoAlt}
      />
      <CallNowFab href={settings.nav.topBar.phoneHref} />
    </EnquiryProvider>
  );
}
