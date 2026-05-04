"use client";

import { useCallback, useEffect, useState } from "react";
import { FileText, Image, PhoneCall, Search } from "lucide-react";
import type { ProjectPayload } from "@/lib/cms/types";
import { DEFAULT_PROJECT_PAGES } from "@/lib/cms/defaults/projectsSeed";
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
import { parseLines } from "./form-helpers";

export default function ProjectPortalForm({ slug }: { slug: string }) {
  const [data, setData] = useState<ProjectPayload | null>(null);
  const [status, setStatus] = useState("");

  const patch = useCallback((fn: (d: ProjectPayload) => ProjectPayload) => {
    setData((prev) => (prev ? fn(structuredClone(prev)) : prev));
  }, []);

  useEffect(() => {
    const seed = DEFAULT_PROJECT_PAGES.find((x) => x.slug === slug)?.payload;
    if (!seed) return;
    fetch(`/api/admin/projects/${slug}`, { credentials: "include" })
      .then((r) => r.json())
      .then((j) => {
        const merged = deepMerge(
          seed as unknown as Record<string, unknown>,
          (j.payload ?? {}) as Record<string, unknown>
        );
        setData(merged as ProjectPayload);
      });
  }, [slug]);

  async function save() {
    if (!data) return;
    setStatus("Saving…");
    const payload = structuredClone(data);
    if (!String(payload.leasingBox?.title ?? "").trim()) {
      payload.leasingBox = undefined;
    }
    if (!String(payload.locationSidebar?.title ?? "").trim()) {
      payload.locationSidebar = undefined;
    }
    const res = await fetch(`/api/admin/projects/${slug}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setStatus(res.ok ? "Saved successfully." : "Could not save. Try again.");
  }

  if (!data) return <CmsLoadingSkeleton label="Loading project content…" />;

  const publicPath = `/${slug}`;

  return (
    <div className="space-y-10">
      <CmsPageIntro
        title={`Editing: ${data.header.title}`}
        where={`Public URL: ${publicPath}`}
      >
        Each section below lines up with a band on the project detail page — hero, numbers,
        story, gallery, and the enquiry area. Save once at the bottom when you are done.
      </CmsPageIntro>

      {/* ── GROUP 1: Discovery ──────────────────────────────────────── */}
      <CmsGroup
        icon={<Search className="h-4 w-4" />}
        title="Search & discovery"
        description="How this project appears in Google search results and the browser tab"
      >
        <CmsSection
          title="SEO — search listing"
          description="Title and short summary for Google search results."
          where="Google snippet and browser tab — not shown as large headings on the page"
          defaultOpen
        >
          <CmsField label="SEO title">
            <CmsInput
              value={data.metadata.title}
              onChange={(e) =>
                patch((d) => ({ ...d, metadata: { ...d.metadata, title: e.target.value } }))
              }
            />
          </CmsField>
          <CmsField label="SEO description" hint="Aim for 140–160 characters.">
            <CmsTextarea
              value={data.metadata.description}
              onChange={(e) =>
                patch((d) => ({
                  ...d,
                  metadata: { ...d.metadata, description: e.target.value },
                }))
              }
            />
          </CmsField>
        </CmsSection>
      </CmsGroup>

      {/* ── GROUP 2: Above the fold ─────────────────────────────────── */}
      <CmsGroup
        icon={<Image className="h-4 w-4" />}
        title="Above the fold"
        description="The hero banner and key numbers visitors see immediately on arrival"
      >
        <CmsSection
          title="Hero banner"
          description="Big title and background photo at the very top."
          where="Top of the project page — full-width photo with the project name"
          defaultOpen
        >
          <CmsField label="Project name in hero">
            <CmsInput
              value={data.header.title}
              onChange={(e) =>
                patch((d) => ({ ...d, header: { ...d.header, title: e.target.value } }))
              }
            />
          </CmsField>
          <CmsField label="Background image" hint="Hero banner behind the project title.">
            <CmsImageUpload
              value={data.header.bgImage}
              onChange={(url) =>
                patch((d) => ({ ...d, header: { ...d.header, bgImage: url } }))
              }
              folder="projects/hero"
            />
          </CmsField>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Breadcrumb trail
          </p>
          <div className="space-y-4">
            {data.header.breadcrumbs.map((bc, i) => (
              <CmsItemCard
                key={i}
                title={`Step ${i + 1}`}
                onRemove={() =>
                  patch((d) => ({
                    ...d,
                    header: {
                      ...d.header,
                      breadcrumbs: d.header.breadcrumbs.filter((_, j) => j !== i),
                    },
                  }))
                }
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  <CmsField label="Label">
                    <CmsInput
                      value={bc.label}
                      onChange={(e) =>
                        patch((d) => {
                          const breadcrumbs = [...d.header.breadcrumbs];
                          const href = breadcrumbs[i].href;
                          breadcrumbs[i] = href
                            ? { label: e.target.value, href }
                            : { label: e.target.value };
                          return { ...d, header: { ...d.header, breadcrumbs } };
                        })
                      }
                    />
                  </CmsField>
                  <CmsField label="Link" hint="Leave empty for the current page step.">
                    <CmsInput
                      value={bc.href ?? ""}
                      onChange={(e) =>
                        patch((d) => {
                          const breadcrumbs = [...d.header.breadcrumbs];
                          const href = e.target.value.trim();
                          const label = breadcrumbs[i].label;
                          breadcrumbs[i] = href ? { label, href } : { label };
                          return { ...d, header: { ...d.header, breadcrumbs } };
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
                  header: {
                    ...d.header,
                    breadcrumbs: [...d.header.breadcrumbs, { label: "New" }],
                  },
                }))
              }
            >
              + Add breadcrumb
            </CmsGhostButton>
          </div>
        </CmsSection>

        <CmsSection
          title="Investment highlights"
          description="Icon row with key numbers buyers notice first."
          where="Immediately under the hero — horizontal highlight cards"
          defaultOpen={false}
        >
          <div className="space-y-4">
            {data.investmentHighlights.map((h, i) => (
              <CmsItemCard
                key={i}
                title={`Highlight ${i + 1}`}
                onRemove={() =>
                  patch((d) => ({
                    ...d,
                    investmentHighlights: d.investmentHighlights.filter((_, j) => j !== i),
                  }))
                }
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  <CmsField
                    label="Icon name"
                    hint="Internal key (e.g. Building2) — ask your web team."
                  >
                    <CmsInput
                      value={h.icon}
                      onChange={(e) =>
                        patch((d) => {
                          const investmentHighlights = [...d.investmentHighlights];
                          investmentHighlights[i] = {
                            ...investmentHighlights[i],
                            icon: e.target.value,
                          };
                          return { ...d, investmentHighlights };
                        })
                      }
                    />
                  </CmsField>
                  <CmsField label="Title">
                    <CmsInput
                      value={h.title}
                      onChange={(e) =>
                        patch((d) => {
                          const investmentHighlights = [...d.investmentHighlights];
                          investmentHighlights[i] = {
                            ...investmentHighlights[i],
                            title: e.target.value,
                          };
                          return { ...d, investmentHighlights };
                        })
                      }
                    />
                  </CmsField>
                  <CmsField label="Big value">
                    <CmsInput
                      value={h.value}
                      onChange={(e) =>
                        patch((d) => {
                          const investmentHighlights = [...d.investmentHighlights];
                          investmentHighlights[i] = {
                            ...investmentHighlights[i],
                            value: e.target.value,
                          };
                          return { ...d, investmentHighlights };
                        })
                      }
                    />
                  </CmsField>
                  <CmsField label="Supporting line">
                    <CmsInput
                      value={h.description}
                      onChange={(e) =>
                        patch((d) => {
                          const investmentHighlights = [...d.investmentHighlights];
                          investmentHighlights[i] = {
                            ...investmentHighlights[i],
                            description: e.target.value,
                          };
                          return { ...d, investmentHighlights };
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
                  investmentHighlights: [
                    ...d.investmentHighlights,
                    { icon: "Sparkles", title: "", value: "", description: "" },
                  ],
                }))
              }
            >
              + Add highlight
            </CmsGhostButton>
          </div>
        </CmsSection>
      </CmsGroup>

      {/* ── GROUP 3: Main content ───────────────────────────────────── */}
      <CmsGroup
        icon={<FileText className="h-4 w-4" />}
        title="Main content"
        description="The project story, typology table, architects, and image gallery"
      >
        <CmsSection
          title="Main story"
          description="Section title, paragraphs, and benefit bullets."
          where="Central column — headline and long-form text about the project"
          defaultOpen
        >
          <CmsField label="Section heading">
            <CmsInput
              value={data.mainTitle}
              onChange={(e) => patch((d) => ({ ...d, mainTitle: e.target.value }))}
            />
          </CmsField>
          <CmsField label="Paragraphs" hint="Separate paragraphs with a blank line.">
            <CmsTextarea
              value={data.introParagraphs.join("\n\n")}
              onChange={(e) =>
                patch((d) => ({
                  ...d,
                  introParagraphs: e.target.value
                    .split(/\n\n+/)
                    .map((x) => x.trim())
                    .filter(Boolean),
                }))
              }
              className="min-h-[160px]"
            />
          </CmsField>
          <div className="grid gap-3 sm:grid-cols-2">
            <CmsField label="Benefits section title (optional)">
              <CmsInput
                value={data.benefitsTitle ?? ""}
                onChange={(e) =>
                  patch((d) => ({ ...d, benefitsTitle: e.target.value || undefined }))
                }
              />
            </CmsField>
            <CmsField label="Benefit lines" hint="One bullet per line.">
              <CmsTextarea
                value={(data.benefits ?? []).join("\n")}
                onChange={(e) =>
                  patch((d) => ({ ...d, benefits: parseLines(e.target.value) }))
                }
                className="min-h-[100px]"
              />
            </CmsField>
          </div>
        </CmsSection>

        <CmsSection
          title="Unit types"
          description="Optional table of typical unit sizes."
          where="Project page — typology table in the main column"
          defaultOpen={false}
        >
          <CmsField label="Section title (optional)">
            <CmsInput
              value={data.unitTypesTitle ?? ""}
              onChange={(e) =>
                patch((d) => ({ ...d, unitTypesTitle: e.target.value || undefined }))
              }
            />
          </CmsField>
          <div className="space-y-4">
            {(data.unitTypes ?? []).map((u, i) => (
              <CmsItemCard
                key={i}
                title={`Row ${i + 1}`}
                onRemove={() =>
                  patch((d) => ({
                    ...d,
                    unitTypes: (d.unitTypes ?? []).filter((_, j) => j !== i),
                  }))
                }
              >
                <div className="grid gap-3 sm:grid-cols-3">
                  <CmsField label="Size label">
                    <CmsInput
                      value={u.size}
                      onChange={(e) =>
                        patch((d) => {
                          const unitTypes = [...(d.unitTypes ?? [])];
                          unitTypes[i] = { ...unitTypes[i], size: e.target.value };
                          return { ...d, unitTypes };
                        })
                      }
                    />
                  </CmsField>
                  <CmsField label="Area">
                    <CmsInput
                      value={u.area}
                      onChange={(e) =>
                        patch((d) => {
                          const unitTypes = [...(d.unitTypes ?? [])];
                          unitTypes[i] = { ...unitTypes[i], area: e.target.value };
                          return { ...d, unitTypes };
                        })
                      }
                    />
                  </CmsField>
                  <CmsField label="Ideal for">
                    <CmsInput
                      value={u.ideal}
                      onChange={(e) =>
                        patch((d) => {
                          const unitTypes = [...(d.unitTypes ?? [])];
                          unitTypes[i] = { ...unitTypes[i], ideal: e.target.value };
                          return { ...d, unitTypes };
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
                  unitTypes: [...(d.unitTypes ?? []), { size: "", area: "", ideal: "" }],
                }))
              }
            >
              + Add unit type
            </CmsGhostButton>
          </div>
        </CmsSection>

        <CmsSection
          title="Architects & consultants"
          description="Optional credits block for the design team."
          where="Project page — credits section"
          defaultOpen={false}
        >
          <CmsField label="Section title (optional)">
            <CmsInput
              value={data.architectsTitle ?? ""}
              onChange={(e) =>
                patch((d) => ({ ...d, architectsTitle: e.target.value || undefined }))
              }
            />
          </CmsField>
          <div className="space-y-4">
            {(data.architects ?? []).map((a, i) => (
              <CmsItemCard
                key={i}
                title={`Person ${i + 1}`}
                onRemove={() =>
                  patch((d) => ({
                    ...d,
                    architects: (d.architects ?? []).filter((_, j) => j !== i),
                  }))
                }
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  <CmsField label="Name">
                    <CmsInput
                      value={a.name}
                      onChange={(e) =>
                        patch((d) => {
                          const architects = [...(d.architects ?? [])];
                          architects[i] = { ...architects[i], name: e.target.value };
                          return { ...d, architects };
                        })
                      }
                    />
                  </CmsField>
                  <CmsField label="Role">
                    <CmsInput
                      value={a.role}
                      onChange={(e) =>
                        patch((d) => {
                          const architects = [...(d.architects ?? [])];
                          architects[i] = { ...architects[i], role: e.target.value };
                          return { ...d, architects };
                        })
                      }
                    />
                  </CmsField>
                </div>
                <CmsField label="Description">
                  <CmsTextarea
                    value={a.description}
                    onChange={(e) =>
                      patch((d) => {
                        const architects = [...(d.architects ?? [])];
                        architects[i] = { ...architects[i], description: e.target.value };
                        return { ...d, architects };
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
                  architects: [
                    ...(d.architects ?? []),
                    { name: "", role: "", description: "" },
                  ],
                }))
              }
            >
              + Add architect
            </CmsGhostButton>
          </div>
        </CmsSection>

        <CmsSection
          title="Image gallery"
          description="Photos visitors swipe or scroll through."
          where="Project page — image gallery section"
          defaultOpen={false}
        >
          <div className="space-y-4">
            {data.gallery.map((g, i) => (
              <CmsItemCard
                key={i}
                title={`Image ${i + 1}`}
                onRemove={() =>
                  patch((d) => ({ ...d, gallery: d.gallery.filter((_, j) => j !== i) }))
                }
              >
                <CmsField label="Gallery image">
                  <CmsImageUpload
                    value={g.src}
                    onChange={(url) =>
                      patch((d) => {
                        const gallery = [...d.gallery];
                        gallery[i] = { ...gallery[i], src: url };
                        return { ...d, gallery };
                      })
                    }
                    folder="projects/gallery"
                  />
                </CmsField>
                <CmsField label="Caption for accessibility">
                  <CmsInput
                    value={g.alt}
                    onChange={(e) =>
                      patch((d) => {
                        const gallery = [...d.gallery];
                        gallery[i] = { ...gallery[i], alt: e.target.value };
                        return { ...d, gallery };
                      })
                    }
                  />
                </CmsField>
              </CmsItemCard>
            ))}
            <CmsGhostButton
              onClick={() =>
                patch((d) => ({ ...d, gallery: [...d.gallery, { src: "", alt: "" }] }))
              }
            >
              + Add image
            </CmsGhostButton>
          </div>
        </CmsSection>
      </CmsGroup>

      {/* ── GROUP 4: Conversion ─────────────────────────────────────── */}
      <CmsGroup
        icon={<PhoneCall className="h-4 w-4" />}
        title="Conversion & enquiry"
        description="Leasing box, specs, location sidebar, enquiry form, and bottom CTA"
      >
        <CmsSection
          title="Leasing / investment box"
          description="Highlighted box in the main column (leave title empty to hide)."
          where="Project page — highlighted box in the main column"
          defaultOpen={false}
        >
          <CmsField label="Box title" hint="Leave all empty to hide this box.">
            <CmsInput
              value={data.leasingBox?.title ?? ""}
              onChange={(e) =>
                patch((d) => ({
                  ...d,
                  leasingBox: {
                    title: e.target.value,
                    intro: d.leasingBox?.intro ?? "",
                    bullets: d.leasingBox?.bullets ?? [],
                  },
                }))
              }
            />
          </CmsField>
          <CmsField label="Intro text">
            <CmsTextarea
              value={data.leasingBox?.intro ?? ""}
              onChange={(e) =>
                patch((d) => ({
                  ...d,
                  leasingBox: {
                    title: d.leasingBox?.title ?? "",
                    intro: e.target.value,
                    bullets: d.leasingBox?.bullets ?? [],
                  },
                }))
              }
            />
          </CmsField>
          <CmsField label="Bullet lines" hint="One per line.">
            <CmsTextarea
              value={(data.leasingBox?.bullets ?? []).join("\n")}
              onChange={(e) =>
                patch((d) => ({
                  ...d,
                  leasingBox: {
                    title: d.leasingBox?.title ?? "",
                    intro: d.leasingBox?.intro ?? "",
                    bullets: parseLines(e.target.value),
                  },
                }))
              }
              className="min-h-[100px]"
            />
          </CmsField>
        </CmsSection>

        <CmsSection
          title="Specifications list"
          description="Label / value pairs (area, approvals, parking…)."
          where="Project page — two-column spec list"
          defaultOpen={false}
        >
          <div className="space-y-4">
            {data.specs.map((s, i) => (
              <CmsItemCard
                key={i}
                title={`Spec ${i + 1}`}
                onRemove={() =>
                  patch((d) => ({ ...d, specs: d.specs.filter((_, j) => j !== i) }))
                }
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  <CmsField label="Label">
                    <CmsInput
                      value={s.label}
                      onChange={(e) =>
                        patch((d) => {
                          const specs = [...d.specs];
                          specs[i] = { ...specs[i], label: e.target.value };
                          return { ...d, specs };
                        })
                      }
                    />
                  </CmsField>
                  <CmsField label="Value">
                    <CmsInput
                      value={s.value}
                      onChange={(e) =>
                        patch((d) => {
                          const specs = [...d.specs];
                          specs[i] = { ...specs[i], value: e.target.value };
                          return { ...d, specs };
                        })
                      }
                    />
                  </CmsField>
                </div>
              </CmsItemCard>
            ))}
            <CmsGhostButton
              onClick={() =>
                patch((d) => ({ ...d, specs: [...d.specs, { label: "", value: "" }] }))
              }
            >
              + Add specification
            </CmsGhostButton>
          </div>
        </CmsSection>

        <CmsSection
          title="Location sidebar"
          description="Narrow column card beside the enquiry form (leave title empty to hide)."
          where="Project page — sidebar card beside the form"
          defaultOpen={false}
        >
          <CmsField label="Title (empty hides the card)">
            <CmsInput
              value={data.locationSidebar?.title ?? ""}
              onChange={(e) =>
                patch((d) => ({
                  ...d,
                  locationSidebar: {
                    title: e.target.value,
                    body: d.locationSidebar?.body ?? "",
                    badges: d.locationSidebar?.badges ?? [],
                  },
                }))
              }
            />
          </CmsField>
          <CmsField label="Body text">
            <CmsTextarea
              value={data.locationSidebar?.body ?? ""}
              onChange={(e) =>
                patch((d) => ({
                  ...d,
                  locationSidebar: {
                    title: d.locationSidebar?.title ?? "",
                    body: e.target.value,
                    badges: d.locationSidebar?.badges ?? [],
                  },
                }))
              }
            />
          </CmsField>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Small location badges
          </p>
          <div className="space-y-4">
            {(data.locationSidebar?.badges ?? []).map((b, i) => (
              <CmsItemCard
                key={i}
                title={`Badge ${i + 1}`}
                onRemove={() =>
                  patch((d) => ({
                    ...d,
                    locationSidebar: {
                      title: d.locationSidebar?.title ?? "",
                      body: d.locationSidebar?.body ?? "",
                      badges: (d.locationSidebar?.badges ?? []).filter((_, j) => j !== i),
                    },
                  }))
                }
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  <CmsField label="Icon name">
                    <CmsInput
                      value={b.icon}
                      onChange={(e) =>
                        patch((d) => {
                          const badges = [...(d.locationSidebar?.badges ?? [])];
                          badges[i] = { ...badges[i], icon: e.target.value };
                          return {
                            ...d,
                            locationSidebar: {
                              title: d.locationSidebar?.title ?? "",
                              body: d.locationSidebar?.body ?? "",
                              badges,
                            },
                          };
                        })
                      }
                    />
                  </CmsField>
                  <CmsField label="Text">
                    <CmsInput
                      value={b.text}
                      onChange={(e) =>
                        patch((d) => {
                          const badges = [...(d.locationSidebar?.badges ?? [])];
                          badges[i] = { ...badges[i], text: e.target.value };
                          return {
                            ...d,
                            locationSidebar: {
                              title: d.locationSidebar?.title ?? "",
                              body: d.locationSidebar?.body ?? "",
                              badges,
                            },
                          };
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
                  locationSidebar: {
                    title: d.locationSidebar?.title ?? "",
                    body: d.locationSidebar?.body ?? "",
                    badges: [
                      ...(d.locationSidebar?.badges ?? []),
                      { icon: "MapPin", text: "" },
                    ],
                  },
                }))
              }
            >
              + Add badge
            </CmsGhostButton>
          </div>
        </CmsSection>

        <CmsSection
          title="Sidebar enquiry form title"
          description="Heading shown above the short enquiry form."
          where="Project page — sticky sidebar on desktop"
          defaultOpen={false}
        >
          <CmsField label="Form title">
            <CmsInput
              value={data.sidebarFormTitle}
              onChange={(e) => patch((d) => ({ ...d, sidebarFormTitle: e.target.value }))}
            />
          </CmsField>
        </CmsSection>

        <CmsSection
          title="Bottom call-to-action"
          description="Wide banner asking for an enquiry at the bottom."
          where="Project page — full-width CTA near the bottom"
          defaultOpen
        >
          <CmsField label="Heading">
            <CmsInput
              value={data.cta.title}
              onChange={(e) =>
                patch((d) => ({ ...d, cta: { ...d.cta, title: e.target.value } }))
              }
            />
          </CmsField>
          <CmsField label="Supporting text">
            <CmsTextarea
              value={data.cta.description}
              onChange={(e) =>
                patch((d) => ({ ...d, cta: { ...d.cta, description: e.target.value } }))
              }
            />
          </CmsField>
          <CmsField
            label="Enquiry routing key"
            hint="Internal — ties the form to this project in your inbox tools."
          >
            <CmsInput
              value={data.cta.enquiryProject ?? ""}
              onChange={(e) =>
                patch((d) => ({
                  ...d,
                  cta: { ...d.cta, enquiryProject: e.target.value || undefined },
                }))
              }
            />
          </CmsField>
          <div className="grid gap-3 sm:grid-cols-2">
            <CmsField label="Primary button label">
              <CmsInput
                value={data.cta.primaryLabel ?? ""}
                onChange={(e) =>
                  patch((d) => ({
                    ...d,
                    cta: { ...d.cta, primaryLabel: e.target.value || undefined },
                  }))
                }
              />
            </CmsField>
            <CmsField label="Secondary button label">
              <CmsInput
                value={data.cta.secondaryLabel ?? ""}
                onChange={(e) =>
                  patch((d) => ({
                    ...d,
                    cta: { ...d.cta, secondaryLabel: e.target.value || undefined },
                  }))
                }
              />
            </CmsField>
          </div>
          <CmsField label="Secondary button link">
            <CmsInput
              value={data.cta.secondaryHref ?? ""}
              onChange={(e) =>
                patch((d) => ({
                  ...d,
                  cta: { ...d.cta, secondaryHref: e.target.value || undefined },
                }))
              }
            />
          </CmsField>
        </CmsSection>
      </CmsGroup>

      <CmsSaveBar onSave={save} status={status} label="Save project page" />
    </div>
  );
}
