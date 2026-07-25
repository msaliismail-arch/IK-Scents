"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Instagram,
  Package,
  ArrowRight,
  ShieldCheck,
  Truck,
  Sparkles,
} from "lucide-react";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { Img } from "@/components/site/media";
import { BRAND, INSTAGRAM_URL, resolveImg } from "@/lib/site";
import type { Perfume } from "@/lib/types";

// ==========================================
// HERO — split éditorial
// ==========================================
function Hero() {
  return (
    <section id="hero" className="relative pt-[72px] bg-background">
      <div className="grid lg:grid-cols-2 items-stretch">
        <div className="relative order-1 min-h-[380px] lg:min-h-[620px]">
          <Img
            src="/hero-bottle.jpg"
            alt={`Flacon ${BRAND}`}
            ratio="h-full min-h-[380px] lg:min-h-[620px]"
          />
        </div>

        <div className="order-2 flex items-center px-6 sm:px-12 lg:px-16 py-16 lg:py-0">
          <div className="w-full max-w-md mx-auto lg:mx-0">
            <span className="block text-[10px] tracking-[0.4em] uppercase text-gold mb-6">
              Parfumerie conceptuelle
            </span>

            <h1 className="font-serif font-semibold uppercase text-foreground leading-[1.05] tracking-[0.01em] text-[2.6rem] sm:text-5xl lg:text-[3.5rem] mb-6">
              Découvrez
              <br />
              l&apos;essence
              <br />
              d&apos;{BRAND}.
            </h1>

            <p className="text-muted-foreground text-[15px] font-light leading-[1.75] mb-9">
              Plongez dans l&apos;univers de la parfumerie conceptuelle. Chaque
              fragrance est une histoire, une émotion, un reflet de vous-même.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/#collection"
                className="btn-gold px-7 py-3.5 font-medium tracking-[0.12em] uppercase text-[11px] transition-colors duration-300"
              >
                Découvrir les collections
              </Link>
              <Link
                href="/#experience"
                className="px-7 py-3.5 border border-foreground text-foreground font-medium tracking-[0.12em] uppercase text-[11px] hover:bg-foreground hover:text-background transition-colors duration-300"
              >
                Créer votre parfum
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ==========================================
// BANDEAU CONFIANCE
// ==========================================
function TrustBar() {
  const items = [
    { icon: <ShieldCheck className="w-[18px] h-[18px]" />, t: "100% Original", s: "Authenticité garantie" },
    { icon: <Truck className="w-[18px] h-[18px]" />, t: "Livraison 48h", s: "Partout au Maroc" },
    { icon: <Sparkles className="w-[18px] h-[18px]" />, t: "Paiement à la livraison", s: "Aucun risque" },
  ];
  return (
    <section className="bg-foreground text-background">
      <div className="max-w-6xl mx-auto px-6 py-7 grid grid-cols-1 sm:grid-cols-3 gap-6">
        {items.map((it, i) => (
          <div key={i} className="flex items-center justify-center gap-3 text-center sm:text-left">
            <span className="text-[#c9a96e] shrink-0">{it.icon}</span>
            <span>
              <span className="block text-[11px] tracking-[0.16em] uppercase font-medium">
                {it.t}
              </span>
              <span className="block text-[11px] text-background/60 font-light">
                {it.s}
              </span>
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

// ==========================================
// EXPÉRIENCE PERSONNALISÉE (photos)
// ==========================================
function Experience() {
  const steps = [
    { n: "01", src: "/step-1.jpg", t: "Questionnaire olfactif", d: "Quelques questions pour cerner vos goûts." },
    { n: "02", src: "/step-2.jpg", t: "Sélection de notes", d: "Nous composons votre palette de notes." },
    { n: "03", src: "/step-3.jpg", t: "Création unique", d: "Votre fragrance, faite pour vous seul." },
  ];

  return (
    <section id="experience" className="py-20 sm:py-28 bg-surface-alt border-y border-border">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center max-w-xl mx-auto mb-14">
          <span className="block text-[10px] tracking-[0.4em] uppercase text-gold mb-4">
            Sur-mesure
          </span>
          <h2 className="font-serif font-semibold uppercase text-foreground text-3xl sm:text-[2.4rem] tracking-[0.03em] leading-tight">
            L&apos;expérience personnalisée
          </h2>
          <div className="w-12 h-px bg-[#8a7a63] mx-auto mt-6" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          {steps.map((s, i) => (
            <div key={i} className="group">
              <div className="overflow-hidden">
                <Img src={s.src} alt={s.t} ratio="aspect-[4/5]" />
              </div>
              <div className="mt-5 flex items-baseline gap-3">
                <span className="font-serif text-[#c0b299] text-lg leading-none">{s.n}</span>
                <h3 className="font-serif text-lg text-foreground">{s.t}</h3>
              </div>
              <p className="mt-2 text-muted-foreground text-sm font-light leading-relaxed">
                {s.d}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ==========================================
// COLLECTION
// ==========================================
function PerfumeCard({ perfume }: { perfume: Perfume }) {
  const [imgError, setImgError] = useState(false);
  const imageUrl = resolveImg(perfume.image);
  const sizes = perfume.sizes ?? [];
  const from = sizes.length
    ? Math.min(...sizes.map((s) => Number.parseFloat(s.price) || Infinity))
    : null;

  return (
    <article className="group">
      <Link href={`/commander/${perfume.id}`} className="block">
        <div className="aspect-[4/5] w-full overflow-hidden bg-[#efeae1]">
          {!imgError ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt={perfume.name}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.05]"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[11px] tracking-[0.2em] uppercase text-[#8a7a63]">
              {perfume.name}
            </div>
          )}
        </div>
      </Link>

      <div className="pt-5">
        <h3 className="font-serif text-lg text-foreground group-hover:text-gold transition-colors">
          <Link href={`/commander/${perfume.id}`}>{perfume.name}</Link>
        </h3>
        <p className="mt-1.5 text-muted-foreground text-[13px] font-light leading-relaxed line-clamp-2">
          {perfume.description}
        </p>

        <div className="mt-3 flex items-center justify-between">
          <span className="text-[13px] text-foreground">
            {from && Number.isFinite(from) ? `À partir de ${from} MAD` : "—"}
          </span>
          <span className="text-[11px] text-muted-foreground">
            {sizes.map((s) => s.label).join(" · ")}
          </span>
        </div>

        <Link
          href={`/commander/${perfume.id}`}
          className="mt-4 inline-flex items-center gap-2 text-[11px] tracking-[0.16em] uppercase text-foreground border-b border-foreground/30 pb-1 hover:border-gold hover:text-gold transition-colors"
        >
          Commander
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </article>
  );
}

function Collection({ perfumes }: { perfumes: Perfume[] }) {
  return (
    <section id="collection" className="py-20 sm:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12">
          <div>
            <span className="block text-[10px] tracking-[0.4em] uppercase text-gold mb-4">
              Nos Essences
            </span>
            <h2 className="font-serif font-semibold uppercase text-foreground text-3xl sm:text-[2.4rem] tracking-[0.03em] leading-tight">
              La collection
            </h2>
          </div>
          <p className="text-muted-foreground text-sm font-light leading-relaxed max-w-sm">
            Des parfums originaux, longue tenue. Choisissez votre format,
            commandez en ligne, payez à la livraison.
          </p>
        </div>

        {perfumes.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-border">
            <Package className="w-12 h-12 text-[#cfc4b0] mx-auto mb-4" />
            <p className="text-muted-foreground font-light">
              Aucun parfum publié pour le moment
            </p>
            <p className="text-muted-foreground/60 text-sm mt-1">
              Ajoutez vos parfums depuis l&apos;espace admin
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-14">
            {perfumes.map((p) => (
              <PerfumeCard key={p.id} perfume={p} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ==========================================
// LE CONCEPT — split éditorial
// ==========================================
function Concept() {
  return (
    <section id="about" className="bg-surface-alt border-y border-border">
      <div className="grid lg:grid-cols-2 items-stretch">
        <div className="order-2 lg:order-1 flex items-center px-6 sm:px-12 lg:px-16 py-16 lg:py-24">
          <div className="max-w-md mx-auto lg:mx-0">
            <span className="block text-[10px] tracking-[0.4em] uppercase text-gold mb-5">
              Le Concept
            </span>
            <h2 className="font-serif font-semibold uppercase text-foreground text-3xl sm:text-[2.3rem] tracking-[0.03em] leading-tight mb-6">
              L&apos;art du parfum,
              <br />
              accessible.
            </h2>
            <p className="text-muted-foreground text-[15px] font-light leading-[1.8] mb-5">
              Chez {BRAND}, nous croyons que chaque personne mérite de porter une
              fragrance d&apos;exception — authentique, et à un prix juste.
            </p>
            <p className="text-muted-foreground text-[15px] font-light leading-[1.8] mb-8">
              Nous sélectionnons uniquement des parfums originaux, et nous les
              proposons dans le format qui vous convient, du décant au grand
              flacon.
            </p>

            <div className="grid grid-cols-3 gap-6 border-t border-gold-border pt-7">
              {[
                { v: "100%", l: "Original" },
                { v: "48h", l: "Livraison" },
                { v: "7j/7", l: "Support" },
              ].map((s, i) => (
                <div key={i}>
                  <div className="font-serif text-2xl text-foreground">{s.v}</div>
                  <div className="text-[10px] tracking-[0.16em] uppercase text-muted-foreground mt-1">
                    {s.l}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="order-1 lg:order-2 min-h-[360px] lg:min-h-[620px]">
          <Img
            src="/concept.jpg"
            alt="L'art du parfum"
            ratio="h-full min-h-[360px] lg:min-h-[620px]"
          />
        </div>
      </div>
    </section>
  );
}

// ==========================================
// SHOWCASE — bandeau pleine largeur
// ==========================================
function Showcase() {
  return (
    <section className="relative bg-background">
      <Img
        src="/showcase.jpg"
        alt={`Coffret ${BRAND}`}
        ratio="h-[300px] sm:h-[420px]"
      />
    </section>
  );
}

// ==========================================
// CONTACT
// ==========================================
function Contact() {
  return (
    <section id="contact" className="py-20 sm:py-28 bg-background">
      <div className="max-w-2xl mx-auto px-6 text-center">
        <span className="block text-[10px] tracking-[0.4em] uppercase text-gold mb-5">
          Contact
        </span>
        <h2 className="font-serif font-semibold uppercase text-foreground text-3xl sm:text-[2.4rem] tracking-[0.03em] leading-tight mb-6">
          Votre parfum vous attend
        </h2>
        <p className="text-muted-foreground text-[15px] font-light leading-[1.8] mb-10">
          Parcourez la collection, choisissez votre format et commandez
          directement sur le site. Paiement à la livraison, partout au Maroc.
        </p>

        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            href="/#collection"
            className="btn-gold px-7 py-3.5 font-medium tracking-[0.12em] uppercase text-[11px] flex items-center gap-2 transition-colors duration-300"
          >
            <ShoppingBag className="w-4 h-4" />
            Voir la collection
          </Link>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="px-7 py-3.5 border border-foreground text-foreground font-medium tracking-[0.12em] uppercase text-[11px] hover:bg-foreground hover:text-background transition-colors duration-300 flex items-center gap-2"
          >
            <Instagram className="w-4 h-4" />
            @assill.parfums
          </a>
        </div>
      </div>
    </section>
  );
}

// ==========================================
// HOME
// ==========================================
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
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <TrustBar />
        <Experience />
        <Collection perfumes={perfumes} />
        <Concept />
        <Showcase />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
