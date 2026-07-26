"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowRight, Instagram, Package, ShoppingBag } from "lucide-react";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { Img } from "@/components/site/media";
import { SideFlorals, FloralDivider } from "@/components/site/botanical";
import { Reveal, RevealLines, Parallax } from "@/components/site/reveal";
import { BRAND, INSTAGRAM_URL, resolveImg } from "@/lib/site";
import type { Perfume } from "@/lib/types";

/* ══════════════════════════════════════════════
   02 — HERO
   [ grande image ASSIL ]  [ texte + CTA ]
   ══════════════════════════════════════════════ */
function Hero() {
  return (
    <section
      id="hero"
      className="relative bg-background overflow-hidden pt-[96px] lg:pt-[104px]"
    >
      <SideFlorals spots={["tl", "br", "mr"]} opacity="opacity-45" />

      <div className="relative z-10 max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 pb-16 lg:pb-24">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Image — pièce maîtresse */}
          <div className="lg:col-span-6 xl:col-span-6 order-1">
            <Parallax strength={22}>
              <Img
                name="hero-bottle"
                alt={`Flacon de parfum ${BRAND}`}
                ratio="aspect-[4/5] sm:aspect-[4/5] lg:aspect-[4/5]"
                className="lg:max-h-[78vh]"
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
              <p className="text-muted-foreground text-[15px] sm:text-base font-light leading-[1.9] max-w-md mb-10">
                Chaque fragrance raconte une histoire.
                <br className="hidden sm:block" /> Une émotion. Une présence.
                Une signature.
              </p>
            </Reveal>

            <Reveal delay={300}>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/#collection"
                  className="btn-gold px-8 py-4 text-[10px] font-medium tracking-[0.22em] uppercase text-center transition-colors duration-500"
                >
                  Découvrir les essences
                </Link>
                <Link
                  href="/#experience"
                  className="btn-outline-ink px-8 py-4 text-[10px] font-medium tracking-[0.22em] uppercase text-center"
                >
                  Créer votre parfum
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════
   03 — L'EXPÉRIENCE PERSONNALISÉE
   ══════════════════════════════════════════════ */
const STEPS = [
  {
    n: "01",
    img: "step-1",
    t: "Questionnaire olfactif",
    d: "Dites-nous ce qui vous ressemble : les matières que vous aimez, les moments que vous voulez habiller.",
  },
  {
    n: "02",
    img: "step-2",
    t: "Sélection de notes",
    d: "Nous composons une sélection de parfums originaux dont les accords répondent à votre profil.",
  },
  {
    n: "03",
    img: "step-3",
    t: "Création unique",
    d: "Votre flacon est préparé au format choisi, emballé avec soin, puis livré chez vous.",
  },
];

function Experience() {
  return (
    <section
      id="experience"
      className="relative bg-surface-alt border-y border-champagne overflow-hidden py-20 sm:py-28 lg:py-32"
    >
      <SideFlorals spots={["tl", "tr", "bl", "br"]} opacity="opacity-45" />

      <div className="relative z-10 max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-end mb-14 lg:mb-20">
          <div className="lg:col-span-7">
            <Reveal>
              <span className="label-xs block mb-6">Sur mesure</span>
            </Reveal>
            <RevealLines
              className="display text-[2.4rem] sm:text-[3.4rem] lg:text-[4rem]"
              lines={["L’expérience", "personnalisée"]}
            />
          </div>
          <Reveal delay={200} className="lg:col-span-5">
            <p className="text-muted-foreground text-[15px] font-light leading-[1.9] max-w-md">
              Trois temps, pensés comme une conversation. Le résultat n’est pas
              un produit choisi au hasard — c’est une signature qui vous
              appartient.
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
                  <span className="font-serif text-[#b3a58c] text-[1.7rem] font-light leading-none pt-0.5">
                    {s.n}
                  </span>
                  <div>
                    <h3 className="font-serif text-[1.35rem] font-light uppercase tracking-[0.06em] text-foreground leading-tight">
                      {s.t}
                    </h3>
                    <p className="mt-3 text-muted-foreground text-[13.5px] font-light leading-[1.8]">
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
   04 — NOS ESSENCES (grandes compositions)
   ══════════════════════════════════════════════ */
function PerfumeRow({ perfume, index }: { perfume: Perfume; index: number }) {
  const [imgError, setImgError] = useState(false);
  const imageUrl = resolveImg(perfume.image);
  const sizes = perfume.sizes ?? [];
  const from = sizes.length
    ? Math.min(...sizes.map((s) => Number.parseFloat(s.price) || Infinity))
    : null;
  const flipped = index % 2 === 1;

  return (
    <article className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-center">
      {/* Image — format 9:16 (portrait vertical) */}
      <Reveal
        className={`lg:col-span-5 ${flipped ? "lg:col-start-8 lg:row-start-1" : ""}`}
      >
        <Link
          href={`/commander/${perfume.id}`}
          className="block zoom-hover overflow-hidden bg-[#efe8dc] aspect-[9/16] mx-auto max-w-[320px] sm:max-w-[380px] lg:max-w-[430px] lg:mx-0"
          aria-label={`Découvrir ${perfume.name}`}
        >
          {!imgError ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt={perfume.name}
              loading="lazy"
              onError={() => setImgError(true)}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center font-serif text-2xl uppercase tracking-[0.2em] text-[#8a7a63]">
              {perfume.name}
            </div>
          )}
        </Link>
      </Reveal>

      {/* Texte */}
      <Reveal
        delay={140}
        className={`lg:col-span-6 ${flipped ? "lg:col-start-1 lg:row-start-1" : "lg:col-start-7"}`}
      >
        <span className="font-serif text-[#b3a58c] text-[1.4rem] font-light block mb-4">
          {String(index + 1).padStart(2, "0")}
        </span>

        <h3 className="display text-[2.2rem] sm:text-[2.8rem] lg:text-[3rem] leading-[1.05]">
          <Link href={`/commander/${perfume.id}`}>{perfume.name}</Link>
        </h3>

        <span className="rule my-6" />

        <p className="text-muted-foreground text-[14.5px] font-light leading-[1.9] max-w-md">
          {perfume.description}
        </p>

        {sizes.length > 0 && (
          <div className="mt-8">
            <span className="block text-[10px] tracking-[0.28em] uppercase text-muted-foreground/80 mb-3">
              Formats disponibles
            </span>
            <div className="flex flex-wrap gap-2">
              {sizes.map((s, i) => (
                <Link
                  key={s.id ?? i}
                  href={`/commander/${perfume.id}?taille=${encodeURIComponent(s.label)}`}
                  className="px-4 py-2 border border-champagne bg-white/60 text-[12px] text-foreground hover:border-foreground transition-colors duration-500"
                >
                  <span className="font-medium">{s.label}</span>
                  <span className="text-muted-foreground"> · {s.price} MAD</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="mt-9 flex flex-wrap items-center gap-7">
          <Link
            href={`/commander/${perfume.id}`}
            className="group inline-flex items-center gap-3 text-[10px] font-medium tracking-[0.26em] uppercase text-foreground border-b border-foreground pb-2 transition-colors duration-500 hover:text-[#5c5344] hover:border-[#5c5344]"
          >
            Découvrir
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-500 group-hover:translate-x-1.5" />
          </Link>

          {from && Number.isFinite(from) && (
            <span className="text-[13px] text-muted-foreground font-light">
              À partir de{" "}
              <span className="font-serif text-lg text-foreground">
                {from} MAD
              </span>
            </span>
          )}
        </div>
      </Reveal>
    </article>
  );
}

function Collection({ perfumes }: { perfumes: Perfume[] }) {
  return (
    <section
      id="collection"
      className="relative bg-background overflow-hidden py-20 sm:py-28 lg:py-32"
    >
      <SideFlorals spots={["tl", "br", "ml"]} opacity="opacity-40" />

      <div className="relative z-10 max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-end mb-16 lg:mb-24">
          <div className="lg:col-span-7">
            <Reveal>
              <span className="label-xs block mb-6">La collection</span>
            </Reveal>
            <RevealLines
              className="display text-[2.6rem] sm:text-[3.6rem] lg:text-[4.4rem]"
              lines={["Nos essences"]}
            />
          </div>
          <Reveal delay={200} className="lg:col-span-5">
            <p className="text-muted-foreground text-[15px] font-light leading-[1.9] max-w-md">
              Des parfums originaux, sélectionnés un à un. Choisissez votre
              format, commandez en ligne, payez à la réception.
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
                <PerfumeRow perfume={p} index={i} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════
   05 — STORYTELLING (pleine largeur)
   ══════════════════════════════════════════════ */
function Storytelling() {
  return (
    <section className="relative w-full overflow-hidden">
      <div className="relative h-[62vh] min-h-[380px] sm:h-[70vh] lg:h-[78vh] w-full">
        <Img
          name="collection-bg"
          alt={`Univers ${BRAND}`}
          ratio="h-full"
          position="center 40%"
        />
        {/* voile très léger, la photo reste lisible */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-black/15" />

        <div className="absolute inset-0 flex items-end">
          <div className="w-full max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 pb-12 sm:pb-16 lg:pb-20">
            <RevealLines
              className="display text-white text-[2.1rem] sm:text-[3.2rem] lg:text-[4rem] drop-shadow-sm"
              lines={["Votre voyage olfactif", "commence ici."]}
            />
            <Reveal delay={280}>
              <Link
                href="/#collection"
                className="mt-9 inline-flex items-center gap-3 border border-white/80 text-white px-8 py-4 text-[10px] font-medium tracking-[0.22em] uppercase transition-colors duration-500 hover:bg-white hover:text-foreground"
              >
                Explorer la collection
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════
   06 — L'ART DU PARFUM, ACCESSIBLE
   ══════════════════════════════════════════════ */
function Concept() {
  return (
    <section
      id="about"
      className="relative bg-surface-alt border-y border-champagne overflow-hidden py-20 sm:py-28 lg:py-32"
    >
      <SideFlorals spots={["tl", "tr", "bl", "br"]} opacity="opacity-45" />

      <div className="relative z-10 max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Texte à gauche */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <Reveal>
              <span className="label-xs block mb-6">Le concept</span>
            </Reveal>

            <RevealLines
              className="display text-[2.3rem] sm:text-[3.1rem] lg:text-[3.6rem]"
              lines={["L’art du parfum,", "accessible."]}
            />

            <Reveal delay={200}>
              <span className="rule my-7" />
              <p className="text-muted-foreground text-[15px] font-light leading-[1.9] mb-5 max-w-md">
                Chez {BRAND}, nous croyons que chaque personne mérite de porter
                une fragrance d’exception — authentique, et à un prix juste.
              </p>
              <p className="text-muted-foreground text-[15px] font-light leading-[1.9] max-w-md">
                Nous sélectionnons uniquement des parfums originaux, et nous les
                proposons dans le format qui vous convient, du décant au grand
                flacon.
              </p>
            </Reveal>

            <Reveal delay={340}>
              <div className="grid grid-cols-3 gap-5 sm:gap-8 border-t border-champagne pt-9 mt-10">
                {[
                  { v: "100%", l: "Original" },
                  { v: "48h", l: "Livraison" },
                  { v: "7j/7", l: "Service" },
                ].map((s) => (
                  <div key={s.l}>
                    <div className="font-serif text-[1.9rem] sm:text-[2.3rem] font-light text-foreground leading-none">
                      {s.v}
                    </div>
                    <div className="text-[9.5px] tracking-[0.24em] uppercase text-muted-foreground mt-3">
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
                ratio="aspect-[4/5] lg:aspect-[4/5]"
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
   07 — NOTES OLFACTIVES
   ══════════════════════════════════════════════ */
const NOTES = [
  {
    n: "I",
    t: "Notes de tête",
    s: "Les premières minutes",
    d: "L’ouverture. Vives et lumineuses, elles s’évaporent vite — agrumes, poivre, bergamote, notes vertes.",
  },
  {
    n: "II",
    t: "Notes de cœur",
    s: "Une à trois heures",
    d: "L’âme du parfum. Florales et rondes, elles installent le caractère — jasmin, rose, iris, épices douces.",
  },
  {
    n: "III",
    t: "Notes de fond",
    s: "Jusqu’au soir",
    d: "La trace. Profondes et tenaces, elles restent sur la peau — bois, ambre, musc, vanille, cuir.",
  },
];

function Notes() {
  return (
    <section className="relative bg-[#171717] text-[#f7f4ee] overflow-hidden py-20 sm:py-28 lg:py-32">
      <SideFlorals
        spots={["tl", "tr", "bl", "br"]}
        opacity="opacity-25 invert brightness-150"
      />

      <div className="relative z-10 max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="max-w-2xl mb-16 lg:mb-24">
          <Reveal>
            <span className="block text-[10px] tracking-[0.42em] uppercase font-medium text-[#d8cbb8] mb-6">
              La pyramide
            </span>
          </Reveal>
          <RevealLines
            className="font-serif font-light uppercase tracking-[0.02em] leading-[1.04] text-[2.4rem] sm:text-[3.4rem] lg:text-[4rem] text-[#f7f4ee]"
            lines={["Notes", "olfactives"]}
          />
          <Reveal delay={200}>
            <p className="mt-8 text-[#f7f4ee]/60 text-[15px] font-light leading-[1.9]">
              Un parfum se lit en trois temps. Comprendre sa structure, c’est
              savoir ce que l’on porte.
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#f7f4ee]/12">
          {NOTES.map((note, i) => (
            <Reveal key={note.n} delay={i * 160}>
              <div className="h-full bg-[#171717] py-9 md:py-10 md:px-8 lg:px-10">
                <div className="flex items-baseline gap-4 mb-7">
                  <span className="font-serif text-[#d8cbb8] text-[1.6rem] font-light leading-none">
                    {note.n}
                  </span>
                  <span className="text-[9.5px] tracking-[0.24em] uppercase text-[#f7f4ee]/40">
                    {note.s}
                  </span>
                </div>

                <h3 className="font-serif text-[1.6rem] lg:text-[1.9rem] font-light uppercase tracking-[0.05em] text-[#f7f4ee] leading-tight">
                  {note.t}
                </h3>

                <span className="block w-10 h-px bg-[#d8cbb8]/60 my-6" />

                <p className="text-[#f7f4ee]/55 text-[13.5px] font-light leading-[1.9] pb-2">
                  {note.d}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════
   08 — GRANDE IMAGE FINALE
   ══════════════════════════════════════════════ */
function Signature() {
  return (
    <section className="relative w-full overflow-hidden">
      <div className="relative h-[72vh] min-h-[440px] lg:h-[88vh] w-full">
        <Img
          name="showcase"
          alt={`Coffret ${BRAND}`}
          ratio="h-full"
          position="center 50%"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/5 to-black/50" />

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-6">
            <RevealLines
              className="display text-white text-[2.2rem] sm:text-[3.4rem] lg:text-[4.4rem]"
              lines={["Une signature.", "Une émotion.", BRAND + "."]}
            />
            <Reveal delay={360}>
              <Link
                href="/#about"
                className="mt-10 inline-flex items-center gap-3 bg-white text-foreground px-9 py-4 text-[10px] font-medium tracking-[0.22em] uppercase transition-colors duration-500 hover:bg-[#efe8dc]"
              >
                Découvrir {BRAND}
                <ArrowRight className="w-3.5 h-3.5" />
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
function Contact() {
  return (
    <section
      id="contact"
      className="relative bg-background overflow-hidden py-20 sm:py-28 lg:py-32"
    >
      <SideFlorals spots={["tl", "tr", "bl", "br"]} opacity="opacity-45" />

      <div className="relative z-10 max-w-2xl mx-auto px-6 text-center">
        <Reveal>
          <span className="label-xs block mb-6">Contact</span>
        </Reveal>
        <RevealLines
          className="display text-[2.2rem] sm:text-[3rem] lg:text-[3.4rem]"
          lines={["Votre parfum", "vous attend"]}
        />
        <Reveal delay={200}>
          <FloralDivider className="my-9" />
          <p className="text-muted-foreground text-[15px] font-light leading-[1.9] mb-11">
            Parcourez la collection, choisissez votre format et commandez
            directement sur le site. Paiement à la livraison, partout au Maroc.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/#collection"
              className="btn-gold px-8 py-4 text-[10px] font-medium tracking-[0.22em] uppercase flex items-center justify-center gap-2.5 transition-colors duration-500"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              Voir la collection
            </Link>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline-ink px-8 py-4 text-[10px] font-medium tracking-[0.22em] uppercase flex items-center justify-center gap-2.5"
            >
              <Instagram className="w-3.5 h-3.5" />
              @assill.parfums
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
    fetch("/api/seed", { method: "POST" }).catch(() => {});
    fetchPerfumes();
  }, [fetchPerfumes]);

  return (
    <div className="min-h-screen flex flex-col bg-background overflow-x-hidden">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Experience />
        <Collection perfumes={perfumes} />
        <Storytelling />
        <Concept />
        <Notes />
        <Signature />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
