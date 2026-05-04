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

export default function IndiaPresenceMap({
  cities,
  dotColor = "#d4cfc7",
  markerColor = "#b08d57",
  width = 440,
  height = 520,
}: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<SVGSVGElement>(null);
  const [hoveredCity, setHoveredCity] = useState<PresenceCity | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [pinPositions, setPinPositions] = useState<
    { city: PresenceCity; cx: number; cy: number }[]
  >([]);

  useEffect(() => {
    if (!mapRef.current) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const map = new DottedMap({ map: indiaMapData as any });

    cities.forEach((city) => {
      map.addPin({
        lat: city.lat,
        lng: city.lon,
        svgOptions: { color: markerColor, radius: 0.5 },
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

    // Collect pin positions for the overlay
    const allCircles = Array.from(svg.querySelectorAll("circle"));
    const pinCircles = allCircles.slice(-cities.length);
    const vb = svg.viewBox.baseVal;

    const positions = pinCircles.map((circle, idx) => {
      const cx = parseFloat(circle.getAttribute("cx") ?? "0");
      const cy = parseFloat(circle.getAttribute("cy") ?? "0");
      // Convert viewBox coords → pixel coords
      const px = vb.width > 0 ? (cx / vb.width) * width : cx;
      const py = vb.height > 0 ? (cy / vb.height) * height : cy;
      return { city: cities[idx]!, cx: px, cy: py };
    });

    // Hide the raw pin circles — we draw prettier ones in the overlay SVG
    pinCircles.forEach((c) => c.setAttribute("fill", "transparent"));

    setPinPositions(positions);
  }, [cities, dotColor, markerColor, width, height]);

  return (
    <div ref={wrapperRef} className="relative select-none" style={{ width, height }}>
      {/* Base dotted map */}
      <div ref={mapRef} className="absolute inset-0" />

      {/* Overlay SVG for rich animated pins */}
      <svg
        ref={overlayRef}
        className="pointer-events-none absolute inset-0"
        width={width}
        height={height}
        style={{ overflow: "visible" }}
      >
        <defs>
          <radialGradient id="pinGold" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#e8c97a" />
            <stop offset="100%" stopColor="#9a6d2e" />
          </radialGradient>
          <filter id="pinGlow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {pinPositions.map(({ city, cx, cy }) => {
          const isHovered = hoveredCity?.id === city.id;
          return (
            <g key={city.id}>
              {/* Outer pulse ring */}
              <circle
                cx={cx}
                cy={cy}
                r={isHovered ? 14 : 9}
                fill={markerColor}
                fillOpacity={isHovered ? 0.18 : 0.12}
                style={{ transition: "r 0.2s, fill-opacity 0.2s" }}
              />
              {/* Mid ring */}
              <circle
                cx={cx}
                cy={cy}
                r={isHovered ? 8 : 5.5}
                fill={markerColor}
                fillOpacity={isHovered ? 0.35 : 0.22}
                style={{ transition: "r 0.2s, fill-opacity 0.2s" }}
              />
              {/* Core dot */}
              <circle
                cx={cx}
                cy={cy}
                r={isHovered ? 4.5 : 3.2}
                fill="url(#pinGold)"
                filter="url(#pinGlow)"
                style={{ transition: "r 0.2s" }}
              />
              {/* Invisible hit area */}
              <circle
                cx={cx}
                cy={cy}
                r={16}
                fill="transparent"
                className="pointer-events-auto cursor-pointer"
                onMouseEnter={(e) => {
                  setHoveredCity(city);
                  const rect = wrapperRef.current?.getBoundingClientRect();
                  if (rect)
                    setTooltipPos({
                      x: e.clientX - rect.left,
                      y: e.clientY - rect.top,
                    });
                }}
                onMouseMove={(e) => {
                  const rect = wrapperRef.current?.getBoundingClientRect();
                  if (rect)
                    setTooltipPos({
                      x: e.clientX - rect.left,
                      y: e.clientY - rect.top,
                    });
                }}
                onMouseLeave={() => setHoveredCity(null)}
              />
            </g>
          );
        })}
      </svg>

      {/* Tooltip */}
      {hoveredCity && (
        <div
          className="pointer-events-none absolute z-50 whitespace-nowrap rounded-lg border border-lux-gold/30 bg-lux-navy px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-lux-ivory shadow-xl"
          style={{
            left: tooltipPos.x + 16,
            top: tooltipPos.y - 44,
          }}
        >
          {hoveredCity.label}
          <span className="absolute left-3 top-full block h-0 w-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-lux-navy" />
        </div>
      )}
    </div>
  );
}
