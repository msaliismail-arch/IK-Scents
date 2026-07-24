import { BRAND } from "@/lib/site";

/**
 * Refined SVG perfume bottle — clear glass, black cap with gold band,
 * amber juice, reflections, soft shadow. Vector stand-in for a product photo.
 */
export function PerfumeBottle({
  className = "",
  width = 320,
}: {
  className?: string;
  width?: number;
}) {
  return (
    <svg
      className={className}
      width={width}
      viewBox="0 0 240 360"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label={`Flacon ${BRAND}`}
    >
      <defs>
        <linearGradient id="glass" x1="0.1" y1="0" x2="0.9" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.96" />
          <stop offset="38%" stopColor="#eef0ef" stopOpacity="0.82" />
          <stop offset="72%" stopColor="#e0e3e1" stopOpacity="0.72" />
          <stop offset="100%" stopColor="#d3d6d3" stopOpacity="0.7" />
        </linearGradient>
        <linearGradient id="juice" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#eccf96" />
          <stop offset="45%" stopColor="#cf9f57" />
          <stop offset="100%" stopColor="#a9793c" />
        </linearGradient>
        <linearGradient id="cap" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3b3833" />
          <stop offset="42%" stopColor="#1c1a16" />
          <stop offset="100%" stopColor="#0e0c09" />
        </linearGradient>
        <linearGradient id="band" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f0d79b" />
          <stop offset="50%" stopColor="#cba767" />
          <stop offset="100%" stopColor="#a07f45" />
        </linearGradient>
        <radialGradient id="halo" cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor="#cba767" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#cba767" stopOpacity="0" />
        </radialGradient>
        <clipPath id="body">
          <path d="M50 96 Q50 74 76 74 L164 74 Q190 74 190 96 L190 300 Q190 328 160 328 L80 328 Q50 328 50 300 Z" />
        </clipPath>
      </defs>

      <circle cx="120" cy="205" r="120" fill="url(#halo)" />
      <ellipse cx="120" cy="342" rx="80" ry="11" fill="#1a1712" opacity="0.16" />

      {/* Cap */}
      <rect x="99" y="2" width="42" height="12" rx="4" fill="url(#cap)" />
      <rect x="92" y="12" width="56" height="46" rx="9" fill="url(#cap)" />
      <rect x="101" y="18" width="9" height="30" rx="4.5" fill="#ffffff" opacity="0.16" />
      {/* Gold band */}
      <rect x="92" y="56" width="56" height="7" rx="2" fill="url(#band)" />
      {/* Neck */}
      <rect x="104" y="62" width="32" height="14" fill="url(#glass)" stroke="#cdd0ce" strokeWidth="0.8" />

      {/* Body */}
      <path
        d="M50 96 Q50 74 76 74 L164 74 Q190 74 190 96 L190 300 Q190 328 160 328 L80 328 Q50 328 50 300 Z"
        fill="url(#glass)"
        stroke="#c9b98f"
        strokeOpacity="0.45"
        strokeWidth="1.2"
      />

      {/* Juice */}
      <g clipPath="url(#body)">
        <rect x="42" y="196" width="156" height="140" fill="url(#juice)" />
        <rect x="42" y="196" width="156" height="5" fill="#f4e3ba" opacity="0.7" />
        {/* juice inner shading */}
        <rect x="150" y="196" width="48" height="140" fill="#8f6531" opacity="0.18" />
      </g>

      {/* Glass reflections */}
      <rect x="66" y="88" width="15" height="216" rx="7.5" fill="#ffffff" opacity="0.5" />
      <rect x="88" y="96" width="6" height="150" rx="3" fill="#ffffff" opacity="0.28" />
      <path d="M182 96 Q186 200 176 300" stroke="#ffffff" strokeOpacity="0.35" strokeWidth="4" fill="none" strokeLinecap="round" />

      {/* Label */}
      <rect x="80" y="212" width="80" height="60" rx="5" fill="#faf7f0" opacity="0.95" />
      <rect x="80" y="212" width="80" height="60" rx="5" fill="none" stroke="#d8cdb4" strokeWidth="0.8" />
      <text x="120" y="240" textAnchor="middle" fontFamily="Georgia, 'Times New Roman', serif"
            fontSize="20" fontWeight="700" letterSpacing="2.5" fill="#1a1712">
        {BRAND}
      </text>
      <rect x="103" y="248" width="34" height="0.9" fill="#b39a63" />
      <text x="120" y="262" textAnchor="middle" fontFamily="Georgia, serif"
            fontSize="7" letterSpacing="3" fill="#6b6459">
        EAU DE PARFUM
      </text>
    </svg>
  );
}
