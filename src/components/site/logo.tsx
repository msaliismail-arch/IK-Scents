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
        className="rounded-full overflow-hidden bg-neutral-900 flex items-center justify-center border border-[#e6dcc6] shadow-sm shrink-0"
        style={{ width: size, height: size }}
      >
        {!err ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src="/logo.png"
            alt={BRAND}
            className="w-full h-full object-cover"
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
          <p className="text-[9px] tracking-[0.3em] text-[#a88a4e]/70 uppercase mt-0.5">
            Parfums Originaux
          </p>
        </div>
      )}
    </div>
  );
}
