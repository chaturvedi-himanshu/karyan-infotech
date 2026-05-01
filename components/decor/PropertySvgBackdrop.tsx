"use client";

import { useId } from "react";
import type { ReactNode } from "react";

/** Decorative backgrounds: soft blobs, waves, rings — fintech / SaaS landing style (not literal building silhouettes). */
export type PropertyBackdropVariant =
  | "meshPremium"
  | "waveFluid"
  | "orbRings"
  | "blobOrganic"
  | "ribbonArcs"
  | "scatterDots"
  | "stackWaves"
  | "gradientMesh";

const GOLD = "#c6a052";
const GOLD_BRIGHT = "#e4c76b";
const NAVY = "#313131";
const NAVY_SOFT = "#3a3a3a";
const CREAM = "#faf7f2";

export default function PropertySvgBackdrop({
  variant,
  className = "",
}: {
  variant: PropertyBackdropVariant;
  className?: string;
}) {
  const id = useId().replace(/:/g, "");
  const g1 = `lux-g1-${id}`;
  const g2 = `lux-g2-${id}`;
  const g3 = `lux-g3-${id}`;
  const g4 = `lux-g4-${id}`;
  const mesh = `lux-mesh-${id}`;
  const dotPat = `lux-dots-${id}`;

  const commonDefs = (
    <defs>
      <radialGradient id={g1} cx="18%" cy="22%" r="55%">
        <stop offset="0%" stopColor={GOLD_BRIGHT} stopOpacity="0.45" />
        <stop offset="55%" stopColor={GOLD} stopOpacity="0.12" />
        <stop offset="100%" stopColor={NAVY} stopOpacity="0" />
      </radialGradient>
      <radialGradient id={g2} cx="88%" cy="12%" r="45%">
        <stop offset="0%" stopColor={GOLD} stopOpacity="0.35" />
        <stop offset="100%" stopColor={NAVY} stopOpacity="0" />
      </radialGradient>
      <radialGradient id={g3} cx="72%" cy="88%" r="50%">
        <stop offset="0%" stopColor={NAVY_SOFT} stopOpacity="0.2" />
        <stop offset="100%" stopColor={CREAM} stopOpacity="0" />
      </radialGradient>
      <radialGradient id={g4} cx="8%" cy="78%" r="40%">
        <stop offset="0%" stopColor={GOLD_BRIGHT} stopOpacity="0.22" />
        <stop offset="100%" stopColor={NAVY} stopOpacity="0" />
      </radialGradient>
      <linearGradient id={mesh} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={GOLD} stopOpacity="0.18" />
        <stop offset="50%" stopColor={NAVY} stopOpacity="0.06" />
        <stop offset="100%" stopColor={GOLD_BRIGHT} stopOpacity="0.12" />
      </linearGradient>
      <pattern
        id={dotPat}
        width="28"
        height="28"
        patternUnits="userSpaceOnUse"
      >
        <circle cx="4" cy="4" r="1.2" fill={NAVY} opacity="0.06" />
        <circle cx="18" cy="14" r="0.9" fill={GOLD} opacity="0.12" />
        <circle cx="10" cy="22" r="0.7" fill={NAVY} opacity="0.05" />
      </pattern>
    </defs>
  );

  const layers: Record<
    PropertyBackdropVariant,
    { viewBox: string; children: ReactNode }
  > = {
    meshPremium: {
      viewBox: "0 0 1440 900",
      children: (
        <>
          {commonDefs}
          <rect width="1440" height="900" fill={`url(#${dotPat})`} opacity="0.85" />
          <ellipse cx="260" cy="220" rx="520" ry="420" fill={`url(#${g1})`} />
          <ellipse cx="1220" cy="180" rx="440" ry="360" fill={`url(#${g2})`} />
          <ellipse cx="980" cy="720" rx="600" ry="380" fill={`url(#${g3})`} />
          <ellipse cx="140" cy="680" rx="360" ry="300" fill={`url(#${g4})`} />
        </>
      ),
    },
    gradientMesh: {
      viewBox: "0 0 1440 900",
      children: (
        <>
          {commonDefs}
          <rect width="1440" height="900" fill={`url(#${mesh})`} opacity="0.35" />
          <path
            d="M0,420 C320,380 520,520 720,480 S1180,360 1440,400 L1440,900 L0,900 Z"
            fill={NAVY}
            opacity="0.03"
          />
          <circle cx="200" cy="150" r="120" fill={GOLD} opacity="0.08" />
          <circle cx="1280" cy="750" r="180" fill={GOLD_BRIGHT} opacity="0.06" />
        </>
      ),
    },
    waveFluid: {
      viewBox: "0 0 1440 320",
      children: (
        <>
          <defs>
            <linearGradient id={`${id}-wv`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={GOLD} stopOpacity="0.2" />
              <stop offset="50%" stopColor={GOLD_BRIGHT} stopOpacity="0.12" />
              <stop offset="100%" stopColor={NAVY} stopOpacity="0.15" />
            </linearGradient>
          </defs>
          <path
            d="M0,80 C240,40 480,120 720,90 S1200,20 1440,70 L1440,320 L0,320 Z"
            fill={`url(#${id}-wv)`}
            opacity="0.9"
          />
          <path
            d="M0,120 C360,180 600,60 900,100 S1320,140 1440,95 L1440,320 L0,320 Z"
            fill={NAVY}
            opacity="0.04"
          />
          <path
            d="M0,160 Q360,220 720,180 T1440,200 L1440,320 L0,320 Z"
            fill={GOLD}
            opacity="0.06"
          />
        </>
      ),
    },
    stackWaves: {
      viewBox: "0 0 1440 400",
      children: (
        <>
          <path
            d="M0,0 L1440,0 L1440,200 C1200,260 800,180 480,220 S0,280 0,200 Z"
            fill={GOLD}
            opacity="0.07"
          />
          <path
            d="M0,40 L1440,40 L1440,240 C1100,300 700,200 360,260 S0,320 0,220 Z"
            fill={NAVY}
            opacity="0.05"
          />
          <path
            d="M0,100 Q720,200 1440,120 L1440,400 L0,400 Z"
            fill={GOLD_BRIGHT}
            opacity="0.05"
          />
        </>
      ),
    },
    orbRings: {
      viewBox: "0 0 800 800",
      children: (
        <>
          <defs>
            <linearGradient id={`${id}-ring`} x1="0%" y1="50%" x2="100%" y2="50%">
              <stop offset="0%" stopColor={GOLD} stopOpacity="0" />
              <stop offset="50%" stopColor={GOLD} stopOpacity="0.2" />
              <stop offset="100%" stopColor={GOLD} stopOpacity="0" />
            </linearGradient>
          </defs>
          <circle
            cx="400"
            cy="400"
            r="280"
            fill="none"
            stroke={`url(#${id}-ring)`}
            strokeWidth="1.5"
          />
          <circle
            cx="400"
            cy="400"
            r="220"
            fill="none"
            stroke={NAVY}
            strokeOpacity="0.06"
            strokeWidth="1"
            strokeDasharray="8 14"
          />
          <circle
            cx="400"
            cy="400"
            r="340"
            fill="none"
            stroke={GOLD}
            strokeOpacity="0.1"
            strokeWidth="1"
          />
          <circle cx="120" cy="140" r="6" fill={GOLD} opacity="0.25" />
          <circle cx="680" cy="200" r="4" fill={NAVY} opacity="0.08" />
          <circle cx="640" cy="620" r="5" fill={GOLD_BRIGHT} opacity="0.2" />
        </>
      ),
    },
    blobOrganic: {
      viewBox: "0 0 1440 900",
      children: (
        <>
          <defs>
            <linearGradient id={`${id}-bl`} x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={GOLD} stopOpacity="0.25" />
              <stop offset="100%" stopColor={NAVY} stopOpacity="0.06" />
            </linearGradient>
          </defs>
          <path
            d="M-80,520 C180,380 420,620 720,500 S1240,360 1520,480 L1520,920 L-80,920 Z"
            fill={`url(#${id}-bl)`}
          />
          <path
            d="M200,-40 C400,120 800,40 1100,180 S1480,80 1520,320 L1520,-40 Z"
            fill={GOLD_BRIGHT}
            opacity="0.12"
          />
          <path
            d="M0,200 C280,80 560,280 900,160 S1320,40 1440,200 L1440,0 L0,0 Z"
            fill={NAVY}
            opacity="0.04"
          />
        </>
      ),
    },
    ribbonArcs: {
      viewBox: "0 0 1440 600",
      children: (
        <>
          <path
            d="M-40,480 Q360,120 800,280 T1520,200"
            fill="none"
            stroke={GOLD}
            strokeOpacity="0.18"
            strokeWidth="2"
          />
          <path
            d="M0,380 Q480,200 960,320 T1520,260"
            fill="none"
            stroke={NAVY}
            strokeOpacity="0.07"
            strokeWidth="1.5"
          />
          <path
            d="M200,520 Q600,280 1000,400 T1440,340"
            fill="none"
            stroke={GOLD_BRIGHT}
            strokeOpacity="0.15"
            strokeWidth="1"
            strokeDasharray="12 16"
          />
          <ellipse
            cx="1180"
            cy="120"
            rx="200"
            ry="80"
            fill={GOLD}
            opacity="0.06"
            transform="rotate(-25 1180 120)"
          />
        </>
      ),
    },
    scatterDots: {
      viewBox: "0 0 600 600",
      children: (
        <>
          <defs>
            <pattern
              id={dotPat}
              width="28"
              height="28"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="4" cy="4" r="1.2" fill={NAVY} opacity="0.06" />
              <circle cx="18" cy="14" r="0.9" fill={GOLD} opacity="0.12" />
              <circle cx="10" cy="22" r="0.7" fill={NAVY} opacity="0.05" />
            </pattern>
          </defs>
          <rect width="600" height="600" fill={`url(#${dotPat})`} />
          {[...Array(48)].map((_, i) => {
            const x = (i * 47 + 13) % 580;
            const y = (i * 71 + 29) % 580;
            const r = 1 + (i % 3) * 0.6;
            const o = 0.04 + (i % 5) * 0.02;
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r={r}
                fill={i % 2 === 0 ? NAVY : GOLD}
                opacity={o}
              />
            );
          })}
        </>
      ),
    },
  };

  const cfg = layers[variant];

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden select-none ${className}`}
      aria-hidden
    >
      <svg
        className="h-full w-full"
        viewBox={cfg.viewBox}
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        {cfg.children}
      </svg>
    </div>
  );
}