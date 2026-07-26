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
        stroke="#8a7a63"
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

/** Angle botanique : photo /public/floral.* si présente, sinon le trait dessiné. */
function Corner({
  className,
  flip = false,
}: {
  className: string;
  flip?: boolean;
}) {
  const [i, setI] = useState(0);
  const exhausted = i >= EXTS.length;
  const base = `${className} ${flip ? "-scale-x-100" : ""} absolute pointer-events-none select-none`;

  if (exhausted) return <Sprig className={base} />;

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

/**
 * Décoration botanique dans les angles d'une section.
 * Volontairement discrète — elle ne doit jamais passer devant un produit.
 */
export function SideFlorals({
  variant = "both",
  opacity = "opacity-60",
}: {
  variant?: "both" | "top-left" | "bottom-right";
  opacity?: string;
}) {
  const showTop = variant === "both" || variant === "top-left";
  const showBottom = variant === "both" || variant === "bottom-right";

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none select-none absolute inset-0 overflow-hidden z-0"
    >
      {showTop && (
        <Corner
          flip
          className={`-top-6 -left-10 w-36 h-36 lg:w-56 lg:h-56 ${opacity}`}
        />
      )}
      {showBottom && (
        <Corner
          className={`-bottom-6 -right-10 w-36 h-36 lg:w-56 lg:h-56 ${opacity}`}
        />
      )}
    </div>
  );
}
