"use client";

import { useCallback, useEffect, useState } from "react";
import type { SiteSettingsBundle } from "@/lib/cms/types";
import { DEFAULT_SITE_SETTINGS } from "@/lib/cms/defaults/siteSettings";
import {
  CmsField,
  CmsGhostButton,
  CmsInput,
  CmsItemCard,
  CmsPageIntro,
  CmsPrimaryButton,
  CmsSaveStatus,
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

  if (!data) return <p className="text-sm text-stone-500">Loading settings…</p>;

  return (
    <div className="space-y-8">
      <CmsPageIntro
        title="Global chrome of your website"
        where="Top navigation bar and footer appear on every public page (home, projects, blog, etc.)."
      >
        Use this area for phone numbers, menu labels, footer columns, and legal lines. Visitors see these
        elements consistently as they move around the site.
      </CmsPageIntro>

      <CmsSection
        title="Top announcement bar"
        description="Phone, region text, and the enquiry button label."
        where="Thin strip at the very top of every page, above the logo."
        defaultOpen
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <CmsField label="Phone number (visible text)">
            <CmsInput
              value={data.nav.topBar.phone}
              onChange={(e) =>
                patch((d) => ({
                  ...d,
                  nav: { ...d.nav, topBar: { ...d.nav.topBar, phone: e.target.value } },
                }))
              }
            />
          </CmsField>
          <CmsField label="Phone tap link" hint="Paste tel:+… so mobile visitors can call in one tap.">
            <CmsInput
              value={data.nav.topBar.phoneHref}
              onChange={(e) =>
                patch((d) => ({
                  ...d,
                  nav: { ...d.nav, topBar: { ...d.nav.topBar, phoneHref: e.target.value } },
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
                  nav: { ...d.nav, topBar: { ...d.nav.topBar, regionLabel: e.target.value } },
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
                  nav: { ...d.nav, topBar: { ...d.nav.topBar, enquireLabel: e.target.value } },
                }))
              }
            />
          </CmsField>
        </div>
      </CmsSection>

      <CmsSection
        title="Header logo"
        description="Image shown in the main header (replaces the old text wordmark)."
        where="Header — left of the menu on desktop and mobile."
        defaultOpen
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <CmsField label="Logo image URL" hint="HTTPS link to PNG or SVG (e.g. from your media library).">
            <CmsInput
              value={data.nav.headerLogoSrc ?? ""}
              onChange={(e) =>
                patch((d) => ({
                  ...d,
                  nav: { ...d.nav, headerLogoSrc: e.target.value },
                }))
              }
            />
          </CmsField>
          <CmsField label="Logo alt text" hint="Short description for accessibility and SEO.">
            <CmsInput
              value={data.nav.headerLogoAlt ?? ""}
              onChange={(e) =>
                patch((d) => ({
                  ...d,
                  nav: { ...d.nav, headerLogoAlt: e.target.value },
                }))
              }
            />
          </CmsField>
        </div>
      </CmsSection>

      <CmsSection
        title="Main menu links"
        description="The primary pages in the horizontal navigation."
        where="Header — main menu beside the logo on desktop; mobile menu on phones."
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
            </CmsItemCard>
          ))}
          <CmsGhostButton
            onClick={() =>
              patch((d) => ({
                ...d,
                nav: { ...d.nav, mainLinks: [...d.nav.mainLinks, { label: "New page", href: "/" }] },
              }))
            }
          >
            + Add menu link
          </CmsGhostButton>
        </div>
      </CmsSection>

      <CmsSection
        title="Residential projects in the menu"
        description="Dropdown entries for homes / apartments."
        where="Header — “Residential” fly-out in the navigation."
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
              <CmsField label="Name">
                <CmsInput
                  value={p.name}
                  onChange={(e) =>
                    patch((d) => {
                      const residentialProjects = [...d.nav.residentialProjects];
                      residentialProjects[i] = { ...residentialProjects[i], name: e.target.value };
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
                      residentialProjects[i] = { ...residentialProjects[i], href: e.target.value };
                      return { ...d, nav: { ...d.nav, residentialProjects } };
                    })
                  }
                />
              </CmsField>
              <CmsField label="Tag line" hint="Short subtitle under the name in the menu.">
                <CmsInput
                  value={p.tag}
                  onChange={(e) =>
                    patch((d) => {
                      const residentialProjects = [...d.nav.residentialProjects];
                      residentialProjects[i] = { ...residentialProjects[i], tag: e.target.value };
                      return { ...d, nav: { ...d.nav, residentialProjects } };
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
        title="Commercial projects in the menu"
        description="Dropdown entries for retail, offices, malls."
        where="Header — “Commercial” fly-out in the navigation."
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
              <CmsField label="Name">
                <CmsInput
                  value={p.name}
                  onChange={(e) =>
                    patch((d) => {
                      const commercialProjects = [...d.nav.commercialProjects];
                      commercialProjects[i] = { ...commercialProjects[i], name: e.target.value };
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
                      commercialProjects[i] = { ...commercialProjects[i], href: e.target.value };
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
                      commercialProjects[i] = { ...commercialProjects[i], tag: e.target.value };
                      return { ...d, nav: { ...d.nav, commercialProjects } };
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

      <CmsSection
        title="Footer story"
        description="Tagline, phone, social, and legal copy."
        where="Footer on every page — columns above the copyright line."
        defaultOpen={false}
      >
        <CmsField label="Tagline" hint="One or two sentences about the company.">
          <CmsTextarea value={data.footer.tagline} onChange={(e) => patch((d) => ({
              ...d,
              footer: { ...d.footer, tagline: e.target.value },
            }))}
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
              patch((d) => ({
                ...d,
                footer: { ...d.footer, legalLine: e.target.value },
              }))
            }
          />
        </CmsField>
        <CmsField label="Extra disclaimer" hint="Shown as smaller legal text when space allows.">
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
        title="Footer — Explore links"
        description="Quick links column (Home, About…)."
        where="Footer — first column of quick links."
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
                  footer: { ...d.footer, explore: d.footer.explore.filter((_, j) => j !== i) },
                }))
              }
            >
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
            </CmsItemCard>
          ))}
          <CmsGhostButton
            onClick={() =>
              patch((d) => ({
                ...d,
                footer: { ...d.footer, explore: [...d.footer.explore, { label: "", href: "/" }] },
              }))
            }
          >
            + Add explore link
          </CmsGhostButton>
        </div>
      </CmsSection>

      <CmsSection
        title="Footer — Residential column"
        where="Footer — residential shortcuts column."
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
        where="Footer — commercial shortcuts column."
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
        title="Social media"
        description="Icons or text links to social profiles."
        where="Footer — social row beside contact details."
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
                  footer: { ...d.footer, social: d.footer.social.filter((_, j) => j !== i) },
                }))
              }
            >
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
            </CmsItemCard>
          ))}
          <CmsGhostButton
            onClick={() =>
              patch((d) => ({
                ...d,
                footer: { ...d.footer, social: [...d.footer.social, { label: "", href: "" }] },
              }))
            }
          >
            + Add social link
          </CmsGhostButton>
        </div>
      </CmsSection>

      <div className="sticky bottom-4 z-10 rounded-2xl border border-stone-200 bg-white/95 p-4 shadow-lg backdrop-blur">
        <CmsPrimaryButton onClick={save}>Save site settings</CmsPrimaryButton>
        <span className="ml-3">
          <CmsSaveStatus message={status} />
        </span>
      </div>
    </div>
  );
}
