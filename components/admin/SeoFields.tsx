"use client";

import type { SeoConfig } from "@/lib/cms/types";
import {
  CmsField,
  CmsGhostButton,
  CmsInput,
  CmsItemCard,
  CmsTextarea,
} from "@/components/admin/cms-ui";

export default function SeoFields({
  value,
  onChange,
}: {
  value: SeoConfig | undefined;
  onChange: (next: SeoConfig) => void;
}) {
  const seo: SeoConfig = value ?? {};

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <CmsField label="Canonical URL">
          <CmsInput
            value={seo.canonical ?? ""}
            onChange={(e) => onChange({ ...seo, canonical: e.target.value })}
            placeholder="https://example.com/page"
          />
        </CmsField>
        <CmsField label="Robots" hint="Example: index,follow or noindex,nofollow">
          <CmsInput
            value={seo.robots ?? ""}
            onChange={(e) => onChange({ ...seo, robots: e.target.value })}
          />
        </CmsField>
      </div>
      <CmsField label="Keywords (comma separated)">
        <CmsTextarea
          rows={3}
          value={seo.keywords ?? ""}
          onChange={(e) => onChange({ ...seo, keywords: e.target.value })}
          placeholder="real estate, ncr projects, commercial property"
        />
      </CmsField>

      <CmsField label="Hreflang URLs">
        <div className="space-y-3">
          {(seo.hreflangs ?? []).map((row, i) => (
            <CmsItemCard
              key={`${row.lang}-${i}`}
              title={`Hreflang ${i + 1}`}
              onRemove={() =>
                onChange({
                  ...seo,
                  hreflangs: (seo.hreflangs ?? []).filter((_, j) => j !== i),
                })
              }
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <CmsField label="Language code">
                  <CmsInput
                    value={row.lang}
                    onChange={(e) => {
                      const hreflangs = [...(seo.hreflangs ?? [])];
                      hreflangs[i] = { ...hreflangs[i], lang: e.target.value };
                      onChange({ ...seo, hreflangs });
                    }}
                    placeholder="en-IN"
                  />
                </CmsField>
                <CmsField label="URL">
                  <CmsInput
                    value={row.url}
                    onChange={(e) => {
                      const hreflangs = [...(seo.hreflangs ?? [])];
                      hreflangs[i] = { ...hreflangs[i], url: e.target.value };
                      onChange({ ...seo, hreflangs });
                    }}
                    placeholder="https://example.com/en/page"
                  />
                </CmsField>
              </div>
            </CmsItemCard>
          ))}
          <CmsGhostButton
            onClick={() =>
              onChange({
                ...seo,
                hreflangs: [...(seo.hreflangs ?? []), { lang: "", url: "" }],
              })
            }
          >
            + Add hreflang
          </CmsGhostButton>
        </div>
      </CmsField>

      <CmsField label="Open Graph">
        <div className="grid gap-3 sm:grid-cols-2">
          <CmsInput
            value={seo.openGraph?.title ?? ""}
            onChange={(e) =>
              onChange({ ...seo, openGraph: { ...(seo.openGraph ?? {}), title: e.target.value } })
            }
            placeholder="OG title"
          />
          <CmsInput
            value={seo.openGraph?.type ?? ""}
            onChange={(e) =>
              onChange({ ...seo, openGraph: { ...(seo.openGraph ?? {}), type: e.target.value } })
            }
            placeholder="website"
          />
          <CmsInput
            value={seo.openGraph?.image ?? ""}
            onChange={(e) =>
              onChange({ ...seo, openGraph: { ...(seo.openGraph ?? {}), image: e.target.value } })
            }
            placeholder="https://.../og-image.jpg"
          />
          <CmsInput
            value={seo.openGraph?.url ?? ""}
            onChange={(e) =>
              onChange({ ...seo, openGraph: { ...(seo.openGraph ?? {}), url: e.target.value } })
            }
            placeholder="https://example.com/page"
          />
          <CmsInput
            value={seo.openGraph?.siteName ?? ""}
            onChange={(e) =>
              onChange({
                ...seo,
                openGraph: { ...(seo.openGraph ?? {}), siteName: e.target.value },
              })
            }
            placeholder="Site name"
          />
          <CmsInput
            value={seo.openGraph?.locale ?? ""}
            onChange={(e) =>
              onChange({
                ...seo,
                openGraph: { ...(seo.openGraph ?? {}), locale: e.target.value },
              })
            }
            placeholder="en_IN"
          />
        </div>
        <div className="mt-3">
          <CmsTextarea
            rows={3}
            value={seo.openGraph?.description ?? ""}
            onChange={(e) =>
              onChange({
                ...seo,
                openGraph: { ...(seo.openGraph ?? {}), description: e.target.value },
              })
            }
            placeholder="OG description"
          />
        </div>
      </CmsField>

      <CmsField label="Twitter">
        <div className="grid gap-3 sm:grid-cols-2">
          <CmsInput
            value={seo.twitter?.card ?? ""}
            onChange={(e) =>
              onChange({ ...seo, twitter: { ...(seo.twitter ?? {}), card: e.target.value } })
            }
            placeholder="summary_large_image"
          />
          <CmsInput
            value={seo.twitter?.title ?? ""}
            onChange={(e) =>
              onChange({ ...seo, twitter: { ...(seo.twitter ?? {}), title: e.target.value } })
            }
            placeholder="Twitter title"
          />
          <CmsInput
            value={seo.twitter?.image ?? ""}
            onChange={(e) =>
              onChange({ ...seo, twitter: { ...(seo.twitter ?? {}), image: e.target.value } })
            }
            placeholder="https://.../twitter-image.jpg"
          />
          <CmsInput
            value={seo.twitter?.site ?? ""}
            onChange={(e) =>
              onChange({ ...seo, twitter: { ...(seo.twitter ?? {}), site: e.target.value } })
            }
            placeholder="@site"
          />
          <CmsInput
            value={seo.twitter?.creator ?? ""}
            onChange={(e) =>
              onChange({ ...seo, twitter: { ...(seo.twitter ?? {}), creator: e.target.value } })
            }
            placeholder="@creator"
          />
        </div>
        <div className="mt-3">
          <CmsTextarea
            rows={3}
            value={seo.twitter?.description ?? ""}
            onChange={(e) =>
              onChange({
                ...seo,
                twitter: { ...(seo.twitter ?? {}), description: e.target.value },
              })
            }
            placeholder="Twitter description"
          />
        </div>
      </CmsField>

      <CmsField label="Schema JSON-LD" hint="Paste valid JSON only.">
        <CmsTextarea
          rows={7}
          value={seo.schemaJsonLd ?? ""}
          onChange={(e) => onChange({ ...seo, schemaJsonLd: e.target.value })}
          placeholder='{"@context":"https://schema.org","@type":"WebPage"}'
        />
      </CmsField>

      <CmsField label="Extra meta tags">
        <div className="space-y-3">
          {(seo.metaTags ?? []).map((tag, i) => (
            <CmsItemCard
              key={`${tag.name}-${i}`}
              title={`Meta tag ${i + 1}`}
              onRemove={() =>
                onChange({
                  ...seo,
                  metaTags: (seo.metaTags ?? []).filter((_, j) => j !== i),
                })
              }
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <CmsField label="Name">
                  <CmsInput
                    value={tag.name}
                    onChange={(e) => {
                      const metaTags = [...(seo.metaTags ?? [])];
                      metaTags[i] = { ...metaTags[i], name: e.target.value };
                      onChange({ ...seo, metaTags });
                    }}
                    placeholder="author"
                  />
                </CmsField>
                <CmsField label="Content">
                  <CmsInput
                    value={tag.content}
                    onChange={(e) => {
                      const metaTags = [...(seo.metaTags ?? [])];
                      metaTags[i] = { ...metaTags[i], content: e.target.value };
                      onChange({ ...seo, metaTags });
                    }}
                    placeholder="Karyan Team"
                  />
                </CmsField>
              </div>
            </CmsItemCard>
          ))}
          <CmsGhostButton
            onClick={() =>
              onChange({
                ...seo,
                metaTags: [...(seo.metaTags ?? []), { name: "", content: "" }],
              })
            }
          >
            + Add meta tag
          </CmsGhostButton>
        </div>
      </CmsField>
    </div>
  );
}
