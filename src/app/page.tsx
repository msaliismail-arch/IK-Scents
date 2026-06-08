"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Menu,
  X,
  LogIn,
  LogOut,
  Shield,
  Plus,
  Pencil,
  Trash2,
  Upload,
  Eye,
  EyeOff,
  Package,
  Star,
  ChevronDown,
  MessageCircle,
  Sparkles,
  Crown,
  Diamond,
  Phone,
  Instagram,
} from "lucide-react";
import type { Perfume } from "@/lib/types";

// ==========================================
// ANIMATION VARIANTS
// ==========================================
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6 },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const slideInLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

// ==========================================
// SECTION OBSERVER COMPONENT
// ==========================================
function AnimatedSection({
  children,
  className = "",
  variants = fadeInUp,
}: {
  children: React.ReactNode;
  className?: string;
  variants?: typeof fadeInUp;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ==========================================
// NAVBAR
// ==========================================
function Navbar({
  isAdmin,
  onLoginClick,
  onLogout,
  onAdminClick,
  onScrollTo,
}: {
  isAdmin: boolean;
  onLoginClick: () => void;
  onLogout: () => void;
  onAdminClick: () => void;
  onScrollTo: (id: string) => void;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { id: "hero", label: "Accueil" },
    { id: "collection", label: "Collection" },
    { id: "about", label: "À Propos" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "glass-dark py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => onScrollTo("hero")}
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-light via-gold to-gold-dark flex items-center justify-center">
            <Diamond className="w-5 h-5 text-luxury-black" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-serif font-bold gold-text tracking-wider">
              IK SCENTS
            </h1>
            <p className="text-[9px] tracking-[0.3em] text-gold/60 uppercase">
              Luxury Fragrances
            </p>
          </div>
        </motion.div>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => onScrollTo(link.id)}
              className="text-sm text-white/70 hover:text-gold transition-colors duration-300 tracking-wider uppercase font-light"
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {isAdmin && (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={onAdminClick}
                variant="outline"
                size="sm"
                className="border-gold/30 text-gold hover:bg-gold/10 hover:border-gold/50 transition-all duration-300"
              >
                <Shield className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Admin</span>
              </Button>
            </motion.div>
          )}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={isAdmin ? onLogout : onLoginClick}
              variant="ghost"
              size="sm"
              className={
                isAdmin
                  ? "text-red-400 hover:text-red-300 hover:bg-red-400/10"
                  : "text-gold hover:text-gold-light hover:bg-gold/10"
              }
            >
              {isAdmin ? (
                <>
                  <LogOut className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Déconnexion</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Connexion</span>
                </>
              )}
            </Button>
          </motion.div>

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-gold hover:bg-gold/10"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden glass-dark mt-2 mx-4 rounded-xl overflow-hidden"
          >
            <div className="p-4 flex flex-col gap-3">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => {
                    onScrollTo(link.id);
                    setMobileOpen(false);
                  }}
                  className="text-left text-white/80 hover:text-gold transition-colors py-2 px-3 rounded-lg hover:bg-gold/5 tracking-wider uppercase text-sm font-light"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

// ==========================================
// HERO SECTION
// ==========================================
function HeroSection({ onScrollTo }: { onScrollTo: (id: string) => void }) {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/hero-perfume.png"
          alt="IK Scents Luxury Perfume"
          className="w-full h-full object-cover"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50" />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-gold/30 rounded-full"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gold/20 bg-gold/5 mb-8">
            <Sparkles className="w-4 h-4 text-gold" />
            <span className="text-gold text-xs tracking-[0.25em] uppercase font-light">
              Collection Exclusive 2024
            </span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-bold mb-6 leading-[0.95]"
        >
          <span className="gold-shimmer">Luxury</span>
          <br />
          <span className="text-white font-light">in Every Drop</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="w-24 h-[1px] bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-8"
        />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="text-white/60 text-lg sm:text-xl max-w-2xl mx-auto mb-12 font-light leading-relaxed tracking-wide"
        >
          Découvrez les plus grandes fragrances du monde, dans des formats
          exclusifs 5ml &amp; 10ml
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onScrollTo("collection")}
            className="px-8 py-4 bg-gradient-to-r from-gold-dark via-gold to-gold-light text-luxury-black font-semibold tracking-wider uppercase text-sm rounded-none hover:shadow-lg hover:shadow-gold/20 transition-all duration-300"
          >
            Explorer la Collection
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onScrollTo("about")}
            className="px-8 py-4 border border-white/20 text-white/80 font-light tracking-wider uppercase text-sm rounded-none hover:border-gold/50 hover:text-gold transition-all duration-300"
          >
            Notre Histoire
          </motion.button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer"
        onClick={() => onScrollTo("collection")}
      >
        <span className="text-white/30 text-[10px] tracking-[0.3em] uppercase">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ChevronDown className="w-5 h-5 text-gold/50" />
        </motion.div>
      </motion.div>
    </section>
  );
}

// ==========================================
// PERFUME CARD
// ==========================================
function PerfumeCard({
  perfume,
  index,
}: {
  perfume: Perfume;
  index: number;
}) {
  const orderWhatsApp = (size: string, price: string) => {
    const message = `Bonjour, je souhaite commander le parfum ${perfume.name} (${size}) chez IK Scents.`;
    const url = `https://wa.me/212606684390?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <motion.div
      variants={fadeInUp}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="group relative bg-luxury-card border border-luxury-border hover:border-gold/30 transition-all duration-500 overflow-hidden"
    >
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-luxury-dark">
        <img
          src={perfume.image}
          alt={perfume.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

        {/* Hover overlay with order buttons */}
        <div className="absolute inset-0 flex items-end justify-center pb-6 opacity-0 group-hover:opacity-100 transition-all duration-500">
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => orderWhatsApp("5ml", perfume.price5ml)}
              className="px-4 py-2 bg-gold/90 text-luxury-black text-xs font-semibold tracking-wider uppercase hover:bg-gold transition-colors"
            >
              5ml · {perfume.price5ml} MAD
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => orderWhatsApp("10ml", perfume.price10ml)}
              className="px-4 py-2 bg-white/90 text-luxury-black text-xs font-semibold tracking-wider uppercase hover:bg-white transition-colors"
            >
              10ml · {perfume.price10ml} MAD
            </motion.button>
          </div>
        </div>

        {/* Featured badge */}
        <div className="absolute top-3 left-3">
          <div className="flex items-center gap-1 px-2 py-1 bg-gold/20 border border-gold/30 rounded-sm">
            <Star className="w-3 h-3 text-gold" />
            <span className="text-[10px] text-gold tracking-wider uppercase">
              Premium
            </span>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-5">
        <h3 className="font-serif text-lg text-white group-hover:text-gold transition-colors duration-300 mb-2">
          {perfume.name}
        </h3>
        <p className="text-white/50 text-sm font-light leading-relaxed mb-4 line-clamp-2">
          {perfume.description}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex gap-4">
            <div className="text-center">
              <span className="text-[10px] text-white/40 uppercase tracking-wider block">
                5ml
              </span>
              <span className="text-gold font-serif text-lg">
                {perfume.price5ml}
              </span>
              <span className="text-[10px] text-white/40 ml-1">MAD</span>
            </div>
            <div className="w-px bg-luxury-border" />
            <div className="text-center">
              <span className="text-[10px] text-white/40 uppercase tracking-wider block">
                10ml
              </span>
              <span className="text-gold font-serif text-lg">
                {perfume.price10ml}
              </span>
              <span className="text-[10px] text-white/40 ml-1">MAD</span>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => orderWhatsApp("5ml", perfume.price5ml)}
            className="w-10 h-10 rounded-full border border-gold/30 flex items-center justify-center text-gold hover:bg-gold hover:text-luxury-black transition-all duration-300"
          >
            <MessageCircle className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

// ==========================================
// COLLECTION / PRODUCTS SECTION
// ==========================================
function CollectionSection({ perfumes }: { perfumes: Perfume[] }) {
  return (
    <section id="collection" className="relative py-24 sm:py-32">
      {/* Section background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#0d0d0d] to-[#0a0a0a]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <AnimatedSection className="text-center mb-16">
          <span className="text-gold/60 text-xs tracking-[0.4em] uppercase font-light">
            Notre Collection
          </span>
          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-white mt-3 mb-4 gold-text">
            Fragrances d&apos;Exception
          </h2>
          <div className="w-20 h-[1px] bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-6" />
          <p className="text-white/40 max-w-xl mx-auto font-light leading-relaxed">
            Chaque flacon raconte une histoire. Découvrez notre sélection de
            parfums les plus prestigieux, disponibles en formats voyage
            exclusifs.
          </p>
        </AnimatedSection>

        {/* Products Grid */}
        {perfumes.length === 0 ? (
          <AnimatedSection className="text-center py-20">
            <Package className="w-16 h-16 text-white/10 mx-auto mb-4" />
            <p className="text-white/30 text-lg font-light">
              Aucun parfum disponible pour le moment
            </p>
            <p className="text-white/20 text-sm mt-2">
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
            {perfumes.map((perfume, index) => (
              <PerfumeCard key={perfume.id} perfume={perfume} index={index} />
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}

// ==========================================
// ABOUT SECTION
// ==========================================
function AboutSection() {
  const features = [
    {
      icon: <Crown className="w-6 h-6" />,
      title: "Authenticité Garantie",
      desc: "100% parfums originaux, sourced directement des maisons les plus prestigieuses.",
    },
    {
      icon: <Diamond className="w-6 h-6" />,
      title: "Formats Exclusifs",
      desc: "Décants 5ml et 10ml parfaits pour découvrir les fragrances avant de vous engager.",
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: "Livraison Rapide",
      desc: "Expédition soignée et rapide partout au Maroc avec emballage premium.",
    },
  ];

  return (
    <section id="about" className="relative py-24 sm:py-32">
      <div className="absolute inset-0 bg-luxury-dark" />
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_30%_50%,rgba(201,169,110,0.3),transparent_70%)]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <span className="text-gold/60 text-xs tracking-[0.4em] uppercase font-light">
            À Propos
          </span>
          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-white mt-3 mb-4">
            L&apos;Art du{" "}
            <span className="gold-text">Parfum</span>
          </h2>
          <div className="w-20 h-[1px] bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-6" />
          <p className="text-white/40 max-w-2xl mx-auto font-light leading-relaxed">
            Chez IK Scents, nous croyons que chaque personne mérite de
            porter une fragrance d&apos;exception. Notre mission est de rendre
            le luxe olfactif accessible à tous.
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
              className="glass p-8 text-center group hover:border-gold/30 transition-all duration-500"
            >
              <div className="w-14 h-14 mx-auto mb-6 rounded-full border border-gold/20 bg-gold/5 flex items-center justify-center text-gold group-hover:bg-gold/10 group-hover:border-gold/40 transition-all duration-300">
                {feature.icon}
              </div>
              <h3 className="font-serif text-xl text-white mb-3 group-hover:text-gold transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-white/40 font-light leading-relaxed text-sm">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats */}
        <AnimatedSection className="mt-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: "50+", label: "Fragrances" },
              { value: "100%", label: "Authentique" },
              { value: "500+", label: "Clients" },
              { value: "24h", label: "Livraison" },
            ].map((stat, i) => (
              <div
                key={i}
                className="text-center py-6 border-t border-gold/10"
              >
                <div className="text-3xl sm:text-4xl font-serif font-bold gold-text mb-2">
                  {stat.value}
                </div>
                <div className="text-white/40 text-sm tracking-wider uppercase font-light">
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
// CONTACT / CTA SECTION
// ==========================================
function ContactSection() {
  return (
    <section id="contact" className="relative py-24 sm:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-luxury-dark to-[#0a0a0a]" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <AnimatedSection>
          <span className="text-gold/60 text-xs tracking-[0.4em] uppercase font-light">
            Contactez-nous
          </span>
          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-white mt-3 mb-4">
            Votre Parfum Vous{" "}
            <span className="gold-text">Attend</span>
          </h2>
          <div className="w-20 h-[1px] bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-6" />
          <p className="text-white/40 max-w-xl mx-auto font-light leading-relaxed mb-10">
            Commandez facilement via WhatsApp. Notre équipe est à votre
            disposition pour vous guider dans le choix de votre fragrance.
          </p>
        </AnimatedSection>

        <AnimatedSection>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="https://wa.me/212606684390?text=Bonjour%2C%20je%20souhaite%20avoir%20des%20informations%20sur%20les%20parfums%20IK%20Scents."
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-gradient-to-r from-gold-dark via-gold to-gold-light text-luxury-black font-semibold tracking-wider uppercase text-sm hover:shadow-lg hover:shadow-gold/20 transition-all duration-300 flex items-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              Commander sur WhatsApp
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="tel:+212606684390"
              className="px-8 py-4 border border-gold/30 text-gold font-light tracking-wider uppercase text-sm hover:border-gold/60 hover:bg-gold/5 transition-all duration-300 flex items-center gap-2"
            >
              <Phone className="w-4 h-4" />
              +212 606 684 390
            </motion.a>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

// ==========================================
// FOOTER
// ==========================================
function Footer() {
  return (
    <footer className="bg-luxury-black border-t border-luxury-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold-light via-gold to-gold-dark flex items-center justify-center">
              <Diamond className="w-4 h-4 text-luxury-black" />
            </div>
            <div>
              <h3 className="text-lg font-serif font-bold gold-text tracking-wider">
                IK SCENTS
              </h3>
              <p className="text-[8px] tracking-[0.3em] text-gold/40 uppercase">
                Luxury Fragrances
              </p>
            </div>
          </div>

          {/* Links */}
          <div className="flex gap-6 text-white/30 text-sm font-light">
            <span>Luxury in Every Drop</span>
            <span>·</span>
            <span>Made with ♥ in Morocco</span>
          </div>

          {/* Social */}
          <div className="flex gap-3">
            <a
              href="https://wa.me/212606684390"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full border border-luxury-border flex items-center justify-center text-white/40 hover:text-gold hover:border-gold/30 transition-all duration-300"
            >
              <MessageCircle className="w-4 h-4" />
            </a>
            <a
              href="#"
              className="w-9 h-9 rounded-full border border-luxury-border flex items-center justify-center text-white/40 hover:text-gold hover:border-gold/30 transition-all duration-300"
            >
              <Instagram className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-luxury-border text-center">
          <p className="text-white/20 text-xs font-light tracking-wider">
            © 2024 IK Scents. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}

// ==========================================
// LOGIN DIALOG
// ==========================================
function LoginDialog({
  open,
  onClose,
  onLogin,
}: {
  open: boolean;
  onClose: () => void;
  onLogin: () => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // First verify credentials via custom login endpoint
      const verifyRes = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const verifyData = await verifyRes.json();

      if (!verifyRes.ok || verifyData.error) {
        setError("Identifiants incorrects");
        setLoading(false);
        return;
      }

      // Then sign in with NextAuth to establish the session
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        // Even if NextAuth signIn fails, the credentials are valid
        // Store admin state manually
        onLogin();
        onClose();
        setEmail("");
        setPassword("");
      } else {
        onLogin();
        onClose();
        setEmail("");
        setPassword("");
      }
    } catch {
      setError("Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="glass-dark border-gold/20 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full border border-gold/20 bg-gold/5 flex items-center justify-center">
              <Shield className="w-7 h-7 text-gold" />
            </div>
            <span className="gold-text text-2xl font-serif">
              Accès Administrateur
            </span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded border border-red-500/30 bg-red-500/10 text-red-400 text-sm text-center"
            >
              {error}
            </motion.div>
          )}

          <div className="space-y-2">
            <Label className="text-white/60 text-sm tracking-wider">
              Email
            </Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@ikscents.com"
              required
              className="bg-luxury-dark border-luxury-border text-white placeholder:text-white/20 focus:border-gold/50 focus:ring-gold/20"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-white/60 text-sm tracking-wider">
              Mot de passe
            </Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="bg-luxury-dark border-luxury-border text-white placeholder:text-white/20 focus:border-gold/50 focus:ring-gold/20 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-gold transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-gold-dark via-gold to-gold-light text-luxury-black font-semibold tracking-wider uppercase hover:shadow-lg hover:shadow-gold/20 transition-all duration-300 py-5"
            >
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="w-5 h-5 border-2 border-luxury-black border-t-transparent rounded-full"
                />
              ) : (
                <>
                  <LogIn className="w-4 h-4 mr-2" />
                  Se Connecter
                </>
              )}
            </Button>
          </motion.div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ==========================================
// ADMIN PANEL
// ==========================================
function AdminPanel({
  open,
  onClose,
  onRefresh,
}: {
  open: boolean;
  onClose: () => void;
  onRefresh: () => void;
}) {
  const [perfumes, setPerfumes] = useState<Perfume[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
    price5ml: "",
    price10ml: "",
    published: true,
  });
  const [uploading, setUploading] = useState(false);

  const fetchPerfumes = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/perfumes?all=true");
      const data = await res.json();
      setPerfumes(data);
    } catch (error) {
      console.error("Error fetching perfumes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchPerfumes();
    }
  }, [open]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append("image", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formDataUpload,
      });

      const data = await res.json();
      if (data.url) {
        setFormData((prev) => ({ ...prev, image: data.url }));
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingId) {
        await fetch(`/api/perfumes/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      } else {
        await fetch("/api/perfumes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      }

      setFormData({
        name: "",
        description: "",
        image: "",
        price5ml: "",
        price10ml: "",
        published: true,
      });
      setEditingId(null);
      setShowForm(false);
      fetchPerfumes();
      onRefresh();
    } catch (error) {
      console.error("Error saving perfume:", error);
    }
  };

  const handleEdit = (perfume: Perfume) => {
    setFormData({
      name: perfume.name,
      description: perfume.description,
      image: perfume.image,
      price5ml: perfume.price5ml,
      price10ml: perfume.price10ml,
      published: perfume.published,
    });
    setEditingId(perfume.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce parfum ?")) return;

    try {
      await fetch(`/api/perfumes/${id}`, { method: "DELETE" });
      fetchPerfumes();
      onRefresh();
    } catch (error) {
      console.error("Error deleting perfume:", error);
    }
  };

  const togglePublish = async (perfume: Perfume) => {
    try {
      await fetch(`/api/perfumes/${perfume.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !perfume.published }),
      });
      fetchPerfumes();
      onRefresh();
    } catch (error) {
      console.error("Error toggling publish:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="glass-dark border-gold/20 max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border border-gold/20 bg-gold/5 flex items-center justify-center">
                <Shield className="w-5 h-5 text-gold" />
              </div>
              <span className="gold-text text-xl font-serif">
                Gestion des Parfums
              </span>
            </div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => {
                  setShowForm(!showForm);
                  if (!showForm) {
                    setEditingId(null);
                    setFormData({
                      name: "",
                      description: "",
                      image: "",
                      price5ml: "",
                      price10ml: "",
                      published: true,
                    });
                  }
                }}
                className="bg-gold/10 border border-gold/30 text-gold hover:bg-gold/20 hover:border-gold/50 transition-all duration-300"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                {showForm ? "Annuler" : "Ajouter"}
              </Button>
            </motion.div>
          </DialogTitle>
        </DialogHeader>

        {/* Add/Edit Form */}
        <AnimatePresence>
          {showForm && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleSubmit}
              className="space-y-4 mt-4 overflow-hidden"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-white/60 text-sm tracking-wider">
                    Nom du parfum
                  </Label>
                  <Input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Dior Sauvage"
                    required
                    className="bg-luxury-dark border-luxury-border text-white placeholder:text-white/20 focus:border-gold/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white/60 text-sm tracking-wider">
                    Image
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      value={formData.image}
                      onChange={(e) =>
                        setFormData({ ...formData, image: e.target.value })
                      }
                      placeholder="/uploads/image.png"
                      required
                      className="bg-luxury-dark border-luxury-border text-white placeholder:text-white/20 focus:border-gold/50 flex-1"
                    />
                    <label className="cursor-pointer px-3 py-2 border border-gold/30 text-gold hover:bg-gold/10 transition-colors rounded-md flex items-center gap-1">
                      <Upload className="w-4 h-4" />
                      <span className="text-xs">
                        {uploading ? "..." : "Upload"}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-white/60 text-sm tracking-wider">
                  Description
                </Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Une fragrance audacieuse et sauvage..."
                  required
                  rows={3}
                  className="bg-luxury-dark border-luxury-border text-white placeholder:text-white/20 focus:border-gold/50 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-white/60 text-sm tracking-wider">
                    Prix 5ml (MAD)
                  </Label>
                  <Input
                    value={formData.price5ml}
                    onChange={(e) =>
                      setFormData({ ...formData, price5ml: e.target.value })
                    }
                    placeholder="150"
                    required
                    className="bg-luxury-dark border-luxury-border text-white placeholder:text-white/20 focus:border-gold/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white/60 text-sm tracking-wider">
                    Prix 10ml (MAD)
                  </Label>
                  <Input
                    value={formData.price10ml}
                    onChange={(e) =>
                      setFormData({ ...formData, price10ml: e.target.value })
                    }
                    placeholder="250"
                    required
                    className="bg-luxury-dark border-luxury-border text-white placeholder:text-white/20 focus:border-gold/50"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Switch
                    checked={formData.published}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, published: checked })
                    }
                    className="data-[state=checked]:bg-gold"
                  />
                  <Label className="text-white/60 text-sm">
                    {formData.published ? "Publié" : "Brouillon"}
                  </Label>
                </div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-gold-dark via-gold to-gold-light text-luxury-black font-semibold tracking-wider uppercase hover:shadow-lg hover:shadow-gold/20 transition-all duration-300"
                  >
                    {editingId ? (
                      <>
                        <Pencil className="w-4 h-4 mr-2" />
                        Modifier
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        Publier
                      </>
                    )}
                  </Button>
                </motion.div>
              </div>

              {/* Image Preview */}
              {formData.image && (
                <div className="mt-2">
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-32 h-32 object-cover border border-gold/20"
                  />
                </div>
              )}
            </motion.form>
          )}
        </AnimatePresence>

        {/* Perfumes List */}
        <div className="mt-6 space-y-3">
          {loading ? (
            <div className="flex justify-center py-8">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full"
              />
            </div>
          ) : perfumes.length === 0 ? (
            <div className="text-center py-8">
              <Package className="w-12 h-12 text-white/10 mx-auto mb-3" />
              <p className="text-white/30 font-light">
                Aucun parfum ajouté
              </p>
            </div>
          ) : (
            <div className="max-h-96 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
              {perfumes.map((perfume) => (
                <motion.div
                  key={perfume.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-3 p-3 bg-luxury-dark/50 border border-luxury-border hover:border-gold/20 transition-colors rounded-lg"
                >
                  <img
                    src={perfume.image}
                    alt={perfume.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-white text-sm font-medium truncate">
                        {perfume.name}
                      </h4>
                      <Badge
                        variant={
                          perfume.published ? "default" : "secondary"
                        }
                        className={`text-[10px] ${
                          perfume.published
                            ? "bg-gold/20 text-gold border-gold/30"
                            : "bg-white/5 text-white/40"
                        }`}
                      >
                        {perfume.published ? "Publié" : "Brouillon"}
                      </Badge>
                    </div>
                    <p className="text-white/30 text-xs truncate">
                      5ml: {perfume.price5ml} MAD · 10ml: {perfume.price10ml}{" "}
                      MAD
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-8 h-8 text-white/40 hover:text-gold"
                      onClick={() => togglePublish(perfume)}
                    >
                      {perfume.published ? (
                        <Eye className="w-3.5 h-3.5" />
                      ) : (
                        <EyeOff className="w-3.5 h-3.5" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-8 h-8 text-white/40 hover:text-gold"
                      onClick={() => handleEdit(perfume)}
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-8 h-8 text-white/40 hover:text-red-400"
                      onClick={() => handleDelete(perfume.id)}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ==========================================
// MAIN PAGE COMPONENT
// ==========================================
export default function Home() {
  const { data: session } = useSession();
  const [localAdmin, setLocalAdmin] = useState(false);
  const isAdmin = !!session?.user || localAdmin;
  const [loginOpen, setLoginOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [perfumes, setPerfumes] = useState<Perfume[]>([]);
  const [loading, setLoading] = useState(true);

  // Check localStorage for admin state on mount
  useEffect(() => {
    const stored = localStorage.getItem("ik-scents-admin");
    if (stored === "true") {
      setLocalAdmin(true);
    }
    // Seed admin users
    fetch("/api/seed", { method: "POST" }).catch(() => {});
  }, []);

  // Fetch published perfumes
  const fetchPerfumes = useCallback(async () => {
    try {
      const res = await fetch("/api/perfumes");
      const data = await res.json();
      setPerfumes(data);
    } catch (error) {
      console.error("Error fetching perfumes:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPerfumes();
  }, [fetchPerfumes]);

  const handleLogin = () => {
    setLocalAdmin(true);
    localStorage.setItem("ik-scents-admin", "true");
    fetchPerfumes();
  };

  const handleLogout = async () => {
    setLocalAdmin(false);
    localStorage.removeItem("ik-scents-admin");
    await signOut({ redirect: false });
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-luxury-black">
      <Navbar
        isAdmin={isAdmin}
        onLoginClick={() => setLoginOpen(true)}
        onLogout={handleLogout}
        onAdminClick={() => setAdminOpen(true)}
        onScrollTo={scrollTo}
      />

      <main className="flex-1">
        <HeroSection onScrollTo={scrollTo} />
        <CollectionSection perfumes={perfumes} />
        <AboutSection />
        <ContactSection />
      </main>

      <Footer />

      <LoginDialog
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        onLogin={handleLogin}
      />

      {isAdmin && (
        <AdminPanel
          open={adminOpen}
          onClose={() => setAdminOpen(false)}
          onRefresh={fetchPerfumes}
        />
      )}
    </div>
  );
}
