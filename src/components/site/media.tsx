"use client";

import { useState } from "react";

const EXTS = ["png", "jpg", "jpeg", "webp"];

/**
 * Image slot. `name` = base filename without extension (e.g. "hero-bottle").
 * Tries .png / .jpg / .jpeg / .webp automatically.
 * If none load, a labelled placeholder stays visible behind showing what to add.
 */
export function Img({
  name,
  alt,
  className = "",
  ratio = "aspect-[4/5]",
}: {
  name: string;
  alt: string;
  className?: string;
  ratio?: string;
}) {
  const [i, setI] = useState(0);
  const exhausted = i >= EXTS.length;

  return (
    <div
      className={`${ratio} ${className} relative w-full overflow-hidden bg-[#efeae1]`}
    >
      {/* Placeholder layer (visible only if no image loads) */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 px-3 text-center border border-dashed border-[#cfc4b0]">
        <span className="text-[10px] tracking-[0.22em] uppercase text-[#8a7a63]">
          Image à ajouter
        </span>
        <code className="text-[11px] text-[#5c5344] font-mono break-all">
          public/{name}.png
        </code>
      </div>

      {!exhausted && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`/${name}.${EXTS[i]}`}
          alt=""
          aria-label={alt}
          onError={() => setI((v) => v + 1)}
          className="relative w-full h-full object-cover transition-transform duration-[1.2s] ease-out hover:scale-[1.04]"
        />
      )}
    </div>
  );
}
