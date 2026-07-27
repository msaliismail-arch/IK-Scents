"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowRight, Bell, Instagram, Package, ShoppingBag } from "lucide-react";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { Img } from "@/components/site/media";
import { SideFlorals, FloralDivider } from "@/components/site/botanical";
import { Reveal, RevealLines, Parallax } from "@/components/site/reveal";
import {
  PerfumeRequestModal,
  type RequestPrefill,
} from "@/components/site/perfume-request-modal";
import { BRAND, INSTAGRAM_URL, resolveImg } from "@/lib/site";
import { resolveAvailability } from "@/lib/availability";
import { genderLabel, priceWithDiscount } from "@/lib/pricing";
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
          {/* Image — pièce maîtresse, jamais recadrée */}
          <div className="lg:col-span-6 order-1">
            <Parallax strength={22}>
              <Img
                name="hero-bottle"
                alt={`Flacon de parfum ${BRAND}`}
                ratio="aspect-[4/5]"
                className="lg:max-h-[76vh]"
                position="center 45%"
                priority
              />
            </Parallax>
          </div>

          {/* Texte */}
          <div className="lg:col-span-6 xl:col-span-5 xl:col-start-8 order-2 lg:pl-4">
            <Reveal>
              <span className="label-xs block mb-7">
                Parfumerie conceptuelle
              </span>
            </Reveal>

            <RevealLines
              className="display text-[3rem] sm:text-[4.2rem] lg:text-[4.6rem] xl:text-[5.2rem] mb-8"
              lines={["Découvrez", "l’essence", `d’${BRAND}.`]}
            />

            <Reveal delay={180}>
              <span className="rule mb-8" />
              <p className="text-[#4a4236] text-[16px] sm:text-[17px] font-light leading-[1.85] max-w-md mb-10">
                Des parfums originaux, sélectionnés avec soin et proposés dans
                des formats accessibles.
              </p>
            </Reveal>

            <Reveal delay={300}>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/#collection"
                  className="bg-[#171717] text-white px-8 py-[18px] text-[11px] font-bold tracking-[0.2em] uppercase text-center transition-colors duration-500 hover:bg-[#3a3a3a]"
                >
                  Découvrir les essences
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
   DE L'ORIGINAL À VOTRE PORTE — les 3 étapes
   ══════════════════════════════════════════════ */
const STEPS = [
  {
    n: "01",
    img: "step-1",
    t: "Parfums originaux",
    d: "Nous sélectionnons des parfums originaux et authentiques avec soin.",
  },
  {
    n: "02",
    img: "step-2",
    t: "Votre format",
    d: "Nous décomposons les parfums originaux en formats 10 ml ou 20 ml, selon votre choix.",
  },
  {
    n: "03",
    img: "step-3",
    t: "Livraison",
    d: "Votre parfum est soigneusement préparé puis livré directement chez vous.",
  },
];

function Steps() {
  return (
    <section
      id="methode"
      className="relative bg-surface-alt border-y border-champagne overflow-hidden py-20 sm:py-28 lg:py-32"
    >
      <SideFlorals
        spots={["tl", "tr", "bl", "br", "ml", "mr"]}
        opacity="opacity-40"
      />

      <div className="relative z-10 max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-end mb-14 lg:mb-20">
          <div className="lg:col-span-7">
            <Reveal>
              <span className="label-xs block mb-6">Notre méthode</span>
            </Reveal>
            <RevealLines
              className="display font-normal text-[2.4rem] sm:text-[3.4rem] lg:text-[4rem]"
              lines={["De l’original", "à votre porte"]}
            />
          </div>
          <Reveal delay={200} className="lg:col-span-5">
            <p className="text-[#4a4236] text-[16px] font-light leading-[1.85] max-w-md">
              Trois étapes, sans intermédiaire. Du flacon original scellé jusqu’à
              votre porte, au format que vous choisissez.
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-7 lg:gap-12">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 160}>
              <article className="group">
                <Img
                  name={s.img}
                  alt={s.t}
                  ratio="aspect-[4/5] md:aspect-[3/4]"
                  zoomOnHover
                />

                <div className="mt-7 flex items-start gap-5">
                  <span className="font-serif text-[#8a7a63] text-[1.7rem] font-light leading-none pt-0.5">
                    {s.n}
                  </span>
                  <div>
                    <h3 className="font-serif text-[1.5rem] font-normal uppercase tracking-[0.05em] text-foreground leading-tight">
                      {s.t}
                    </h3>
                    <p className="mt-3 text-[#4a4236] text-[14.5px] font-light leading-[1.8]">
                      {s.d}
                    </p>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════
   NOS ESSENCES
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
    view: priceWithDiscount(s.price, perfume.discount),
  }));
  const from = priced.length
    ? Math.min(...priced.map((s) => s.view.final || Infinity))
    : null;
  const percent = priced[0]?.view.percent ?? 0;
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
                  formats: sizes.map((x) => x.label).filter(Boolean),
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
}: {
  perfumes: Perfume[];
  onRequest: (prefill?: RequestPrefill) => void;
}) {
  return (
    <section
      id="collection"
      className="relative bg-background overflow-hidden py-20 sm:py-28 lg:py-32"
    >
      {/* Photo d'ambiance de l'admin, en fond très atténué :
          elle habille la section sans jamais gêner la lecture. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-center lg:bg-fixed opacity-[0.16]"
        style={{ backgroundImage: "url('/collection-bg.png')" }}
      />
      <div aria-hidden="true" className="absolute inset-0 bg-background/75" />

      <SideFlorals spots={["tl", "br", "ml"]} opacity="opacity-30" />

      <div className="relative z-10 max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-end mb-16 lg:mb-24">
          <div className="lg:col-span-7">
            <Reveal>
              <span className="block text-[11px] font-bold tracking-[0.4em] uppercase text-[#171717] mb-6">
                La collection
              </span>
            </Reveal>
            <RevealLines
              className="font-serif font-semibold uppercase tracking-[0.01em] leading-[1] text-foreground text-[3.2rem] sm:text-[4.6rem] lg:text-[5.6rem]"
              lines={["Nos essences"]}
            />
          </div>
          <Reveal delay={200} className="lg:col-span-5">
            <p className="text-[#2e2a22] text-[17px] font-normal leading-[1.8] max-w-md">
              Des parfums <strong className="font-semibold">100 % originaux</strong>,
              sélectionnés un à un. Choisissez votre format 10 ml ou 20 ml,
              commandez en ligne, payez à la réception.
            </p>
          </Reveal>
        </div>

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
        ) : (
          <div>
            {perfumes.map((p, i) => (
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
                  { v: "10 / 20 ml", l: "Formats accessibles" },
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
        <Steps />
        <Collection perfumes={perfumes} onRequest={openRequest} />
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
