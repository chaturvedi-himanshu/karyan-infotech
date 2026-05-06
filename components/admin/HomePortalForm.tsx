"use client";

import { useCallback, useEffect, useState } from "react";
import { BookOpen, Layers, MessageSquare, Megaphone } from "lucide-react";
import type { HomePayload } from "@/lib/cms/types";
import { DEFAULT_HOME_PAYLOAD } from "@/lib/cms/defaults/homePayload";
import { INDIA_PRESENCE_CITIES_SORTED } from "@/lib/cms/indiaPresenceCities";
import { migrateLegacyHomePresence } from "@/lib/cms/migrateHomePresence";
import { normalizePresenceCityIds } from "@/lib/cms/normalizePresenceCityIds";
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
  CmsSelect,
  CmsTextarea,
  deepMerge,
} from "./cms-ui";

const HOME_SECTION_CATALOG: { id: string; label: string }[] = [
  { id: "stats", label: "Stats band" },
  { id: "projects", label: "Projects slider" },
  { id: "philosophy", label: "Philosophy" },
  { id: "capabilities", label: "Capabilities" },
  { id: "presence", label: "Our Presence" },
  { id: "why", label: "Why Karyan" },
  { id: "process", label: "Process timeline" },
  { id: "testimonials", label: "Testimonials" },
  { id: "location", label: "Location intelligence" },
  { id: "about", label: "About section" },
  { id: "journal", label: "Blog carousel" },
  { id: "splitCta", label: "Call + Enquiry strip" },
];

export default function HomePortalForm() {
  const [data, setData] = useState<HomePayload | null>(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetch("/api/admin/home", { credentials: "include" })
      .then((r) => r.json())
      .then((j) => {
        const raw = (j.data ?? {}) as Record<string, unknown>;
        const merged = deepMerge(
          DEFAULT_HOME_PAYLOAD as unknown as Record<string, unknown>,
          raw
        ) as unknown as HomePayload;
        const withMigrated = migrateLegacyHomePresence(merged, raw);
        setData({
          ...withMigrated,
          presence: {
            ...withMigrated.presence,
            cityIds: normalizePresenceCityIds(withMigrated.presence.cityIds),
          },
        });
      });
  }, []);

  const patch = useCallback((fn: (d: HomePayload) => HomePayload) => {
    setData((prev) => (prev ? fn(structuredClone(prev)) : prev));
  }, []);

  async function persistHome(nextData: HomePayload, savingLabel = "Saving…") {
    const normalized: HomePayload = {
      ...nextData,
      presence: {
        ...nextData.presence,
        cityIds: normalizePresenceCityIds(nextData.presence.cityIds),
      },
    };
    setStatus(savingLabel);
    const res = await fetch("/api/admin/home", {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(normalized),
    });
    if (res.ok) setData(normalized);
    setStatus(res.ok ? "Saved successfully." : "Could not save. Try again.");
    return res.ok;
  }

  async function save() {
    if (!data) return;
    await persistHome(data);
  }

  if (!data) {
    return <CmsLoadingSkeleton label="Loading home page content…" />;
  }

  return (
    <div className="space-y-10">
      <CmsPageIntro
        title="Home page editor"
        where="Everything here appears on your public homepage at /"
      >
        Each section below matches a visible part of your homepage. Open a section, edit the
        words or images, then press "Save home page" once at the bottom.
      </CmsPageIntro>

      <CmsGroup
        icon={<Layers className="h-4 w-4" />}
        title="Section positions"
        description="Move homepage sections up/down without code changes"
      >
        <CmsSection
          title="Homepage order"
          description="Use arrows to move sections upward or downward."
          where="Home page — section sequence below hero"
          defaultOpen
        >
          <div className="space-y-3">
            {data.sectionOrder.map((id, i) => {
              const label =
                HOME_SECTION_CATALOG.find((s) => s.id === id)?.label ?? id;
              return (
                <CmsItemCard key={`${id}-${i}`} title={`${i + 1}. ${label}`}>
                  <div className="flex gap-2">
                    <CmsGhostButton
                      onClick={() =>
                        patch((d) => {
                          if (i === 0) return d;
                          const sectionOrder = [...d.sectionOrder];
                          [sectionOrder[i - 1], sectionOrder[i]] = [
                            sectionOrder[i],
                            sectionOrder[i - 1],
                          ];
                          return { ...d, sectionOrder };
                        })
                      }
                    >
                      Move up
                    </CmsGhostButton>
                    <CmsGhostButton
                      onClick={() =>
                        patch((d) => {
                          if (i === d.sectionOrder.length - 1) return d;
                          const sectionOrder = [...d.sectionOrder];
                          [sectionOrder[i], sectionOrder[i + 1]] = [
                            sectionOrder[i + 1],
                            sectionOrder[i],
                          ];
                          return { ...d, sectionOrder };
                        })
                      }
                    >
                      Move down
                    </CmsGhostButton>
                  </div>
                </CmsItemCard>
              );
            })}
          </div>
        </CmsSection>
      </CmsGroup>

      {/* ── GROUP 1: Above the fold ─────────────────────────────────── */}
      <CmsGroup
        icon={<Layers className="h-4 w-4" />}
        title="Above the fold"
        description="The first thing visitors see — hero banner and key statistics"
      >
        <CmsSection
          title="Hero carousel"
          description="Large rotating banners at the very top of the home page."
          where="Top of the home page — full-width slides with headline and Explore link"
          defaultOpen
        >
          <div className="space-y-4">
            {data.heroSlides.map((slide, i) => (
              <CmsItemCard
                key={i}
                title={`Slide ${i + 1}`}
                onRemove={
                  data.heroSlides.length > 1
                    ? () =>
                        patch((d) => ({
                          ...d,
                          heroSlides: d.heroSlides.filter((_, j) => j !== i),
                        }))
                    : undefined
                }
              >
                <CmsField label="Headline" hint="Main title visitors read first.">
                  <CmsInput
                    value={slide.title}
                    onChange={(e) =>
                      patch((d) => {
                        const heroSlides = [...d.heroSlides];
                        heroSlides[i] = { ...heroSlides[i], title: e.target.value };
                        return { ...d, heroSlides };
                      })
                    }
                  />
                </CmsField>
                <CmsField label="Supporting line" hint="Smaller text under the headline.">
                  <CmsTextarea
                    value={slide.subtitle}
                    onChange={(e) =>
                      patch((d) => {
                        const heroSlides = [...d.heroSlides];
                        heroSlides[i] = { ...heroSlides[i], subtitle: e.target.value };
                        return { ...d, heroSlides };
                      })
                    }
                  />
                </CmsField>
                <div className="grid gap-3 sm:grid-cols-2">
                  <CmsField label="Badge (e.g. Residential)" hint="Small label above the title.">
                    <CmsInput
                      value={slide.tag}
                      onChange={(e) =>
                        patch((d) => {
                          const heroSlides = [...d.heroSlides];
                          heroSlides[i] = { ...heroSlides[i], tag: e.target.value };
                          return { ...d, heroSlides };
                        })
                      }
                    />
                  </CmsField>
                  <CmsField
                    label="Internal project key"
                    hint="For your team only — links analytics to a project."
                  >
                    <CmsInput
                      value={slide.project}
                      onChange={(e) =>
                        patch((d) => {
                          const heroSlides = [...d.heroSlides];
                          heroSlides[i] = { ...heroSlides[i], project: e.target.value };
                          return { ...d, heroSlides };
                        })
                      }
                    />
                  </CmsField>
                </div>
                <CmsField
                  label='"Explore" button link'
                  hint="Paste the page path, e.g. /karyan-trevana"
                >
                  <CmsInput
                    value={slide.exploreHref}
                    onChange={(e) =>
                      patch((d) => {
                        const heroSlides = [...d.heroSlides];
                        heroSlides[i] = { ...heroSlides[i], exploreHref: e.target.value };
                        return { ...d, heroSlides };
                      })
                    }
                    placeholder="/karyan-trevana"
                  />
                </CmsField>
                <CmsField
                  label="Background image"
                  hint="Upload a file or paste a URL — this image fills the hero slide."
                >
                  <CmsImageUpload
                    value={slide.bg}
                    onChange={async (url) => {
                      if (!data) return;
                      const heroSlides = [...data.heroSlides];
                      heroSlides[i] = { ...heroSlides[i], bg: url };
                      const nextData: HomePayload = { ...data, heroSlides };
                      setData(nextData);
                      await persistHome(nextData, "Saving hero image…");
                    }}
                    folder="home/hero-slides"
                  />
                </CmsField>
              </CmsItemCard>
            ))}
            <CmsGhostButton
              onClick={() =>
                patch((d) => ({
                  ...d,
                  heroSlides: [
                    ...d.heroSlides,
                    { title: "New slide", subtitle: "", tag: "", project: "", exploreHref: "/", bg: "" },
                  ],
                }))
              }
            >
              + Add slide
            </CmsGhostButton>
          </div>
        </CmsSection>

        <CmsSection
          title="Hero side metrics"
          description="Three small facts shown next to the hero on wide screens."
          where="Beside the hero carousel on desktop — stacked on mobile"
          defaultOpen={false}
        >
          <div className="space-y-4">
            {data.heroSideStats.map((row, i) => (
              <CmsItemCard
                key={i}
                title={`Metric ${i + 1}`}
                onRemove={
                  data.heroSideStats.length > 1
                    ? () =>
                        patch((d) => ({
                          ...d,
                          heroSideStats: d.heroSideStats.filter((_, j) => j !== i),
                        }))
                    : undefined
                }
              >
                <div className="grid gap-3 sm:grid-cols-3">
                  <CmsField label="Label" hint="e.g. Developments">
                    <CmsInput
                      value={row.label}
                      onChange={(e) =>
                        patch((d) => {
                          const heroSideStats = [...d.heroSideStats];
                          heroSideStats[i] = { ...heroSideStats[i], label: e.target.value };
                          return { ...d, heroSideStats };
                        })
                      }
                    />
                  </CmsField>
                  <CmsField label="Big value" hint="e.g. 4+">
                    <CmsInput
                      value={row.value}
                      onChange={(e) =>
                        patch((d) => {
                          const heroSideStats = [...d.heroSideStats];
                          heroSideStats[i] = { ...heroSideStats[i], value: e.target.value };
                          return { ...d, heroSideStats };
                        })
                      }
                    />
                  </CmsField>
                  <CmsField label="Hint line" hint="Smaller text under the value.">
                    <CmsInput
                      value={row.hint}
                      onChange={(e) =>
                        patch((d) => {
                          const heroSideStats = [...d.heroSideStats];
                          heroSideStats[i] = { ...heroSideStats[i], hint: e.target.value };
                          return { ...d, heroSideStats };
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
                  heroSideStats: [...d.heroSideStats, { label: "", value: "", hint: "" }],
                }))
              }
            >
              + Add metric
            </CmsGhostButton>
          </div>
        </CmsSection>

        <CmsSection
          title="Highlight stat cards"
          description="The bold numbers in a row — years of experience, cities, shops, area."
          where="Home page — horizontal band of four statistics below the hero"
          defaultOpen={false}
        >
          <div className="space-y-4">
            {data.statCards.map((card, i) => (
              <CmsItemCard
                key={i}
                title={`Card ${i + 1}`}
                onRemove={
                  data.statCards.length > 1
                    ? () =>
                        patch((d) => ({
                          ...d,
                          statCards: d.statCards.filter((_, j) => j !== i),
                        }))
                    : undefined
                }
              >
                <div className="grid gap-3 sm:grid-cols-3">
                  <CmsField label="Large number or text" hint="e.g. 15+">
                    <CmsInput
                      value={card.value}
                      onChange={(e) =>
                        patch((d) => {
                          const statCards = [...d.statCards];
                          statCards[i] = { ...statCards[i], value: e.target.value };
                          return { ...d, statCards };
                        })
                      }
                    />
                  </CmsField>
                  <CmsField label="Title under the number">
                    <CmsInput
                      value={card.label}
                      onChange={(e) =>
                        patch((d) => {
                          const statCards = [...d.statCards];
                          statCards[i] = { ...statCards[i], label: e.target.value };
                          return { ...d, statCards };
                        })
                      }
                    />
                  </CmsField>
                  <CmsField label="Subtitle" hint="Smaller line (optional).">
                    <CmsInput
                      value={card.sub}
                      onChange={(e) =>
                        patch((d) => {
                          const statCards = [...d.statCards];
                          statCards[i] = { ...statCards[i], sub: e.target.value };
                          return { ...d, statCards };
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
                  statCards: [...d.statCards, { value: "", label: "", sub: "" }],
                }))
              }
            >
              + Add card
            </CmsGhostButton>
          </div>
        </CmsSection>
      </CmsGroup>

      {/* ── GROUP 2: Brand & voice ──────────────────────────────────── */}
      <CmsGroup
        icon={<MessageSquare className="h-4 w-4" />}
        title="Brand & voice"
        description="Your positioning, capabilities, and core reasons to believe"
      >
        <CmsSection
          title="Philosophy"
          description="Your positioning paragraph — the brand's tone of voice."
          where="Home page — editorial block with badge and long paragraph"
          defaultOpen={false}
        >
          <CmsField label="Small badge" hint='Word above the heading, e.g. "Philosophy".'>
            <CmsInput
              value={data.philosophy.badge}
              onChange={(e) =>
                patch((d) => ({ ...d, philosophy: { ...d.philosophy, badge: e.target.value } }))
              }
            />
          </CmsField>
          <CmsField label="Section heading">
            <CmsInput
              value={data.philosophy.title}
              onChange={(e) =>
                patch((d) => ({ ...d, philosophy: { ...d.philosophy, title: e.target.value } }))
              }
            />
          </CmsField>
          <CmsField label="Body copy">
            <CmsTextarea
              value={data.philosophy.body}
              onChange={(e) =>
                patch((d) => ({ ...d, philosophy: { ...d.philosophy, body: e.target.value } }))
              }
            />
          </CmsField>
        </CmsSection>

        <CmsSection
          title="Capabilities"
          description="Intro heading and four service pillars with icons."
          where='Home page — "Capabilities" band with icon cards'
          defaultOpen={false}
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <CmsField label="Eyebrow" hint="Small word above the heading.">
              <CmsInput
                value={data.capabilitiesIntro.eyebrow}
                onChange={(e) =>
                  patch((d) => ({
                    ...d,
                    capabilitiesIntro: { ...d.capabilitiesIntro, eyebrow: e.target.value },
                  }))
                }
              />
            </CmsField>
            <CmsField label="Section heading">
              <CmsInput
                value={data.capabilitiesIntro.title}
                onChange={(e) =>
                  patch((d) => ({
                    ...d,
                    capabilitiesIntro: { ...d.capabilitiesIntro, title: e.target.value },
                  }))
                }
              />
            </CmsField>
          </div>
          <div className="space-y-4">
            {data.capabilities.map((c, i) => (
              <CmsItemCard
                key={i}
                title={`Card ${i + 1}`}
                onRemove={() =>
                  patch((d) => ({
                    ...d,
                    capabilities: d.capabilities.filter((_, j) => j !== i),
                  }))
                }
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  <CmsField
                    label="Icon name"
                    hint="Internal key (e.g. Layers, Gem) — ask your web team if unsure."
                  >
                    <CmsInput
                      value={c.icon}
                      onChange={(e) =>
                        patch((d) => {
                          const capabilities = [...d.capabilities];
                          capabilities[i] = { ...capabilities[i], icon: e.target.value };
                          return { ...d, capabilities };
                        })
                      }
                    />
                  </CmsField>
                  <CmsField label="Title">
                    <CmsInput
                      value={c.title}
                      onChange={(e) =>
                        patch((d) => {
                          const capabilities = [...d.capabilities];
                          capabilities[i] = { ...capabilities[i], title: e.target.value };
                          return { ...d, capabilities };
                        })
                      }
                    />
                  </CmsField>
                </div>
                <CmsField label="Description">
                  <CmsTextarea
                    value={c.text}
                    onChange={(e) =>
                      patch((d) => {
                        const capabilities = [...d.capabilities];
                        capabilities[i] = { ...capabilities[i], text: e.target.value };
                        return { ...d, capabilities };
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
                  capabilities: [...d.capabilities, { title: "", text: "", icon: "Layers" }],
                }))
              }
            >
              + Add capability
            </CmsGhostButton>
          </div>
        </CmsSection>

        <CmsSection
          title="Why Karyan"
          description="Section intro and the pillar cards."
          where='Home page — "Why Karyan" with three reasons'
          defaultOpen={false}
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <CmsField label="Eyebrow">
              <CmsInput
                value={data.whyIntro.eyebrow}
                onChange={(e) =>
                  patch((d) => ({ ...d, whyIntro: { ...d.whyIntro, eyebrow: e.target.value } }))
                }
              />
            </CmsField>
            <CmsField label="Heading">
              <CmsInput
                value={data.whyIntro.title}
                onChange={(e) =>
                  patch((d) => ({ ...d, whyIntro: { ...d.whyIntro, title: e.target.value } }))
                }
              />
            </CmsField>
          </div>
          <div className="space-y-4">
            {data.pillars.map((p, i) => (
              <CmsItemCard
                key={i}
                title={`Pillar ${i + 1}`}
                onRemove={() =>
                  patch((d) => ({ ...d, pillars: d.pillars.filter((_, j) => j !== i) }))
                }
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  <CmsField label="Icon name">
                    <CmsInput
                      value={p.icon}
                      onChange={(e) =>
                        patch((d) => {
                          const pillars = [...d.pillars];
                          pillars[i] = { ...pillars[i], icon: e.target.value };
                          return { ...d, pillars };
                        })
                      }
                    />
                  </CmsField>
                  <CmsField label="Title">
                    <CmsInput
                      value={p.title}
                      onChange={(e) =>
                        patch((d) => {
                          const pillars = [...d.pillars];
                          pillars[i] = { ...pillars[i], title: e.target.value };
                          return { ...d, pillars };
                        })
                      }
                    />
                  </CmsField>
                </div>
                <CmsField label="Text">
                  <CmsTextarea
                    value={p.text}
                    onChange={(e) =>
                      patch((d) => {
                        const pillars = [...d.pillars];
                        pillars[i] = { ...pillars[i], text: e.target.value };
                        return { ...d, pillars };
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
                  pillars: [...d.pillars, { title: "", text: "", icon: "Sparkles" }],
                }))
              }
            >
              + Add pillar
            </CmsGhostButton>
          </div>
        </CmsSection>

        <CmsSection
          title="Commitments"
          description="Heading and checklist of promises."
          where="Home page — checklist-style commitments band"
          defaultOpen={false}
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <CmsField label="Eyebrow">
              <CmsInput
                value={data.promisesIntro.eyebrow}
                onChange={(e) =>
                  patch((d) => ({
                    ...d,
                    promisesIntro: { ...d.promisesIntro, eyebrow: e.target.value },
                  }))
                }
              />
            </CmsField>
            <CmsField label="Heading">
              <CmsInput
                value={data.promisesIntro.title}
                onChange={(e) =>
                  patch((d) => ({
                    ...d,
                    promisesIntro: { ...d.promisesIntro, title: e.target.value },
                  }))
                }
              />
            </CmsField>
          </div>
          <CmsField label="Bullet lines" hint="One promise per line.">
            <CmsTextarea
              value={data.promises.join("\n")}
              onChange={(e) =>
                patch((d) => ({
                  ...d,
                  promises: e.target.value
                    .split("\n")
                    .map((x) => x.trim())
                    .filter(Boolean),
                }))
              }
              className="min-h-[160px]"
            />
          </CmsField>
        </CmsSection>
      </CmsGroup>

      {/* ── GROUP 3: Content sections ───────────────────────────────── */}
      <CmsGroup
        icon={<BookOpen className="h-4 w-4" />}
        title="Content sections"
        description="Portfolio, process, testimonials, FAQs, location, and About section"
      >
        <CmsSection
          title="Our Presence"
          description="India map with golden city markers. Edit all text and add/remove cities — the map updates automatically."
          where="Home page — full-width presence section below the project slider"
          defaultOpen
        >
          <div className="grid gap-3 sm:grid-cols-3">
            <CmsField label="Eyebrow" hint="Small text above the heading, e.g. Our reach.">
              <CmsInput
                value={data.presence.eyebrow ?? ""}
                onChange={(e) =>
                  patch((d) => ({
                    ...d,
                    presence: { ...d.presence, eyebrow: e.target.value },
                  }))
                }
                placeholder="Our reach"
              />
            </CmsField>
            <CmsField label="Heading" hint="Large display heading, e.g. Our Presence.">
              <CmsInput
                value={data.presence.heading}
                onChange={(e) =>
                  patch((d) => ({
                    ...d,
                    presence: { ...d.presence, heading: e.target.value },
                  }))
                }
                placeholder="Our Presence"
              />
            </CmsField>
          </div>
          <CmsField label="Subheading" hint="One sentence below the heading.">
            <CmsInput
              value={data.presence.subheading ?? ""}
              onChange={(e) =>
                patch((d) => ({
                  ...d,
                  presence: { ...d.presence, subheading: e.target.value },
                }))
              }
              placeholder="From NCR to the coast — Karyan developments spanning 13+ cities."
            />
          </CmsField>

          <div className="mt-6 border-t border-slate-200 pt-6">
            <p className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-500">
              Cities on the map
            </p>
            <div className="space-y-3">
              {data.presence.cityIds.map((cityId, i) => (
                <CmsItemCard
                  key={`p-${i}-${cityId || "empty"}`}
                  title={`City ${i + 1}`}
                  onRemove={() =>
                    patch((d) => ({
                      ...d,
                      presence: {
                        ...d.presence,
                        cityIds: d.presence.cityIds.filter((_, j) => j !== i),
                      },
                    }))
                  }
                >
                  <CmsField label="City" hint="Selecting a city places a golden marker on the India map.">
                    <CmsSelect
                      value={cityId}
                      onChange={(e) =>
                        patch((d) => {
                          const cityIds = [...d.presence.cityIds];
                          cityIds[i] = e.target.value;
                          return { ...d, presence: { ...d.presence, cityIds } };
                        })
                      }
                    >
                      <option value="">Select city…</option>
                      {INDIA_PRESENCE_CITIES_SORTED.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.label}
                        </option>
                      ))}
                    </CmsSelect>
                  </CmsField>
                </CmsItemCard>
              ))}
              <CmsGhostButton
                onClick={() =>
                  patch((d) => ({
                    ...d,
                    presence: {
                      ...d.presence,
                      cityIds: [...d.presence.cityIds, ""],
                    },
                  }))
                }
              >
                + Add city
              </CmsGhostButton>
            </div>
          </div>
        </CmsSection>

        <CmsSection
          title="Process steps"
          description="The numbered steps (Discover → Handover)."
          where='Home page — "Simple steps" timeline'
          defaultOpen={false}
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <CmsField label="Eyebrow">
              <CmsInput
                value={data.processIntro.eyebrow}
                onChange={(e) =>
                  patch((d) => ({
                    ...d,
                    processIntro: { ...d.processIntro, eyebrow: e.target.value },
                  }))
                }
              />
            </CmsField>
            <CmsField label="Heading">
              <CmsInput
                value={data.processIntro.title}
                onChange={(e) =>
                  patch((d) => ({
                    ...d,
                    processIntro: { ...d.processIntro, title: e.target.value },
                  }))
                }
              />
            </CmsField>
          </div>
          <div className="space-y-4">
            {data.process.map((step, i) => (
              <CmsItemCard
                key={i}
                title={`Step ${i + 1}`}
                onRemove={() =>
                  patch((d) => ({ ...d, process: d.process.filter((_, j) => j !== i) }))
                }
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  <CmsField label="Step number" hint="e.g. 01">
                    <CmsInput
                      value={step.step}
                      onChange={(e) =>
                        patch((d) => {
                          const process = [...d.process];
                          process[i] = { ...process[i], step: e.target.value };
                          return { ...d, process };
                        })
                      }
                    />
                  </CmsField>
                  <CmsField label="Title">
                    <CmsInput
                      value={step.title}
                      onChange={(e) =>
                        patch((d) => {
                          const process = [...d.process];
                          process[i] = { ...process[i], title: e.target.value };
                          return { ...d, process };
                        })
                      }
                    />
                  </CmsField>
                </div>
                <CmsField label="Description">
                  <CmsTextarea
                    value={step.body}
                    onChange={(e) =>
                      patch((d) => {
                        const process = [...d.process];
                        process[i] = { ...process[i], body: e.target.value };
                        return { ...d, process };
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
                  process: [...d.process, { step: "", title: "", body: "" }],
                }))
              }
            >
              + Add step
            </CmsGhostButton>
          </div>
        </CmsSection>

        <CmsSection
          title="Testimonials"
          description="Quotes from clients or partners."
          where='Home page — "Voices" slider or cards'
          defaultOpen={false}
        >
          <div className="grid gap-3 sm:grid-cols-3">
            <CmsField label="Eyebrow">
              <CmsInput
                value={data.testimonialsIntro.eyebrow}
                onChange={(e) =>
                  patch((d) => ({
                    ...d,
                    testimonialsIntro: { ...d.testimonialsIntro, eyebrow: e.target.value },
                  }))
                }
              />
            </CmsField>
            <CmsField label="Heading">
              <CmsInput
                value={data.testimonialsIntro.title}
                onChange={(e) =>
                  patch((d) => ({
                    ...d,
                    testimonialsIntro: { ...d.testimonialsIntro, title: e.target.value },
                  }))
                }
              />
            </CmsField>
            <CmsField label="Badge text">
              <CmsInput
                value={data.testimonialsIntro.badge}
                onChange={(e) =>
                  patch((d) => ({
                    ...d,
                    testimonialsIntro: { ...d.testimonialsIntro, badge: e.target.value },
                  }))
                }
              />
            </CmsField>
          </div>
          <div className="space-y-4">
            {data.testimonials.map((t, i) => (
              <CmsItemCard
                key={i}
                title={`Quote ${i + 1}`}
                onRemove={() =>
                  patch((d) => ({
                    ...d,
                    testimonials: d.testimonials.filter((_, j) => j !== i),
                  }))
                }
              >
                <CmsField label="Quote">
                  <CmsTextarea
                    value={t.quote}
                    onChange={(e) =>
                      patch((d) => {
                        const testimonials = [...d.testimonials];
                        testimonials[i] = { ...testimonials[i], quote: e.target.value };
                        return { ...d, testimonials };
                      })
                    }
                  />
                </CmsField>
                <div className="grid gap-3 sm:grid-cols-2">
                  <CmsField label="Name">
                    <CmsInput
                      value={t.name}
                      onChange={(e) =>
                        patch((d) => {
                          const testimonials = [...d.testimonials];
                          testimonials[i] = { ...testimonials[i], name: e.target.value };
                          return { ...d, testimonials };
                        })
                      }
                    />
                  </CmsField>
                  <CmsField label="Role / context">
                    <CmsInput
                      value={t.role}
                      onChange={(e) =>
                        patch((d) => {
                          const testimonials = [...d.testimonials];
                          testimonials[i] = { ...testimonials[i], role: e.target.value };
                          return { ...d, testimonials };
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
                  testimonials: [...d.testimonials, { quote: "", name: "", role: "" }],
                }))
              }
            >
              + Add testimonial
            </CmsGhostButton>
          </div>
        </CmsSection>

        <CmsSection
          title="Frequently asked questions"
          description="Questions and answers for buyers."
          where="Home page — FAQ accordion before the footer"
          defaultOpen={false}
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <CmsField label="Eyebrow">
              <CmsInput
                value={data.faqIntro.eyebrow}
                onChange={(e) =>
                  patch((d) => ({ ...d, faqIntro: { ...d.faqIntro, eyebrow: e.target.value } }))
                }
              />
            </CmsField>
            <CmsField label="Heading">
              <CmsInput
                value={data.faqIntro.title}
                onChange={(e) =>
                  patch((d) => ({ ...d, faqIntro: { ...d.faqIntro, title: e.target.value } }))
                }
              />
            </CmsField>
          </div>
          <div className="space-y-4">
            {data.faqs.map((faq, i) => (
              <CmsItemCard
                key={i}
                title={`Question ${i + 1}`}
                onRemove={() =>
                  patch((d) => ({ ...d, faqs: d.faqs.filter((_, j) => j !== i) }))
                }
              >
                <CmsField label="Question">
                  <CmsInput
                    value={faq.q}
                    onChange={(e) =>
                      patch((d) => {
                        const faqs = [...d.faqs];
                        faqs[i] = { ...faqs[i], q: e.target.value };
                        return { ...d, faqs };
                      })
                    }
                  />
                </CmsField>
                <CmsField label="Answer">
                  <CmsTextarea
                    value={faq.a}
                    onChange={(e) =>
                      patch((d) => {
                        const faqs = [...d.faqs];
                        faqs[i] = { ...faqs[i], a: e.target.value };
                        return { ...d, faqs };
                      })
                    }
                  />
                </CmsField>
              </CmsItemCard>
            ))}
            <CmsGhostButton
              onClick={() =>
                patch((d) => ({ ...d, faqs: [...d.faqs, { q: "", a: "" }] }))
              }
            >
              + Add question
            </CmsGhostButton>
          </div>
        </CmsSection>

        <CmsSection
          title="Location story"
          description="Corridor narrative, highlight bullets, and the corridor table."
          where='Home page — "Location intelligence" band above amenities'
          defaultOpen={false}
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <CmsField label="Eyebrow">
              <CmsInput
                value={data.location.eyebrow}
                onChange={(e) =>
                  patch((d) => ({ ...d, location: { ...d.location, eyebrow: e.target.value } }))
                }
              />
            </CmsField>
            <CmsField label="Heading">
              <CmsInput
                value={data.location.title}
                onChange={(e) =>
                  patch((d) => ({ ...d, location: { ...d.location, title: e.target.value } }))
                }
              />
            </CmsField>
          </div>
          <CmsField label="Body">
            <CmsTextarea
              value={data.location.body}
              onChange={(e) =>
                patch((d) => ({ ...d, location: { ...d.location, body: e.target.value } }))
              }
            />
          </CmsField>
          <CmsField label="Corridors table title">
            <CmsInput
              value={data.location.corridorsTitle}
              onChange={(e) =>
                patch((d) => ({
                  ...d,
                  location: { ...d.location, corridorsTitle: e.target.value },
                }))
              }
            />
          </CmsField>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Highlight bullets
          </p>
          <div className="space-y-4">
            {data.location.bullets.map((b, i) => (
              <CmsItemCard
                key={i}
                title={`Bullet ${i + 1}`}
                onRemove={() =>
                  patch((d) => ({
                    ...d,
                    location: {
                      ...d.location,
                      bullets: d.location.bullets.filter((_, j) => j !== i),
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
                          const bullets = [...d.location.bullets];
                          bullets[i] = { ...bullets[i], icon: e.target.value };
                          return { ...d, location: { ...d.location, bullets } };
                        })
                      }
                    />
                  </CmsField>
                  <CmsField label="Text">
                    <CmsInput
                      value={b.text}
                      onChange={(e) =>
                        patch((d) => {
                          const bullets = [...d.location.bullets];
                          bullets[i] = { ...bullets[i], text: e.target.value };
                          return { ...d, location: { ...d.location, bullets } };
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
                  location: {
                    ...d.location,
                    bullets: [...d.location.bullets, { icon: "MapPin", text: "" }],
                  },
                }))
              }
            >
              + Add bullet
            </CmsGhostButton>
          </div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Corridor rows
          </p>
          <div className="space-y-4">
            {data.location.corridors.map((c, i) => (
              <CmsItemCard
                key={i}
                title={`Row ${i + 1}`}
                onRemove={() =>
                  patch((d) => ({
                    ...d,
                    location: {
                      ...d.location,
                      corridors: d.location.corridors.filter((_, j) => j !== i),
                    },
                  }))
                }
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  <CmsField label="Corridor name">
                    <CmsInput
                      value={c.corridor}
                      onChange={(e) =>
                        patch((d) => {
                          const corridors = [...d.location.corridors];
                          corridors[i] = { ...corridors[i], corridor: e.target.value };
                          return { ...d, location: { ...d.location, corridors } };
                        })
                      }
                    />
                  </CmsField>
                  <CmsField label="Projects text">
                    <CmsInput
                      value={c.projects}
                      onChange={(e) =>
                        patch((d) => {
                          const corridors = [...d.location.corridors];
                          corridors[i] = { ...corridors[i], projects: e.target.value };
                          return { ...d, location: { ...d.location, corridors } };
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
                  location: {
                    ...d.location,
                    corridors: [...d.location.corridors, { corridor: "", projects: "" }],
                  },
                }))
              }
            >
              + Add corridor row
            </CmsGhostButton>
          </div>
        </CmsSection>

        <CmsSection
          title="About section"
          description="Left image, intro copy, and highlights for the About block on home page."
          where='Home page — section replacing "Product craft"'
          defaultOpen={false}
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <CmsField label="Eyebrow">
              <CmsInput
                value={data.aboutSection.eyebrow}
                onChange={(e) =>
                  patch((d) => ({
                    ...d,
                    aboutSection: { ...d.aboutSection, eyebrow: e.target.value },
                  }))
                }
              />
            </CmsField>
            <CmsField label="Heading">
              <CmsInput
                value={data.aboutSection.title}
                onChange={(e) =>
                  patch((d) => ({
                    ...d,
                    aboutSection: { ...d.aboutSection, title: e.target.value },
                  }))
                }
              />
            </CmsField>
          </div>
          <CmsField label="Description">
            <CmsTextarea
              value={data.aboutSection.description}
              onChange={(e) =>
                patch((d) => ({
                  ...d,
                  aboutSection: { ...d.aboutSection, description: e.target.value },
                }))
              }
              className="min-h-[120px]"
            />
          </CmsField>
          <div className="grid gap-3 sm:grid-cols-2">
            <CmsField label="Left image">
              <CmsImageUpload
                value={data.aboutSection.logoSrc}
                onChange={(url) =>
                  patch((d) => ({
                    ...d,
                    aboutSection: { ...d.aboutSection, logoSrc: url },
                  }))
                }
                folder="home/about"
                accept="image/png,image/jpeg,image/webp,image/svg+xml"
              />
            </CmsField>
            <CmsField label="Image alt text">
              <CmsInput
                value={data.aboutSection.logoAlt}
                onChange={(e) =>
                  patch((d) => ({
                    ...d,
                    aboutSection: { ...d.aboutSection, logoAlt: e.target.value },
                  }))
                }
              />
            </CmsField>
          </div>
          <CmsField label="Highlight lines" hint="One point per line.">
            <CmsTextarea
              value={data.aboutSection.points.join("\n")}
              onChange={(e) =>
                patch((d) => ({
                  ...d,
                  aboutSection: {
                    ...d.aboutSection,
                    points: e.target.value
                      .split("\n")
                      .map((x) => x.trim())
                      .filter(Boolean),
                  },
                }))
              }
              className="min-h-[140px]"
            />
          </CmsField>
        </CmsSection>
      </CmsGroup>

      {/* ── GROUP 4: Conversion ─────────────────────────────────────── */}
      <CmsGroup
        icon={<Megaphone className="h-4 w-4" />}
        title="Conversion & contact"
        description="Journal teaser, contact strips, and the final call-to-action"
      >
        <CmsSection
          title="Journal teaser"
          description="Heading for the blog strip and up to three teaser links."
          where="Home page — links toward /blog before the ecosystem strip"
          defaultOpen={false}
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <CmsField label="Eyebrow">
              <CmsInput
                value={data.journalIntro.eyebrow}
                onChange={(e) =>
                  patch((d) => ({
                    ...d,
                    journalIntro: { ...d.journalIntro, eyebrow: e.target.value },
                  }))
                }
              />
            </CmsField>
            <CmsField label="Heading">
              <CmsInput
                value={data.journalIntro.title}
                onChange={(e) =>
                  patch((d) => ({
                    ...d,
                    journalIntro: { ...d.journalIntro, title: e.target.value },
                  }))
                }
              />
            </CmsField>
            <CmsField label="Button label">
              <CmsInput
                value={data.journalIntro.ctaLabel}
                onChange={(e) =>
                  patch((d) => ({
                    ...d,
                    journalIntro: { ...d.journalIntro, ctaLabel: e.target.value },
                  }))
                }
              />
            </CmsField>
            <CmsField label="Button link">
              <CmsInput
                value={data.journalIntro.ctaHref}
                onChange={(e) =>
                  patch((d) => ({
                    ...d,
                    journalIntro: { ...d.journalIntro, ctaHref: e.target.value },
                  }))
                }
              />
            </CmsField>
          </div>
          <div className="space-y-4">
            {data.journalTeasers.map((t, i) => (
              <CmsItemCard
                key={i}
                title={`Teaser ${i + 1}`}
                onRemove={() =>
                  patch((d) => ({
                    ...d,
                    journalTeasers: d.journalTeasers.filter((_, j) => j !== i),
                  }))
                }
              >
                <div className="grid gap-3 sm:grid-cols-3">
                  <CmsField label="Title">
                    <CmsInput
                      value={t.title}
                      onChange={(e) =>
                        patch((d) => {
                          const journalTeasers = [...d.journalTeasers];
                          journalTeasers[i] = { ...journalTeasers[i], title: e.target.value };
                          return { ...d, journalTeasers };
                        })
                      }
                    />
                  </CmsField>
                  <CmsField label="Hint line">
                    <CmsInput
                      value={t.hint}
                      onChange={(e) =>
                        patch((d) => {
                          const journalTeasers = [...d.journalTeasers];
                          journalTeasers[i] = { ...journalTeasers[i], hint: e.target.value };
                          return { ...d, journalTeasers };
                        })
                      }
                    />
                  </CmsField>
                  <CmsField label="Link">
                    <CmsInput
                      value={t.href}
                      onChange={(e) =>
                        patch((d) => {
                          const journalTeasers = [...d.journalTeasers];
                          journalTeasers[i] = { ...journalTeasers[i], href: e.target.value };
                          return { ...d, journalTeasers };
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
                  journalTeasers: [
                    ...d.journalTeasers,
                    { title: "", href: "/blog", hint: "" },
                  ],
                }))
              }
            >
              + Add teaser
            </CmsGhostButton>
          </div>
        </CmsSection>

        <CmsSection
          title="Ecosystem strip"
          description="Partner narrative and keyword chips."
          where="Home page — slim band above the split contact section"
          defaultOpen={false}
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <CmsField label="Eyebrow">
              <CmsInput
                value={data.ecosystem.eyebrow}
                onChange={(e) =>
                  patch((d) => ({
                    ...d,
                    ecosystem: { ...d.ecosystem, eyebrow: e.target.value },
                  }))
                }
              />
            </CmsField>
            <CmsField label="Tags" hint="Comma-separated chips (e.g. Design, Structure, MEP).">
              <CmsInput
                value={data.ecosystem.tags.join(", ")}
                onChange={(e) =>
                  patch((d) => ({
                    ...d,
                    ecosystem: {
                      ...d.ecosystem,
                      tags: e.target.value
                        .split(",")
                        .map((x) => x.trim())
                        .filter(Boolean),
                    },
                  }))
                }
              />
            </CmsField>
          </div>
          <CmsField label="Body">
            <CmsTextarea
              value={data.ecosystem.body}
              onChange={(e) =>
                patch((d) => ({ ...d, ecosystem: { ...d.ecosystem, body: e.target.value } }))
              }
            />
          </CmsField>
        </CmsSection>

        <CmsSection
          title="Split contact strip"
          description="Phone block on the left and enquiry prompt on the right."
          where="Home page — two-column strip above the final banner"
          defaultOpen={false}
        >
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/50 p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Left column — phone
              </p>
              <CmsField label="Eyebrow">
                <CmsInput
                  value={data.splitCta.leftEyebrow}
                  onChange={(e) =>
                    patch((d) => ({
                      ...d,
                      splitCta: { ...d.splitCta, leftEyebrow: e.target.value },
                    }))
                  }
                />
              </CmsField>
              <CmsField label="Title">
                <CmsInput
                  value={data.splitCta.leftTitle}
                  onChange={(e) =>
                    patch((d) => ({
                      ...d,
                      splitCta: { ...d.splitCta, leftTitle: e.target.value },
                    }))
                  }
                />
              </CmsField>
              <CmsField label="Phone number (display)">
                <CmsInput
                  value={data.splitCta.phone}
                  onChange={(e) =>
                    patch((d) => ({
                      ...d,
                      splitCta: { ...d.splitCta, phone: e.target.value },
                    }))
                  }
                />
              </CmsField>
              <CmsField label="Phone link" hint="tel:+91…">
                <CmsInput
                  value={data.splitCta.phoneHref}
                  onChange={(e) =>
                    patch((d) => ({
                      ...d,
                      splitCta: { ...d.splitCta, phoneHref: e.target.value },
                    }))
                  }
                />
              </CmsField>
              <CmsField label="Hours line">
                <CmsTextarea
                  value={data.splitCta.hours}
                  onChange={(e) =>
                    patch((d) => ({
                      ...d,
                      splitCta: { ...d.splitCta, hours: e.target.value },
                    }))
                  }
                  className="min-h-[72px]"
                />
              </CmsField>
            </div>
            <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/50 p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Right column — enquiry
              </p>
              <CmsField label="Title">
                <CmsInput
                  value={data.splitCta.rightTitle}
                  onChange={(e) =>
                    patch((d) => ({
                      ...d,
                      splitCta: { ...d.splitCta, rightTitle: e.target.value },
                    }))
                  }
                />
              </CmsField>
              <CmsField label="Body">
                <CmsTextarea
                  value={data.splitCta.rightBody}
                  onChange={(e) =>
                    patch((d) => ({
                      ...d,
                      splitCta: { ...d.splitCta, rightBody: e.target.value },
                    }))
                  }
                />
              </CmsField>
              <CmsField label="Button label">
                <CmsInput
                  value={data.splitCta.rightCtaLabel}
                  onChange={(e) =>
                    patch((d) => ({
                      ...d,
                      splitCta: { ...d.splitCta, rightCtaLabel: e.target.value },
                    }))
                  }
                />
              </CmsField>
            </div>
          </div>
        </CmsSection>

        <CmsSection
          title="Final banner"
          description="Last invitation before the site footer."
          where="Bottom of the home page — full-width call-to-action"
          defaultOpen
        >
          <CmsField label="Heading">
            <CmsInput
              value={data.finalCta.title}
              onChange={(e) =>
                patch((d) => ({ ...d, finalCta: { ...d.finalCta, title: e.target.value } }))
              }
            />
          </CmsField>
          <CmsField label="Supporting text">
            <CmsTextarea
              value={data.finalCta.body}
              onChange={(e) =>
                patch((d) => ({ ...d, finalCta: { ...d.finalCta, body: e.target.value } }))
              }
            />
          </CmsField>
          <div className="grid gap-3 sm:grid-cols-2">
            <CmsField label="Primary button label">
              <CmsInput
                value={data.finalCta.primaryLabel}
                onChange={(e) =>
                  patch((d) => ({
                    ...d,
                    finalCta: { ...d.finalCta, primaryLabel: e.target.value },
                  }))
                }
              />
            </CmsField>
            <CmsField label="Secondary button label">
              <CmsInput
                value={data.finalCta.secondaryLabel}
                onChange={(e) =>
                  patch((d) => ({
                    ...d,
                    finalCta: { ...d.finalCta, secondaryLabel: e.target.value },
                  }))
                }
              />
            </CmsField>
          </div>
          <CmsField label="Secondary button link">
            <CmsInput
              value={data.finalCta.secondaryHref}
              onChange={(e) =>
                patch((d) => ({
                  ...d,
                  finalCta: { ...d.finalCta, secondaryHref: e.target.value },
                }))
              }
              placeholder="/projects"
            />
          </CmsField>
        </CmsSection>
      </CmsGroup>

      <CmsSaveBar onSave={save} status={status} label="Save home page" />
    </div>
  );
}
