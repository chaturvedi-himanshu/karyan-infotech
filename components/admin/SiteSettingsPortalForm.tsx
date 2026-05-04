"use client";

import { useCallback, useEffect, useState } from "react";
import { Globe, LayoutGrid, Menu } from "lucide-react";
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
  deepMerge,
} from "./cms-ui";

export default function SiteSettingsPortalForm() {
  const [data, setData] = useState<SiteSettingsBundle | null>(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetch("/api/admin/site", { credentials: "include" })
      .then((r) => r.json())
      .then((j) => {
        const nav = j.nav ?? {};
        const footer = j.footer ?? {};
        const merged = deepMerge(
          DEFAULT_SITE_SETTINGS as unknown as Record<string, unknown>,
          { nav, footer } as Record<string, unknown>
        );
        setData(merged as SiteSettingsBundle);
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
    setStatus(res.ok ? "Saved successfully." : "Could not save. Try again.");
  }

  if (!data) return <CmsLoadingSkeleton label="Loading site settings…" />;

  return (
    <div className="space-y-10">
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
                  <CmsField label="Label" hint="e.g. Instagram">
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
