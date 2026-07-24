import { BRAND } from "@/lib/site";

/**
 * Elegant SVG perfume bottle with a 3D-ish glass look.
 * Pure SVG + gradients (no dependency). Animate via wrapper (float / parallax).
 */
export function PerfumeBottle({
  className = "",
  width = 300,
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
        <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="45%" stopColor="#f2f0ec" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#e4e1da" stopOpacity="0.75" />
        </linearGradient>
        <linearGradient id="liquid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e8cd97" />
          <stop offset="55%" stopColor="#c9a05a" />
          <stop offset="100%" stopColor="#a97e3c" />
        </linearGradient>
        <linearGradient id="cap" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f0dca8" />
          <stop offset="45%" stopColor="#c9a96e" />
          <stop offset="100%" stopColor="#8a6a34" />
        </linearGradient>
        <linearGradient id="collar" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e6c98a" />
          <stop offset="100%" stopColor="#b08f52" />
        </linearGradient>
        <radialGradient id="glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#e8cd97" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#e8cd97" stopOpacity="0" />
        </radialGradient>
        <clipPath id="bodyClip">
          <path d="M52 120 Q52 96 78 96 L162 96 Q188 96 188 120 L188 300 Q188 330 158 330 L82 330 Q52 330 52 300 Z" />
        </clipPath>
      </defs>

      {/* Golden glow behind */}
      <circle cx="120" cy="215" r="115" fill="url(#glow)" />

      {/* Ground shadow */}
      <ellipse cx="120" cy="342" rx="72" ry="12" fill="#000000" opacity="0.12" />

      {/* Cap */}
      <rect x="98" y="6" width="44" height="14" rx="5" fill="url(#cap)" />
      <rect x="92" y="18" width="56" height="44" rx="9" fill="url(#cap)" />
      {/* Cap highlight */}
      <rect x="100" y="24" width="10" height="30" rx="5" fill="#ffffff" opacity="0.35" />

      {/* Collar */}
      <rect x="100" y="60" width="40" height="16" rx="3" fill="url(#collar)" />
      {/* Neck */}
      <rect x="104" y="74" width="32" height="26" fill="url(#glass)" stroke="#d8cfbf" strokeWidth="1" />

      {/* Body */}
      <path
        d="M52 120 Q52 96 78 96 L162 96 Q188 96 188 120 L188 300 Q188 330 158 330 L82 330 Q52 330 52 300 Z"
        fill="url(#glass)"
        stroke="#d8b877"
        strokeOpacity="0.5"
        strokeWidth="1.5"
      />

      {/* Liquid */}
      <g clipPath="url(#bodyClip)">
        <rect x="40" y="188" width="160" height="150" fill="url(#liquid)" />
        {/* liquid surface shimmer */}
        <rect x="40" y="188" width="160" height="6" fill="#f4e2b8" opacity="0.7" />
      </g>

      {/* Glass reflections */}
      <rect x="70" y="112" width="16" height="188" rx="8" fill="#ffffff" opacity="0.38" />
      <rect x="94" y="120" width="7" height="150" rx="3.5" fill="#ffffff" opacity="0.22" />

      {/* Label */}
      <rect x="82" y="210" width="76" height="56" rx="6" fill="#ffffff" opacity="0.88" />
      <text
        x="120"
        y="234"
        textAnchor="middle"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="17"
        fontWeight="700"
        letterSpacing="2"
        fill="#a88a4e"
      >
        {BRAND}
      </text>
      <text
        x="120"
        y="250"
        textAnchor="middle"
        fontFamily="Georgia, serif"
        fontSize="7"
        letterSpacing="3"
        fill="#b8935a"
      >
        PARFUM
      </text>
      <rect x="104" y="256" width="32" height="1" fill="#c9a96e" opacity="0.6" />
    </svg>
  );
}
