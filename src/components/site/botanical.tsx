"use client";

import { useState } from "react";

const EXTS = ["png", "webp", "svg"];

/**
 * Brindille dessinée au trait — décor de repli si /public/floral.png est absent.
 * Purement décorative : jamais un produit, jamais posée devant un flacon.
 */
function Sprig({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <g
        stroke="currentColor"
        strokeWidth="0.9"
        strokeLinecap="round"
        fill="none"
        opacity="0.85"
      >
        {/* tiges */}
        <path d="M18 16 C 58 46, 92 84, 118 132" />
        <path d="M18 16 C 62 30, 96 52, 128 78" opacity="0.6" />
        {/* feuilles */}
        <path d="M40 36 C 30 24, 36 12, 52 12 C 56 26, 50 36, 40 36 Z" />
        <path d="M46 42 C 58 34, 72 40, 74 54 C 60 58, 48 54, 46 42 Z" />
        <path d="M62 60 C 52 48, 58 36, 74 36 C 78 50, 72 60, 62 60 Z" />
        <path d="M70 68 C 82 60, 96 66, 98 80 C 84 84, 72 80, 70 68 Z" />
        <path d="M86 90 C 76 78, 82 66, 98 66 C 102 80, 96 90, 86 90 Z" />
        <path d="M94 100 C 106 92, 120 98, 122 112 C 108 116, 96 112, 94 100 Z" />
        {/* petites fleurs séchées */}
        <circle cx="128" cy="78" r="3.2" />
        <circle cx="134" cy="72" r="2.2" />
        <circle cx="136" cy="82" r="1.8" />
        <circle cx="118" cy="132" r="3.6" />
        <circle cx="112" cy="138" r="2.1" />
        <circle cx="124" cy="139" r="1.7" />
        {/* pétales dispersés */}
        <path
          d="M148 104 C 154 100, 160 104, 158 110 C 152 112, 148 109, 148 104 Z"
          opacity="0.5"
        />
        <path
          d="M156 132 C 162 128, 168 132, 166 138 C 160 140, 156 137, 156 132 Z"
          opacity="0.35"
        />
      </g>
    </svg>
  );
}

/** Une brindille : photo /public/floral.* si présente, sinon le trait dessiné. */
function Corner({
  className,
  flipX = false,
  flipY = false,
}: {
  className: string;
  flipX?: boolean;
  flipY?: boolean;
}) {
  const [i, setI] = useState(0);
  const exhausted = i >= EXTS.length;
  const flip = `${flipX ? "-scale-x-100" : ""} ${flipY ? "-scale-y-100" : ""}`;
  const base = `${className} ${flip} absolute pointer-events-none select-none`;

  if (exhausted) return <Sprig className={`${base} text-[#8a7a63]`} />;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/floral.${EXTS[i]}`}
      alt=""
      aria-hidden="true"
      onError={() => setI((v) => v + 1)}
      className={`${base} object-contain`}
    />
  );
}

export type Spot = "tl" | "tr" | "bl" | "br" | "ml" | "mr" | "tc" | "bc";

/**
 * Tailles ×4 par rapport à la première version : les brindilles deviennent
 * un vrai élément de direction artistique, pas un détail.
 * Elles restent en arrière-plan (z-0) et débordent hors cadre.
 */
const PLACEMENTS: Record<
  Spot,
  { pos: string; size: string; flipX: boolean; flipY: boolean }
> = {
  tl: {
    pos: "-top-10 -left-14 sm:-top-24 sm:-left-32 lg:-top-40 lg:-left-48",
    size: "w-56 h-56 sm:w-[30rem] sm:h-[30rem] lg:w-[56rem] lg:h-[56rem]",
    flipX: true,
    flipY: false,
  },
  tr: {
    pos: "-top-10 -right-14 sm:-top-24 sm:-right-32 lg:-top-40 lg:-right-48",
    size: "w-56 h-56 sm:w-[30rem] sm:h-[30rem] lg:w-[56rem] lg:h-[56rem]",
    flipX: false,
    flipY: false,
  },
  bl: {
    pos: "-bottom-10 -left-14 sm:-bottom-24 sm:-left-32 lg:-bottom-40 lg:-left-48",
    size: "w-56 h-56 sm:w-[30rem] sm:h-[30rem] lg:w-[56rem] lg:h-[56rem]",
    flipX: true,
    flipY: true,
  },
  br: {
    pos: "-bottom-10 -right-14 sm:-bottom-24 sm:-right-32 lg:-bottom-40 lg:-right-48",
    size: "w-56 h-56 sm:w-[30rem] sm:h-[30rem] lg:w-[56rem] lg:h-[56rem]",
    flipX: false,
    flipY: true,
  },
  ml: {
    pos: "hidden sm:block top-1/3 -left-40 lg:-left-56",
    size: "w-40 h-40 sm:w-80 sm:h-80 lg:w-[40rem] lg:h-[40rem]",
    flipX: true,
    flipY: true,
  },
  mr: {
    pos: "hidden sm:block bottom-1/3 -right-40 lg:-right-56",
    size: "w-40 h-40 sm:w-80 sm:h-80 lg:w-[40rem] lg:h-[40rem]",
    flipX: false,
    flipY: false,
  },
  tc: {
    pos: "hidden sm:block -top-40 left-1/2 -translate-x-1/2 lg:-top-56",
    size: "w-40 h-40 sm:w-80 sm:h-80 lg:w-[40rem] lg:h-[40rem]",
    flipX: false,
    flipY: false,
  },
  bc: {
    pos: "hidden sm:block -bottom-40 left-1/2 -translate-x-1/2 lg:-bottom-56",
    size: "w-40 h-40 sm:w-80 sm:h-80 lg:w-[40rem] lg:h-[40rem]",
    flipX: true,
    flipY: true,
  },
};

/**
 * Décoration botanique d'une section.
 * `spots` choisit les emplacements — elle reste toujours en arrière-plan (z-0)
 * et ne doit jamais passer devant un produit.
 */
export function SideFlorals({
  spots = ["tl", "br"],
  opacity = "opacity-60",
}: {
  spots?: Spot[];
  opacity?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none select-none absolute inset-0 overflow-hidden z-0"
    >
      {spots.map((s) => {
        const p = PLACEMENTS[s];
        return (
          <Corner
            key={s}
            flipX={p.flipX}
            flipY={p.flipY}
            className={`${p.pos} ${p.size} ${opacity}`}
          />
        );
      })}
    </div>
  );
}

/**
 * Petite brindille centrée, utilisée comme séparateur entre deux blocs.
 * Décor pur, aucune information.
 */
export function FloralDivider({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`relative flex items-center justify-center gap-6 ${className}`}
    >
      <span className="h-[1.5px] sm:h-[2px] flex-1 bg-[#171717]" />
      <span className="relative w-16 h-16 sm:w-24 sm:h-24 lg:w-32 lg:h-32 shrink-0 opacity-70">
        <Corner className="inset-0 w-full h-full" />
      </span>
      <span className="h-[1.5px] sm:h-[2px] flex-1 bg-[#171717]" />
    </div>
  );
}
