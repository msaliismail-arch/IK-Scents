"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { DEFAULT_SETTINGS } from "@/lib/delivery";
import type { Settings } from "@/lib/types";

/** Clé de mémorisation des annonces déjà fermées par le visiteur. */
const DISMISS_KEY = "assil-annonce-fermee";

/**
 * Bandeau d'annonce, en haut de toutes les pages.
 *
 * Un bandeau fin plutôt qu'une fenêtre surgissante : sur mobile, un pop-up à
 * l'arrivée fait fuir une partie des visiteurs avant même qu'ils aient vu un
 * produit. Le bandeau se lit sans rien bloquer.
 *
 * Le visiteur peut le fermer, et on s'en souvient — mais la mémorisation est
 * liée au TEXTE de l'annonce : une nouvelle promotion réapparaît, même chez
 * quelqu'un qui avait fermé la précédente.
 *
 * La hauteur réelle est publiée dans `--announce-h`, ce qui décale à la fois
 * la navbar fixe et le contenu de la page. Sans ça, le bandeau recouvrirait le
 * haut du site.
 */
export function AnnouncementBar() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [dismissed, setDismissed] = useState(true); // fermé jusqu'à preuve du contraire
  const barRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let active = true;
    fetch("/api/settings")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!active || !data) return;
        const next: Settings = { ...DEFAULT_SETTINGS, ...data };
        setSettings(next);
        const text = (next.announcement ?? "").trim();
        let alreadyClosed = false;
        try {
          alreadyClosed = localStorage.getItem(DISMISS_KEY) === text;
        } catch {
          // Navigation privée ou stockage refusé : on affiche, c'est tout.
        }
        setDismissed(alreadyClosed);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const text = (settings.announcement ?? "").trim();
  const visible = Boolean(settings.announcementActive) && text !== "" && !dismissed;

  // Publie la hauteur du bandeau pour que rien ne passe dessous
  useEffect(() => {
    const root = document.documentElement;
    if (!visible) {
      root.style.setProperty("--announce-h", "0px");
      return;
    }
    const apply = () => {
      const h = barRef.current?.offsetHeight ?? 0;
      root.style.setProperty("--announce-h", `${h}px`);
    };
    apply();
    window.addEventListener("resize", apply);
    return () => {
      window.removeEventListener("resize", apply);
      root.style.setProperty("--announce-h", "0px");
    };
  }, [visible, text]);

  if (!visible) return null;

  const close = () => {
    setDismissed(true);
    try {
      localStorage.setItem(DISMISS_KEY, text);
    } catch {
      // Sans stockage, le bandeau reviendra au rechargement — acceptable.
    }
  };

  const href = (settings.announcementUrl ?? "").trim();
  const label = (
    <span className="text-[11px] sm:text-[12px] font-medium tracking-[0.14em] uppercase">
      {text}
    </span>
  );

  return (
    <div
      ref={barRef}
      role="region"
      aria-label="Annonce"
      className="fixed top-0 left-0 right-0 z-[60] bg-[#6e2639] text-[#f7f4ee]"
    >
      <div className="max-w-[1500px] mx-auto px-10 sm:px-12 py-2.5 text-center">
        {href ? (
          href.startsWith("/") ? (
            <Link href={href} className="hover:underline underline-offset-4">
              {label}
            </Link>
          ) : (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline underline-offset-4"
            >
              {label}
            </a>
          )
        ) : (
          label
        )}
      </div>

      <button
        type="button"
        onClick={close}
        aria-label="Fermer l'annonce"
        className="absolute top-1/2 -translate-y-1/2 right-2 sm:right-4 w-8 h-8 inline-flex items-center justify-center text-[#f7f4ee]/70 hover:text-[#f7f4ee] transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
