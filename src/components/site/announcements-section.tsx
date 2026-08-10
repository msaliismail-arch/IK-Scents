"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Megaphone } from "lucide-react";
import { Reveal } from "@/components/site/reveal";
import { useLang } from "@/components/site/language-provider";
import type { Announcement } from "@/lib/types";

/**
 * Section « Annonces », entre le hero et la collection.
 *
 * Placée là volontairement : au-dessus du hero, un bloc de promotions ferait
 * ressembler ASSIL à un site de déstockage plutôt qu'à une marque de parfum.
 * Juste après, c'est le moment exact où le visiteur décide s'il continue à
 * descendre — une annonce y travaille vraiment.
 *
 * La visibilité immédiate est assurée par le bandeau du haut, qui reprend la
 * première de ces annonces.
 *
 * Rien à annoncer = rien à afficher : la section disparaît entièrement plutôt
 * que de laisser un titre au-dessus du vide.
 */
export function AnnouncementsSection() {
  const { t } = useLang();
  const [items, setItems] = useState<Announcement[]>([]);

  useEffect(() => {
    let active = true;
    fetch("/api/announcements")
      .then((r) => (r.ok ? r.json() : []))
      .then((list) => {
        if (active && Array.isArray(list)) setItems(list);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  if (items.length === 0) return null;

  return (
    <section
      id="annonces"
      className="relative bg-surface-alt border-y border-champagne py-16 sm:py-20 lg:py-24"
    >
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12">
        <Reveal>
          <div className="flex items-center gap-3 mb-10 lg:mb-14">
            <Megaphone className="w-4 h-4 text-bordeaux shrink-0" />
            <span className="text-[11px] font-bold tracking-[0.4em] uppercase text-[#171717]">
              {t.announcements.title}
            </span>
            <span className="h-px flex-1 bg-champagne" />
          </div>
        </Reveal>

        <div
          className={`grid gap-5 sm:gap-6 ${
            items.length === 1
              ? "grid-cols-1 max-w-3xl"
              : items.length === 2
                ? "grid-cols-1 md:grid-cols-2"
                : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          }`}
        >
          {items.map((a, i) => {
            const url = (a.url ?? "").trim();
            // Le libellé saisi par l'admin l'emporte : c'est son texte, dans
            // la langue qu'il a choisie. Le repli, lui, suit le visiteur.
            const label =
              (a.linkLabel ?? "").trim() || t.announcements.linkLabel;

            return (
              <Reveal key={a.id} delay={i * 110}>
                <article className="h-full bg-card border border-champagne p-6 sm:p-7 flex flex-col transition-colors duration-500 hover:border-[#171717]">
                  <h3 className="font-serif text-xl sm:text-2xl font-light leading-snug text-foreground">
                    {a.title}
                  </h3>

                  {a.body && (
                    <p className="mt-3.5 text-[14.5px] font-light leading-[1.8] text-muted-foreground flex-1">
                      {a.body}
                    </p>
                  )}

                  {url && (
                    <div className="mt-6">
                      {url.startsWith("/") ? (
                        <Link
                          href={url}
                          className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.18em] uppercase text-bordeaux hover:gap-3.5 transition-all duration-500"
                        >
                          {label}
                          <ArrowRight className="w-3.5 h-3.5 shrink-0 rtl:-scale-x-100" />
                        </Link>
                      ) : (
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.18em] uppercase text-bordeaux hover:gap-3.5 transition-all duration-500"
                        >
                          {label}
                          <ArrowRight className="w-3.5 h-3.5 shrink-0 rtl:-scale-x-100" />
                        </a>
                      )}
                    </div>
                  )}
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
