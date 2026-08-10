"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import type { Announcement } from "@/lib/types";

/** Clé de mémorisation de l'annonce déjà fermée par le visiteur. */
const DISMISS_KEY = "assil-annonce-fermee";

/**
 * Bandeau d'annonce, en haut de toutes les pages.
 *
 * Il reprend la PREMIÈRE annonce active — la même que celle en tête de la
 * section « Annonces » de l'accueil. Une seule saisie côté admin alimente donc
 * les deux emplacements.
 *
 * Un bandeau fin plutôt qu'une fenêtre surgissante : sur mobile, un pop-up à
 * l'arrivée fait fuir une partie des visiteurs avant qu'ils aient vu un
 * produit. Le bandeau se lit sans rien bloquer.
 *
 * Le visiteur peut le fermer, et on s'en souvient — mais la mémorisation est
 * liée au TEXTE : une nouvelle annonce réapparaît, même chez quelqu'un qui
 * avait fermé la précédente.
 *
 * La hauteur réelle est publiée dans `--announce-h`, ce qui décale à la fois
 * la navbar fixe et le contenu. Sans ça, le bandeau recouvrirait le haut du
 * site.
 */
export function AnnouncementBar() {
  const [first, setFirst] = useState<Announcement | null>(null);
  const [dismissed, setDismissed] = useState(true); // fermé jusqu'à preuve du contraire
  const barRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let active = true;
    fetch("/api/announcements")
      .then((r) => (r.ok ? r.json() : []))
      .then((list: Announcement[]) => {
        if (!active || !Array.isArray(list) || list.length === 0) return;
        const top = list[0];
        setFirst(top);
        let alreadyClosed = false;
        try {
          alreadyClosed = localStorage.getItem(DISMISS_KEY) === top.title;
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

  const text = (first?.title ?? "").trim();
  const visible = text !== "" && !dismissed;

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

  // À défaut de lien propre, le bandeau renvoie vers la section Annonces :
  // le visiteur y trouve le détail plutôt que de rester sur sa faim.
  const href = (first?.url ?? "").trim() || "/#annonces";
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
      className="fixed-safe fixed top-0 left-0 right-0 z-[60] bg-[#6e2639] text-[#f7f4ee]"
    >
      {/* `px-11` à gauche comme à droite : le texte reste centré et ne passe
          jamais sous la croix de fermeture, même sur un écran de 320 px. */}
      <div className="max-w-[1500px] mx-auto px-11 sm:px-14 py-2.5 text-center">
        {href.startsWith("/") ? (
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
