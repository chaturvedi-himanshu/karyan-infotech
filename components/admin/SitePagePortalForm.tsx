"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { FileText, Globe, LayoutTemplate, MapPin } from "lucide-react";
import { DEFAULT_SITE_PAGES } from "@/lib/cms/defaults/sitePages";
import {
  CmsCheckbox,
  CmsField,
  CmsGhostButton,
  CmsGroup,
  CmsImageUpload,
  CmsInput,
  CmsItemCard,
  CmsPageIntro,
  CmsSaveBar,
  CmsSection,
  CmsSelect,
  CmsTextarea,
  deepMerge,
} from "./cms-ui";

const CONTACT_ICONS = ["Phone", "Mail", "MapPin", "Clock"] as const;

type AboutPayload = {
  headerEyebrow: string;
  headerTitle: string;
  imageSrc: string;
  imageAlt: string;
  paragraphs: string[];
  stats: { num: string; label: string }[];
  whyTitle: string;
  whySubtitle: string;
  whyInvest: string[];
  whyClosing: string;
  ctaTitle: string;
  ctaDescription: string;
  ctaPrimaryLabel: string;
  ctaPrimaryHref: string;
};

type ContactItem = { icon: string; label: string; value: string; href: string };

type ContactPayload = {
  heroTitle: string;
  contactHeading: string;
  formHeading: string;
  contactItems: ContactItem[];
  mapIframeSrc: string;
  mapTitle: string;
};

type ProjectCard = {
  title: string;
  description: string;
  image: string;
  href: string;
  type: string;
  location: string;
  status: string;
  featured: boolean;
};

type ProjectsListPayload = {
  eyebrow: string;
  title: string;
  subtitle: string;
  projects: ProjectCard[];
};

type BlogIntroPayload = {
  eyebrow: string;
  title: string;
};

export default function SitePagePortalForm({ slug }: { slug: string }) {
  const fallback = useMemo(() => DEFAULT_SITE_PAGES.find((p) => p.slug === slug), [slug]);

  const [metaTitle, setMetaTitle] = useState(() => fallback?.metaTitle ?? "");
  const [metaDescription, setMetaDescription] = useState(
    () => fallback?.metaDescription ?? ""
  );
  const [payload, setPayload] = useState<Record<string, unknown>>(
    () => ({ ...((fallback?.payload as Record<string, unknown>) ?? {}) })
  );
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (!fallback) return;
    let cancelled = false;
    fetch(`/api/admin/pages/${slug}`, { credentials: "include" }).then(async (r) => {
      const doc = r.ok ? await r.json() : null;
      if (cancelled || !doc) return;
      setMetaTitle(doc.metaTitle ?? fallback.metaTitle);
      setMetaDescription(doc.metaDescription ?? fallback.metaDescription);
      const merged = deepMerge(
        { ...(fallback.payload as Record<string, unknown>) },
        (doc.payload ?? {}) as Record<string, unknown>
      );
      setPayload(merged);
    });
    return () => {
      cancelled = true;
    };
  }, [slug, fallback]);

  const patchPayload = useCallback(
    (fn: (p: Record<string, unknown>) => Record<string, unknown>) => {
      setPayload((prev) => fn(structuredClone(prev)));
    },
    []
  );

  async function save() {
    if (!fallback) return;
    setStatus("Saving…");
    const res = await fetch(`/api/admin/pages/${slug}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ metaTitle, metaDescription, payload }),
    });
    setStatus(res.ok ? "Saved successfully." : "Could not save. Try again.");
  }

  if (!fallback)
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
        Unknown page slug: <span className="font-mono font-bold">{slug}</span>
      </div>
    );

  const where =
    slug === "about"
      ? "Public page at /about — company story and credibility"
      : slug === "contact"
        ? "Public page at /contact — hero, contact strip, map, and enquiry form"
        : slug === "projects"
          ? "Public page at /projects — portfolio grid of all developments"
          : "Top of /blog — intro lines above the article list";

  const about = payload as unknown as AboutPayload;
  const contact = payload as unknown as ContactPayload;
  const projectsList = payload as unknown as ProjectsListPayload;
  const blogIntro = payload as unknown as BlogIntroPayload;

  return (
    <div className="space-y-10">
      <CmsPageIntro title="Page editor" where={where}>
        Edit the content that appears on this public page. The SEO fields below are for Google
        search results, not large headings on the page itself.
      </CmsPageIntro>

      {/* ── SEO group — always shown ────────────────────────────────── */}
      <CmsGroup
        icon={<Globe className="h-4 w-4" />}
        title="Search & discovery"
        description="How this page appears in Google search results and the browser tab"
      >
        <CmsSection
          title="SEO — search listing"
          description="Title and description shown in Google results."
          where="Google snippet and browser tab — not the large visible headings on the page"
          defaultOpen
        >
          <CmsField label="Page title (tab & Google)">
            <CmsInput
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
            />
          </CmsField>
          <CmsField label="Short summary for Google" hint="Aim for 140–160 characters.">
            <CmsTextarea
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
            />
          </CmsField>
        </CmsSection>
      </CmsGroup>

      {/* ── About page ──────────────────────────────────────────────── */}
      {slug === "about" ? (
        <>
          <CmsGroup
            icon={<FileText className="h-4 w-4" />}
            title="Page content"
            description="Hero image, story paragraphs, and highlight statistics"
          >
            <CmsSection
              title="Header & hero image"
              description="Top banner with photo and headline."
              where="/about — top banner with photo and headline"
              defaultOpen
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <CmsField label="Eyebrow">
                  <CmsInput
                    value={about.headerEyebrow}
                    onChange={(e) =>
                      patchPayload((p) => ({ ...p, headerEyebrow: e.target.value }))
                    }
                  />
                </CmsField>
                <CmsField label="Main heading">
                  <CmsInput
                    value={about.headerTitle}
                    onChange={(e) =>
                      patchPayload((p) => ({ ...p, headerTitle: e.target.value }))
                    }
                  />
                </CmsField>
                <CmsField label="Hero image" hint="Large image shown on the About page hero.">
                  <CmsImageUpload
                    value={about.imageSrc}
                    onChange={(url) =>
                      patchPayload((p) => ({ ...p, imageSrc: url }))
                    }
                    folder="pages/about"
                  />
                </CmsField>
                <CmsField label="Image description (accessibility)">
                  <CmsInput
                    value={about.imageAlt}
                    onChange={(e) =>
                      patchPayload((p) => ({ ...p, imageAlt: e.target.value }))
                    }
                  />
                </CmsField>
              </div>
            </CmsSection>

            <CmsSection
              title="Story paragraphs"
              description="Main text under the hero image."
              where="/about — main text under the hero"
              defaultOpen={false}
            >
              <CmsField label="Body copy" hint="Separate paragraphs with a blank line.">
                <CmsTextarea
                  value={(about.paragraphs ?? []).join("\n\n")}
                  onChange={(e) =>
                    patchPayload((p) => ({
                      ...p,
                      paragraphs: e.target.value
                        .split(/\n\n+/)
                        .map((x) => x.trim())
                        .filter(Boolean),
                    }))
                  }
                  className="min-h-[200px]"
                />
              </CmsField>
            </CmsSection>

            <CmsSection
              title="Highlight statistics"
              description="Key numbers displayed in a grid below the story."
              where="/about — grid of statistics under the story"
              defaultOpen={false}
            >
              <div className="space-y-4">
                {(about.stats ?? []).map((s, i) => (
                  <CmsItemCard
                    key={i}
                    title={`Stat ${i + 1}`}
                    onRemove={() =>
                      patchPayload((p) => {
                        const stats = [...((p.stats as typeof about.stats) ?? [])];
                        stats.splice(i, 1);
                        return { ...p, stats };
                      })
                    }
                  >
                    <div className="grid gap-3 sm:grid-cols-2">
                      <CmsField label="Big number">
                        <CmsInput
                          value={s.num}
                          onChange={(e) =>
                            patchPayload((p) => {
                              const stats = [...((p.stats as typeof about.stats) ?? [])];
                              stats[i] = { ...stats[i], num: e.target.value };
                              return { ...p, stats };
                            })
                          }
                        />
                      </CmsField>
                      <CmsField label="Label">
                        <CmsInput
                          value={s.label}
                          onChange={(e) =>
                            patchPayload((p) => {
                              const stats = [...((p.stats as typeof about.stats) ?? [])];
                              stats[i] = { ...stats[i], label: e.target.value };
                              return { ...p, stats };
                            })
                          }
                        />
                      </CmsField>
                    </div>
                  </CmsItemCard>
                ))}
                <CmsGhostButton
                  onClick={() =>
                    patchPayload((p) => ({
                      ...p,
                      stats: [
                        ...((p.stats as typeof about.stats) ?? []),
                        { num: "", label: "" },
                      ],
                    }))
                  }
                >
                  + Add statistic
                </CmsGhostButton>
              </div>
            </CmsSection>
          </CmsGroup>

          <CmsGroup
            icon={<LayoutTemplate className="h-4 w-4" />}
            title="Lower sections"
            description="Why invest with us block and the bottom call-to-action"
          >
            <CmsSection
              title="Why invest with us"
              description="Reasons list and closing statement."
              where="/about — reasons list and closing line"
              defaultOpen={false}
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <CmsField label="Section title">
                  <CmsInput
                    value={about.whyTitle}
                    onChange={(e) =>
                      patchPayload((p) => ({ ...p, whyTitle: e.target.value }))
                    }
                  />
                </CmsField>
                <CmsField label="Subtitle">
                  <CmsInput
                    value={about.whySubtitle}
                    onChange={(e) =>
                      patchPayload((p) => ({ ...p, whySubtitle: e.target.value }))
                    }
                  />
                </CmsField>
              </div>
              <CmsField label="Bullet lines" hint="One reason per line.">
                <CmsTextarea
                  value={(about.whyInvest ?? []).join("\n")}
                  onChange={(e) =>
                    patchPayload((p) => ({
                      ...p,
                      whyInvest: e.target.value
                        .split("\n")
                        .map((x) => x.trim())
                        .filter(Boolean),
                    }))
                  }
                  className="min-h-[120px]"
                />
              </CmsField>
              <CmsField label="Closing line">
                <CmsInput
                  value={about.whyClosing}
                  onChange={(e) =>
                    patchPayload((p) => ({ ...p, whyClosing: e.target.value }))
                  }
                />
              </CmsField>
            </CmsSection>

            <CmsSection
              title="Bottom call-to-action"
              description="Banner above the footer with a link button."
              where="/about — banner before the footer"
              defaultOpen={false}
            >
              <CmsField label="Heading">
                <CmsInput
                  value={about.ctaTitle}
                  onChange={(e) =>
                    patchPayload((p) => ({ ...p, ctaTitle: e.target.value }))
                  }
                />
              </CmsField>
              <CmsField label="Supporting text">
                <CmsTextarea
                  value={about.ctaDescription}
                  onChange={(e) =>
                    patchPayload((p) => ({ ...p, ctaDescription: e.target.value }))
                  }
                />
              </CmsField>
              <div className="grid gap-3 sm:grid-cols-2">
                <CmsField label="Button label">
                  <CmsInput
                    value={about.ctaPrimaryLabel}
                    onChange={(e) =>
                      patchPayload((p) => ({ ...p, ctaPrimaryLabel: e.target.value }))
                    }
                  />
                </CmsField>
                <CmsField label="Button link">
                  <CmsInput
                    value={about.ctaPrimaryHref}
                    onChange={(e) =>
                      patchPayload((p) => ({ ...p, ctaPrimaryHref: e.target.value }))
                    }
                  />
                </CmsField>
              </div>
            </CmsSection>
          </CmsGroup>
        </>
      ) : null}

      {/* ── Contact page ────────────────────────────────────────────── */}
      {slug === "contact" ? (
        <CmsGroup
          icon={<MapPin className="h-4 w-4" />}
          title="Contact page content"
          description="Hero text, contact details, and the embedded map"
        >
          <CmsSection
            title="Hero line"
            description="Large quote-style text at the top of the page."
            where="/contact — large line at the top"
            defaultOpen
          >
            <CmsField label="Hero text">
              <CmsTextarea
                value={contact.heroTitle}
                onChange={(e) =>
                  patchPayload((p) => ({ ...p, heroTitle: e.target.value }))
                }
              />
            </CmsField>
          </CmsSection>

          <CmsSection
            title="Column headings"
            description="Labels above the phone/email list and the enquiry form."
            where="/contact — labels above phone & email list and the form"
            defaultOpen={false}
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <CmsField label="Heading above phone & email">
                <CmsInput
                  value={contact.contactHeading}
                  onChange={(e) =>
                    patchPayload((p) => ({ ...p, contactHeading: e.target.value }))
                  }
                />
              </CmsField>
              <CmsField label="Heading above the enquiry form">
                <CmsInput
                  value={contact.formHeading}
                  onChange={(e) =>
                    patchPayload((p) => ({ ...p, formHeading: e.target.value }))
                  }
                />
              </CmsField>
            </div>
          </CmsSection>

          <CmsSection
            title="Contact rows"
            description="Phone, email, address, and hours list items."
            where="/contact — phone, email, address, and hours list"
            defaultOpen
          >
            <div className="space-y-4">
              {(contact.contactItems ?? []).map((item, i) => (
                <CmsItemCard
                  key={i}
                  title={`Row ${i + 1}`}
                  onRemove={() =>
                    patchPayload((p) => {
                      const contactItems = [
                        ...((p.contactItems as ContactItem[]) ?? []),
                      ];
                      contactItems.splice(i, 1);
                      return { ...p, contactItems };
                    })
                  }
                >
                  <div className="grid gap-3 sm:grid-cols-2">
                    <CmsField label="Icon">
                      <CmsSelect
                        value={item.icon}
                        onChange={(e) =>
                          patchPayload((p) => {
                            const contactItems = [
                              ...((p.contactItems as ContactItem[]) ?? []),
                            ];
                            contactItems[i] = { ...contactItems[i], icon: e.target.value };
                            return { ...p, contactItems };
                          })
                        }
                      >
                        {CONTACT_ICONS.map((ic) => (
                          <option key={ic} value={ic}>
                            {ic}
                          </option>
                        ))}
                      </CmsSelect>
                    </CmsField>
                    <CmsField label="Row label" hint="e.g. Call, Email">
                      <CmsInput
                        value={item.label}
                        onChange={(e) =>
                          patchPayload((p) => {
                            const contactItems = [
                              ...((p.contactItems as ContactItem[]) ?? []),
                            ];
                            contactItems[i] = { ...contactItems[i], label: e.target.value };
                            return { ...p, contactItems };
                          })
                        }
                      />
                    </CmsField>
                    <CmsField label="Value shown to visitors">
                      <CmsInput
                        value={item.value}
                        onChange={(e) =>
                          patchPayload((p) => {
                            const contactItems = [
                              ...((p.contactItems as ContactItem[]) ?? []),
                            ];
                            contactItems[i] = { ...contactItems[i], value: e.target.value };
                            return { ...p, contactItems };
                          })
                        }
                      />
                    </CmsField>
                    <CmsField label="Tap link" hint="tel:, mailto:, or # if not clickable.">
                      <CmsInput
                        value={item.href}
                        onChange={(e) =>
                          patchPayload((p) => {
                            const contactItems = [
                              ...((p.contactItems as ContactItem[]) ?? []),
                            ];
                            contactItems[i] = { ...contactItems[i], href: e.target.value };
                            return { ...p, contactItems };
                          })
                        }
                      />
                    </CmsField>
                  </div>
                </CmsItemCard>
              ))}
              <CmsGhostButton
                onClick={() =>
                  patchPayload((p) => ({
                    ...p,
                    contactItems: [
                      ...((p.contactItems as ContactItem[]) ?? []),
                      { icon: "Phone", label: "", value: "", href: "" },
                    ],
                  }))
                }
              >
                + Add contact row
              </CmsGhostButton>
            </div>
          </CmsSection>

          <CmsSection
            title="Embedded map"
            description="Google Maps embed shown below the two columns."
            where="/contact — embedded map under the two columns"
            defaultOpen={false}
          >
            <CmsField label="Map title (accessibility)">
              <CmsInput
                value={contact.mapTitle}
                onChange={(e) =>
                  patchPayload((p) => ({ ...p, mapTitle: e.target.value }))
                }
              />
            </CmsField>
            <CmsField
              label="Map embed link"
              hint='Paste the long "embed" URL from Google Maps.'
            >
              <CmsTextarea
                value={contact.mapIframeSrc}
                onChange={(e) =>
                  patchPayload((p) => ({ ...p, mapIframeSrc: e.target.value }))
                }
                className="min-h-[100px] font-mono text-xs"
              />
            </CmsField>
          </CmsSection>
        </CmsGroup>
      ) : null}

      {/* ── Projects listing page ───────────────────────────────────── */}
      {slug === "projects" ? (
        <CmsGroup
          icon={<LayoutTemplate className="h-4 w-4" />}
          title="Projects listing page"
          description="Intro header and the grid of project cards at /projects"
        >
          <CmsSection
            title="Page intro"
            description="Eyebrow, heading, and supporting paragraph."
            where="/projects — headline area above the project cards"
            defaultOpen
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <CmsField label="Eyebrow">
                <CmsInput
                  value={projectsList.eyebrow}
                  onChange={(e) =>
                    patchPayload((p) => ({ ...p, eyebrow: e.target.value }))
                  }
                />
              </CmsField>
              <CmsField label="Main heading">
                <CmsInput
                  value={projectsList.title}
                  onChange={(e) =>
                    patchPayload((p) => ({ ...p, title: e.target.value }))
                  }
                />
              </CmsField>
            </div>
            <CmsField label="Supporting paragraph">
              <CmsTextarea
                value={projectsList.subtitle}
                onChange={(e) =>
                  patchPayload((p) => ({ ...p, subtitle: e.target.value }))
                }
              />
            </CmsField>
          </CmsSection>

          <CmsSection
            title="Project cards"
            description="Each tile links to a full project detail page."
            where="/projects — each tile linking to a full project page"
            defaultOpen
          >
            <div className="space-y-4">
              {(projectsList.projects ?? []).map((proj, i) => (
                <CmsItemCard
                  key={i}
                  title={`Project ${i + 1}`}
                  onRemove={() =>
                    patchPayload((p) => {
                      const projects = [...((p.projects as ProjectCard[]) ?? [])];
                      projects.splice(i, 1);
                      return { ...p, projects };
                    })
                  }
                >
                  <div className="grid gap-3 sm:grid-cols-2">
                    <CmsField label="Project name">
                      <CmsInput
                        value={proj.title}
                        onChange={(e) =>
                          patchPayload((p) => {
                            const projects = [...((p.projects as ProjectCard[]) ?? [])];
                            projects[i] = { ...projects[i], title: e.target.value };
                            return { ...p, projects };
                          })
                        }
                      />
                    </CmsField>
                    <CmsField label="Link to detail page">
                      <CmsInput
                        value={proj.href}
                        onChange={(e) =>
                          patchPayload((p) => {
                            const projects = [...((p.projects as ProjectCard[]) ?? [])];
                            projects[i] = { ...projects[i], href: e.target.value };
                            return { ...p, projects };
                          })
                        }
                      />
                    </CmsField>
                    <CmsField label="Card image" hint="Thumbnail shown on the projects listing.">
                      <CmsImageUpload
                        value={proj.image}
                        onChange={(url) =>
                          patchPayload((p) => {
                            const projects = [...((p.projects as ProjectCard[]) ?? [])];
                            projects[i] = { ...projects[i], image: url };
                            return { ...p, projects };
                          })
                        }
                        folder="pages/projects"
                      />
                    </CmsField>
                    <CmsField label="Type tag" hint="Residential, Retail…">
                      <CmsInput
                        value={proj.type}
                        onChange={(e) =>
                          patchPayload((p) => {
                            const projects = [...((p.projects as ProjectCard[]) ?? [])];
                            projects[i] = { ...projects[i], type: e.target.value };
                            return { ...p, projects };
                          })
                        }
                      />
                    </CmsField>
                    <CmsField label="Location line">
                      <CmsInput
                        value={proj.location}
                        onChange={(e) =>
                          patchPayload((p) => {
                            const projects = [...((p.projects as ProjectCard[]) ?? [])];
                            projects[i] = { ...projects[i], location: e.target.value };
                            return { ...p, projects };
                          })
                        }
                      />
                    </CmsField>
                    <CmsField label="Status label" hint="e.g. ONGOING">
                      <CmsInput
                        value={proj.status}
                        onChange={(e) =>
                          patchPayload((p) => {
                            const projects = [...((p.projects as ProjectCard[]) ?? [])];
                            projects[i] = { ...projects[i], status: e.target.value };
                            return { ...p, projects };
                          })
                        }
                      />
                    </CmsField>
                  </div>
                  <CmsField label="Short description">
                    <CmsTextarea
                      value={proj.description}
                      onChange={(e) =>
                        patchPayload((p) => {
                          const projects = [...((p.projects as ProjectCard[]) ?? [])];
                          projects[i] = { ...projects[i], description: e.target.value };
                          return { ...p, projects };
                        })
                      }
                      className="min-h-[80px]"
                    />
                  </CmsField>
                  <CmsCheckbox
                    label="Feature this project (shows as a larger card on the listing page)"
                    checked={Boolean(proj.featured)}
                    onChange={(e) =>
                      patchPayload((p) => {
                        const projects = [...((p.projects as ProjectCard[]) ?? [])];
                        projects[i] = { ...projects[i], featured: e.target.checked };
                        return { ...p, projects };
                      })
                    }
                  />
                </CmsItemCard>
              ))}
              <CmsGhostButton
                onClick={() =>
                  patchPayload((p) => ({
                    ...p,
                    projects: [
                      ...((p.projects as ProjectCard[]) ?? []),
                      {
                        title: "New project",
                        description: "",
                        image: "/images/trevana-main.webp",
                        href: "/",
                        type: "",
                        location: "",
                        status: "",
                        featured: false,
                      },
                    ],
                  }))
                }
              >
                + Add project card
              </CmsGhostButton>
            </div>
          </CmsSection>
        </CmsGroup>
      ) : null}

      {/* ── Blog intro page ─────────────────────────────────────────── */}
      {slug === "blog" ? (
        <CmsGroup
          icon={<FileText className="h-4 w-4" />}
          title="Blog listing intro"
          description="The headline lines displayed above the grid of articles at /blog"
        >
          <CmsSection
            title="Blog listing intro"
            description="Eyebrow and heading above the articles grid."
            where="/blog — lines above the grid of articles"
            defaultOpen
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <CmsField label="Eyebrow">
                <CmsInput
                  value={blogIntro.eyebrow}
                  onChange={(e) =>
                    patchPayload((p) => ({ ...p, eyebrow: e.target.value }))
                  }
                />
              </CmsField>
              <CmsField label="Main heading">
                <CmsInput
                  value={blogIntro.title}
                  onChange={(e) =>
                    patchPayload((p) => ({ ...p, title: e.target.value }))
                  }
                />
              </CmsField>
            </div>
          </CmsSection>
        </CmsGroup>
      ) : null}

      <CmsSaveBar onSave={save} status={status} label="Save page" />
    </div>
  );
}
