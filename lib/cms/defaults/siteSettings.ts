import type { SiteSettingsBundle } from "../types";

/** Matches WordPress custom logo on karyaninfratech.co.in */
export const DEFAULT_HEADER_LOGO_SRC =
  "https://karyaninfratech.co.in/wp-content/uploads/2023/03/logo.png";

export const DEFAULT_SITE_SETTINGS: SiteSettingsBundle = {
  nav: {
    headerLogoSrc: DEFAULT_HEADER_LOGO_SRC,
    headerLogoAlt: "Karyan Infratech",
    topBar: {
      phone: "+91 920 600 1002",
      phoneHref: "tel:+919206001002",
      regionLabel: "Delhi NCR",
      enquireLabel: "Enquire",
    },
    mainLinks: [
      { label: "Home", href: "/" },
      { label: "About", href: "/about" },
      { label: "Blog", href: "/blog" },
      { label: "Contact", href: "/contact" },
    ],
    residentialProjects: [
      { name: "Karyan Trevana", href: "/karyan-trevana", tag: "NH-24 · Residences" },
    ],
    commercialProjects: [
      { name: "Karyan CityWalk", href: "/karyan-citywalk", tag: "Retail · Expressway" },
      { name: "Karyan Square", href: "/karyan-square", tag: "Retail & offices" },
      { name: "Karyan Avenue IV", href: "/karyan-avenue-iv", tag: "Wave City mall" },
    ],
  },
  footer: {
    tagline:
      "Premier residential and commercial developments across Delhi NCR — conceived with discipline, delivered with clarity.",
    explore: [
      { label: "Home", href: "/" },
      { label: "About", href: "/about" },
      { label: "Projects", href: "/projects" },
      { label: "Blog", href: "/blog" },
      { label: "Contact", href: "/contact" },
    ],
    residential: [{ label: "Karyan Trevana", href: "/karyan-trevana" }],
    commercial: [
      { label: "Karyan CityWalk", href: "/karyan-citywalk" },
      { label: "Karyan Square", href: "/karyan-square" },
      { label: "Avenue IV", href: "/karyan-avenue-iv" },
    ],
    contactPhone: "+91 920 600 1002",
    contactPhoneHref: "tel:+919206001002",
    social: [
      { label: "Facebook", href: "https://www.facebook.com/karyanNh24" },
      { label: "Instagram", href: "https://www.instagram.com/karyanstreetwalk" },
    ],
    legalLine: "© Karyan Infratech LLP. All rights reserved.",
    disclaimerExtra:
      "Images are for representation. This site is informational; terms are subject to final agreements and applicable law.",
  },
};
