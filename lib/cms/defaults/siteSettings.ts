import type { SiteSettingsBundle } from "../types";

/** Local logo from public/images — guaranteed to load in every environment. */
export const DEFAULT_HEADER_LOGO_SRC = "/images/logo.png";

export const DEFAULT_SITE_SETTINGS: SiteSettingsBundle = {
  nav: {
    headerLogoSrc: DEFAULT_HEADER_LOGO_SRC,
    headerLogoAlt: "Karyan Infratech",
    topBar: {
      phone: "+91 920 600 1002",
      phoneHref: "tel:+919206001002",
      whatsapp: "+91 920 600 1002",
      whatsappHref: "https://wa.me/919206001002",
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
      { label: "Privacy Policy", href: "/privacy-policy" },
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
  projectInterestOptions: [
    { value: "", label: "Select a project" },
    { value: "trevana", label: "Karyan Trevana" },
    { value: "citywalk", label: "Karyan CityWalk" },
    { value: "avenue-iv", label: "Karyan Avenue IV" },
    { value: "square", label: "Karyan Square" },
    { value: "other", label: "Other / General" },
  ],
  themeColors: {
    luxNavy: "#17314a",
    luxNavyMid: "#2b4a69",
    luxNavySoft: "#446489",
    luxGold: "#e8891d",
    luxGoldBright: "#ffb347",
    luxGoldDim: "#cc5a00",
    luxCream: "#fff0db",
    luxIvory: "#fffaf2",
    luxCharcoal: "#1a130d",
    themeBgDeep: "#1a324b",
    themeBg: "#2b4666",
    themeBgSoft: "#4c5f7e",
    themeBgMuted: "#8a6341",
    themeBgElevated: "#b46e31",
    themeFg: "#4a2208",
    themeFgSoft: "#7f3408",
    themeFgMuted: "#b94a08",
    themeFgSubtle: "#e66f0e",
    themeOnBg: "#fffdf8",
    themeOnBgMuted: "#ffe4c4",
    themeOnBgSubtle: "#ffc875",
  },
  pageHeader: {
    bgImage: "",
    heading: "Karyan Infratech",
    subheading: "Luxury residences and commercial destinations crafted for Delhi NCR.",
  },
  projectDetailAds: {
    images: [],
    bookNowLabel: "Book Now",
  },
  enquiryFloatPromo: {
    enabled: false,
    imageSrc: "",
    imageAlt: "Enquire about our projects",
  },
  cookieConsent: {
    enabled: true,
    heading: "Disclaimer & cookies",
    description:
      "This website is for information only. By continuing, you agree to our use of cookies for basic site functionality and analytics. Project details are subject to change and final agreements.",
    acceptLabel: "Accept",
    closeLabel: "Close",
  },
};
