"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import {
  Star,
  ChevronDown,
  ShoppingBag,
  Crown,
  Diamond,
  Instagram,
  Package,
  ClipboardList,
  Sparkles,
  FlaskConical,
} from "lucide-react";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { PerfumeBottle } from "@/components/site/perfume-bottle";
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

// Decorative botanical line accent
function Sprig({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 200"
      className={className}
      fill="none"
      stroke="#9a8266"
      strokeWidth="1.2"
      aria-hidden="true"
    >
      <path d="M60 200 C60 150 60 100 60 20" strokeLinecap="round" />
      {[...Array(6)].map((_, i) => {
        const y = 40 + i * 24;
        return (
          <g key={i}>
            <path d={`M60 ${y} C40 ${y - 12} 24 ${y - 6} 18 ${y + 6} C34 ${y + 10} 50 ${y + 6} 60 ${y}`} />
            <path d={`M60 ${y + 12} C80 ${y} 96 ${y + 6} 102 ${y + 18} C86 ${y + 22} 70 ${y + 18} 60 ${y + 12}`} />
          </g>
        );
      })}
    </svg>
  );
}

// ==========================================
// HERO (editorial cream)
// ==========================================
function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden hero-bg"
    >
      <Sprig className="absolute top-24 right-8 w-16 h-40 opacity-40 hidden md:block" />
      <Sprig className="absolute bottom-10 left-8 w-14 h-36 opacity-30 rotate-180 hidden md:block" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_40%,rgba(154,130,102,0.08),transparent_60%)]" />

      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-28 pb-16 grid md:grid-cols-2 gap-12 items-center">
        <div className="text-center md:text-left order-2 md:order-1">
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="text-gold text-xs tracking-[0.4em] uppercase font-light block mb-5"
          >
            L&apos;Art de l&apos;Essence
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.3 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-serif font-bold leading-[0.98] mb-6 text-foreground"
          >
            Découvrez
            <br />
            l&apos;essence d&apos;<span className="gold-text">{BRAND}</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="w-24 h-[1px] bg-gradient-to-r from-[#9a8266] to-transparent mx-auto md:mx-0 mb-8 origin-left"
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="text-muted-foreground text-lg max-w-lg mx-auto md:mx-0 mb-10 font-light leading-relaxed"
          >
            Des parfums originaux, authentiques et raffinés. Chaque fragrance est
            une histoire — livrée partout au Maroc, paiement à la livraison.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.85 }}
            className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start items-center"
          >
            <Link
              href="/#collection"
              className="btn-gold px-8 py-4 font-semibold tracking-wider uppercase text-sm hover:shadow-lg transition-all duration-300"
            >
              Découvrir les collections
            </Link>
            <Link
              href="/#about"
              className="px-8 py-4 border border-foreground/25 text-foreground font-light tracking-wider uppercase text-sm hover:border-gold hover:text-gold transition-all duration-300"
            >
              Notre Histoire
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.35 }}
          className="order-1 md:order-2 flex justify-center"
        >
          <div className="animate-float">
            <PerfumeBottle width={300} />
          </div>
        </motion.div>
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
    <section id="collection" className="relative py-24 sm:py-32 bg-background">
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
// EXPERIENCE (3 steps) — concept ASSIL
// ==========================================
function ExperienceSection() {
  const steps = [
    {
      icon: <ClipboardList className="w-6 h-6" />,
      n: "01",
      title: "Choisissez",
      desc: "Parcourez nos essences originales et sélectionnez votre fragrance.",
    },
    {
      icon: <FlaskConical className="w-6 h-6" />,
      n: "02",
      title: "Votre taille",
      desc: "Sélectionnez le format en ml qui vous convient, du décant au grand format.",
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      n: "03",
      title: "Recevez",
      desc: "Livraison partout au Maroc, paiement à la livraison. Simple et sûr.",
    },
  ];
  return (
    <section className="relative py-24 sm:py-32 bg-surface-alt">
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <span className="text-gold text-xs tracking-[0.4em] uppercase font-light">
            L&apos;expérience {BRAND}
          </span>
          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-foreground mt-3">
            Simple &amp; <span className="gold-text">raffinée</span>
          </h2>
          <div className="w-20 h-[1px] bg-gradient-to-r from-transparent via-[#9a8266] to-transparent mx-auto mt-6" />
        </AnimatedSection>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {steps.map((s, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              className="relative bg-card border border-border rounded-lg p-8 text-center"
            >
              <span className="absolute top-4 right-5 font-serif text-3xl text-gold/25">
                {s.n}
              </span>
              <div className="w-14 h-14 mx-auto mb-6 rounded-full border border-gold-soft bg-gold-soft flex items-center justify-center text-gold">
                {s.icon}
              </div>
              <h3 className="font-serif text-xl text-foreground mb-3">{s.title}</h3>
              <p className="text-muted-foreground font-light leading-relaxed text-sm">
                {s.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
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
    <section id="about" className="relative py-24 sm:py-32 bg-background">
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

        <AnimatedSection className="mt-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: "100%", label: "Original" },
              { value: "48h", label: "Livraison" },
              { value: "COD", label: "Paiement livraison" },
              { value: "7j/7", label: "Support" },
            ].map((stat, i) => (
              <div key={i} className="text-center py-6 border-t border-gold-soft">
                <div className="text-3xl sm:text-4xl font-serif font-bold gold-text mb-2">
                  {stat.value}
                </div>
                <div className="text-muted-foreground text-sm tracking-wider uppercase font-light">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

// ==========================================
// CONTACT
// ==========================================
function ContactSection() {
  return (
    <section id="contact" className="relative py-24 sm:py-32 bg-surface-alt">
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
        <CollectionSection perfumes={perfumes} />
        <ExperienceSection />
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
