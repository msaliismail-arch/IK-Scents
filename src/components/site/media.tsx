"use client";

import { useState } from "react";

/**
 * Image slot. Shows the exact filename to drop in /public when missing.
 * No decorative fallback art — keeps the design honest.
 */
export function Img({
  src,
  alt,
  className = "",
  ratio = "aspect-[4/5]",
}: {
  src: string;
  alt: string;
  className?: string;
  ratio?: string;
}) {
  const [ok, setOk] = useState(true);

  if (!ok) {
    return (
      <div
        className={`${ratio} ${className} w-full bg-[#efeae1] border border-dashed border-[#cfc4b0] flex flex-col items-center justify-center gap-1 text-center px-3`}
      >
        <span className="text-[10px] tracking-[0.2em] uppercase text-[#8a7a63]">
          Image manquante
        </span>
        <code className="text-[11px] text-[#5c5344] font-mono">
          public{src}
        </code>
      </div>
    );
  }

  return (
    <div className={`${ratio} ${className} w-full overflow-hidden bg-[#efeae1]`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        onError={() => setOk(false)}
        className="w-full h-full object-cover transition-transform duration-[1.2s] ease-out hover:scale-[1.04]"
      />
    </div>
  );
}
