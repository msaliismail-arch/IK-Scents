"use client";

import { useMemo } from "react";
import { qrMatrix, qrSvgPath, qrViewBox } from "@/lib/qr";

/**
 * QR code aux couleurs ASSIL — scannable et cliquable.
 *
 * `value` est ce que le téléphone lira ; `href` est ce qui s'ouvre au clic.
 * Les deux pointent normalement au même endroit, mais rester séparés permet
 * d'ouvrir une page interne au clic tout en encodant l'URL absolue, la seule
 * exploitable par un appareil qui scanne depuis l'extérieur du site.
 *
 * Le calcul est déterministe : le serveur et le navigateur produisent la même
 * image, donc aucun décalage d'hydratation.
 */
export function QrCode({
  value,
  href,
  size = 148,
  className = "",
  title = "QR code de vérification",
}: {
  value: string;
  href?: string;
  size?: number;
  className?: string;
  title?: string;
}) {
  const svg = useMemo(() => {
    if (!value) return null;
    try {
      const matrix = qrMatrix(value, "M");
      return { path: qrSvgPath(matrix), viewBox: qrViewBox(matrix, 2) };
    } catch {
      // Texte trop long : mieux vaut ne rien afficher qu'un QR illisible
      return null;
    }
  }, [value]);

  if (!svg) return null;

  const graphic = (
    <svg
      viewBox={svg.viewBox}
      width={size}
      height={size}
      role="img"
      aria-label={title}
      shapeRendering="crispEdges"
      className="block"
    >
      <title>{title}</title>
      <rect
        x={-2}
        y={-2}
        width="100%"
        height="100%"
        fill="#ffffff"
        stroke="none"
      />
      <path d={svg.path} fill="#171717" />
    </svg>
  );

  const frame = `inline-block bg-white p-3 border border-[#d8cbb8] ${className}`;

  if (!href) return <span className={frame}>{graphic}</span>;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${frame} transition-colors duration-500 hover:border-[#171717] focus:outline-none focus-visible:border-[#171717]`}
    >
      {graphic}
    </a>
  );
}
