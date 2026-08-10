"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { resolveImg } from "@/lib/site";
import { SLIDE_MS } from "@/lib/carousel";
import { useLang } from "@/components/site/language-provider";
import type { Slide } from "@/lib/types";

/** Déplacement du doigt, en pixels, à partir duquel on change de visuel. */
const SWIPE_THRESHOLD = 45;

/**
 * Au-delà de ce déplacement, le geste est considéré comme un balayage et non
 * comme un clic : sans ce garde-fou, faire défiler les photos au doigt ouvrait
 * la fiche produit à chaque fois.
 */
const DRAG_TOLERANCE = 10;

/**
 * Carrousel de visuels, tout en haut de la page d'accueil.
 *
 * ─── Ce qui se passe automatiquement, et quand ça s'arrête ──────────────────
 *
 * Les visuels défilent seuls. Ce défilement se met en pause dès que le
 * visiteur montre qu'il regarde : survol à la souris, doigt posé sur l'image,
 * navigation au clavier, ou onglet passé en arrière-plan. Un carrousel qui
 * continue de tourner pendant qu'on lit fait rater l'image qu'on voulait voir
 * — et sur un onglet caché, il consomme de la batterie pour rien.
 *
 * Les personnes qui ont demandé à leur système de réduire les animations ne
 * voient aucun défilement automatique : les flèches et les points restent, la
 * navigation devient simplement manuelle.
 *
 * Sans visuel actif, le composant ne rend rien du tout — pas de cadre vide ni
 * d'espace réservé en haut de la page.
 */
export function HeroCarousel() {
  const { t, dir } = useLang();
  const [slides, setSlides] = useState<Slide[]>([]);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    let active = true;
    fetch("/api/slides")
      .then((r) => (r.ok ? r.json() : []))
      .then((list) => {
        if (active && Array.isArray(list)) setSlides(list);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const count = slides.length;

  const goTo = useCallback(
    (next: number) => {
      if (count === 0) return;
      // Modulo positif : reculer depuis le premier visuel ramène au dernier.
      setIndex(((next % count) + count) % count);
    },
    [count]
  );

  // ── Défilement automatique ────────────────────────────────────────────────
  useEffect(() => {
    if (count < 2 || paused) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduced) return;

    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % count),
      SLIDE_MS
    );
    return () => window.clearInterval(id);
  }, [count, paused]);

  // Onglet en arrière-plan : rien ne sert de faire tourner les images.
  useEffect(() => {
    const onVisibility = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () =>
      document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  // ── Balayage au doigt ─────────────────────────────────────────────────────
  const startX = useRef(0);
  const deltaX = useRef(0);
  const dragging = useRef(false);

  const onTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    deltaX.current = 0;
    dragging.current = false;
    setPaused(true);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    deltaX.current = e.touches[0].clientX - startX.current;
    if (Math.abs(deltaX.current) > DRAG_TOLERANCE) dragging.current = true;
  };

  const onTouchEnd = () => {
    // En arabe la page se lit de droite à gauche : le même geste vers la
    // gauche doit alors ramener en arrière, pas avancer.
    const forward = dir === "rtl" ? 1 : -1;
    if (deltaX.current * forward >= SWIPE_THRESHOLD) goTo(index + 1);
    else if (deltaX.current * forward <= -SWIPE_THRESHOLD) goTo(index - 1);
    setPaused(false);
  };

  // Un balayage se termine toujours par un clic du point de vue du navigateur.
  // On l'annule pour ne pas ouvrir une fiche produit contre le gré du visiteur.
  const onClickCapture = (e: React.MouseEvent) => {
    if (dragging.current) {
      e.preventDefault();
      e.stopPropagation();
      dragging.current = false;
    }
  };

  if (count === 0) return null;

  return (
    <section
      aria-label={t.carousel.label}
      aria-roledescription="carrousel"
      className="relative bg-[#efe8dc]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div
        className="relative overflow-hidden"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onClickCapture={onClickCapture}
      >
        {/*
          `flex` + `translateX` plutôt qu'une image affichée à la fois : la
          transition reste fluide et les images voisines sont déjà en place,
          donc aucun clignotement au changement.
        */}
        {/*
          Le signe suit le sens de lecture : en `dir="rtl"` la rangée est déjà
          retournée par le navigateur, un décalage négatif reviendrait donc à
          reculer.
        */}
        <div
          className="flex transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
          style={{
            transform: `translateX(${dir === "rtl" ? "" : "-"}${index * 100}%)`,
          }}
        >
          {slides.map((s, i) => {
            const alt = s.perfumeName || t.carousel.label;

            const media = (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={resolveImg(s.image)}
                alt={alt}
                draggable={false}
                // Le premier visuel est celui que le visiteur voit avant tout
                // le reste : il ne doit pas être chargé paresseusement.
                loading={i === 0 ? "eager" : "lazy"}
                className="block w-full h-full object-cover select-none"
              />
            );

            return (
              <div
                key={s.id}
                role="group"
                aria-roledescription={t.carousel.slide}
                aria-label={`${i + 1} / ${count}`}
                aria-hidden={i !== index}
                className="w-full shrink-0 aspect-[4/5] sm:aspect-[3/2] lg:aspect-[16/7]"
              >
                {s.perfumeId ? (
                  <Link
                    href={`/commander/${s.perfumeId}`}
                    // Un visuel masqué reste dans le DOM : sans `tabIndex={-1}`
                    // la tabulation s'y arrête alors qu'on ne le voit pas.
                    tabIndex={i === index ? 0 : -1}
                    className="block w-full h-full"
                    aria-label={`${t.carousel.see} ${
                      s.perfumeName || t.carousel.thisPerfume
                    }`}
                  >
                    {media}
                  </Link>
                ) : (
                  media
                )}
              </div>
            );
          })}
        </div>

        {count > 1 && (
          <>
            {/*
              `start` / `end` plutôt que `left` / `right` : « précédent » se
              place du côté d'où vient la lecture — à gauche en français, à
              droite en arabe. Les chevrons se retournent avec `rtl:`.
            */}
            <button
              type="button"
              onClick={() => goTo(index - 1)}
              aria-label={t.carousel.previous}
              className="absolute start-2 sm:start-4 top-1/2 -translate-y-1/2 w-11 h-11 inline-flex items-center justify-center bg-white/85 text-[#171717] backdrop-blur-sm transition-colors duration-300 hover:bg-white"
            >
              <ChevronLeft className="w-5 h-5 rtl:-scale-x-100" />
            </button>
            <button
              type="button"
              onClick={() => goTo(index + 1)}
              aria-label={t.carousel.next}
              className="absolute end-2 sm:end-4 top-1/2 -translate-y-1/2 w-11 h-11 inline-flex items-center justify-center bg-white/85 text-[#171717] backdrop-blur-sm transition-colors duration-300 hover:bg-white"
            >
              <ChevronRight className="w-5 h-5 rtl:-scale-x-100" />
            </button>
          </>
        )}
      </div>

      {count > 1 && (
        // Les points sont petits par nature ; c'est le bouton qui les entoure
        // qui fait 44 px, pas la pastille elle-même.
        <div className="absolute bottom-2 left-0 right-0 flex items-center justify-center gap-0.5">
          {slides.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`${t.carousel.goTo} ${i + 1}`}
              aria-current={i === index}
              className="w-8 h-11 inline-flex items-center justify-center"
            >
              <span
                className={`block h-[3px] transition-all duration-500 ${
                  i === index ? "w-7 bg-[#171717]" : "w-4 bg-[#171717]/35"
                }`}
              />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
