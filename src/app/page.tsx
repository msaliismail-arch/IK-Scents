"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { ArrowRight, Bell, Instagram, Package, ShoppingBag } from "lucide-react";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { Img } from "@/components/site/media";
import { AnnouncementsSection } from "@/components/site/announcements-section";
import { HeroCarousel } from "@/components/site/hero-carousel";
import { AddToCart } from "@/components/site/add-to-cart";
import { SideFlorals, FloralDivider } from "@/components/site/botanical";
import { Reveal, RevealLines, Parallax } from "@/components/site/reveal";
import {
  PerfumeRequestModal,
  type RequestPrefill,
} from "@/components/site/perfume-request-modal";
import { BRAND, INSTAGRAM_URL, resolveImg } from "@/lib/site";
import { resolveAvailability } from "@/lib/availability";
import { GENDERS, normalizeGender, priceOf } from "@/lib/pricing";
import { useLang } from "@/components/site/language-provider";
import { genderText, pick, stockText } from "@/lib/i18n";
import type { Perfume } from "@/lib/types";

/* ══════════════════════════════════════════════
   HERO — bloc éditorial centré, sans photo

   La photo de flacon a été retirée : sur téléphone elle occupait tout le
   premier écran et repoussait le titre et les boutons sous la ligne de
   flottaison. Un hero purement typographique se lit d'un coup d'œil quelle
   que soit la taille de l'écran, et la marque reste tenue par les brindilles
   en arrière-plan.
   ══════════════════════════════════════════════ */
function Hero({ onRequest }: { onRequest: () => void }) {
  const { t } = useLang();

  return (
    <section
      id="hero"
      className="relative bg-background overflow-hidden"
    >
      <SideFlorals spots={["tl", "tr", "br", "mr", "bl"]} opacity="opacity-40" />

      <div className="relative z-10 max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 pt-14 sm:pt-20 lg:pt-24 pb-16 sm:pb-24 lg:pb-32">
        <div className="max-w-3xl mx-auto text-center">
          <Reveal>
            <span className="label-xs block mb-6 sm:mb-8">
              {t.hero.eyebrow}
            </span>
          </Reveal>

          {/*
            Taille en `clamp` plutôt qu'en paliers : entre 320 px et 400 px de
            large — la zone où vivent la plupart des téléphones — le titre
            grandit en continu au lieu de sauter d'un cran et de déborder.
          */}
          <RevealLines
            className="display text-[clamp(2.5rem,11vw,5.2rem)] mb-7 sm:mb-8"
            lines={[...t.hero.title]}
          />

          <Reveal delay={180}>
            <span className="rule mx-auto mb-7 sm:mb-8" />
            <p className="text-[#4a4236] text-[16px] sm:text-[17px] font-light leading-[1.85] max-w-md mx-auto mb-9 sm:mb-11">
              {t.hero.text}
            </p>
          </Reveal>

          <Reveal delay={300}>
            <div className="flex flex-col sm:flex-row gap-3 sm:justify-center">
              <Link
                href="/#collection"
                className="bg-[#171717] text-white px-8 py-[18px] text-[11px] font-bold tracking-[0.2em] uppercase text-center transition-colors duration-500 hover:bg-[#3a3a3a]"
              >
                {t.hero.cta}
              </Link>
              <button
                type="button"
                onClick={onRequest}
                className="border border-[#171717] text-[#171717] px-8 py-[18px] text-[11px] font-bold tracking-[0.2em] uppercase text-center transition-colors duration-500 hover:bg-[#171717] hover:text-white"
              >
                {t.hero.request}
              </button>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════
   NOS DÉCANTS
   ══════════════════════════════════════════════ */

/**
 * Cadre noir fin autour du produit.
 *
 * Aucun ratio n'est imposé et aucun `object-fit` n'est appliqué : l'image garde
 * exactement les proportions du fichier envoyé par l'admin. Le noir n'est donc
 * qu'une bordure de quelques pixels — jamais une bande qui comble un vide.
 * Carrée, portrait ou paysage, la photo s'affiche entière et sans déformation.
 */
function ProductFrame({
  src,
  alt,
  onError,
  failed,
}: {
  src: string;
  alt: string;
  onError: () => void;
  failed: boolean;
}) {
  return (
    <div className="bg-[#171717] p-2 sm:p-2.5 overflow-hidden">
      {!failed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onError={onError}
          className="block w-full h-auto transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
        />
      ) : (
        <div className="aspect-[4/5] w-full flex items-center justify-center">
          <span className="font-serif text-xl uppercase tracking-[0.2em] text-[#d8cbb8] text-center px-4">
            {alt}
          </span>
        </div>
      )}
    </div>
  );
}

function PerfumeRow({
  perfume,
  index,
  onRequest,
}: {
  perfume: Perfume;
  index: number;
  onRequest: (prefill?: RequestPrefill) => void;
}) {
  const { lang, t } = useLang();
  const [imgError, setImgError] = useState(false);
  const stock = resolveAvailability(perfume.availability);
  const stockLabel = stockText(t, perfume.availability);
  const sexe = genderText(t, perfume.gender);
  const imageUrl = resolveImg(perfume.image);
  const sizes = perfume.sizes ?? [];
  // Chaque format porte son prix catalogue et, s'il existe, son prix promo.
  const priced = sizes.map((s) => ({ ...s, view: priceOf(s) }));
  const from = priced.length
    ? Math.min(...priced.map((s) => s.view.final || Infinity))
    : null;
  const flipped = index % 2 === 1;

  // Format sélectionné. Le premier est proposé d'emblée : un bouton
  // « Ajouter au panier » désactivé tant qu'on n'a rien choisi donnerait
  // l'impression d'un produit indisponible.
  const [chosenSize, setChosenSize] = useState(sizes[0]?.label ?? "");
  const selected =
    priced.find((s) => s.label === chosenSize) ?? priced[0] ?? null;

  // Contenu rédigé par l'admin : version arabe si elle existe, français sinon.
  const name = pick(lang, perfume.name, perfume.nameAr);
  const description = pick(lang, perfume.description, perfume.descriptionAr);
  const notes = pick(lang, perfume.notes, perfume.notesAr);
  const family = pick(lang, perfume.family, perfume.familyAr);

  return (
    <article className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-center">
      {/* Image dans son cadre noir */}
      <Reveal
        className={`lg:col-span-5 group ${flipped ? "lg:col-start-8 lg:row-start-1" : ""}`}
      >
        <Link
          href={`/commander/${perfume.id}`}
          className="block"
          aria-label={`${t.collection.discover} ${name}`}
        >
          <ProductFrame
            src={imageUrl}
            alt={name}
            failed={imgError}
            onError={() => setImgError(true)}
          />
        </Link>
      </Reveal>

      {/* Informations produit */}
      <Reveal
        delay={140}
        className={`lg:col-span-6 ${flipped ? "lg:col-start-1 lg:row-start-1" : "lg:col-start-7"}`}
      >
        <span className="font-serif text-[#8a7a63] text-[1.4rem] font-light block mb-4">
          {String(index + 1).padStart(2, "0")}
        </span>

        <h3 className="font-serif font-semibold uppercase tracking-[0.015em] leading-[1.05] text-foreground text-[clamp(1.65rem,7vw,3.3rem)] break-words hyphens-auto">
          <Link href={`/commander/${perfume.id}`}>{name}</Link>
        </h3>

        <div className="mt-4 flex flex-wrap items-center gap-2 sm:gap-3">
          <span
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 text-[10px] font-bold tracking-[0.2em] uppercase border ${
              stock.orderable
                ? "border-[#171717] bg-[#171717] text-white"
                : "border-champagne bg-white text-[#6b6255]"
            }`}
          >
            <span
              aria-hidden="true"
              className={`w-1.5 h-1.5 rounded-full ${
                stock.orderable ? "bg-white" : "bg-[#8a7a63]"
              }`}
            />
            {stockLabel.badge}
          </span>

          {sexe && (
            <span className="chip-champagne inline-flex items-center px-3 py-1.5 text-[9.5px] sm:px-3.5 sm:text-[10px] font-semibold tracking-[0.2em] uppercase">
              {sexe}
            </span>
          )}

          {family && (
            <span className="chip-bordeaux inline-flex items-center px-3 py-1.5 text-[9.5px] sm:px-3.5 sm:text-[10px] font-bold tracking-[0.2em] uppercase">
              {family}
            </span>
          )}

        </div>

        <span className="rule my-6" />

        <p className="text-[#4a4236] text-[15.5px] font-light leading-[1.85] max-w-lg">
          {description}
        </p>

        {notes && (
          <p className="mt-4 text-[14px] text-[#4a4236] font-light leading-[1.8] max-w-lg">
            <span className="text-[10px] font-bold tracking-[0.24em] uppercase text-bordeaux block mb-1.5">
              {t.collection.mainNotes}
            </span>
            {notes}
          </p>
        )}

        {sizes.length > 0 && (
          <div className="mt-8">
            <span className="block text-[10px] font-bold tracking-[0.26em] uppercase text-bordeaux mb-3">
              {t.collection.availableSizes}
            </span>
            <div className="flex flex-wrap gap-2">
              {priced.map((s, i) => {
                const contenu = (
                  <>
                    <span className="font-semibold uppercase">{s.label}</span>
                    <span className="opacity-60"> · </span>
                    {s.view.hasDiscount && (
                      <span className="opacity-60 line-through mr-1.5">
                        {s.view.original}
                      </span>
                    )}
                    <span className="font-bold">{s.view.final} MAD</span>
                  </>
                );

                // Le format se choisit ici même : le visiteur sélectionne sa
                // contenance puis ajoute au panier, sans changer de page.
                const active = s.label === chosenSize;

                return stock.orderable ? (
                  <button
                    key={s.id ?? i}
                    type="button"
                    onClick={() => setChosenSize(s.label)}
                    aria-pressed={active}
                    className={`inline-flex items-center px-4 py-2.5 pointer-coarse:min-h-[44px] text-[13px] sm:px-5 sm:py-3 sm:text-[14px] border transition-colors duration-300 ${
                      active
                        ? "size-chip border-transparent"
                        : "border-champagne bg-white text-[#4a4236] hover:border-bordeaux"
                    }`}
                  >
                    {contenu}
                  </button>
                ) : (
                  <span
                    key={s.id ?? i}
                    className="chip-bordeaux inline-flex items-center px-4 py-2.5 text-[13px] sm:px-5 sm:py-3 sm:text-[14px] opacity-45"
                  >
                    {contenu}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {from && Number.isFinite(from) && (
          <p className="mt-6 text-[14px] text-[#6b6255] font-light">
            {t.collection.from}{" "}
            <span className="font-serif text-[1.9rem] font-medium text-bordeaux align-middle">
              {from} MAD
            </span>
          </p>
        )}

        {stock.orderable ? (
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <AddToCart
              className="w-full sm:w-auto"
              disabled={!selected}
              line={{
                perfumeId: perfume.id,
                perfumeName: perfume.name,
                perfumeNameAr: perfume.nameAr,
                image: perfume.image,
                sizeLabel: selected?.label ?? "",
                price: selected?.view.final ?? 0,
                quantity: 1,
              }}
            />
            <Link
              href="/panier"
              className="text-[11px] font-semibold tracking-[0.18em] uppercase text-bordeaux hover:underline underline-offset-4 inline-flex items-center pointer-coarse:min-h-[44px]"
            >
              {t.cart.open}
            </Link>
          </div>
        ) : (
          <div className="mt-8">
            <button
              type="button"
              onClick={() =>
                onRequest({
                  name,
                  gender: perfume.gender,
                  formats: priced
                    .filter((x) => x.label)
                    .map((x) => ({
                      label: x.label,
                      price: x.view.final,
                    })),
                })
              }
              className="btn-bordeaux w-full sm:w-auto inline-flex items-center justify-center gap-3 px-10 py-5 text-[12px] font-bold tracking-[0.2em] uppercase"
            >
              <Bell className="w-4 h-4" />
              {stockLabel.cta}
            </button>
            <p className="mt-3 text-[13px] text-[#6b6255] font-light">
              {stock.value === "bientot"
                ? t.collection.soonText
                : t.collection.outText}
            </p>
          </div>
        )}
      </Reveal>
    </article>
  );
}

function Collection({
  perfumes,
  onRequest,
  id = "collection",
  eyebrow,
  title,
  intro,
  variant = "decants",
  withGenderFilter = false,
}: {
  perfumes: Perfume[];
  onRequest: (prefill?: RequestPrefill) => void;
  id?: string;
  eyebrow?: string;
  title?: string;
  intro?: string;
  /** "packs" pose un fond crème pour détacher la section des décants */
  variant?: "decants" | "packs";
  /** Barre « Tous · Homme · Femme · Unisexe ». Inutile sur les packs. */
  withGenderFilter?: boolean;
}) {
  const { t } = useLang();
  const packs = variant === "packs";
  const eyebrowText = eyebrow ?? t.collection.eyebrow;
  const titleText = title ?? t.collection.title;

  // "" = aucun filtre actif, donc « Tous »
  const [genderFilter, setGenderFilter] = useState("");

  // Un onglet qui ne contient rien est un cul-de-sac : on ne propose que les
  // catégories réellement représentées, avec leur nombre.
  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const p of perfumes) {
      const g = normalizeGender(p.gender);
      if (!g) continue;
      map.set(g, (map.get(g) ?? 0) + 1);
    }
    return map;
  }, [perfumes]);

  const visible = useMemo(
    () =>
      genderFilter
        ? perfumes.filter((p) => normalizeGender(p.gender) === genderFilter)
        : perfumes,
    [perfumes, genderFilter]
  );

  // Filtrer n'a de sens qu'à partir de deux catégories distinctes.
  const showFilter = Boolean(withGenderFilter) && counts.size > 1;

  // Une section vide n'apporte rien : les packs ne s'affichent que s'il y en a.
  if (packs && perfumes.length === 0) return null;

  return (
    <section
      id={id}
      className={`relative overflow-hidden py-20 sm:py-28 lg:py-32 ${
        packs
          ? "bg-surface-alt border-y border-champagne"
          : "bg-background"
      }`}
    >
      {!packs && (
        <>
          {/* Photo d'ambiance de l'admin, en fond très atténué :
              elle habille la section sans jamais gêner la lecture. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-cover bg-center lg:bg-fixed opacity-[0.16]"
            style={{ backgroundImage: "url('/collection-bg.png')" }}
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-background/75"
          />
        </>
      )}

      <SideFlorals spots={["tl", "br", "ml"]} opacity="opacity-30" />

      <div className="relative z-10 max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-end mb-16 lg:mb-24">
          <div className="lg:col-span-7">
            <Reveal>
              <span className="block text-[11px] font-bold tracking-[0.4em] uppercase text-[#171717] mb-6">
                {eyebrowText}
              </span>
            </Reveal>
            <RevealLines
              className="font-serif font-semibold uppercase tracking-[0.01em] leading-[1] text-foreground text-[clamp(2.4rem,12vw,5.6rem)] break-words"
              lines={[titleText]}
            />
          </div>
          <Reveal delay={200} className="lg:col-span-5">
            {intro ? (
              <p className="text-[#2e2a22] text-[17px] font-normal leading-[1.8] max-w-md">
                {intro}
              </p>
            ) : (
              <p className="text-[#2e2a22] text-[17px] font-normal leading-[1.8] max-w-md">
                {t.collection.intro1}
                <strong className="font-semibold">
                  {t.collection.introStrong}
                </strong>
                {t.collection.intro2}
              </p>
            )}
          </Reveal>
        </div>

        {showFilter && (
          <Reveal>
            <div
              role="group"
              aria-label={t.collection.filterLabel}
              className="flex flex-wrap gap-2.5 mb-14 lg:mb-20"
            >
              {[
                { value: "", label: t.collection.all, count: perfumes.length },
                // GENDERS donne l'ordre et les valeurs ; le libellé affiché
                // vient du dictionnaire, pour suivre la langue choisie.
                ...GENDERS.filter((g) => counts.has(g.value)).map((g) => ({
                  value: g.value as string,
                  label: t.gender[g.value],
                  count: counts.get(g.value) ?? 0,
                })),
              ].map((opt) => {
                const active = genderFilter === opt.value;
                return (
                  <button
                    key={opt.value || "tous"}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setGenderFilter(opt.value)}
                    className={`inline-flex items-center px-5 py-2.5 pointer-coarse:min-h-[44px] text-[11px] font-semibold tracking-[0.18em] uppercase border transition-colors duration-300 ${
                      active
                        ? "bg-[#171717] text-white border-[#171717]"
                        : "bg-transparent text-[#171717] border-champagne hover:border-[#171717]"
                    }`}
                  >
                    {opt.label}
                    <span
                      className={active ? "opacity-60" : "opacity-45"}
                    >{` (${opt.count})`}</span>
                  </button>
                );
              })}
            </div>
          </Reveal>
        )}

        {perfumes.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-champagne">
            <Package className="w-10 h-10 text-champagne mx-auto mb-5" />
            <p className="text-muted-foreground font-light">
              {t.collection.empty}
            </p>
            <p className="text-muted-foreground/60 text-sm mt-1.5">
              {t.collection.emptyHint}
            </p>
          </div>
        ) : visible.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-champagne">
            <Package className="w-10 h-10 text-champagne mx-auto mb-5" />
            <p className="text-muted-foreground font-light">
              {t.collection.emptyCategory}
            </p>
            <button
              type="button"
              onClick={() => onRequest()}
              className="mt-5 inline-flex items-center justify-center px-4 pointer-coarse:min-h-[44px] text-[11px] font-semibold tracking-[0.18em] uppercase text-bordeaux hover:underline underline-offset-4"
            >
              {t.collection.askYours}
            </button>
          </div>
        ) : (
          <div>
            {visible.map((p, i) => (
              <div key={p.id}>
                {i > 0 && (
                  <Reveal>
                    <FloralDivider className="my-16 lg:my-24" />
                  </Reveal>
                )}
                <PerfumeRow perfume={p} index={i} onRequest={onRequest} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════
   L'ART DU PARFUM, ACCESSIBLE
   ══════════════════════════════════════════════ */
function Concept() {
  const { t } = useLang();

  return (
    <section
      id="about"
      className="relative bg-surface-alt border-y border-champagne overflow-hidden py-20 sm:py-28 lg:py-32"
    >
      <SideFlorals
        spots={["tl", "tr", "bl", "br", "ml", "mr"]}
        opacity="opacity-40"
      />

      <div className="relative z-10 max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Texte à gauche */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <Reveal>
              <span className="label-xs block mb-6">{t.concept.eyebrow}</span>
            </Reveal>

            <RevealLines
              className="display font-normal text-[clamp(2rem,9vw,3.7rem)]"
              lines={[...t.concept.title]}
            />

            <Reveal delay={200}>
              <span className="rule my-7" />
              <p className="text-[#4a4236] text-[16px] font-light leading-[1.85] max-w-md">
                {BRAND}, {t.concept.text}
              </p>
            </Reveal>

            <Reveal delay={340}>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-7 sm:gap-6 border-t border-champagne pt-9 mt-10">
                {[
                  { v: t.concept.stat1, l: t.concept.stat1Label },
                  { v: t.concept.stat2, l: t.concept.stat2Label },
                  { v: t.concept.stat3, l: t.concept.stat3Label },
                ].map((s) => (
                  <div key={s.l}>
                    <div className="font-serif text-[1.7rem] sm:text-[1.9rem] font-medium text-foreground leading-none">
                      {s.v}
                    </div>
                    <div className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#6b6255] mt-3">
                      {s.l}
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Grande image à droite */}
          <div className="lg:col-span-6 lg:col-start-7 order-1 lg:order-2">
            <Parallax strength={18}>
              <Img
                name="concept"
                alt="L’art du parfum"
                ratio="aspect-[4/5]"
                position="center 45%"
                zoomOnHover
              />
            </Parallax>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════
   SECTION VISUELLE — grande image immersive
   ══════════════════════════════════════════════ */
function Signature() {
  const { t } = useLang();

  return (
    <section className="relative w-full overflow-hidden">
      {/*
        `svh` et non `vh` : sur iOS et Android la barre d'adresse fait varier
        `vh`, ce qui décalait le bloc de texte au moindre scroll. `svh` se
        cale sur la petite hauteur — la section ne bouge plus.
      */}
      <div className="relative h-[70svh] min-h-[400px] lg:h-[86svh] w-full">
        <Img
          name="showcase"
          alt={`${t.signature.alt} ${BRAND}`}
          ratio="h-full"
          position="center 50%"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/55" />

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-6">
            <RevealLines
              className="font-serif font-normal uppercase tracking-[0.02em] leading-[1.05] text-white text-[clamp(1.75rem,8.5vw,4.2rem)] drop-shadow-sm"
              lines={[...t.signature.title]}
            />
            <Reveal delay={360}>
              <Link
                href="/#collection"
                className="mt-8 sm:mt-10 inline-flex items-center gap-3 bg-white text-[#171717] px-7 sm:px-10 py-4 sm:py-5 text-[11px] sm:text-[12px] font-bold tracking-[0.2em] uppercase transition-colors duration-500 hover:bg-[#efe8dc]"
              >
                {t.signature.cta}
                <ArrowRight className="w-4 h-4 rtl:-scale-x-100" />
              </Link>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════
   CONTACT
   ══════════════════════════════════════════════ */
function Contact({ onRequest }: { onRequest: () => void }) {
  const { t } = useLang();

  return (
    <section
      id="contact"
      className="relative bg-background overflow-hidden py-20 sm:py-28 lg:py-32"
    >
      <SideFlorals
        spots={["tl", "tr", "bl", "br", "ml", "mr"]}
        opacity="opacity-40"
      />

      <div className="relative z-10 max-w-2xl mx-auto px-5 sm:px-6 text-center">
        <Reveal>
          <span className="label-xs block mb-6">
            {t.contactSection.eyebrow}
          </span>
        </Reveal>
        <RevealLines
          className="display font-normal text-[clamp(1.9rem,9vw,3.5rem)]"
          lines={[...t.contactSection.title]}
        />
        <Reveal delay={200}>
          <FloralDivider className="my-9" />
          <p className="text-[#4a4236] text-[16px] font-light leading-[1.85] mb-11">
            {t.contactSection.text}
          </p>

          {/*
            Trois boutons côte à côte ne tiennent pas sur une tablette : sans
            `flex-wrap` le troisième débordait ou écrasait les deux autres.
            Empilés sur téléphone, ils passent à la ligne au besoin ensuite.
          */}
          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 justify-center">
            <Link
              href="/#collection"
              className="bg-[#171717] text-white px-7 sm:px-8 py-[18px] text-[11px] font-bold tracking-[0.2em] uppercase flex items-center justify-center gap-2.5 transition-colors duration-500 hover:bg-[#3a3a3a]"
            >
              <ShoppingBag className="w-4 h-4 shrink-0" />
              {t.contactSection.seeCollection}
            </Link>
            <button
              type="button"
              onClick={onRequest}
              className="border border-[#171717] text-[#171717] px-7 sm:px-8 py-[18px] text-[11px] font-bold tracking-[0.2em] uppercase transition-colors duration-500 hover:bg-[#171717] hover:text-white"
            >
              {t.contactSection.request}
            </button>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-champagne text-[#4a4236] px-7 sm:px-8 py-[18px] text-[11px] font-semibold tracking-[0.2em] uppercase flex items-center justify-center gap-2.5 transition-colors duration-500 hover:border-[#171717] hover:text-[#171717]"
            >
              <Instagram className="w-4 h-4 shrink-0" />
              {t.contactSection.instagram}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════
   HOME
   ══════════════════════════════════════════════ */
export default function Home() {
  const { t } = useLang();
  const [perfumes, setPerfumes] = useState<Perfume[]>([]);
  const [requestOpen, setRequestOpen] = useState(false);

  const fetchPerfumes = useCallback(async () => {
    try {
      const res = await fetch("/api/perfumes");
      const data = await res.json();
      setPerfumes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching perfumes:", error);
    }
  }, []);

  useEffect(() => {
    fetchPerfumes();
  }, [fetchPerfumes]);

  const decants = perfumes.filter((p) => !p.isPack);
  const packs = perfumes.filter((p) => p.isPack);

  const [prefill, setPrefill] = useState<RequestPrefill | undefined>(undefined);

  const openRequest = useCallback(
    (p?: RequestPrefill) => {
      setPrefill(p);
      setRequestOpen(true);
    },
    []
  );
  const closeRequest = useCallback(() => setRequestOpen(false), []);

  return (
    <div className="min-h-screen flex flex-col bg-background overflow-x-hidden">
      <Navbar />
      {/*
        Le décalage sous la navbar fixe est porté par <main>, pas par la
        première section. Le carrousel n'existe que s'il contient des visuels :
        s'il portait lui-même ce décalage, une page sans visuel verrait son
        titre passer sous la navbar.
      */}
      <main className="flex-1 pt-[76px] lg:pt-[92px]">
        <HeroCarousel />
        <Hero onRequest={() => openRequest()} />
        {/* Entre le hero et la collection : le visiteur vient de voir la
            marque, il décide s'il descend. C'est là qu'une annonce agit. */}
        <AnnouncementsSection />
        <Collection
          perfumes={decants}
          onRequest={openRequest}
          withGenderFilter
        />
        <Collection
          perfumes={packs}
          onRequest={openRequest}
          id="packs"
          eyebrow={t.collection.packsEyebrow}
          title={t.collection.packsTitle}
          intro={t.collection.packsIntro}
          variant="packs"
        />
        <Concept />
        <Signature />
        <Contact onRequest={() => openRequest()} />
      </main>
      <Footer />

      <PerfumeRequestModal
        open={requestOpen}
        onClose={closeRequest}
        prefill={prefill}
      />
    </div>
  );
}
