// Delicate line-art botanical accents (inherit color via `text-*` + currentColor)

// Symmetric side flowers (left + right) for any section. Visible, consistent.
export function SideFlorals() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none select-none absolute inset-0 overflow-hidden"
    >
      <FloralSpray className="absolute -top-2 -left-6 w-28 h-24 text-[#6b5f4a] opacity-60 -scale-x-100 hidden lg:block" />
      <FloralSpray className="absolute -bottom-2 -right-6 w-28 h-24 text-[#6b5f4a] opacity-60 hidden lg:block" />
      <LeafBranch className="absolute bottom-0 -left-4 w-14 h-36 text-[#8a7a63] opacity-45 hidden xl:block" />
      <LeafBranch className="absolute top-0 -right-4 w-14 h-36 text-[#8a7a63] opacity-45 rotate-180 hidden xl:block" />
    </div>
  );
}


export function LeafBranch({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 160 220"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.1"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M80 220 C78 170 74 120 82 60 C86 34 96 18 110 6" />
      {[...Array(7)].map((_, i) => {
        const t = i / 6;
        const y = 200 - t * 170;
        const x = 80 - Math.sin(t * 3.1) * 6;
        return (
          <g key={i}>
            <path
              d={`M${x} ${y} C${x - 26} ${y - 8} ${x - 40} ${y - 22} ${x - 42} ${y - 40} C${x - 22} ${y - 34} ${x - 8} ${y - 20} ${x} ${y}`}
            />
            <path
              d={`M${x} ${y - 8} C${x + 26} ${y - 16} ${x + 40} ${y - 30} ${x + 42} ${y - 48} C${x + 22} ${y - 42} ${x + 8} ${y - 26} ${x} ${y - 8}`}
            />
          </g>
        );
      })}
    </svg>
  );
}

export function FloralSpray({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 220 200"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.1"
      strokeLinecap="round"
      aria-hidden="true"
    >
      {/* stems */}
      <path d="M20 190 C70 160 120 120 150 60" />
      <path d="M20 190 C60 150 90 120 120 70" />
      <path d="M20 190 C80 170 130 150 180 120" />

      {/* leaves along stems */}
      <path d="M70 150 C60 138 58 126 64 116 C74 124 76 138 70 150" />
      <path d="M110 110 C100 98 98 86 104 76 C114 84 116 98 110 110" />
      <path d="M120 150 C132 146 144 148 150 158 C140 164 128 160 120 150" />

      {/* blossom 1 (poppy) */}
      <g transform="translate(150,54)">
        <path d="M0 0 C-14 -6 -22 -18 -18 -30 C-6 -26 2 -14 0 0" />
        <path d="M0 0 C14 -6 22 -18 18 -30 C6 -26 -2 -14 0 0" />
        <path d="M0 0 C-8 -16 -6 -30 4 -36 C10 -24 8 -10 0 0" />
        <circle cx="-1" cy="-16" r="2.4" fill="currentColor" stroke="none" />
      </g>

      {/* blossom 2 */}
      <g transform="translate(184,116)">
        <circle cx="0" cy="0" r="9" />
        {[...Array(6)].map((_, i) => {
          const a = (i / 6) * Math.PI * 2;
          return (
            <ellipse
              key={i}
              cx={Math.cos(a) * 16}
              cy={Math.sin(a) * 16}
              rx="8"
              ry="4"
              transform={`rotate(${(a * 180) / Math.PI} ${Math.cos(a) * 16} ${Math.sin(a) * 16})`}
            />
          );
        })}
      </g>
    </svg>
  );
}
