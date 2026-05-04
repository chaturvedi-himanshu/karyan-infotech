"use client";

import { useEffect, useRef, useState } from "react";
import DottedMap from "dotted-map/without-countries";
import indiaMapData from "@/lib/cms/indiaMapPrecomputed.json";

export type PresenceCity = {
  id: string;
  label: string;
  lat: number;
  lon: number;
};

type Props = {
  cities: PresenceCity[];
  dotColor?: string;
  markerColor?: string;
  width?: number;
  height?: number;
};

type MapState = {
  /** Exact viewBox string taken from the dotted-map SVG output */
  viewBox: string;
  pins: { city: PresenceCity; cx: number; cy: number }[];
};

export default function IndiaPresenceMap({
  cities,
  dotColor = "#d4cfc7",
  markerColor = "#b08d57",
  width = 440,
  height = 520,
}: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<PresenceCity | null>(null);
  const [tipPos, setTipPos] = useState({ x: 0, y: 0 });
  const [mapState, setMapState] = useState<MapState | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const map = new DottedMap({ map: indiaMapData as any });

    // Add invisible seed pins just so dotted-map snaps them to grid and
    // records their viewBox coordinates. We'll draw our own pretty markers
    // on the overlay SVG.
    cities.forEach((city) => {
      map.addPin({
        lat: city.lat,
        lng: city.lon,
        svgOptions: { color: "transparent", radius: 0.01 },
        data: city,
      });
    });

    const svgString = map.getSVG({
      radius: 0.28,
      color: dotColor,
      shape: "circle",
      backgroundColor: "transparent",
    });

    mapRef.current.innerHTML = svgString;

    const svg = mapRef.current.querySelector("svg");
    if (!svg || !(svg instanceof SVGSVGElement)) return;

    svg.setAttribute("width", String(width));
    svg.setAttribute("height", String(height));
    svg.style.display = "block";

    // ── Grab the EXACT viewBox string (e.g. "0 0 1000 1180") ──────────
    const viewBox = svg.getAttribute("viewBox") ?? `0 0 ${width} ${height}`;

    // ── Extract pin positions in VIEWBOX units (no px conversion!) ────
    const allCircles = Array.from(svg.querySelectorAll("circle"));
    const pinCircles = allCircles.slice(-cities.length);

    const pins: MapState["pins"] = pinCircles.map((circle, idx) => ({
      city: cities[idx]!,
      cx: parseFloat(circle.getAttribute("cx") ?? "0"),
      cy: parseFloat(circle.getAttribute("cy") ?? "0"),
    }));

    // Hide the transparent seed circles from the base map
    pinCircles.forEach((c) => c.setAttribute("fill", "transparent"));

    setMapState({ viewBox, pins });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cities.map((c) => c.id).join(","), dotColor, markerColor, width, height]);

  return (
    <div ref={wrapperRef} className="relative select-none" style={{ width, height }}>
      {/* Base dotted India map */}
      <div ref={mapRef} className="absolute inset-0" />

      {/* Overlay SVG — uses the SAME viewBox as the base map.
          SVG will scale the coordinate system identically, so cx/cy from
          the base circles sit exactly on top of the right dots. */}
      {mapState && (
        <svg
          className="pointer-events-none absolute inset-0"
          viewBox={mapState.viewBox}
          preserveAspectRatio="xMidYMid meet"
          width={width}
          height={height}
        >
          <defs>
            <radialGradient id="pinGold" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#f0d788" />
              <stop offset="100%" stopColor="#9a6d2e" />
            </radialGradient>
            <filter id="pinGlow" x="-150%" y="-150%" width="400%" height="400%">
              <feGaussianBlur stdDeviation="0.6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {mapState.pins.map(({ city, cx, cy }) => {
            const h = hovered?.id === city.id;
            return (
              <g key={city.id}>
                {/* Outer glow ring */}
                <circle
                  cx={cx} cy={cy}
                  r={h ? 3.2 : 2.0}
                  fill={markerColor}
                  fillOpacity={h ? 0.22 : 0.13}
                  style={{ transition: "r 0.25s ease, fill-opacity 0.25s" }}
                />
                {/* Mid ring */}
                <circle
                  cx={cx} cy={cy}
                  r={h ? 1.9 : 1.2}
                  fill={markerColor}
                  fillOpacity={h ? 0.42 : 0.28}
                  style={{ transition: "r 0.25s ease" }}
                />
                {/* Core gold dot */}
                <circle
                  cx={cx} cy={cy}
                  r={h ? 1.0 : 0.65}
                  fill="url(#pinGold)"
                  filter="url(#pinGlow)"
                  style={{ transition: "r 0.25s ease" }}
                />
                {/* Invisible pointer-events hit area */}
                <circle
                  cx={cx} cy={cy}
                  r={4}
                  fill="transparent"
                  className="pointer-events-auto cursor-pointer"
                  onMouseEnter={(e) => {
                    setHovered(city);
                    const rect = wrapperRef.current?.getBoundingClientRect();
                    if (rect) setTipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
                  }}
                  onMouseMove={(e) => {
                    const rect = wrapperRef.current?.getBoundingClientRect();
                    if (rect) setTipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
                  }}
                  onMouseLeave={() => setHovered(null)}
                />
              </g>
            );
          })}
        </svg>
      )}

      {/* Tooltip */}
      {hovered && (
        <div
          className="pointer-events-none absolute z-50 whitespace-nowrap rounded-lg border border-lux-gold/30 bg-lux-navy px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-lux-ivory shadow-xl"
          style={{ left: tipPos.x + 16, top: tipPos.y - 44 }}
        >
          {hovered.label}
          <span className="absolute left-3 top-full block h-0 w-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-lux-navy" />
        </div>
      )}
    </div>
  );
}
