"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { ArrowRight, Bell, Instagram, Package, ShoppingBag } from "lucide-react";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { Img } from "@/components/site/media";
import { AnnouncementsSection } from "@/components/site/announcements-section";
import { SideFlorals, FloralDivider } from "@/components/site/botanical";
import { Reveal, RevealLines, Parallax } from "@/components/site/reveal";
import {
  PerfumeRequestModal,
  type RequestPrefill,
} from "@/components/site/perfume-request-modal";
import { BRAND, INSTAGRAM_URL, resolveImg } from "@/lib/site";
import { resolveAvailability } from "@/lib/availability";
import {
  GENDERS,
  genderLabel,
  normalizeGender,
  // genderLabel reste utilisé ailleurs dans la page (fiche parfum)
  priceWithDiscount,
  discountEndLabel,
} from "@/lib/pricing";
import type { Perfume } from "@/lib/types";

/* ══════════════════════════════════════════════
   HERO — [ grande image ASSIL ]  [ texte + CTA ]
   ══════════════════════════════════════════════ */
function Hero({ onRequest }: { onRequest: () => void }) {
  return (
    <section
      id="hero"
      className="relative bg-background overflow-hidden pt-[100px] lg:pt-[124px]"
    >
      <SideFlorals spots={["tl", "tr", "br", "mr", "bl"]} opacity="opacity-40" />

      <div className="relative z-10 max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 pb-16 lg:pb-24">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/*
            Image — pièce maîtresse. Même cadre 9:16 que les fiches produit :
            une photo prise au téléphone remplit le cadre exactement, sans
            aucun recadrage. La largeur est bornée, sinon 9:16 sur six colonnes
            donnerait une image de plus de 1000 px de haut.
          */}
          <div className="lg:col-span-5 order-1">
            <Parallax strength={22}>
              <Img
                name="hero-bottle"
                alt={`Flacon de parfum ${BRAND}`}
                ratio="aspect-[9/16]"
                className="mx-auto max-w-[300px] sm:max-w-[380px] lg:max-w-[440px] lg:mx-0"
                priority
              />
            </Parallax>
          </div>

          {/* Texte */}
          <div className="lg:col-span-6 lg:col-start-7 order-2">
            <Reveal>
              <span className="label-xs block mb-7">
                Décants de parfums originaux
              </span>
            </Reveal>

            <RevealLines
              className="display text-[3rem] sm:text-[4.2rem] lg:text-[4.6rem] xl:text-[5.2rem] mb-8"
              lines={["Le parfum", "original,", "en décant."]}
            />

            <Reveal delay={180}>
              <span className="rule mb-8" />
              <p className="text-[#4a4236] text-[16px] sm:text-[17px] font-light leading-[1.85] max-w-md mb-10">
                Nous achetons des flacons de parfum originaux et les proposons
                en petits formats — le même parfum, à un prix accessible.
              </p>
            </Reveal>

            <Reveal delay={300}>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/#collection"
                  className="bg-[#171717] text-white px-8 py-[18px] text-[11px] font-bold tracking-[0.2em] uppercase text-center transition-colors duration-500 hover:bg-[#3a3a3a]"
                >
                  Voir les décants
                </Link>
                <button
                  type="button"
                  onClick={onRequest}
                  className="border border-[#171717] text-[#171717] px-8 py-[18px] text-[11px] font-bold tracking-[0.2em] uppercase text-center transition-colors duration-500 hover:bg-[#171717] hover:text-white"
                >
                  Votre parfum préféré
                </button>
              </div>
            </Reveal>
          </div>
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
  const [imgError, setImgError] = useState(false);
  const stock = resolveAvailability(perfume.availability);
  const sexe = genderLabel(perfume.gender);
  const imageUrl = resolveImg(perfume.image);
  const sizes = perfume.sizes ?? [];
  // Chaque format porte son prix catalogue et son prix remisé.
  const priced = sizes.map((s) => ({
    ...s,
    view: priceWithDiscount(s.price, perfume.discount, perfume.discountUntil),
  }));
  const from = priced.length
    ? Math.min(...priced.map((s) => s.view.final || Infinity))
    : null;
  const percent = priced[0]?.view.percent ?? 0;
  const promoEnd = percent > 0 ? discountEndLabel(perfume.discountUntil) : "";
  const flipped = index % 2 === 1;

  return (
    <article className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-center">
      {/* Image dans son cadre noir */}
      <Reveal
        className={`lg:col-span-5 group ${flipped ? "lg:col-start-8 lg:row-start-1" : ""}`}
      >
        <Link
          href={`/commander/${perfume.id}`}
          className="block"
          aria-label={`Découvrir ${perfume.name}`}
        >
          <ProductFrame
            src={imageUrl}
            alt={perfume.name}
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

        <h3 className="font-serif font-semibold uppercase tracking-[0.015em] leading-[1.05] text-foreground text-[1.9rem] sm:text-[2.6rem] lg:text-[3.3rem] break-words">
          <Link href={`/commander/${perfume.id}`}>{perfume.name}</Link>
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
            {stock.badge}
          </span>

          {percent > 0 && stock.orderable && (
            <span className="chip-bordeaux inline-flex items-center px-3 py-1.5 text-[9.5px] sm:px-3.5 sm:text-[10px] font-bold tracking-[0.2em] uppercase">
              −{percent}%
            </span>
          )}

          {sexe && (
            <span className="chip-champagne inline-flex items-center px-3 py-1.5 text-[9.5px] sm:px-3.5 sm:text-[10px] font-semibold tracking-[0.2em] uppercase">
              {sexe}
            </span>
          )}

          {perfume.family && (
            <span className="chip-bordeaux inline-flex items-center px-3 py-1.5 text-[9.5px] sm:px-3.5 sm:text-[10px] font-bold tracking-[0.2em] uppercase">
              {perfume.family}
            </span>
          )}

        </div>

        <span className="rule my-6" />

        <p className="text-[#4a4236] text-[15.5px] font-light leading-[1.85] max-w-lg">
          {perfume.description}
        </p>

        {perfume.notes && (
          <p className="mt-4 text-[14px] text-[#4a4236] font-light leading-[1.8] max-w-lg">
            <span className="text-[10px] font-bold tracking-[0.24em] uppercase text-bordeaux block mb-1.5">
              Notes principales
            </span>
            {perfume.notes}
          </p>
        )}

        {promoEnd && (
          <p className="mt-4 text-[12.5px] font-medium text-bordeaux">
            Offre valable jusqu’au {promoEnd}.
          </p>
        )}

        {sizes.length > 0 && (
          <div className="mt-8">
            <span className="block text-[10px] font-bold tracking-[0.26em] uppercase text-bordeaux mb-3">
              Formats disponibles
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

                return stock.orderable ? (
                  <Link
                    key={s.id ?? i}
                    href={`/commander/${perfume.id}?taille=${encodeURIComponent(s.label)}`}
                    className="size-chip px-4 py-2.5 text-[13px] sm:px-5 sm:py-3 sm:text-[14px]"
                  >
                    {contenu}
                  </Link>
                ) : (
                  <span
                    key={s.id ?? i}
                    className="chip-bordeaux px-4 py-2.5 text-[13px] sm:px-5 sm:py-3 sm:text-[14px] opacity-45"
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
            À partir de{" "}
            <span className="font-serif text-[1.9rem] font-medium text-bordeaux align-middle">
              {from} MAD
            </span>
          </p>
        )}

        {stock.orderable ? (
          <Link
            href={`/commander/${perfume.id}`}
            className="mt-8 w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-[#171717] text-white px-10 py-5 text-[12px] font-bold tracking-[0.2em] uppercase transition-colors duration-500 hover:bg-[#3a3a3a]"
          >
            <ShoppingBag className="w-4 h-4" />
            Commander
          </Link>
        ) : (
          <div className="mt-8">
            <button
              type="button"
              onClick={() =>
                onRequest({
                  name: perfume.name,
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
              {stock.cta}
            </button>
            <p className="mt-3 text-[13px] text-[#6b6255] font-light">
              {stock.value === "bientot"
                ? "Ce parfum arrive bientôt. Laissez-nous vos coordonnées, nous vous prévenons dès sa mise en ligne."
                : "Ce parfum n’est plus en stock. Laissez-nous vos coordonnées, nous vous prévenons dès son retour."}
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
  eyebrow = "La collection",
  title = "Nos décants",
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
  const packs = variant === "packs";

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
                {eyebrow}
              </span>
            </Reveal>
            <RevealLines
              className="font-serif font-semibold uppercase tracking-[0.01em] leading-[1] text-foreground text-[3.2rem] sm:text-[4.6rem] lg:text-[5.6rem]"
              lines={[title]}
            />
          </div>
          <Reveal delay={200} className="lg:col-span-5">
            {intro ? (
              <p className="text-[#2e2a22] text-[17px] font-normal leading-[1.8] max-w-md">
                {intro}
              </p>
            ) : (
              <p className="text-[#2e2a22] text-[17px] font-normal leading-[1.8] max-w-md">
                Un décant, c&apos;est du parfum{" "}
                <strong className="font-semibold">100 % original</strong>{" "}
                transvasé du flacon de marque dans un petit format. Même
                parfum, même tenue — vous payez la quantité, pas le flacon.
              </p>
            )}
          </Reveal>
        </div>

        {showFilter && (
          <Reveal>
            <div
              role="group"
              aria-label="Filtrer par genre"
              className="flex flex-wrap gap-2.5 mb-14 lg:mb-20"
            >
              {[
                { value: "", label: "Tous", count: perfumes.length },
                // GENDERS contient des objets { value, label } — on garde le
                // libellé officiel plutôt que d'en réinventer un ici.
                ...GENDERS.filter((g) => counts.has(g.value)).map((g) => ({
                  value: g.value as string,
                  label: g.label as string,
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
                    className={`px-5 py-2.5 text-[11px] font-semibold tracking-[0.18em] uppercase border transition-colors duration-300 ${
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
              Aucun parfum publié pour le moment
            </p>
            <p className="text-muted-foreground/60 text-sm mt-1.5">
              Ajoutez vos parfums depuis l’espace admin
            </p>
          </div>
        ) : visible.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-champagne">
            <Package className="w-10 h-10 text-champagne mx-auto mb-5" />
            <p className="text-muted-foreground font-light">
              Aucun décant dans cette catégorie pour le moment
            </p>
            <button
              type="button"
              onClick={() => onRequest()}
              className="mt-5 text-[11px] font-semibold tracking-[0.18em] uppercase text-bordeaux hover:underline underline-offset-4"
            >
              Demander votre parfum préféré
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
              <span className="label-xs block mb-6">Le concept</span>
            </Reveal>

            <RevealLines
              className="display font-normal text-[2.4rem] sm:text-[3.2rem] lg:text-[3.7rem]"
              lines={["L’art du parfum,", "accessible."]}
            />

            <Reveal delay={200}>
              <span className="rule my-7" />
              <p className="text-[#4a4236] text-[16px] font-light leading-[1.85] max-w-md">
                Chez {BRAND}, nous sélectionnons des parfums originaux et
                authentiques pour vous permettre de découvrir vos fragrances
                préférées dans des formats accessibles.
              </p>
            </Reveal>

            <Reveal delay={340}>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-7 sm:gap-6 border-t border-champagne pt-9 mt-10">
                {[
                  { v: "100%", l: "Original" },
                  { v: "Dès 5 ml", l: "Jusqu’au flacon complet" },
                  { v: "Livraison", l: "Partout au Maroc" },
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
  return (
    <section className="relative w-full overflow-hidden">
      <div className="relative h-[72vh] min-h-[440px] lg:h-[86vh] w-full">
        <Img
          name="showcase"
          alt={`Univers ${BRAND}`}
          ratio="h-full"
          position="center 50%"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/55" />

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-6">
            <RevealLines
              className="font-serif font-normal uppercase tracking-[0.02em] leading-[1.05] text-white text-[2.1rem] sm:text-[3.3rem] lg:text-[4.2rem] drop-shadow-sm"
              lines={["Une fragrance.", "Une présence.", "Une signature."]}
            />
            <Reveal delay={360}>
              <Link
                href="/#collection"
                className="mt-10 inline-flex items-center gap-3 bg-white text-[#171717] px-10 py-5 text-[12px] font-bold tracking-[0.2em] uppercase transition-colors duration-500 hover:bg-[#efe8dc]"
              >
                Découvrir la boutique
                <ArrowRight className="w-4 h-4" />
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
  return (
    <section
      id="contact"
      className="relative bg-background overflow-hidden py-20 sm:py-28 lg:py-32"
    >
      <SideFlorals
        spots={["tl", "tr", "bl", "br", "ml", "mr"]}
        opacity="opacity-40"
      />

      <div className="relative z-10 max-w-2xl mx-auto px-6 text-center">
        <Reveal>
          <span className="label-xs block mb-6">Contact</span>
        </Reveal>
        <RevealLines
          className="display font-normal text-[2.3rem] sm:text-[3.1rem] lg:text-[3.5rem]"
          lines={["Votre parfum", "vous attend"]}
        />
        <Reveal delay={200}>
          <FloralDivider className="my-9" />
          <p className="text-[#4a4236] text-[16px] font-light leading-[1.85] mb-11">
            Parcourez la collection, choisissez votre format et commandez
            directement sur le site. Paiement à la livraison, partout au Maroc.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/#collection"
              className="bg-[#171717] text-white px-8 py-[18px] text-[11px] font-bold tracking-[0.2em] uppercase flex items-center justify-center gap-2.5 transition-colors duration-500 hover:bg-[#3a3a3a]"
            >
              <ShoppingBag className="w-4 h-4" />
              Voir la collection
            </Link>
            <button
              type="button"
              onClick={onRequest}
              className="border border-[#171717] text-[#171717] px-8 py-[18px] text-[11px] font-bold tracking-[0.2em] uppercase transition-colors duration-500 hover:bg-[#171717] hover:text-white"
            >
              Votre parfum préféré
            </button>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-champagne text-[#4a4236] px-8 py-[18px] text-[11px] font-semibold tracking-[0.2em] uppercase flex items-center justify-center gap-2.5 transition-colors duration-500 hover:border-[#171717] hover:text-[#171717]"
            >
              <Instagram className="w-4 h-4" />
              Instagram
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
      <main className="flex-1">
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
          eyebrow="Coffrets"
          title="Nos packs"
          intro="Plusieurs parfums réunis, à prix réduit. Idéal pour découvrir
                 plusieurs signatures ou pour offrir."
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
