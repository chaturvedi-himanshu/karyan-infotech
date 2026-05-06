import { parseSchemaJsonLd } from "@/lib/seo/metadata";

export default function SeoJsonLd({ raw }: { raw?: string }) {
  const payload = parseSchemaJsonLd(raw);
  if (!payload) return null;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  );
}
