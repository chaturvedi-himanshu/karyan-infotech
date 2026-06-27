"use client";

import { useCallback, useEffect, useState } from "react";
import { Cookie, Globe, ImageIcon, LayoutGrid, Menu } from "lucide-react";
import type { SiteSettingsBundle } from "@/lib/cms/types";
import { DEFAULT_SITE_SETTINGS } from "@/lib/cms/defaults/siteSettings";
import {
  CmsField,
  CmsGhostButton,
  CmsGroup,
  CmsImageUpload,
  CmsInput,
  CmsItemCard,
  CmsLoadingSkeleton,
  CmsPageIntro,
  CmsSaveBar,
  CmsSection,
  CmsTextarea,
  AdminToastViewport,
  deepMerge,
  showAdminErrorToast,
} from "./cms-ui";

export default function SiteSettingsPortalForm() {
  const [data, setData] = useState<SiteSettingsBundle | null>(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetch("/api/admin/site", { credentials: "include" })
      .then(async (r) => {
        if (!r.ok) throw new Error(`Could not load site settings (${r.status})`);
        return r.json();
      })
      .then((j) => {
        const nav = j.nav ?? {};
        const footer = j.footer ?? {};
        const projectInterestOptions = j.projectInterestOptions ?? [];
        const themeColors = j.themeColors ?? {};
        const pageHeader = j.pageHeader ?? {};
        const enquiryFloatPromo = j.enquiryFloatPromo ?? {};
        const cookieConsent = j.cookieConsent ?? {};
        const projectDetailAds = j.projectDetailAds ?? {};
        const merged = deepMerge(
          DEFAULT_SITE_SETTINGS as unknown as Record<string, unknown>,
          {
            nav,
            footer,
            projectInterestOptions,
            themeColors,
            pageHeader,
            projectDetailAds,
            enquiryFloatPromo,
            cookieConsent,
          } as Record<string, unknown>
        );
        setData(merged as SiteSettingsBundle);
      })
      .catch((e: unknown) => {
        const msg = e instanceof Error ? e.message : "Could not load site settings.";
        showAdminErrorToast(msg);
      });
  }, []);

  const patch = useCallback((fn: (d: SiteSettingsBundle) => SiteSettingsBundle) => {
    setData((prev) => (prev ? fn(structuredClone(prev)) : prev));
  }, []);

  async function save() {
    if (!data) return;
    setStatus("Saving…");
    const res = await fetch("/api/admin/site", {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) showAdminErrorToast("Site settings save failed. Please try again.");
    setStatus(res.ok ? "Saved successfully." : "Could not save. Try again.");
  }

  if (!data) return <CmsLoadingSkeleton label="Loading site settings…" />;

  return (
    <div className="space-y-10">
      <AdminToastViewport />
      <CmsPageIntro
        title="Global site settings"
        where="Top navigation bar and footer appear on every public page"
      >
        Use this area for phone numbers, menu labels, footer columns, and legal lines. These
        elements are visible consistently as visitors move around the site.
      </CmsPageIntro>

      {/* ── GROUP 1: Header ─────────────────────────────────────────── */}
      <CmsGroup
        icon={<Globe className="h-4 w-4" />}
        title="Header"
        description="Top announcement bar, logo, and primary navigation links"
      >
        <CmsSection
          title="Top announcement bar"
          description="Phone number, region text, and the enquiry button label."
          where="Thin strip at the very top of every page, above the logo"
          defaultOpen
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <CmsField label="Phone number (visible text)">
              <CmsInput
                value={data.nav.topBar.phone}
                onChange={(e) =>
                  patch((d) => ({
                    ...d,
                    nav: {
                      ...d.nav,
                      topBar: { ...d.nav.topBar, phone: e.target.value },
                    },
                  }))
                }
              />
            </CmsField>
            <CmsField
              label="Phone tap link"
              hint="Paste tel:+… so mobile visitors can call in one tap."
            >
              <CmsInput
                value={data.nav.topBar.phoneHref}
                onChange={(e) =>
                  patch((d) => ({
                    ...d,
                    nav: {
                      ...d.nav,
                      topBar: { ...d.nav.topBar, phoneHref: e.target.value },
                    },
                  }))
                }
              />
            </CmsField>
            <CmsField label="WhatsApp number (visible text)">
              <CmsInput
                value={data.nav.topBar.whatsapp ?? ""}
                onChange={(e) =>
                  patch((d) => ({
                    ...d,
                    nav: {
                      ...d.nav,
                      topBar: { ...d.nav.topBar, whatsapp: e.target.value },
                    },
                  }))
                }
              />
            </CmsField>
            <CmsField
              label="WhatsApp link"
              hint="Use https://wa.me/9192... format. Floating icon opens this link."
            >
              <CmsInput
                value={data.nav.topBar.whatsappHref ?? ""}
                onChange={(e) =>
                  patch((d) => ({
                    ...d,
                    nav: {
                      ...d.nav,
                      topBar: { ...d.nav.topBar, whatsappHref: e.target.value },
                    },
                  }))
                }
              />
            </CmsField>
            <CmsField label="Region label" hint="e.g. Delhi NCR">
              <CmsInput
                value={data.nav.topBar.regionLabel ?? ""}
                onChange={(e) =>
                  patch((d) => ({
                    ...d,
                    nav: {
                      ...d.nav,
                      topBar: { ...d.nav.topBar, regionLabel: e.target.value },
                    },
                  }))
                }
              />
            </CmsField>
            <CmsField label="Enquiry button label">
              <CmsInput
                value={data.nav.topBar.enquireLabel ?? ""}
                onChange={(e) =>
                  patch((d) => ({
                    ...d,
                    nav: {
                      ...d.nav,
                      topBar: { ...d.nav.topBar, enquireLabel: e.target.value },
                    },
                  }))
                }
              />
            </CmsField>
          </div>
        </CmsSection>

        <CmsSection
          title="Header logo"
          description="Image shown in the main header, replacing the text wordmark."
          where="Header — left of the menu on desktop and mobile"
          defaultOpen
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <CmsField
              label="Logo image"
              hint="Upload a PNG/SVG or paste its URL. Shown in the top navigation bar."
            >
              <CmsImageUpload
                value={data.nav.headerLogoSrc ?? ""}
                onChange={(url) =>
                  patch((d) => ({ ...d, nav: { ...d.nav, headerLogoSrc: url } }))
                }
                folder="site/logo"
                accept="image/png,image/svg+xml,image/webp"
              />
            </CmsField>
            <CmsField label="Logo alt text" hint="Short description for accessibility and SEO.">
              <CmsInput
                value={data.nav.headerLogoAlt ?? ""}
                onChange={(e) =>
                  patch((d) => ({ ...d, nav: { ...d.nav, headerLogoAlt: e.target.value } }))
                }
              />
            </CmsField>
          </div>
        </CmsSection>


        <CmsSection
          title="Page header defaults"
          description="Shared banner settings for about, blog, projects and contact headers."
          where="Public pages — top hero/header strip"
          defaultOpen
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <CmsField
              label="Background image"
              hint="Optional shared image. If empty, the premium dark gradient is used."
            >
              <CmsImageUpload
                value={data.pageHeader.bgImage ?? ""}
                onChange={(url) =>
                  patch((d) => ({ ...d, pageHeader: { ...d.pageHeader, bgImage: url } }))
                }
                folder="site/page-header"
                accept="image/png,image/jpeg,image/webp"
              />
            </CmsField>
            <CmsField
              label="Default heading"
              hint="Fallback title if a page does not pass a heading explicitly."
            >
              <CmsInput
                value={data.pageHeader.heading}
                onChange={(e) =>
                  patch((d) => ({
                    ...d,
                    pageHeader: { ...d.pageHeader, heading: e.target.value },
                  }))
                }
              />
            </CmsField>
          </div>
          <div className="mt-4">
            <CmsField
              label="Default subheading"
              hint="Shown under the page heading across section headers."
            >
              <CmsTextarea
                rows={3}
                value={data.pageHeader.subheading}
                onChange={(e) =>
                  patch((d) => ({
                    ...d,
                    pageHeader: { ...d.pageHeader, subheading: e.target.value },
                  }))
                }
              />
            </CmsField>
          </div>
        </CmsSection>

        <CmsSection
          title="Main menu links"
          description="The primary pages in the horizontal navigation."
          where="Header — main menu beside the logo on desktop; mobile menu on phones"
          defaultOpen
        >
          <div className="space-y-4">
            {data.nav.mainLinks.map((link, i) => (
              <CmsItemCard
                key={i}
                title={`Link ${i + 1}`}
                onRemove={
                  data.nav.mainLinks.length > 1
                    ? () =>
                        patch((d) => ({
                          ...d,
                          nav: {
                            ...d.nav,
                            mainLinks: d.nav.mainLinks.filter((_, j) => j !== i),
                          },
                        }))
                    : undefined
                }
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  <CmsField label="Label">
                    <CmsInput
                      value={link.label}
                      onChange={(e) =>
                        patch((d) => {
                          const mainLinks = [...d.nav.mainLinks];
                          mainLinks[i] = { ...mainLinks[i], label: e.target.value };
                          return { ...d, nav: { ...d.nav, mainLinks } };
                        })
                      }
                    />
                  </CmsField>
                  <CmsField label="Page address" hint="Starts with / — e.g. /about">
                    <CmsInput
                      value={link.href}
                      onChange={(e) =>
                        patch((d) => {
                          const mainLinks = [...d.nav.mainLinks];
                          mainLinks[i] = { ...mainLinks[i], href: e.target.value };
                          return { ...d, nav: { ...d.nav, mainLinks } };
                        })
                      }
                    />
                  </CmsField>
                </div>
              </CmsItemCard>
            ))}
            <CmsGhostButton
              onClick={() =>
                patch((d) => ({
                  ...d,
                  nav: {
                    ...d.nav,
                    mainLinks: [...d.nav.mainLinks, { label: "New page", href: "/" }],
                  },
                }))
              }
            >
              + Add menu link
            </CmsGhostButton>
          </div>
        </CmsSection>
      </CmsGroup>

      <CmsGroup
        icon={<ImageIcon className="h-4 w-4" />}
        title="Floating enquiry image"
        description="Portrait strip fixed to the bottom-left; click opens the enquiry popup (same as the header button)."
      >
        <CmsSection
          title="Bottom-left promo"
          description="Fixed 160×260px frame; image uses “cover”. The X minimizes to an animated round thumbnail bottom-left; click it to expand again."
          where="Public pages — large card and minimized chip both bottom-left (not in admin)"
          defaultOpen
        >
          <div className="flex flex-wrap items-center gap-3 rounded-lg border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm text-slate-600">
            <label className="flex cursor-pointer items-center gap-2 font-medium text-slate-800">
              <input
                type="checkbox"
                checked={data.enquiryFloatPromo.enabled}
                onChange={(e) =>
                  patch((d) => ({
                    ...d,
                    enquiryFloatPromo: { ...d.enquiryFloatPromo, enabled: e.target.checked },
                  }))
                }
                className="h-4 w-4 rounded border-slate-300"
              />
              Show on public site
            </label>
            <span className="text-xs text-slate-500">
              Frame: <span className="font-mono">160 × 260 px</span>
            </span>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <CmsField
              label="Promo image"
              hint="Upload or paste URL. Design for a tall portrait safe area — edges may crop slightly."
            >
              <CmsImageUpload
                value={data.enquiryFloatPromo.imageSrc}
                onChange={(url) =>
                  patch((d) => ({
                    ...d,
                    enquiryFloatPromo: { ...d.enquiryFloatPromo, imageSrc: url },
                  }))
                }
                folder="site/floating-enquiry"
                accept="image/png,image/jpeg,image/webp"
              />
            </CmsField>
            <CmsField label="Alt text" hint="Short description for screen readers (e.g. “3 & 4 BHK — enquire now”).">
              <CmsInput
                value={data.enquiryFloatPromo.imageAlt}
                onChange={(e) =>
                  patch((d) => ({
                    ...d,
                    enquiryFloatPromo: { ...d.enquiryFloatPromo, imageAlt: e.target.value },
                  }))
                }
              />
            </CmsField>
          </div>
        </CmsSection>
      </CmsGroup>

      <CmsGroup
        icon={<LayoutGrid className="h-4 w-4" />}
        title="Project detail ads"
        description="Shared image carousel on every project page — right column, above the enquiry form"
      >
        <CmsSection
          title="Sidebar ads carousel"
          description="Same carousel on all project detail pages. Upload images at 386 × 550 px. Book Now opens the enquiry popup for that project."
          where="Right column on /karyan-trevana, /karyan-citywalk, and every other project page — directly above the contact form"
          defaultOpen
        >
          <CmsField label="Book now button label">
            <CmsInput
              value={data.projectDetailAds.bookNowLabel ?? "Book Now"}
              onChange={(e) =>
                patch((d) => ({
                  ...d,
                  projectDetailAds: {
                    ...d.projectDetailAds,
                    bookNowLabel: e.target.value,
                  },
                }))
              }
            />
          </CmsField>
          <div className="space-y-4">
            {(data.projectDetailAds.images ?? []).map((slide, i) => (
              <CmsItemCard
                key={i}
                title={`Slide ${i + 1}`}
                onRemove={() =>
                  patch((d) => ({
                    ...d,
                    projectDetailAds: {
                      ...d.projectDetailAds,
                      images: d.projectDetailAds.images.filter((_, j) => j !== i),
                    },
                  }))
                }
              >
                <CmsField
                  label="Image"
                  hint="Recommended size: 386 × 550 px (portrait)."
                >
                  <CmsImageUpload
                    value={slide.src}
                    onChange={(url) =>
                      patch((d) => {
                        const images = [...d.projectDetailAds.images];
                        images[i] = { ...images[i], src: url };
                        return {
                          ...d,
                          projectDetailAds: { ...d.projectDetailAds, images },
                        };
                      })
                    }
                    folder="site/project-detail-ads"
                  />
                </CmsField>
                <CmsField label="Alt text">
                  <CmsInput
                    value={slide.alt}
                    onChange={(e) =>
                      patch((d) => {
                        const images = [...d.projectDetailAds.images];
                        images[i] = { ...images[i], alt: e.target.value };
                        return {
                          ...d,
                          projectDetailAds: { ...d.projectDetailAds, images },
                        };
                      })
                    }
                  />
                </CmsField>
              </CmsItemCard>
            ))}
            <CmsGhostButton
              onClick={() =>
                patch((d) => ({
                  ...d,
                  projectDetailAds: {
                    ...d.projectDetailAds,
                    images: [...d.projectDetailAds.images, { src: "", alt: "" }],
                  },
                }))
              }
            >
              + Add ad image
            </CmsGhostButton>
          </div>
        </CmsSection>
      </CmsGroup>

      <CmsGroup
        icon={<Cookie className="h-4 w-4" />}
        title="Disclaimer & cookie notice"
        description="Bottom-left banner with accept or close; choice is remembered for 7 days."
      >
        <CmsSection
          title="Cookie / disclaimer banner"
          description="Shown on public pages until the visitor accepts or closes. Max width 400px, bottom-left."
          where="Public site — fixed bottom-left card (not shown in admin)"
          defaultOpen
        >
          <div className="flex flex-wrap items-center gap-3 rounded-lg border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm text-slate-600">
            <label className="flex cursor-pointer items-center gap-2 font-medium text-slate-800">
              <input
                type="checkbox"
                checked={data.cookieConsent.enabled}
                onChange={(e) =>
                  patch((d) => ({
                    ...d,
                    cookieConsent: { ...d.cookieConsent, enabled: e.target.checked },
                  }))
                }
                className="h-4 w-4 rounded border-slate-300"
              />
              Show on public site
            </label>
            <span className="text-xs text-slate-500">Consent stored in browser for 7 days</span>
          </div>
          <CmsField label="Heading">
            <CmsInput
              value={data.cookieConsent.heading}
              onChange={(e) =>
                patch((d) => ({
                  ...d,
                  cookieConsent: { ...d.cookieConsent, heading: e.target.value },
                }))
              }
            />
          </CmsField>
          <CmsField label="Description">
            <CmsTextarea
              value={data.cookieConsent.description}
              onChange={(e) =>
                patch((d) => ({
                  ...d,
                  cookieConsent: { ...d.cookieConsent, description: e.target.value },
                }))
              }
            />
          </CmsField>
          <div className="grid gap-4 sm:grid-cols-2">
            <CmsField label="Accept button label">
              <CmsInput
                value={data.cookieConsent.acceptLabel ?? ""}
                onChange={(e) =>
                  patch((d) => ({
                    ...d,
                    cookieConsent: { ...d.cookieConsent, acceptLabel: e.target.value },
                  }))
                }
                placeholder="Accept"
              />
            </CmsField>
            <CmsField label="Close button label">
              <CmsInput
                value={data.cookieConsent.closeLabel ?? ""}
                onChange={(e) =>
                  patch((d) => ({
                    ...d,
                    cookieConsent: { ...d.cookieConsent, closeLabel: e.target.value },
                  }))
                }
                placeholder="Close"
              />
            </CmsField>
          </div>
        </CmsSection>
      </CmsGroup>

      <CmsGroup
        icon={<Menu className="h-4 w-4" />}
        title="Lead forms"
        description="Options for Project of Interest used in all enquiry forms"
      >
        <CmsSection
          title="Project interest options"
          description="Shown in contact page form, popup enquiry modal, and other shared forms."
          where="All enquiry forms — Project of Interest dropdown"
          defaultOpen
        >
          <div className="space-y-4">
            {data.projectInterestOptions.map((item, i) => (
              <CmsItemCard
                key={i}
                title={`Option ${i + 1}`}
                onRemove={() =>
                  patch((d) => ({
                    ...d,
                    projectInterestOptions: d.projectInterestOptions.filter((_, j) => j !== i),
                  }))
                }
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  <CmsField label="Label (visitor sees this)">
                    <CmsInput
                      value={item.label}
                      onChange={(e) =>
                        patch((d) => {
                          const projectInterestOptions = [...d.projectInterestOptions];
                          projectInterestOptions[i] = {
                            ...projectInterestOptions[i],
                            label: e.target.value,
                          };
                          return { ...d, projectInterestOptions };
                        })
                      }
                    />
                  </CmsField>
                  <CmsField
                    label="Value (saved in leads)"
                    hint="Short slug like citywalk, trevana, or other."
                  >
                    <CmsInput
                      value={item.value}
                      onChange={(e) =>
                        patch((d) => {
                          const projectInterestOptions = [...d.projectInterestOptions];
                          projectInterestOptions[i] = {
                            ...projectInterestOptions[i],
                            value: e.target.value,
                          };
                          return { ...d, projectInterestOptions };
                        })
                      }
                    />
                  </CmsField>
                </div>
              </CmsItemCard>
            ))}
            <CmsGhostButton
              onClick={() =>
                patch((d) => ({
                  ...d,
                  projectInterestOptions: [
                    ...d.projectInterestOptions,
                    { label: "", value: "" },
                  ],
                }))
              }
            >
              + Add project option
            </CmsGhostButton>
          </div>
        </CmsSection>
      </CmsGroup>


      <CmsGroup
        icon={<LayoutGrid className="h-4 w-4" />}
        title="Theme colors"
        description="Control the global color palette used across the public website"
      >
        <CmsSection
          title="Brand palette"
          description="Pick colors and save to apply them live."
          where="All public pages — background, text, accents and luxury highlights"
          defaultOpen
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ["luxNavy", "Luxury Navy"],
              ["luxNavyMid", "Luxury Navy Mid"],
              ["luxNavySoft", "Luxury Navy Soft"],
              ["luxGold", "Luxury Gold"],
              ["luxGoldBright", "Luxury Gold Bright"],
              ["luxGoldDim", "Luxury Gold Dim"],
              ["luxCream", "Luxury Cream"],
              ["luxIvory", "Luxury Ivory"],
              ["luxCharcoal", "Luxury Charcoal"],
              ["themeBgDeep", "Theme BG Deep"],
              ["themeBg", "Theme BG"],
              ["themeBgSoft", "Theme BG Soft"],
              ["themeBgMuted", "Theme BG Muted"],
              ["themeBgElevated", "Theme BG Elevated"],
              ["themeFg", "Theme FG"],
              ["themeFgSoft", "Theme FG Soft"],
              ["themeFgMuted", "Theme FG Muted"],
              ["themeFgSubtle", "Theme FG Subtle"],
              ["themeOnBg", "Text on BG"],
              ["themeOnBgMuted", "Text on BG Muted"],
              ["themeOnBgSubtle", "Text on BG Subtle"],
            ].map(([key, label]) => (
              <CmsField key={String(key)} label={String(label)}>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={String((data.themeColors as Record<string, string>)[String(key)] ?? "#000000")}
                    onChange={(e) =>
                      patch((d) => ({
                        ...d,
                        themeColors: {
                          ...d.themeColors,
                          [String(key)]: e.target.value,
                        },
                      }))
                    }
                    className="h-10 w-14 cursor-pointer rounded border border-slate-300 bg-white"
                  />
                  <CmsInput
                    value={String((data.themeColors as Record<string, string>)[String(key)] ?? "")}
                    onChange={(e) =>
                      patch((d) => ({
                        ...d,
                        themeColors: {
                          ...d.themeColors,
                          [String(key)]: e.target.value,
                        },
                      }))
                    }
                    placeholder="#ffffff"
                  />
                </div>
              </CmsField>
            ))}
          </div>
        </CmsSection>
      </CmsGroup>

      {/* ── GROUP 2: Navigation menus ───────────────────────────────── */}
      <CmsGroup
        icon={<Menu className="h-4 w-4" />}
        title="Dropdown menus"
        description="Residential and commercial project fly-out menus in the header"
      >
        <CmsSection
          title="Residential projects menu"
          description="Dropdown entries for homes / apartments."
          where='Header — "Residential" fly-out in the navigation'
          defaultOpen={false}
        >
          <div className="space-y-4">
            {data.nav.residentialProjects.map((p, i) => (
              <CmsItemCard
                key={i}
                title={`Project ${i + 1}`}
                onRemove={() =>
                  patch((d) => ({
                    ...d,
                    nav: {
                      ...d.nav,
                      residentialProjects: d.nav.residentialProjects.filter((_, j) => j !== i),
                    },
                  }))
                }
              >
                <div className="grid gap-3 sm:grid-cols-3">
                  <CmsField label="Name">
                    <CmsInput
                      value={p.name}
                      onChange={(e) =>
                        patch((d) => {
                          const residentialProjects = [...d.nav.residentialProjects];
                          residentialProjects[i] = {
                            ...residentialProjects[i],
                            name: e.target.value,
                          };
                          return { ...d, nav: { ...d.nav, residentialProjects } };
                        })
                      }
                    />
                  </CmsField>
                  <CmsField label="Link">
                    <CmsInput
                      value={p.href}
                      onChange={(e) =>
                        patch((d) => {
                          const residentialProjects = [...d.nav.residentialProjects];
                          residentialProjects[i] = {
                            ...residentialProjects[i],
                            href: e.target.value,
                          };
                          return { ...d, nav: { ...d.nav, residentialProjects } };
                        })
                      }
                    />
                  </CmsField>
                  <CmsField label="Tag line" hint="Short subtitle under the name.">
                    <CmsInput
                      value={p.tag}
                      onChange={(e) =>
                        patch((d) => {
                          const residentialProjects = [...d.nav.residentialProjects];
                          residentialProjects[i] = {
                            ...residentialProjects[i],
                            tag: e.target.value,
                          };
                          return { ...d, nav: { ...d.nav, residentialProjects } };
                        })
                      }
                    />
                  </CmsField>
                </div>
              </CmsItemCard>
            ))}
            <CmsGhostButton
              onClick={() =>
                patch((d) => ({
                  ...d,
                  nav: {
                    ...d.nav,
                    residentialProjects: [
                      ...d.nav.residentialProjects,
                      { name: "", href: "/", tag: "" },
                    ],
                  },
                }))
              }
            >
              + Add residential item
            </CmsGhostButton>
          </div>
        </CmsSection>

        <CmsSection
          title="Commercial projects menu"
          description="Dropdown entries for retail, offices, and malls."
          where='Header — "Commercial" fly-out in the navigation'
          defaultOpen={false}
        >
          <div className="space-y-4">
            {data.nav.commercialProjects.map((p, i) => (
              <CmsItemCard
                key={i}
                title={`Project ${i + 1}`}
                onRemove={() =>
                  patch((d) => ({
                    ...d,
                    nav: {
                      ...d.nav,
                      commercialProjects: d.nav.commercialProjects.filter((_, j) => j !== i),
                    },
                  }))
                }
              >
                <div className="grid gap-3 sm:grid-cols-3">
                  <CmsField label="Name">
                    <CmsInput
                      value={p.name}
                      onChange={(e) =>
                        patch((d) => {
                          const commercialProjects = [...d.nav.commercialProjects];
                          commercialProjects[i] = {
                            ...commercialProjects[i],
                            name: e.target.value,
                          };
                          return { ...d, nav: { ...d.nav, commercialProjects } };
                        })
                      }
                    />
                  </CmsField>
                  <CmsField label="Link">
                    <CmsInput
                      value={p.href}
                      onChange={(e) =>
                        patch((d) => {
                          const commercialProjects = [...d.nav.commercialProjects];
                          commercialProjects[i] = {
                            ...commercialProjects[i],
                            href: e.target.value,
                          };
                          return { ...d, nav: { ...d.nav, commercialProjects } };
                        })
                      }
                    />
                  </CmsField>
                  <CmsField label="Tag line">
                    <CmsInput
                      value={p.tag}
                      onChange={(e) =>
                        patch((d) => {
                          const commercialProjects = [...d.nav.commercialProjects];
                          commercialProjects[i] = {
                            ...commercialProjects[i],
                            tag: e.target.value,
                          };
                          return { ...d, nav: { ...d.nav, commercialProjects } };
                        })
                      }
                    />
                  </CmsField>
                </div>
              </CmsItemCard>
            ))}
            <CmsGhostButton
              onClick={() =>
                patch((d) => ({
                  ...d,
                  nav: {
                    ...d.nav,
                    commercialProjects: [
                      ...d.nav.commercialProjects,
                      { name: "", href: "/", tag: "" },
                    ],
                  },
                }))
              }
            >
              + Add commercial item
            </CmsGhostButton>
          </div>
        </CmsSection>
      </CmsGroup>

      {/* ── GROUP 3: Footer ─────────────────────────────────────────── */}
      <CmsGroup
        icon={<LayoutGrid className="h-4 w-4" />}
        title="Footer"
        description="Tagline, contact details, link columns, social profiles, and legal copy"
      >
        <CmsSection
          title="Footer story & contact"
          description="Tagline, phone number, copyright, and disclaimer."
          where="Footer on every page — first column and legal row"
          defaultOpen={false}
        >
          <CmsField label="Tagline" hint="One or two sentences about the company.">
            <CmsTextarea
              value={data.footer.tagline}
              onChange={(e) =>
                patch((d) => ({ ...d, footer: { ...d.footer, tagline: e.target.value } }))
              }
            />
          </CmsField>
          <div className="grid gap-4 sm:grid-cols-2">
            <CmsField label="Footer phone (display)">
              <CmsInput
                value={data.footer.contactPhone}
                onChange={(e) =>
                  patch((d) => ({
                    ...d,
                    footer: { ...d.footer, contactPhone: e.target.value },
                  }))
                }
              />
            </CmsField>
            <CmsField label="Footer phone link" hint="tel:+…">
              <CmsInput
                value={data.footer.contactPhoneHref}
                onChange={(e) =>
                  patch((d) => ({
                    ...d,
                    footer: { ...d.footer, contactPhoneHref: e.target.value },
                  }))
                }
              />
            </CmsField>
          </div>
          <CmsField label="Copyright / legal line">
            <CmsInput
              value={data.footer.legalLine}
              onChange={(e) =>
                patch((d) => ({ ...d, footer: { ...d.footer, legalLine: e.target.value } }))
              }
            />
          </CmsField>
          <CmsField label="Extra disclaimer" hint="Smaller legal text shown when space allows.">
            <CmsTextarea
              value={data.footer.disclaimerExtra ?? ""}
              onChange={(e) =>
                patch((d) => ({
                  ...d,
                  footer: { ...d.footer, disclaimerExtra: e.target.value },
                }))
              }
            />
          </CmsField>
        </CmsSection>

        <CmsSection
          title="Footer — Explore links column"
          description="Quick navigation links (Home, About, Contact…)."
          where="Footer — first column of quick links"
          defaultOpen={false}
        >
          <div className="space-y-4">
            {data.footer.explore.map((link, i) => (
              <CmsItemCard
                key={i}
                title={`Link ${i + 1}`}
                onRemove={() =>
                  patch((d) => ({
                    ...d,
                    footer: {
                      ...d.footer,
                      explore: d.footer.explore.filter((_, j) => j !== i),
                    },
                  }))
                }
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  <CmsField label="Label">
                    <CmsInput
                      value={link.label}
                      onChange={(e) =>
                        patch((d) => {
                          const explore = [...d.footer.explore];
                          explore[i] = { ...explore[i], label: e.target.value };
                          return { ...d, footer: { ...d.footer, explore } };
                        })
                      }
                    />
                  </CmsField>
                  <CmsField label="Page address">
                    <CmsInput
                      value={link.href}
                      onChange={(e) =>
                        patch((d) => {
                          const explore = [...d.footer.explore];
                          explore[i] = { ...explore[i], href: e.target.value };
                          return { ...d, footer: { ...d.footer, explore } };
                        })
                      }
                    />
                  </CmsField>
                </div>
              </CmsItemCard>
            ))}
            <CmsGhostButton
              onClick={() =>
                patch((d) => ({
                  ...d,
                  footer: {
                    ...d.footer,
                    explore: [...d.footer.explore, { label: "", href: "/" }],
                  },
                }))
              }
            >
              + Add explore link
            </CmsGhostButton>
          </div>
        </CmsSection>

        <CmsSection
          title="Footer — Residential column"
          description="Shortcuts to residential project pages."
          where="Footer — residential shortcuts column"
          defaultOpen={false}
        >
          <div className="space-y-4">
            {data.footer.residential.map((link, i) => (
              <CmsItemCard
                key={i}
                title={`Link ${i + 1}`}
                onRemove={() =>
                  patch((d) => ({
                    ...d,
                    footer: {
                      ...d.footer,
                      residential: d.footer.residential.filter((_, j) => j !== i),
                    },
                  }))
                }
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  <CmsField label="Label">
                    <CmsInput
                      value={link.label}
                      onChange={(e) =>
                        patch((d) => {
                          const residential = [...d.footer.residential];
                          residential[i] = { ...residential[i], label: e.target.value };
                          return { ...d, footer: { ...d.footer, residential } };
                        })
                      }
                    />
                  </CmsField>
                  <CmsField label="Page address">
                    <CmsInput
                      value={link.href}
                      onChange={(e) =>
                        patch((d) => {
                          const residential = [...d.footer.residential];
                          residential[i] = { ...residential[i], href: e.target.value };
                          return { ...d, footer: { ...d.footer, residential } };
                        })
                      }
                    />
                  </CmsField>
                </div>
              </CmsItemCard>
            ))}
            <CmsGhostButton
              onClick={() =>
                patch((d) => ({
                  ...d,
                  footer: {
                    ...d.footer,
                    residential: [...d.footer.residential, { label: "", href: "/" }],
                  },
                }))
              }
            >
              + Add residential link
            </CmsGhostButton>
          </div>
        </CmsSection>

        <CmsSection
          title="Footer — Commercial column"
          description="Shortcuts to commercial project pages."
          where="Footer — commercial shortcuts column"
          defaultOpen={false}
        >
          <div className="space-y-4">
            {data.footer.commercial.map((link, i) => (
              <CmsItemCard
                key={i}
                title={`Link ${i + 1}`}
                onRemove={() =>
                  patch((d) => ({
                    ...d,
                    footer: {
                      ...d.footer,
                      commercial: d.footer.commercial.filter((_, j) => j !== i),
                    },
                  }))
                }
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  <CmsField label="Label">
                    <CmsInput
                      value={link.label}
                      onChange={(e) =>
                        patch((d) => {
                          const commercial = [...d.footer.commercial];
                          commercial[i] = { ...commercial[i], label: e.target.value };
                          return { ...d, footer: { ...d.footer, commercial } };
                        })
                      }
                    />
                  </CmsField>
                  <CmsField label="Page address">
                    <CmsInput
                      value={link.href}
                      onChange={(e) =>
                        patch((d) => {
                          const commercial = [...d.footer.commercial];
                          commercial[i] = { ...commercial[i], href: e.target.value };
                          return { ...d, footer: { ...d.footer, commercial } };
                        })
                      }
                    />
                  </CmsField>
                </div>
              </CmsItemCard>
            ))}
            <CmsGhostButton
              onClick={() =>
                patch((d) => ({
                  ...d,
                  footer: {
                    ...d.footer,
                    commercial: [...d.footer.commercial, { label: "", href: "/" }],
                  },
                }))
              }
            >
              + Add commercial link
            </CmsGhostButton>
          </div>
        </CmsSection>

        <CmsSection
          title="Social media profiles"
          description="Icons or text links to social networks."
          where="Footer — social row beside contact details"
          defaultOpen={false}
        >
          <div className="space-y-4">
            {data.footer.social.map((s, i) => (
              <CmsItemCard
                key={i}
                title={`Network ${i + 1}`}
                onRemove={() =>
                  patch((d) => ({
                    ...d,
                    footer: {
                      ...d.footer,
                      social: d.footer.social.filter((_, j) => j !== i),
                    },
                  }))
                }
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  <CmsField label="Label" hint="Used for accessibility; brand icon is shown on the site.">
                    <CmsInput
                      value={s.label}
                      onChange={(e) =>
                        patch((d) => {
                          const social = [...d.footer.social];
                          social[i] = { ...social[i], label: e.target.value };
                          return { ...d, footer: { ...d.footer, social } };
                        })
                      }
                    />
                  </CmsField>
                  <CmsField label="Full web address" hint="https://…">
                    <CmsInput
                      value={s.href}
                      onChange={(e) =>
                        patch((d) => {
                          const social = [...d.footer.social];
                          social[i] = { ...social[i], href: e.target.value };
                          return { ...d, footer: { ...d.footer, social } };
                        })
                      }
                    />
                  </CmsField>
                </div>
                <CmsField
                  label="Custom icon (optional)"
                  hint="Leave empty to use the built-in brand icon from the label (Facebook, Instagram, etc.)."
                >
                  <CmsImageUpload
                    value={s.iconSrc ?? ""}
                    onChange={(url) =>
                      patch((d) => {
                        const social = [...d.footer.social];
                        social[i] = { ...social[i], iconSrc: url || undefined };
                        return { ...d, footer: { ...d.footer, social } };
                      })
                    }
                  />
                </CmsField>
              </CmsItemCard>
            ))}
            <CmsGhostButton
              onClick={() =>
                patch((d) => ({
                  ...d,
                  footer: {
                    ...d.footer,
                    social: [...d.footer.social, { label: "", href: "" }],
                  },
                }))
              }
            >
              + Add social link
            </CmsGhostButton>
          </div>
        </CmsSection>
      </CmsGroup>

      <CmsSaveBar onSave={save} status={status} label="Save site settings" />
    </div>
  );
}
