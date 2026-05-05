export type NavLink = { label: string; href: string };
export type NavProject = { name: string; href: string; tag: string };

export type SiteNavPayload = {
  /** Header brand image (HTTPS URL). Falls back to the main site logo if unset. */
  headerLogoSrc?: string;
  headerLogoAlt?: string;
  topBar: {
    phone: string;
    phoneHref: string;
    regionLabel?: string;
    enquireLabel?: string;
  };
  mainLinks: NavLink[];
  residentialProjects: NavProject[];
  commercialProjects: NavProject[];
};

export type SiteFooterPayload = {
  tagline: string;
  explore: NavLink[];
  residential: NavLink[];
  commercial: NavLink[];
  contactPhone: string;
  contactPhoneHref: string;
  social: { label: string; href: string }[];
  legalLine: string;
  disclaimerExtra?: string;
};

export type SiteProjectInterestOption = {
  value: string;
  label: string;
};

/** Bottom-left floating image; click opens the global enquiry modal (see EnquiryFloatPromo). */
export type SiteEnquiryFloatPromo = {
  enabled: boolean;
  /** Full image URL (HTTPS). Empty hides the promo even if enabled. */
  imageSrc: string;
  imageAlt: string;
};

export type SiteThemeColors = {
  luxNavy: string;
  luxNavyMid: string;
  luxNavySoft: string;
  luxGold: string;
  luxGoldBright: string;
  luxGoldDim: string;
  luxCream: string;
  luxIvory: string;
  luxCharcoal: string;
  themeBgDeep: string;
  themeBg: string;
  themeBgSoft: string;
  themeBgMuted: string;
  themeBgElevated: string;
  themeFg: string;
  themeFgSoft: string;
  themeFgMuted: string;
  themeFgSubtle: string;
  themeOnBg: string;
  themeOnBgMuted: string;
  themeOnBgSubtle: string;
};

export type SitePageHeaderDefaults = {
  /** Optional shared background for all non-project page headers. */
  bgImage?: string;
  /** Fallback heading when a page does not provide one. */
  heading: string;
  /** Default subheading shown under each page heading. */
  subheading: string;
};

export type SiteSettingsBundle = {
  nav: SiteNavPayload;
  footer: SiteFooterPayload;
  projectInterestOptions: SiteProjectInterestOption[];
  themeColors: SiteThemeColors;
  pageHeader: SitePageHeaderDefaults;
  enquiryFloatPromo: SiteEnquiryFloatPromo;
};

export type HomeCapability = { title: string; text: string; icon: string };
export type HomePillar = { title: string; text: string; icon: string };
export type HomeHeroSlide = {
  bg: string;
  title: string;
  subtitle: string;
  tag: string;
  project: string;
  exploreHref: string;
};

/** Cities are chosen by id from `INDIA_PRESENCE_CITIES`; map markers use lat/lon from that registry. */
export type HomePresenceBand = {
  /** Small uppercase eyebrow above heading, e.g. "Our reach" */
  eyebrow: string;
  /** Large heading, e.g. "Our Presence" */
  heading: string;
  /** Subheading line below the heading */
  subheading: string;
  /** Preset city ids (see `lib/cms/indiaPresenceCities.ts`) */
  cityIds: string[];
};

export type HomePayload = {
  heroSlides: HomeHeroSlide[];
  heroSideStats: { label: string; value: string; hint: string }[];
  statCards: { value: string; label: string; sub: string }[];
  philosophy: { badge: string; title: string; body: string };
  capabilitiesIntro: { eyebrow: string; title: string };
  capabilities: HomeCapability[];
  portfolioIntro: { eyebrow: string; title: string };
  /** Single India map + city list (regions glow gold when a city in that region is selected) */
  presence: HomePresenceBand;
  /** Legacy home project tiles — no longer shown on the public home page; kept for older API payloads. */
  portfolio: { name: string; href: string; tag: string; blurb: string }[];
  whyIntro: { eyebrow: string; title: string };
  pillars: HomePillar[];
  promisesIntro: { eyebrow: string; title: string };
  promises: string[];
  processIntro: { eyebrow: string; title: string };
  process: { step: string; title: string; body: string }[];
  testimonialsIntro: { eyebrow: string; title: string; badge: string };
  testimonials: { quote: string; name: string; role: string }[];
  faqIntro: { eyebrow: string; title: string };
  faqs: { q: string; a: string }[];
  location: {
    eyebrow: string;
    title: string;
    body: string;
    bullets: { icon: string; text: string }[];
    corridorsTitle: string;
    corridors: { corridor: string; projects: string }[];
  };
  amenitiesIntro: { eyebrow: string; title: string };
  amenities: string[];
  journalIntro: { eyebrow: string; title: string; ctaLabel: string; ctaHref: string };
  journalTeasers: { title: string; href: string; hint: string }[];
  ecosystem: { eyebrow: string; body: string; tags: string[] };
  splitCta: {
    leftEyebrow: string;
    leftTitle: string;
    phone: string;
    phoneHref: string;
    hours: string;
    rightTitle: string;
    rightBody: string;
    rightCtaLabel: string;
  };
  finalCta: { title: string; body: string; primaryLabel: string; secondaryLabel: string; secondaryHref: string };
};

export type ProjectHighlight = {
  icon: string;
  title: string;
  value: string;
  description: string;
};

export type ProjectPayload = {
  metadata: { title: string; description: string };
  header: {
    title: string;
    breadcrumbs: { label: string; href?: string }[];
    bgImage: string;
  };
  investmentHighlights: ProjectHighlight[];
  mainTitle: string;
  introParagraphs: string[];
  benefitsTitle?: string;
  benefits?: string[];
  unitTypesTitle?: string;
  unitTypes?: { size: string; area: string; ideal: string }[];
  architectsTitle?: string;
  architects?: { name: string; role: string; description: string }[];
  gallery: { src: string; alt: string }[];
  leasingBox?: { title: string; intro: string; bullets: string[] };
  specs: { label: string; value: string }[];
  locationSidebar?: {
    title: string;
    body: string;
    badges?: { icon: string; text: string }[];
  };
  sidebarFormTitle: string;
  cta: {
    title: string;
    description: string;
    enquiryProject?: string;
    primaryLabel?: string;
    secondaryLabel?: string;
    secondaryHref?: string;
  };
};

export type BlogPostPayload = {
  slug: string;
  title: string;
  excerpt: string;
  /** Optional long-form body for the article page; falls back to excerpt if empty. */
  body?: string;
  date: string;
  category: string;
  href: string;
  image: string;
  order?: number;
};
