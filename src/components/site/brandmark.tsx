"use client";

import { useState } from "react";
import { BRAND } from "@/lib/site";

const SOURCES = ["/logo.svg", "/logo.png", "/logo.webp"];

/**
 * Logotype ASSIL pour la navbar et le footer.
 *
 * Contrairement à <Logo />, il n'enferme pas l'image dans un cercle :
 * `public/logo.svg` est un logotype large (ratio ≈ 4.9:1) et le recadrer
 * en rond le détruit. Ici la hauteur est imposée, la largeur suit.
 *
 * Si aucun fichier ne charge, on retombe sur le mot ASSIL en serif —
 * jamais sur un carré vide.
 */
export function Brandmark({
  height = 40,
  className = "",
  invert = false,
}: {
  /** hauteur en px du logotype */
  height?: number;
  className?: string;
  /** true sur fond sombre : le logotype est éclairci */
  invert?: boolean;
}) {
  const [i, setI] = useState(0);
  const exhausted = i >= SOURCES.length;

  if (exhausted) {
    return (
      <span
        className={`font-serif font-semibold tracking-[0.34em] leading-none ${className}`}
        style={{ fontSize: height * 0.62 }}
      >
        {BRAND}
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={SOURCES[i]}
      alt={BRAND}
      onError={() => setI((v) => v + 1)}
      style={{ height }}
      className={`w-auto object-contain shrink-0 ${
        invert ? "invert brightness-200" : ""
      } ${className}`}
    />
  );
}
