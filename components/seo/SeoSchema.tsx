export default function SeoSchema({ schemaJsonLd }: { schemaJsonLd?: string }) {
  const text = schemaJsonLd?.trim();
  if (!text) return null;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: text }}
      suppressHydrationWarning
    />
  );
}

