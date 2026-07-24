"use client";

import { useState } from "react";
import { BRAND } from "@/lib/site";

export function Logo({
  size = 42,
  showText = true,
}: {
  size?: number;
  showText?: boolean;
}) {
  const [err, setErr] = useState(false);

  return (
    <div className="flex items-center gap-3">
      <div
        className="rounded-full overflow-hidden bg-neutral-900 flex items-center justify-center border border-gold-soft shadow-sm shrink-0"
        style={{ width: size, height: size }}
      >
        {!err ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src="/logo.svg"
            alt={BRAND}
            className="w-full h-full object-contain p-1"
            onError={() => setErr(true)}
          />
        ) : (
          <span
            className="font-serif font-bold gold-text"
            style={{ fontSize: size * 0.5 }}
          >
            A
          </span>
        )}
      </div>
      {showText && (
        <div className="leading-none">
          <h1 className="text-xl sm:text-2xl font-serif font-bold gold-text tracking-wider">
            {BRAND}
          </h1>
          <p className="text-[9px] tracking-[0.3em] text-gold/70 uppercase mt-0.5">
            Parfums Originaux
          </p>
        </div>
      )}
    </div>
  );
}
