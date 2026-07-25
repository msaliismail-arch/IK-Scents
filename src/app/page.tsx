"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Star,
  ChevronDown,
  ChevronRight,
  ShoppingBag,
  Crown,
  Diamond,
  Instagram,
  Package,
  ClipboardList,
  Flower2,
  FlaskConical,
} from "lucide-react";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { SideFlorals } from "@/components/site/botanical";
import { BRAND, INSTAGRAM_URL, resolveImg } from "@/lib/site";
import type { Perfume } from "@/lib/types";

// ==========================================
// HERO — photo pleine hauteur à gauche, texte à droite
// ==========================================
function HeroSection() {
  const [imgOk, setImgOk] = useState(true);

  return (
    <section
      id="hero"
      className="relative bg-background pt-[76px] border-b border-border"
    >
      <div className="grid md:grid-cols-2 items-stretch min-h-[560px]">
        {/* Photo */}
        <div className="relative bg-[#f0ece2] min-h-[340px] md:min-h-[560px] overflow-hidden">
          {imgOk ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src="/hero-bottle.png"
              alt={`Flacon ${BRAND}`}
              onError={() => setImgOk(false)}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-[11px] tracking-[0.25em] uppercase">
              Flacon {BRAND}
            </div>
          )}
        </div>

        {/* Texte */}
        <div className="relative flex items-center px-6 sm:px-10 lg:px-16 py-14 md:py-0">
          <SideFlorals />
          <div className="relative z-10 w-full text-center md:text-left">
            <h1 className="font-serif font-semibold uppercase text-foreground leading-[1.06] tracking-[0.005em] text-4xl sm:text-5xl lg:text-[3.4rem] mb-5">
              Découvrez
              <br />
              l&apos;essence d&apos;{BRAND}.
            </h1>

            <p className="text-muted-foreground text-sm sm:text-base font-light leading-relaxed max-w-md mx-auto md:mx-0 mb-8">
              Plongez dans l&apos;univers de la parfumerie conceptuelle. Chaque
              fragrance est une histoire, une émotion, un reflet de vous-même.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start items-center">
              <Link
                href="/#collection"
                className="btn-gold px-6 py-3 font-medium tracking-[0.1em] uppercase text-[11px] transition-all duration-300"
              >
                Découvrir les collections
              </Link>
              <Link
                href="/#experience"
                className="px-6 py-3 border border-foreground text-foreground font-medium tracking-[0.1em] uppercase text-[11px] hover:bg-foreground hover:text-background transition-all duration-300"
              >
                Créer votre parfum
              </Link>
            </div>
          </div>
        </div>
      </div>

      <a
        href="/#experience"
        className="flex flex-col items-center gap-1.5 py-6 text-muted-foreground hover:text-gold transition-colors"
      >
        <span className="text-[10px] tracking-[0.3em] uppercase">Découvrir</span>
        <ChevronDown className="w-4 h-4" />
      </a>
    </section>
  );
}

// ==========================================
// EXPÉRIENCE PERSONNALISÉE
// ==========================================
function ExperienceSection() {
  const steps = [
    { icon: <ClipboardList className="w-8 h-8" />, label: "1. Questionnaire olfactif" },
    { icon: <Flower2 className="w-8 h-8" />, label: "2. Sélection de notes" },
    { icon: <FlaskConical className="w-8 h-8" />, label: "3. Création unique" },
  ];

  return (
    <section
      id="experience"
      className="relative py-16 sm:py-20 bg-surface-alt border-b border-border overflow-hidden"
    >
      <SideFlorals />
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
        <h2 className="text-center text-2xl sm:text-3xl font-serif font-semibold text-foreground tracking-[0.08em] uppercase mb-10">
          L&apos;expérience personnalisée
        </h2>

        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-3">
          {steps.map((s, i) => (
            <div key={i} className="flex flex-col md:flex-row items-center gap-4 md:gap-3">
              <div className="flex flex-col items-center">
                <div className="w-44 h-28 rounded bg-gold-soft border border-gold-border flex items-center justify-center text-gold">
                  {s.icon}
                </div>
                <p className="mt-3 text-[11px] tracking-[0.1em] uppercase text-foreground/80 text-center font-medium">
                  {s.label}
                </p>
              </div>
              {i < steps.length - 1 && (
                <ChevronRight className="w-5 h-5 text-muted-foreground rotate-90 md:rotate-0 shrink-0" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ==========================================
// BANDE SHOWCASE (marbre)
// ==========================================
function ShowcaseBand() {
  const [imgOk, setImgOk] = useState(true);

  return (
    <section className="relative bg-[#1a1a1a] border-b border-border">
      {imgOk ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/showcase.jpg"
          alt={`Coffret ${BRAND}`}
          onError={() => setImgOk(false)}
          className="w-full h-[260px] sm:h-[360px] object-cover"
        />
      ) : (
        <div className="w-full h-[260px] sm:h-[340px] flex items-center justify-center gap-8 sm:gap-16 bg-[#faf8f5] px-6">
          <div className="w-24 h-32 sm:w-32 sm:h-44 bg-[#f0ece2] border border-border rounded flex items-center justify-center text-[10px] tracking-[0.15em] uppercase text-muted-foreground text-center">
            Flacon
          </div>
          <div className="w-28 h-28 sm:w-40 sm:h-40 bg-[#1a1a1a] rounded flex items-center justify-center">
            <span className="font-serif text-4xl sm:text-6xl text-[#c9a96e]">A</span>
          </div>
          <div className="w-28 h-32 sm:w-40 sm:h-44 bg-white border border-border rounded flex items-center justify-center rotate-[-4deg]">
            <span className="font-serif text-sm sm:text-lg text-foreground leading-tight text-center">
              Votre
              <br />
              Voyage
              <br />
              Olfactif
            </span>
          </div>
        </div>
      )}
    </section>
  );
}

// ==========================================
// PERFUME CARD
// ==========================================
function PerfumeCard({ perfume }: { perfume: Perfume }) {
  const [imgError, setImgError] = useState(false);
  const imageUrl = resolveImg(perfume.image);
  const sizes = perfume.sizes ?? [];

  return (
    <div className="group relative bg-card border border-border hover:border-gold-soft hover:shadow-xl hover:-translate-y-1.5 transition-all duration-500 overflow-hidden flex flex-col rounded">
      <div className="relative aspect-[3/4] overflow-hidden bg-[#f0ece2]">
        {!imgError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={perfume.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <Diamond className="w-12 h-12 text-gold/30 mb-2" />
            <span className="text-muted-foreground text-sm font-light">{perfume.name}</span>
          </div>
        )}
        <div className="absolute top-3 left-3">
          <div className="flex items-center gap-1 px-2 py-1 bg-white/85 border border-gold-soft rounded-sm backdrop-blur-sm">
            <Star className="w-3 h-3 text-gold" />
            <span className="text-[10px] text-gold tracking-wider uppercase">Original</span>
          </div>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-serif text-xl text-foreground group-hover:text-gold transition-colors duration-300 mb-2">
          {perfume.name}
        </h3>
        <p className="text-muted-foreground text-sm font-light leading-relaxed mb-4 line-clamp-2">
          {perfume.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {sizes.map((s, i) => (
            <Link
              key={i}
              href={`/commander/${perfume.id}?taille=${encodeURIComponent(s.label)}`}
              className="px-3 py-1.5 border border-gold-soft text-xs text-muted-foreground hover:bg-gold-soft hover:text-gold transition-all duration-300 rounded-sm"
            >
              <span className="text-gold font-medium">{s.label}</span>
              <span className="text-muted-foreground"> · </span>
              <span>{s.price} MAD</span>
            </Link>
          ))}
        </div>

        <div className="mt-auto">
          <Link
            href={`/commander/${perfume.id}`}
            className="btn-gold w-full flex items-center justify-center gap-2 px-4 py-2.5 text-[11px] font-medium tracking-[0.1em] uppercase transition-all duration-300 rounded-sm"
          >
            <ShoppingBag className="w-4 h-4" />
            Commander
          </Link>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// COLLECTION
// ==========================================
function CollectionSection({ perfumes }: { perfumes: Perfume[] }) {
  return (
    <section
      id="collection"
      className="relative py-20 sm:py-24 bg-background border-b border-border overflow-hidden"
    >
      <div
        className="absolute inset-0 bg-cover bg-center opacity-25"
        style={{ backgroundImage: "url('/collection-bg.jpg')" }}
      />
      <div className="absolute inset-0 bg-background/85" />
      <SideFlorals />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-gold text-[11px] tracking-[0.35em] uppercase font-light">
            Nos Essences
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-foreground mt-3 mb-4 uppercase tracking-[0.04em]">
            Fragrances d&apos;Exception
          </h2>
          <div className="w-16 h-[1px] bg-[#8a7a63] mx-auto mb-5" />
          <p className="text-muted-foreground max-w-xl mx-auto text-sm font-light leading-relaxed">
            Des parfums originaux, puissants et longue tenue. Choisissez votre
            taille, commandez en ligne, payez à la livraison.
          </p>
        </div>

        {perfumes.length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-14 h-14 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground text-base font-light">
              Aucun parfum disponible pour le moment
            </p>
            <p className="text-muted-foreground/60 text-sm mt-2">
              Nouvelles fragrances bientôt disponibles
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {perfumes.map((perfume) => (
              <PerfumeCard key={perfume.id} perfume={perfume} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ==========================================
// LE CONCEPT
// ==========================================
function AboutSection() {
  const features = [
    {
      icon: <Crown className="w-6 h-6" />,
      title: "Authenticité Garantie",
      desc: "100% parfums originaux. Jamais de contrefaçon — c'est notre engagement.",
    },
    {
      icon: <Diamond className="w-6 h-6" />,
      title: "Tailles au Choix",
      desc: "Choisissez le format en ml qui vous convient, du décant à la grande taille.",
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: "Livraison & Paiement",
      desc: "Livraison partout au Maroc, paiement à la livraison. Simple et sécurisé.",
    },
  ];

  return (
    <section
      id="about"
      className="relative py-20 sm:py-24 bg-surface-alt border-b border-border overflow-hidden"
    >
      <SideFlorals />
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-gold text-[11px] tracking-[0.35em] uppercase font-light">
            Le Concept
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-foreground mt-3 mb-4 uppercase tracking-[0.04em]">
            L&apos;Art du Parfum
          </h2>
          <div className="w-16 h-[1px] bg-[#8a7a63] mx-auto mb-5" />
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm font-light leading-relaxed">
            Chez {BRAND}, nous croyons que chaque personne mérite de porter une
            fragrance d&apos;exception, authentique et à un prix juste. Notre
            mission : rendre le parfum original accessible à tous au Maroc.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <div
              key={i}
              className="bg-card border border-border p-7 text-center group hover:border-gold-soft hover:shadow-lg hover:-translate-y-1 transition-all duration-500 rounded"
            >
              <div className="w-12 h-12 mx-auto mb-5 rounded-full border border-gold-border bg-gold-soft flex items-center justify-center text-gold">
                {feature.icon}
              </div>
              <h3 className="font-serif text-lg text-foreground mb-2.5 group-hover:text-gold transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-muted-foreground font-light leading-relaxed text-sm">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-14">
          {[
            { value: "100%", label: "Original" },
            { value: "48h", label: "Livraison" },
            { value: "COD", label: "Paiement livraison" },
            { value: "7j/7", label: "Support" },
          ].map((stat, i) => (
            <div key={i} className="text-center py-5 border-t border-gold-border">
              <div className="text-2xl sm:text-3xl font-serif font-semibold text-foreground mb-1.5">
                {stat.value}
              </div>
              <div className="text-muted-foreground text-[11px] tracking-[0.12em] uppercase font-light">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ==========================================
// CONTACT
// ==========================================
function ContactSection() {
  return (
    <section
      id="contact"
      className="relative py-20 sm:py-24 bg-background overflow-hidden"
    >
      <SideFlorals />
      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <span className="text-gold text-[11px] tracking-[0.35em] uppercase font-light">
          Contact
        </span>
        <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-foreground mt-3 mb-4 uppercase tracking-[0.04em]">
          Votre Parfum Vous Attend
        </h2>
        <div className="w-16 h-[1px] bg-[#8a7a63] mx-auto mb-5" />
        <p className="text-muted-foreground max-w-xl mx-auto text-sm font-light leading-relaxed mb-9">
          Parcourez la collection, choisissez votre taille et commandez
          directement sur le site. Paiement à la livraison, partout au Maroc.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <Link
            href="/#collection"
            className="btn-gold px-7 py-3.5 font-medium tracking-[0.1em] uppercase text-[11px] transition-all duration-300 flex items-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            Voir la Collection
          </Link>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="px-7 py-3.5 border border-foreground text-foreground font-medium tracking-[0.1em] uppercase text-[11px] hover:bg-foreground hover:text-background transition-all duration-300 flex items-center gap-2"
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
        <HeroSection />
        <ExperienceSection />
        <ShowcaseBand />
        <CollectionSection perfumes={perfumes} />
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
