"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import {
  Sparkles,
  Star,
  ChevronDown,
  ShoppingBag,
  Crown,
  Diamond,
  Instagram,
  Package,
} from "lucide-react";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { Logo } from "@/components/site/logo";
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

// ==========================================
// HERO (light)
// ==========================================
function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#fbf9f5] via-white to-[#fbf9f5]"
    >
      <div className="absolute inset-0 opacity-60 bg-[radial-gradient(circle_at_50%_30%,rgba(184,147,90,0.10),transparent_60%)]" />

      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[#c9a96e]/40 rounded-full"
            style={{ left: `${15 + i * 15}%`, top: `${20 + (i % 3) * 25}%` }}
            animate={{ y: [-20, 20, -20], opacity: [0.15, 0.5, 0.15] }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto pt-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex justify-center mb-8"
        >
          <Logo size={96} showText={false} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#e2d3ae] bg-[#faf4e8] mb-8">
            <Sparkles className="w-4 h-4 text-[#a88a4e]" />
            <span className="text-[#a88a4e] text-xs tracking-[0.25em] uppercase font-light">
              Authenticité Garantie · 100% Original
            </span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.6 }}
          className="text-5xl sm:text-6xl md:text-7xl font-serif font-bold mb-6 leading-[0.95]"
        >
          <span className="gold-shimmer">{BRAND}</span>
          <br />
          <span className="text-neutral-800 font-light">Parfums Originaux</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#c9a96e] to-transparent mx-auto mb-8"
        />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="text-neutral-500 text-lg sm:text-xl max-w-2xl mx-auto mb-12 font-light leading-relaxed"
        >
          Des fragrances puissantes et authentiques, livrées partout au Maroc.
          Paiement à la livraison.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link
            href="/#collection"
            className="px-8 py-4 bg-gradient-to-r from-[#997640] via-[#b8935a] to-[#d4b478] text-white font-semibold tracking-wider uppercase text-sm hover:shadow-lg hover:shadow-[#c9a96e]/30 transition-all duration-300"
          >
            Explorer la Collection
          </Link>
          <Link
            href="/#about"
            className="px-8 py-4 border border-neutral-300 text-neutral-700 font-light tracking-wider uppercase text-sm hover:border-[#c9a96e] hover:text-[#a88a4e] transition-all duration-300"
          >
            Notre Histoire
          </Link>
        </motion.div>
      </div>

      <motion.a
        href="/#collection"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer"
      >
        <span className="text-neutral-400 text-[10px] tracking-[0.3em] uppercase">
          Découvrir
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ChevronDown className="w-5 h-5 text-[#c9a96e]" />
        </motion.div>
      </motion.a>
    </section>
  );
}

// ==========================================
// PERFUME CARD (links to order page)
// ==========================================
function PerfumeCard({ perfume }: { perfume: Perfume }) {
  const [imgError, setImgError] = useState(false);
  const imageUrl = resolveImg(perfume.image);
  const sizes = perfume.sizes ?? [];

  return (
    <motion.div
      variants={fadeInUp}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="group relative bg-white border border-neutral-200 hover:border-[#dcc9a0] hover:shadow-xl hover:shadow-neutral-200/60 transition-all duration-500 overflow-hidden flex flex-col rounded-lg"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-[#f5f1ea]">
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
            <Diamond className="w-12 h-12 text-[#c9a96e]/30 mb-2" />
            <span className="text-neutral-400 text-sm font-light">
              {perfume.name}
            </span>
          </div>
        )}
        <div className="absolute top-3 left-3">
          <div className="flex items-center gap-1 px-2 py-1 bg-white/90 border border-[#e2d3ae] rounded-sm">
            <Star className="w-3 h-3 text-[#a88a4e]" />
            <span className="text-[10px] text-[#a88a4e] tracking-wider uppercase">
              Original
            </span>
          </div>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-serif text-lg text-neutral-900 group-hover:text-[#a88a4e] transition-colors duration-300 mb-2">
          {perfume.name}
        </h3>
        <p className="text-neutral-500 text-sm font-light leading-relaxed mb-4 line-clamp-2">
          {perfume.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {sizes.map((s, i) => (
            <Link
              key={i}
              href={`/commander/${perfume.id}?taille=${encodeURIComponent(s.label)}`}
              className="px-3 py-1.5 border border-[#e2d3ae] text-xs text-neutral-700 hover:bg-[#faf4e8] hover:border-[#c9a96e] transition-all duration-300 rounded-sm"
            >
              <span className="text-[#a88a4e] font-medium">{s.label}</span>
              <span className="text-neutral-400"> · </span>
              <span>{s.price} MAD</span>
            </Link>
          ))}
        </div>

        <div className="mt-auto">
          <Link
            href={`/commander/${perfume.id}`}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#997640] via-[#b8935a] to-[#d4b478] text-white text-xs font-semibold tracking-wider uppercase hover:shadow-lg hover:shadow-[#c9a96e]/30 transition-all duration-300 rounded-sm"
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
    <section id="collection" className="relative py-24 sm:py-32 bg-white">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <span className="text-[#a88a4e]/70 text-xs tracking-[0.4em] uppercase font-light">
            Notre Collection
          </span>
          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-neutral-900 mt-3 mb-4">
            Fragrances d&apos;<span className="gold-text">Exception</span>
          </h2>
          <div className="w-20 h-[1px] bg-gradient-to-r from-transparent via-[#c9a96e] to-transparent mx-auto mb-6" />
          <p className="text-neutral-500 max-w-xl mx-auto font-light leading-relaxed">
            Des parfums originaux, puissants et longue tenue. Choisissez votre
            taille, commandez en ligne, payez à la livraison.
          </p>
        </AnimatedSection>

        {perfumes.length === 0 ? (
          <AnimatedSection className="text-center py-20">
            <Package className="w-16 h-16 text-neutral-200 mx-auto mb-4" />
            <p className="text-neutral-400 text-lg font-light">
              Aucun parfum disponible pour le moment
            </p>
            <p className="text-neutral-300 text-sm mt-2">
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
    <section id="about" className="relative py-24 sm:py-32 bg-[#faf8f4]">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <span className="text-[#a88a4e]/70 text-xs tracking-[0.4em] uppercase font-light">
            À Propos
          </span>
          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-neutral-900 mt-3 mb-4">
            L&apos;Art du <span className="gold-text">Parfum</span>
          </h2>
          <div className="w-20 h-[1px] bg-gradient-to-r from-transparent via-[#c9a96e] to-transparent mx-auto mb-6" />
          <p className="text-neutral-500 max-w-2xl mx-auto font-light leading-relaxed">
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
              className="bg-white border border-neutral-200 p-8 text-center group hover:border-[#dcc9a0] hover:shadow-lg transition-all duration-500 rounded-lg"
            >
              <div className="w-14 h-14 mx-auto mb-6 rounded-full border border-[#e2d3ae] bg-[#faf4e8] flex items-center justify-center text-[#a88a4e] group-hover:bg-[#f3e7cf] transition-all duration-300">
                {feature.icon}
              </div>
              <h3 className="font-serif text-xl text-neutral-900 mb-3 group-hover:text-[#a88a4e] transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-neutral-500 font-light leading-relaxed text-sm">
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
              <div key={i} className="text-center py-6 border-t border-[#e2d3ae]/60">
                <div className="text-3xl sm:text-4xl font-serif font-bold gold-text mb-2">
                  {stat.value}
                </div>
                <div className="text-neutral-500 text-sm tracking-wider uppercase font-light">
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
    <section id="contact" className="relative py-24 sm:py-32 bg-white">
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <AnimatedSection>
          <span className="text-[#a88a4e]/70 text-xs tracking-[0.4em] uppercase font-light">
            Commander
          </span>
          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-neutral-900 mt-3 mb-4">
            Votre Parfum Vous <span className="gold-text">Attend</span>
          </h2>
          <div className="w-20 h-[1px] bg-gradient-to-r from-transparent via-[#c9a96e] to-transparent mx-auto mb-6" />
          <p className="text-neutral-500 max-w-xl mx-auto font-light leading-relaxed mb-10">
            Parcourez la collection, choisissez votre taille et commandez
            directement sur le site. Paiement à la livraison, partout au Maroc.
          </p>
        </AnimatedSection>

        <AnimatedSection>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/#collection"
              className="px-8 py-4 bg-gradient-to-r from-[#997640] via-[#b8935a] to-[#d4b478] text-white font-semibold tracking-wider uppercase text-sm hover:shadow-lg hover:shadow-[#c9a96e]/30 transition-all duration-300 flex items-center gap-2"
            >
              <ShoppingBag className="w-5 h-5" />
              Voir la Collection
            </Link>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 border border-[#dcc9a0] text-[#a88a4e] font-light tracking-wider uppercase text-sm hover:border-[#c9a96e] hover:bg-[#faf4e8] transition-all duration-300 flex items-center gap-2"
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
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <CollectionSection perfumes={perfumes} />
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
