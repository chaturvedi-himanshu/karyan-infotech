import { getSiteSettings } from "@/lib/cms/getters";
import { EnquiryProvider } from "@/components/enquiry/EnquiryProvider";
import AosProvider from "@/components/layout/AosProvider";
import CallNowFab from "@/components/layout/CallNowFab";
import WhatsAppFab from "@/components/layout/WhatsAppFab";
import EnquiryFloatPromo from "@/components/layout/EnquiryFloatPromo";
import NavbarClient from "@/components/layout/NavbarClient";
import FooterClient from "@/components/layout/FooterClient";
import type { SiteThemeColors } from "@/lib/cms/types";

function themeCssVars(theme: SiteThemeColors): Record<string, string> {
  return {
    "--color-lux-navy": theme.luxNavy,
    "--color-lux-navy-mid": theme.luxNavyMid,
    "--color-lux-navy-soft": theme.luxNavySoft,
    "--color-lux-gold": theme.luxGold,
    "--color-lux-gold-bright": theme.luxGoldBright,
    "--color-lux-gold-dim": theme.luxGoldDim,
    "--color-lux-cream": theme.luxCream,
    "--color-lux-ivory": theme.luxIvory,
    "--color-lux-charcoal": theme.luxCharcoal,
    "--color-theme-bg-deep": theme.themeBgDeep,
    "--color-theme-bg": theme.themeBg,
    "--color-theme-bg-soft": theme.themeBgSoft,
    "--color-theme-bg-muted": theme.themeBgMuted,
    "--color-theme-bg-elevated": theme.themeBgElevated,
    "--color-theme-fg": theme.themeFg,
    "--color-theme-fg-soft": theme.themeFgSoft,
    "--color-theme-fg-muted": theme.themeFgMuted,
    "--color-theme-fg-subtle": theme.themeFgSubtle,
    "--color-theme-on-bg": theme.themeOnBg,
    "--color-theme-on-bg-muted": theme.themeOnBgMuted,
    "--color-theme-on-bg-subtle": theme.themeOnBgSubtle,
  };
}

export default async function SiteShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();
  const footer = {
    ...settings.footer,
    contactPhone: settings.nav.topBar.phone || settings.footer.contactPhone,
    contactPhoneHref: settings.nav.topBar.phoneHref || settings.footer.contactPhoneHref,
  };
  return (
    <AosProvider>
      <EnquiryProvider
        brandLogoSrc={settings.nav.headerLogoSrc}
        brandLogoAlt={settings.nav.headerLogoAlt}
        projectOptions={settings.projectInterestOptions}
      >
        {/* Use a real wrapper element so CSS vars cascade to all site UI */}
        <div className="overflow-x-clip" style={themeCssVars(settings.themeColors)}>
          <NavbarClient nav={settings.nav} />
          {children}
          <FooterClient
            footer={footer}
            logoSrc={settings.nav.headerLogoSrc}
            logoAlt={settings.nav.headerLogoAlt}
          />
          <WhatsAppFab
            href={settings.nav.topBar.whatsappHref}
            phone={settings.nav.topBar.whatsapp || settings.nav.topBar.phone}
          />
          {/* <CallNowFab href={settings.nav.topBar.phoneHref} /> */}
          <EnquiryFloatPromo promo={settings.enquiryFloatPromo} />
        </div>
      </EnquiryProvider>
    </AosProvider>
  );
}
