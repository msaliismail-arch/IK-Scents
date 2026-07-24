"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
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
import { PerfumeBottle } from "@/components/site/perfume-bottle";
import { FloralSpray, LeafBranch } from "@/components/site/botanical";
import { BRAND, INSTAGRAM_URL, resolveImg } from "@/lib/site";
import type { Perfume } from "@/lib/types";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
};

function AnimatedSection({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={fadeInUp}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Uses a real product photo if present (public/hero-bottle.png), else SVG.
function HeroProduct() {
  const [useImg, setUseImg] = useState(true);
  return useImg ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/hero-bottle.png"
      alt={`Flacon ${BRAND}`}
      onError={() => setUseImg(false)}
      className="w-[320px] max-w-full object-contain drop-shadow-2xl"
    />
  ) : (
    <PerfumeBottle width={320} />
  );
}

// ==========================================
// HERO — product left, text right (mockup)
// ==========================================
function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden hero-bg"
    >
      {/* Botanical accents */}
      <FloralSpray className="absolute top-20 right-6 w-40 h-36 text-[#9a8266] opacity-50 hidden md:block" />
      <LeafBranch className="absolute -bottom-4 left-4 w-24 h-56 text-[#9a8266] opacity-30 hidden md:block" />

      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-28 pb-16 grid md:grid-cols-2 gap-12 items-center">
        {/* Product (left) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="flex justify-center order-1"
        >
          <div className="animate-float">
            <PerfumeBottle width={320} />
          </div>
        </motion.div>

        {/* Text (right) */}
        <div className="text-center md:text-left order-2">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.3 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-serif font-semibold leading-[1.08] mb-5 text-foreground uppercase tracking-[0.01em]"
          >
            Découvrez
            <br />
            l&apos;essence d&apos;<span className="gold-text">{BRAND}</span>.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.55 }}
            className="text-muted-foreground text-base sm:text-lg max-w-lg mx-auto md:mx-0 mb-9 font-light leading-relaxed"
          >
            Plongez dans l&apos;univers de la parfumerie conceptuelle. Chaque
            fragrance est une histoire, une émotion, un reflet de vous-même.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.75 }}
            className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start items-center"
          >
            <Link
              href="/#collection"
              className="btn-gold px-7 py-3.5 font-semibold tracking-[0.12em] uppercase text-xs hover:shadow-lg transition-all duration-300"
            >
              Découvrir les collections
            </Link>
            <Link
              href="/#experience"
              className="px-7 py-3.5 border border-foreground/30 text-foreground font-light tracking-[0.12em] uppercase text-xs hover:border-gold hover:text-gold transition-all duration-300"
            >
              Créer votre parfum
            </Link>
          </motion.div>
        </div>
      </div>

      <motion.a
        href="/#collection"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer"
      >
        <span className="text-muted-foreground text-[10px] tracking-[0.3em] uppercase">
          Découvrir
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ChevronDown className="w-5 h-5 text-gold" />
        </motion.div>
      </motion.a>
    </section>
  );
}

// ==========================================
// EXPÉRIENCE PERSONNALISÉE (3 étapes)
// ==========================================
function ExperienceSection() {
  const steps = [
    {
      icon: <ClipboardList className="w-8 h-8" />,
      label: "1. Questionnaire olfactif",
    },
    {
      icon: <Flower2 className="w-8 h-8" />,
      label: "2. Sélection de notes",
    },
    {
      icon: <FlaskConical className="w-8 h-8" />,
      label: "3. Création unique",
    },
  ];

  return (
    <section id="experience" className="relative py-20 sm:py-24 bg-surface-alt border-y border-border overflow-hidden">
      <FloralSpray className="absolute top-6 left-2 w-28 h-24 text-[#9a8266] opacity-25 -scale-x-100 hidden md:block" />
      <FloralSpray className="absolute bottom-6 right-2 w-28 h-24 text-[#9a8266] opacity-25 hidden md:block" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground tracking-wide uppercase">
            L&apos;expérience personnalisée
          </h2>
        </AnimatedSection>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-2"
        >
          {steps.map((s, i) => (
            <div key={i} className="flex flex-col md:flex-row items-center gap-4 md:gap-2">
              <motion.div variants={fadeInUp} className="flex flex-col items-center">
                <div className="w-40 h-32 rounded-lg bg-gold-soft border border-gold-border flex items-center justify-center text-gold">
                  {s.icon}
                </div>
                <p className="mt-4 text-xs tracking-[0.12em] uppercase text-muted-foreground text-center">
                  {s.label}
                </p>
              </motion.div>
              {i < steps.length - 1 && (
                <ChevronRight className="w-6 h-6 text-gold rotate-90 md:rotate-0 shrink-0" />
              )}
            </div>
          ))}
        </motion.div>
      </div>
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

  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 150, damping: 15 });
  const sry = useSpring(ry, { stiffness: 150, damping: 15 });

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    ry.set(px * 6);
    rx.set(-py * 6);
  };
  const onLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <motion.div
      variants={fadeInUp}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX: srx, rotateY: sry, transformPerspective: 900 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="group relative bg-card border border-border hover:border-gold-soft hover:shadow-xl hover:shadow-neutral-300/40 transition-shadow duration-500 overflow-hidden flex flex-col rounded-lg"
    >
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
            <span className="text-muted-foreground text-sm font-light">
              {perfume.name}
            </span>
          </div>
        )}
        <div className="absolute top-3 left-3">
          <div className="flex items-center gap-1 px-2 py-1 bg-white/85 border border-gold-soft rounded-sm backdrop-blur-sm">
            <Star className="w-3 h-3 text-gold" />
            <span className="text-[10px] text-gold tracking-wider uppercase">
              Original
            </span>
          </div>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-serif text-lg text-foreground group-hover:text-gold transition-colors duration-300 mb-2">
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
            className="btn-gold w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold tracking-wider uppercase hover:shadow-lg transition-all duration-300 rounded-sm"
          >
            <ShoppingBag className="w-4 h-4" />
            Commander
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

// ==========================================
// COLLECTION
// ==========================================
function CollectionSection({ perfumes }: { perfumes: Perfume[] }) {
  return (
    <section id="collection" className="relative py-24 sm:py-32 bg-surface-alt overflow-hidden">
      {/* Background photo (public/collection-bg.jpg) — optionnel */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: "url('/collection-bg.jpg')" }}
      />
      <div className="absolute inset-0 bg-surface-alt/80" />
      <LeafBranch className="absolute top-10 right-4 w-20 h-44 text-[#9a8266] opacity-20 hidden md:block" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <span className="text-gold text-xs tracking-[0.4em] uppercase font-light">
            Nos Essences
          </span>
          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-foreground mt-3 mb-4">
            Fragrances d&apos;<span className="gold-text">Exception</span>
          </h2>
          <div className="w-20 h-[1px] bg-gradient-to-r from-transparent via-[#9a8266] to-transparent mx-auto mb-6" />
          <p className="text-muted-foreground max-w-xl mx-auto font-light leading-relaxed">
            Des parfums originaux, puissants et longue tenue. Choisissez votre
            taille, commandez en ligne, payez à la livraison.
          </p>
        </AnimatedSection>

        {perfumes.length === 0 ? (
          <AnimatedSection className="text-center py-20">
            <Package className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground text-lg font-light">
              Aucun parfum disponible pour le moment
            </p>
            <p className="text-muted-foreground/60 text-sm mt-2">
              Nouvelles fragrances bientôt disponibles
            </p>
          </AnimatedSection>
        ) : (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {perfumes.map((perfume) => (
              <PerfumeCard key={perfume.id} perfume={perfume} />
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}

// ==========================================
// ABOUT
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
    <section id="about" className="relative py-24 sm:py-32 bg-background overflow-hidden">
      <FloralSpray className="absolute -top-2 right-2 w-28 h-24 text-[#9a8266] opacity-20 hidden md:block" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <span className="text-gold text-xs tracking-[0.4em] uppercase font-light">
            Le Concept
          </span>
          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-foreground mt-3 mb-4">
            L&apos;Art du <span className="gold-text">Parfum</span>
          </h2>
          <div className="w-20 h-[1px] bg-gradient-to-r from-transparent via-[#9a8266] to-transparent mx-auto mb-6" />
          <p className="text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed">
            Chez {BRAND}, nous croyons que chaque personne mérite de porter une
            fragrance d&apos;exception, authentique et à un prix juste. Notre
            mission : rendre le parfum original accessible à tous au Maroc.
          </p>
        </AnimatedSection>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {features.map((feature, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              whileHover={{ y: -5 }}
              className="bg-card border border-border p-8 text-center group hover:border-gold-soft hover:shadow-lg transition-all duration-500 rounded-lg"
            >
              <div className="w-14 h-14 mx-auto mb-6 rounded-full border border-gold-soft bg-gold-soft flex items-center justify-center text-gold transition-all duration-300">
                {feature.icon}
              </div>
              <h3 className="font-serif text-xl text-foreground mb-3 group-hover:text-gold transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-muted-foreground font-light leading-relaxed text-sm">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ==========================================
// CONTACT
// ==========================================
function ContactSection() {
  return (
    <section id="contact" className="relative py-24 sm:py-32 bg-surface-alt overflow-hidden">
      <LeafBranch className="absolute bottom-0 left-4 w-20 h-44 text-[#9a8266] opacity-20 rotate-180 hidden md:block" />
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <AnimatedSection>
          <span className="text-gold text-xs tracking-[0.4em] uppercase font-light">
            Contact
          </span>
          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-foreground mt-3 mb-4">
            Votre Parfum Vous <span className="gold-text">Attend</span>
          </h2>
          <div className="w-20 h-[1px] bg-gradient-to-r from-transparent via-[#9a8266] to-transparent mx-auto mb-6" />
          <p className="text-muted-foreground max-w-xl mx-auto font-light leading-relaxed mb-10">
            Parcourez la collection, choisissez votre taille et commandez
            directement sur le site. Paiement à la livraison, partout au Maroc.
          </p>
        </AnimatedSection>

        <AnimatedSection>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/#collection"
              className="btn-gold px-8 py-4 font-semibold tracking-wider uppercase text-sm hover:shadow-lg transition-all duration-300 flex items-center gap-2"
            >
              <ShoppingBag className="w-5 h-5" />
              Voir la Collection
            </Link>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 border border-gold-soft text-gold font-light tracking-wider uppercase text-sm hover:bg-gold-soft transition-all duration-300 flex items-center gap-2"
            >
              <Instagram className="w-4 h-4" />
              @assill.parfums
            </a>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

// ==========================================
// SHOWCASE (bas de page — mockup)
// ==========================================
function ShowcaseSection() {
  return (
    <section className="relative py-20 sm:py-24 bg-card border-t border-border overflow-hidden">
      <LeafBranch className="absolute top-8 left-6 w-16 h-40 text-[#9a8266] opacity-15 pointer-events-none hidden md:block" />
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="grid grid-cols-1 md:grid-cols-3 gap-10 items-center justify-items-center">
          <div className="flex flex-col items-center text-center">
            <PerfumeBottle width={150} />
            <p className="mt-4 text-xs tracking-[0.15em] uppercase text-muted-foreground">
              Formats 10ml / 20ml
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="w-40 h-40 rounded-lg bg-[#1a1a1a] flex items-center justify-center shadow-xl border border-[#2a2a2a]">
              <span className="font-serif text-6xl text-[#c9a96e] leading-none">A</span>
            </div>
            <p className="mt-4 text-xs tracking-[0.15em] uppercase text-muted-foreground">
              Coffret {BRAND}
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="w-44 h-40 rounded-lg bg-surface-alt border border-border flex items-center justify-center rotate-[-4deg] shadow-md">
              <span className="font-serif text-xl text-foreground italic leading-tight">
                Votre
                <br />
                Voyage
                <br />
                Olfactif
              </span>
            </div>
            <p className="mt-4 text-xs tracking-[0.15em] uppercase text-muted-foreground">
              Carte parfumée
            </p>
          </div>
        </AnimatedSection>
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
        <CollectionSection perfumes={perfumes} />
        <AboutSection />
        <ContactSection />
        <ShowcaseSection />
      </main>
      <Footer />
    </div>
  );
}
