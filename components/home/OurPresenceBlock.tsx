import type { HomePresenceBand } from "@/lib/cms/types";
import { getIndiaPresenceCity } from "@/lib/cms/indiaPresenceCities";
import IndiaPresenceMap from "./IndiaPresenceMap";

function uniqueCityIds(ids: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const id of ids) {
    if (!id || seen.has(id)) continue;
    seen.add(id);
    out.push(id);
  }
  return out;
}

export default function OurPresenceBlock({ band }: { band: HomePresenceBand }) {
  const cityIds = uniqueCityIds(band.cityIds);
  const resolved = cityIds
    .map((id) => {
      const c = getIndiaPresenceCity(id);
      if (!c) return null;
      return { id: c.id, label: c.label, lat: c.lat, lon: c.lon };
    })
    .filter(Boolean) as { id: string; label: string; lat: number; lon: number }[];

  const eyebrow = band.eyebrow?.trim() || "Our reach";
  const heading = band.heading?.trim() || "Our Presence";
  const subheading = band.subheading?.trim() || "";

  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-20">
      {/* ── Left: text + city grid ── */}
      <div className="order-2 flex flex-col lg:order-1">
        {/* Eyebrow */}
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-lux-gold-dim">
          {eyebrow}
        </p>

        {/* Heading */}
        <h2 className="font-display mt-3 text-4xl font-light uppercase tracking-[0.2em] text-lux-navy sm:text-5xl">
          {heading}
        </h2>

        {/* Decorative rule */}
        <div className="mt-5 h-px w-14 bg-gradient-to-r from-lux-gold-dim to-transparent" />

        {/* Subheading */}
        {subheading ? (
          <p className="mt-4 max-w-md text-sm leading-relaxed text-stone-500 sm:text-base">
            {subheading}
          </p>
        ) : null}

        {/* City list */}
        {resolved.length ? (
          <>
            <p className="mt-8 text-[10px] font-bold uppercase tracking-[0.28em] text-stone-400">
              {resolved.length} {resolved.length === 1 ? "city" : "cities"}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {resolved.map(({ id, label }) => (
                <span
                  key={id}
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
            cities={resolved}
            dotColor="#d4cfc7"
            markerColor="#b08d57"
            width={440}
            height={520}
          />
        </div>
      </div>
    </div>
  );
}
