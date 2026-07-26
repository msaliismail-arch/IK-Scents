"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Observe un élément et bascule `is-in` quand il entre dans le viewport.
 * Une seule fois — pas de flicker au scroll inverse.
 */
export function useInView<T extends HTMLElement>(threshold = 0.18) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true);
            io.disconnect();
          }
        }
      },
      { threshold, rootMargin: "0px 0px -8% 0px" }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return { ref, inView };
}

/** Fade-in + translation douce au scroll. */
export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  /** délai en ms */
  delay?: number;
}) {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={`reveal ${inView ? "is-in" : ""} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}

/**
 * Titre dont chaque ligne monte depuis un masque.
 * `lines` = tableau de lignes de texte.
 */
export function RevealLines({
  lines,
  className = "",
  delay = 0,
}: {
  lines: ReactNode[];
  className?: string;
  delay?: number;
}) {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <div ref={ref} className={inView ? "is-in" : undefined}>
      <div className={className}>
        {lines.map((l, i) => (
          <span className="line-mask" key={i}>
            <span style={{ transitionDelay: `${delay + i * 110}ms` }}>{l}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/**
 * Parallax très léger sur un enfant (translateY proportionnel au scroll).
 * `strength` en px de déplacement total.
 */
export function Parallax({
  children,
  strength = 40,
  className = "",
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const rect = el.getBoundingClientRect();
        const vh = window.innerHeight || 1;
        // -1 (sous le viewport) → 1 (au-dessus)
        const progress = (vh / 2 - (rect.top + rect.height / 2)) / vh;
        setOffset(Math.max(-1, Math.min(1, progress)) * strength);
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [strength]);

  return (
    <div ref={ref} className={className}>
      <div style={{ transform: `translate3d(0, ${offset}px, 0)` }}>
        {children}
      </div>
    </div>
  );
}
