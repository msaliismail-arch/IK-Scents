"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Megaphone } from "lucide-react";
import { useLang } from "@/components/site/language-provider";
import { pick } from "@/lib/i18n";
import type { Announcement } from "@/lib/types";

/**
 * Bandeau d'annonce, tout en haut de chaque page.
 *
 * ─── Toujours visible, jamais fermable ─────────────────────────────────────
 *
 * Le visiteur pouvait autrefois le fermer, et son choix était mémorisé. Ce
 * n'est plus le cas : une annonce est une information que la boutique a
 * décidé de montrer — une promotion, une rupture, un délai de livraison — et
 * elle doit rester lisible pendant toute la visite.
 *
 * La contrepartie est réelle : un bandeau qu'on ne peut pas écarter devient
 * pesant s'il reste des semaines. Ce n'est pas au code de l'empêcher, c'est à
 * l'admin de désactiver l'annonce quand elle n'a plus lieu d'être. Sans
 * annonce active, le bandeau disparaît de lui-même.
 *
 * ─── Une seule saisie, deux emplacements ───────────────────────────────────
 *
 * Le bandeau reprend la PREMIÈRE annonce active — la même qui ouvre la
 * section « Annonces » de l'accueil. Écrire l'annonce une fois suffit.
 *
 * ─── Pourquoi publier sa hauteur ───────────────────────────────────────────
 *
 * La navbar est en position fixe, le bandeau aussi. Sans mesure, l'un
 * recouvrirait l'autre. La hauteur réelle est donc écrite dans `--announce-h`,
 * que lisent la navbar et le corps de page. Elle vaut 0 quand il n'y a rien à
 * annoncer, ce qui rend le décalage sans effet le reste du temps.
 */
export function AnnouncementBar() {
  const { lang } = useLang();
  const [first, setFirst] = useState<Announcement | null>(null);
  const barRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let active = true;
    fetch("/api/announcements")
      .then((r) => (r.ok ? r.json() : []))
      .then((list: Announcement[]) => {
        if (!active || !Array.isArray(list) || list.length === 0) return;
        setFirst(list[0]);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const text = pick(lang, first?.title, first?.titleAr);
  const visible = text !== "";

  useEffect(() => {
    const root = document.documentElement;
    if (!visible) {
      root.style.setProperty("--announce-h", "0px");
      return;
    }

    // Mesure après peinture, et à chaque redimensionnement : sur un écran
    // étroit une annonce longue passe sur deux lignes, et le décalage doit
    // suivre. `ResizeObserver` capte aussi le changement de police au chargement.
    const apply = () => {
      const h = barRef.current?.offsetHeight ?? 0;
      root.style.setProperty("--announce-h", `${h}px`);
    };
    apply();

    const observer = new ResizeObserver(apply);
    if (barRef.current) observer.observe(barRef.current);
    window.addEventListener("resize", apply);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", apply);
      root.style.setProperty("--announce-h", "0px");
    };
  }, [visible, text]);

  if (!visible) return null;

  // À défaut de lien propre, le bandeau renvoie vers la section Annonces :
  // le visiteur y trouve le détail plutôt que de rester sur sa faim.
  const href = (first?.url ?? "").trim() || "/#annonces";

  const content = (
    <>
      {/*
        Le porte-voix dit « ceci est une annonce » sans consommer de place ni
        demander de traduction. Il est décoratif : le texte suffit à lui seul.
      */}
      <Megaphone aria-hidden="true" className="w-3.5 h-3.5 shrink-0" />
      <span className="text-[11px] sm:text-[12px] font-medium tracking-[0.14em] uppercase">
        {text}
      </span>
    </>
  );

  return (
    <div
      ref={barRef}
      role="region"
      aria-label={text}
      className="fixed-safe fixed top-0 left-0 right-0 z-[60] bg-[#6e2639] text-[#f7f4ee] shadow-[0_1px_12px_rgba(110,38,57,0.35)]"
    >
      <div className="max-w-[1500px] mx-auto px-5 sm:px-8 py-2.5">
        {href.startsWith("/") ? (
          <Link
            href={href}
            className="flex items-center justify-center gap-2.5 text-center hover:opacity-80 transition-opacity duration-300"
          >
            {content}
          </Link>
        ) : (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2.5 text-center hover:opacity-80 transition-opacity duration-300"
          >
            {content}
          </a>
        )}
      </div>
    </div>
  );
}
