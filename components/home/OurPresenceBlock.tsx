import type { HomePresenceBand } from "@/lib/cms/types";
import { normalizePresenceCityIds } from "@/lib/cms/normalizePresenceCityIds";
import { getIndiaPresenceCity } from "@/lib/cms/indiaPresenceCities";
import IndiaPresenceMap, { type PresenceCity } from "./IndiaPresenceMap";
import HomeSectionHeading from "@/components/home/HomeSectionHeading";

function titleCaseSlug(id: string): string {
  return id.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}

/** One map pin per city id (first row wins) so stacked duplicates don’t break SVG keys. */
function dedupeForMap(rows: { id: string; label: string; lat: number; lon: number }[]): PresenceCity[] {
  const seen = new Set<string>();
  const out: PresenceCity[] = [];
  for (const r of rows) {
    if (seen.has(r.id)) continue;
    seen.add(r.id);
    out.push({ id: r.id, label: r.label, lat: r.lat, lon: r.lon });
  }
  return out;
}

export default function OurPresenceBlock({ band }: { band: HomePresenceBand }) {
  const rawIds = normalizePresenceCityIds(band.cityIds);

  type Row = {
    rowKey: string;
    id: string;
    label: string;
    lat?: number;
    lon?: number;
  };

  const rows: Row[] = rawIds.map((id, idx) => {
    const c = getIndiaPresenceCity(id);
    return {
      rowKey: `${idx}-${id}`,
      id,
      label: c?.label ?? titleCaseSlug(id),
      lat: c?.lat,
      lon: c?.lon,
    };
  });

  const knownForMap = rows
    .filter((r): r is Row & { lat: number; lon: number } => r.lat != null && r.lon != null)
    .map((r) => ({ id: r.id, label: r.label, lat: r.lat, lon: r.lon }));

  const mapCities = dedupeForMap(knownForMap);

  const eyebrow = band.eyebrow?.trim() || "Our reach";
  const heading = band.heading?.trim() || "Our Presence";
  const subheading = band.subheading?.trim() || "";

  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-20">
      {/* ── Left: text + city grid ── */}
      <div className="order-2 flex flex-col lg:order-1">
        <HomeSectionHeading eyebrow={eyebrow} title={heading} description={subheading} />
        <div className="mt-5 h-px w-14 bg-gradient-to-r from-lux-gold-dim to-transparent" />

        {/* City list */}
        {rows.length ? (
          <>
            <p className="mt-8 text-[10px] font-bold uppercase tracking-[0.28em] text-stone-400">
              {rows.length} {rows.length === 1 ? "city" : "cities"}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {rows.map(({ rowKey, label }) => (
                <span
                  key={rowKey}
                  className="rounded-full border border-stone-200 bg-white px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-700 shadow-sm"
                >
                  {label}
                </span>
              ))}
            </div>
          </>
        ) : (
          <p className="mt-8 text-sm text-stone-400">
            Add cities from the admin panel to mark them on the map.
          </p>
        )}
      </div>

      {/* ── Right: India map ── */}
      <div className="order-1 flex items-center justify-center lg:order-2">
        <div className="relative">
          {/* Glow behind map */}
          <div className="pointer-events-none absolute inset-0 -z-10 scale-[0.85] rounded-full bg-lux-gold/10 blur-3xl" />
          <IndiaPresenceMap
            cities={mapCities}
            dotColor="#d4cfc7"
            markerColor="#b08d57"
            width={340}
            height={320}
          />
        </div>
      </div>
    </div>
  );
}
