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
  Sparkles,
  Crown,
  Diamond,
  Instagram,
  ShoppingBag,
  Check,
  Minus,
  ClipboardList,
} from "lucide-react";
import type { Perfume, Order, Size } from "@/lib/types";

// ==========================================
// BRAND CONSTANTS
// ==========================================
const BRAND = "ASSIL";
const INSTAGRAM_URL = "https://www.instagram.com/assill.parfums/";

const resolveImg = (url: string) =>
  url && url.startsWith("/uploads/") ? `/api${url}` : url;

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
        scrolled ? "glass-dark py-3" : "bg-transparent py-5"
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
              {BRAND}
            </h1>
            <p className="text-[9px] tracking-[0.3em] text-gold/60 uppercase">
              Parfums Originaux
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
          <motion.a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-9 h-9 rounded-full border border-gold/30 flex items-center justify-center text-gold hover:bg-gold/10 transition-all duration-300"
            aria-label="Instagram"
          >
            <Instagram className="w-4 h-4" />
          </motion.a>
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
          alt={`${BRAND} Parfums Originaux`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50" />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-gold/30 rounded-full"
            style={{ left: `${15 + i * 15}%`, top: `${20 + (i % 3) * 25}%` }}
            animate={{ y: [-20, 20, -20], opacity: [0.2, 0.6, 0.2] }}
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
              Authenticité Garantie · 100% Original
            </span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-bold mb-6 leading-[0.95]"
        >
          <span className="gold-shimmer">{BRAND}</span>
          <br />
          <span className="text-white font-light">Parfums Originaux</span>
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
          Des fragrances puissantes et authentiques, livrées partout au Maroc.
          Paiement à la livraison.
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
  onOrder,
}: {
  perfume: Perfume;
  onOrder: (perfume: Perfume, sizeLabel: string) => void;
}) {
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const imageUrl = resolveImg(perfume.image);
  const sizes = perfume.sizes ?? [];

  return (
    <motion.div
      variants={fadeInUp}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="group relative bg-luxury-card border border-luxury-border hover:border-gold/30 transition-all duration-500 overflow-hidden flex flex-col"
    >
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-luxury-dark">
        {!imgError ? (
          <img
            src={imageUrl}
            alt={perfume.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-luxury-dark">
            <Diamond className="w-12 h-12 text-gold/20 mb-2" />
            <span className="text-white/20 text-sm font-light">
              {perfume.name}
            </span>
          </div>
        )}
        {!imgLoaded && !imgError && (
          <div className="absolute inset-0 flex items-center justify-center bg-luxury-dark">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full"
            />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

        {/* Featured badge */}
        <div className="absolute top-3 left-3">
          <div className="flex items-center gap-1 px-2 py-1 bg-gold/20 border border-gold/30 rounded-sm">
            <Star className="w-3 h-3 text-gold" />
            <span className="text-[10px] text-gold tracking-wider uppercase">
              Original
            </span>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-serif text-lg text-white group-hover:text-gold transition-colors duration-300 mb-2">
          {perfume.name}
        </h3>
        <p className="text-white/50 text-sm font-light leading-relaxed mb-4 line-clamp-2">
          {perfume.description}
        </p>

        {/* Dynamic sizes */}
        <div className="flex flex-wrap gap-2 mb-4">
          {sizes.map((s, i) => (
            <button
              key={i}
              onClick={() => onOrder(perfume, s.label)}
              className="px-3 py-1.5 border border-gold/25 text-xs text-white/80 hover:bg-gold/10 hover:border-gold/50 transition-all duration-300 rounded-sm"
            >
              <span className="text-gold font-medium">{s.label}</span>
              <span className="text-white/40"> · </span>
              <span>{s.price} MAD</span>
            </button>
          ))}
        </div>

        <div className="mt-auto">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onOrder(perfume, sizes[0]?.label ?? "")}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-gold-dark via-gold to-gold-light text-luxury-black text-xs font-semibold tracking-wider uppercase hover:shadow-lg hover:shadow-gold/20 transition-all duration-300"
          >
            <ShoppingBag className="w-4 h-4" />
            Commander
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

// ==========================================
// ORDER DIALOG (order form -> saved to DB)
// ==========================================
function OrderDialog({
  open,
  onClose,
  perfume,
  initialSize,
}: {
  open: boolean;
  onClose: () => void;
  perfume: Perfume | null;
  initialSize: string;
}) {
  const [sizeLabel, setSizeLabel] = useState(initialSize);
  const [quantity, setQuantity] = useState(1);
  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    address: "",
    city: "",
    note: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (open) {
      setSizeLabel(initialSize || perfume?.sizes?.[0]?.label || "");
      setQuantity(1);
      setError("");
      setDone(false);
      setForm({ customerName: "", phone: "", address: "", city: "", note: "" });
    }
  }, [open, initialSize, perfume]);

  const sizes: Size[] = perfume?.sizes ?? [];
  const selectedSize = sizes.find((s) => s.label === sizeLabel) ?? sizes[0];
  const unitPrice = Number.parseFloat(selectedSize?.price ?? "0") || 0;
  const total = unitPrice * quantity;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!perfume || !selectedSize) return;
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: form.customerName,
          phone: form.phone,
          address: form.address,
          city: form.city,
          note: form.note,
          perfumeId: perfume.id,
          perfumeName: perfume.name,
          sizeLabel: selectedSize.label,
          price: selectedSize.price,
          quantity,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Une erreur est survenue. Réessayez.");
        setLoading(false);
        return;
      }
      setDone(true);
    } catch {
      setError("Erreur de connexion. Réessayez.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="glass-dark border-gold/20 max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border border-gold/20 bg-gold/5 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-gold" />
            </div>
            <span className="gold-text text-xl font-serif">
              {done ? "Commande reçue" : "Passer commande"}
            </span>
          </DialogTitle>
        </DialogHeader>

        {done ? (
          <div className="py-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-16 h-16 mx-auto mb-5 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center"
            >
              <Check className="w-8 h-8 text-gold" />
            </motion.div>
            <p className="text-white text-lg font-serif mb-2">Merci !</p>
            <p className="text-white/50 text-sm font-light leading-relaxed max-w-xs mx-auto">
              Votre commande a bien été enregistrée. Nous vous contacterons très
              vite au {form.phone} pour confirmer la livraison.
            </p>
            <Button
              onClick={onClose}
              className="mt-6 bg-gradient-to-r from-gold-dark via-gold to-gold-light text-luxury-black font-semibold tracking-wider uppercase"
            >
              Fermer
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            {/* Product summary */}
            {perfume && (
              <div className="flex items-center gap-3 p-3 bg-luxury-dark/60 border border-luxury-border rounded-lg">
                <img
                  src={resolveImg(perfume.image)}
                  alt={perfume.name}
                  className="w-12 h-12 object-cover rounded"
                />
                <div className="min-w-0">
                  <p className="text-white text-sm font-medium truncate">
                    {perfume.name}
                  </p>
                  <p className="text-white/40 text-xs truncate">
                    {perfume.description}
                  </p>
                </div>
              </div>
            )}

            {error && (
              <div className="p-3 rounded border border-red-500/30 bg-red-500/10 text-red-400 text-sm text-center">
                {error}
              </div>
            )}

            {/* Size selection */}
            <div className="space-y-2">
              <Label className="text-white/60 text-sm tracking-wider">
                Taille (ml)
              </Label>
              <div className="flex flex-wrap gap-2">
                {sizes.map((s, i) => (
                  <button
                    type="button"
                    key={i}
                    onClick={() => setSizeLabel(s.label)}
                    className={`px-3 py-2 text-xs border transition-all duration-200 rounded-sm ${
                      s.label === sizeLabel
                        ? "border-gold bg-gold/15 text-gold"
                        : "border-luxury-border text-white/70 hover:border-gold/40"
                    }`}
                  >
                    {s.label} · {s.price} MAD
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="flex items-center justify-between">
              <Label className="text-white/60 text-sm tracking-wider">
                Quantité
              </Label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-8 h-8 rounded border border-luxury-border text-white/70 hover:border-gold/40 flex items-center justify-center"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-white w-6 text-center">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-8 h-8 rounded border border-luxury-border text-white/70 hover:border-gold/40 flex items-center justify-center"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="border-t border-luxury-border pt-4 space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label className="text-white/60 text-sm tracking-wider">
                    Nom complet *
                  </Label>
                  <Input
                    value={form.customerName}
                    onChange={(e) =>
                      setForm({ ...form, customerName: e.target.value })
                    }
                    placeholder="Votre nom"
                    required
                    className="bg-luxury-dark border-luxury-border text-white placeholder:text-white/20 focus:border-gold/50"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white/60 text-sm tracking-wider">
                      Téléphone *
                    </Label>
                    <Input
                      value={form.phone}
                      onChange={(e) =>
                        setForm({ ...form, phone: e.target.value })
                      }
                      placeholder="06 00 00 00 00"
                      required
                      className="bg-luxury-dark border-luxury-border text-white placeholder:text-white/20 focus:border-gold/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white/60 text-sm tracking-wider">
                      Ville
                    </Label>
                    <Input
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      placeholder="Oujda"
                      className="bg-luxury-dark border-luxury-border text-white placeholder:text-white/20 focus:border-gold/50"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-white/60 text-sm tracking-wider">
                    Adresse de livraison *
                  </Label>
                  <Textarea
                    value={form.address}
                    onChange={(e) =>
                      setForm({ ...form, address: e.target.value })
                    }
                    placeholder="Quartier, rue, n°..."
                    required
                    rows={2}
                    className="bg-luxury-dark border-luxury-border text-white placeholder:text-white/20 focus:border-gold/50 resize-none"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white/60 text-sm tracking-wider">
                    Note (optionnel)
                  </Label>
                  <Input
                    value={form.note}
                    onChange={(e) => setForm({ ...form, note: e.target.value })}
                    placeholder="Précisions..."
                    className="bg-luxury-dark border-luxury-border text-white placeholder:text-white/20 focus:border-gold/50"
                  />
                </div>
              </div>
            </div>

            {/* Total */}
            <div className="flex items-center justify-between p-3 bg-gold/5 border border-gold/20 rounded-lg">
              <span className="text-white/60 text-sm">Total (paiement à la livraison)</span>
              <span className="text-gold font-serif text-lg">
                {total > 0 ? `${total} MAD` : "—"}
              </span>
            </div>

            <Button
              type="submit"
              disabled={loading || !selectedSize}
              className="w-full bg-gradient-to-r from-gold-dark via-gold to-gold-light text-luxury-black font-semibold tracking-wider uppercase hover:shadow-lg hover:shadow-gold/20 transition-all duration-300 py-5"
            >
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-luxury-black border-t-transparent rounded-full"
                />
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Confirmer la commande
                </>
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ==========================================
// COLLECTION / PRODUCTS SECTION
// ==========================================
function CollectionSection({
  perfumes,
  onOrder,
}: {
  perfumes: Perfume[];
  onOrder: (perfume: Perfume, sizeLabel: string) => void;
}) {
  return (
    <section id="collection" className="relative py-24 sm:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#0d0d0d] to-[#0a0a0a]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <span className="text-gold/60 text-xs tracking-[0.4em] uppercase font-light">
            Notre Collection
          </span>
          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-white mt-3 mb-4 gold-text">
            Fragrances d&apos;Exception
          </h2>
          <div className="w-20 h-[1px] bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-6" />
          <p className="text-white/40 max-w-xl mx-auto font-light leading-relaxed">
            Des parfums originaux, puissants et longue tenue. Choisissez votre
            taille, commandez en ligne, payez à la livraison.
          </p>
        </AnimatedSection>

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
            {perfumes.map((perfume) => (
              <PerfumeCard
                key={perfume.id}
                perfume={perfume}
                onOrder={onOrder}
              />
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
    <section id="about" className="relative py-24 sm:py-32">
      <div className="absolute inset-0 bg-luxury-dark" />
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_30%_50%,rgba(201,169,110,0.3),transparent_70%)]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <span className="text-gold/60 text-xs tracking-[0.4em] uppercase font-light">
            À Propos
          </span>
          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-white mt-3 mb-4">
            L&apos;Art du <span className="gold-text">Parfum</span>
          </h2>
          <div className="w-20 h-[1px] bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-6" />
          <p className="text-white/40 max-w-2xl mx-auto font-light leading-relaxed">
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

        <AnimatedSection className="mt-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: "100%", label: "Original" },
              { value: "48h", label: "Livraison" },
              { value: "COD", label: "Paiement livraison" },
              { value: "7j/7", label: "Support" },
            ].map((stat, i) => (
              <div key={i} className="text-center py-6 border-t border-gold/10">
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
function ContactSection({ onScrollTo }: { onScrollTo: (id: string) => void }) {
  return (
    <section id="contact" className="relative py-24 sm:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-luxury-dark to-[#0a0a0a]" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <AnimatedSection>
          <span className="text-gold/60 text-xs tracking-[0.4em] uppercase font-light">
            Commander
          </span>
          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-white mt-3 mb-4">
            Votre Parfum Vous <span className="gold-text">Attend</span>
          </h2>
          <div className="w-20 h-[1px] bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-6" />
          <p className="text-white/40 max-w-xl mx-auto font-light leading-relaxed mb-10">
            Parcourez la collection, choisissez votre taille et commandez
            directement sur le site. Paiement à la livraison, partout au Maroc.
          </p>
        </AnimatedSection>

        <AnimatedSection>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onScrollTo("collection")}
              className="px-8 py-4 bg-gradient-to-r from-gold-dark via-gold to-gold-light text-luxury-black font-semibold tracking-wider uppercase text-sm hover:shadow-lg hover:shadow-gold/20 transition-all duration-300 flex items-center gap-2"
            >
              <ShoppingBag className="w-5 h-5" />
              Voir la Collection
            </motion.button>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 border border-gold/30 text-gold font-light tracking-wider uppercase text-sm hover:border-gold/60 hover:bg-gold/5 transition-all duration-300 flex items-center gap-2"
            >
              <Instagram className="w-4 h-4" />
              @assill.parfums
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
                {BRAND}
              </h3>
              <p className="text-[8px] tracking-[0.3em] text-gold/40 uppercase">
                Parfums Originaux
              </p>
            </div>
          </div>

          {/* Links */}
          <div className="flex gap-6 text-white/30 text-sm font-light">
            <span>Authenticité garantie</span>
            <span>·</span>
            <span>Made with ♥ in Morocco</span>
          </div>

          {/* Social */}
          <div className="flex gap-3">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full border border-luxury-border flex items-center justify-center text-white/40 hover:text-gold hover:border-gold/30 transition-all duration-300"
              aria-label="Instagram"
            >
              <Instagram className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-luxury-border text-center">
          <p className="text-white/20 text-xs font-light tracking-wider">
            © 2026 {BRAND}. Tous droits réservés.
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

      await signIn("credentials", { email, password, redirect: false });
      onLogin();
      onClose();
      setEmail("");
      setPassword("");
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
            <Label className="text-white/60 text-sm tracking-wider">Email</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@assil.ma"
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
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
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
type SizeRow = { label: string; price: string };

const STATUS_LABELS: Record<string, string> = {
  new: "Nouveau",
  confirmed: "Confirmé",
  shipped: "Expédié",
  delivered: "Livré",
  cancelled: "Annulé",
};

function AdminPanel({
  open,
  onClose,
  onRefresh,
}: {
  open: boolean;
  onClose: () => void;
  onRefresh: () => void;
}) {
  const [tab, setTab] = useState<"products" | "orders">("products");
  const [perfumes, setPerfumes] = useState<Perfume[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const emptyForm = {
    name: "",
    description: "",
    image: "",
    published: true,
  };
  const [formData, setFormData] = useState(emptyForm);
  const [sizes, setSizes] = useState<SizeRow[]>([{ label: "", price: "" }]);

  const fetchPerfumes = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/perfumes?all=true");
      const data = await res.json();
      setPerfumes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching perfumes:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchPerfumes();
      fetchOrders();
    }
  }, [open]);

  const resetForm = () => {
    setFormData(emptyForm);
    setSizes([{ label: "", price: "" }]);
    setEditingId(null);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("image", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.url) setFormData((prev) => ({ ...prev, image: data.url }));
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setUploading(false);
    }
  };

  const updateSize = (i: number, key: keyof SizeRow, value: string) => {
    setSizes((prev) =>
      prev.map((s, idx) => (idx === i ? { ...s, [key]: value } : s))
    );
  };
  const addSize = () => setSizes((prev) => [...prev, { label: "", price: "" }]);
  const removeSize = (i: number) =>
    setSizes((prev) => (prev.length === 1 ? prev : prev.filter((_, idx) => idx !== i)));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanSizes = sizes.filter(
      (s) => s.label.trim() !== "" && s.price.trim() !== ""
    );
    if (cleanSizes.length === 0) {
      alert("Ajoutez au moins une taille avec un prix.");
      return;
    }
    const payload = { ...formData, sizes: cleanSizes };
    try {
      if (editingId) {
        await fetch(`/api/perfumes/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch("/api/perfumes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      resetForm();
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
      published: perfume.published,
    });
    setSizes(
      perfume.sizes && perfume.sizes.length > 0
        ? perfume.sizes.map((s) => ({ label: s.label, price: s.price }))
        : [{ label: "", price: "" }]
    );
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

  const updateOrderStatus = async (id: string, status: string) => {
    try {
      await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      fetchOrders();
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  const deleteOrder = async (id: string) => {
    if (!confirm("Supprimer cette commande ?")) return;
    try {
      await fetch(`/api/orders/${id}`, { method: "DELETE" });
      fetchOrders();
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  const newOrdersCount = orders.filter((o) => o.status === "new").length;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="glass-dark border-gold/20 max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border border-gold/20 bg-gold/5 flex items-center justify-center">
              <Shield className="w-5 h-5 text-gold" />
            </div>
            <span className="gold-text text-xl font-serif">
              Espace Admin {BRAND}
            </span>
          </DialogTitle>
        </DialogHeader>

        {/* Tabs */}
        <div className="flex gap-2 mt-2 border-b border-luxury-border">
          <button
            onClick={() => setTab("products")}
            className={`px-4 py-2 text-sm tracking-wider uppercase transition-colors flex items-center gap-2 ${
              tab === "products"
                ? "text-gold border-b-2 border-gold"
                : "text-white/40 hover:text-white/70"
            }`}
          >
            <Package className="w-4 h-4" />
            Parfums
          </button>
          <button
            onClick={() => setTab("orders")}
            className={`px-4 py-2 text-sm tracking-wider uppercase transition-colors flex items-center gap-2 ${
              tab === "orders"
                ? "text-gold border-b-2 border-gold"
                : "text-white/40 hover:text-white/70"
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            Commandes
            {newOrdersCount > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-[10px] rounded-full bg-gold text-luxury-black font-semibold">
                {newOrdersCount}
              </span>
            )}
          </button>
        </div>

        {/* PRODUCTS TAB */}
        {tab === "products" && (
          <>
            <div className="flex justify-end mt-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={() => {
                    setShowForm(!showForm);
                    if (!showForm) resetForm();
                  }}
                  className="bg-gold/10 border border-gold/30 text-gold hover:bg-gold/20 hover:border-gold/50 transition-all duration-300"
                  size="sm"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {showForm ? "Annuler" : "Ajouter un parfum"}
                </Button>
              </motion.div>
            </div>

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
                        placeholder="Ex: 9PM by Afnan"
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
                          placeholder="/api/uploads/image.png"
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
                      placeholder="Sillage puissant, longue tenue..."
                      required
                      rows={3}
                      className="bg-luxury-dark border-luxury-border text-white placeholder:text-white/20 focus:border-gold/50 resize-none"
                    />
                  </div>

                  {/* Dynamic sizes editor */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-white/60 text-sm tracking-wider">
                        Tailles & prix (ml)
                      </Label>
                      <Button
                        type="button"
                        onClick={addSize}
                        size="sm"
                        variant="ghost"
                        className="text-gold hover:bg-gold/10 h-7"
                      >
                        <Plus className="w-3.5 h-3.5 mr-1" />
                        Ajouter une taille
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {sizes.map((s, i) => (
                        <div key={i} className="flex gap-2 items-center">
                          <Input
                            value={s.label}
                            onChange={(e) => updateSize(i, "label", e.target.value)}
                            placeholder="Ex: 5ml"
                            className="bg-luxury-dark border-luxury-border text-white placeholder:text-white/20 focus:border-gold/50 flex-1"
                          />
                          <Input
                            value={s.price}
                            onChange={(e) => updateSize(i, "price", e.target.value)}
                            placeholder="Prix MAD (ex: 120)"
                            className="bg-luxury-dark border-luxury-border text-white placeholder:text-white/20 focus:border-gold/50 flex-1"
                          />
                          <Button
                            type="button"
                            onClick={() => removeSize(i)}
                            size="icon"
                            variant="ghost"
                            className="w-9 h-9 text-white/40 hover:text-red-400 shrink-0"
                            disabled={sizes.length === 1}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
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

                  {formData.image && (
                    <div className="mt-2">
                      <img
                        src={resolveImg(formData.image)}
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
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full"
                  />
                </div>
              ) : perfumes.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="w-12 h-12 text-white/10 mx-auto mb-3" />
                  <p className="text-white/30 font-light">Aucun parfum ajouté</p>
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
                        src={resolveImg(perfume.image)}
                        alt={perfume.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-white text-sm font-medium truncate">
                            {perfume.name}
                          </h4>
                          <Badge
                            variant={perfume.published ? "default" : "secondary"}
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
                          {(perfume.sizes ?? [])
                            .map((s) => `${s.label}: ${s.price} MAD`)
                            .join(" · ") || "Aucune taille"}
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
          </>
        )}

        {/* ORDERS TAB */}
        {tab === "orders" && (
          <div className="mt-4 space-y-3">
            {ordersLoading ? (
              <div className="flex justify-center py-8">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full"
                />
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-8">
                <ClipboardList className="w-12 h-12 text-white/10 mx-auto mb-3" />
                <p className="text-white/30 font-light">Aucune commande pour le moment</p>
              </div>
            ) : (
              <div className="max-h-[28rem] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                {orders.map((order) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-3 bg-luxury-dark/50 border border-luxury-border rounded-lg"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-white text-sm font-medium">
                            {order.customerName}
                          </h4>
                          <a
                            href={`tel:${order.phone}`}
                            className="text-gold text-xs hover:underline"
                          >
                            {order.phone}
                          </a>
                        </div>
                        <p className="text-white/50 text-xs mt-1">
                          {order.perfumeName} — {order.sizeLabel} × {order.quantity}
                          {order.price ? ` · ${order.price} MAD/u` : ""}
                        </p>
                        <p className="text-white/30 text-xs mt-0.5">
                          {order.address}
                          {order.city ? `, ${order.city}` : ""}
                        </p>
                        {order.note && (
                          <p className="text-white/30 text-xs mt-0.5 italic">
                            Note: {order.note}
                          </p>
                        )}
                        <p className="text-white/20 text-[10px] mt-1">
                          {new Date(order.createdAt).toLocaleString("fr-FR")}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <select
                          value={order.status}
                          onChange={(e) =>
                            updateOrderStatus(order.id, e.target.value)
                          }
                          className="bg-luxury-dark border border-luxury-border text-white text-xs rounded px-2 py-1 focus:border-gold/50 outline-none"
                        >
                          {Object.keys(STATUS_LABELS).map((k) => (
                            <option key={k} value={k} className="bg-luxury-dark">
                              {STATUS_LABELS[k]}
                            </option>
                          ))}
                        </select>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-8 h-8 text-white/40 hover:text-red-400"
                          onClick={() => deleteOrder(order.id)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
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
  const [, setLoading] = useState(true);

  // Order dialog state
  const [orderOpen, setOrderOpen] = useState(false);
  const [orderPerfume, setOrderPerfume] = useState<Perfume | null>(null);
  const [orderSize, setOrderSize] = useState("");

  const openOrder = (perfume: Perfume, sizeLabel: string) => {
    setOrderPerfume(perfume);
    setOrderSize(sizeLabel);
    setOrderOpen(true);
  };

  useEffect(() => {
    const stored = localStorage.getItem("assil-admin");
    if (stored === "true") setLocalAdmin(true);
    fetch("/api/seed", { method: "POST" }).catch(() => {});
  }, []);

  const fetchPerfumes = useCallback(async () => {
    try {
      const res = await fetch("/api/perfumes");
      const data = await res.json();
      setPerfumes(Array.isArray(data) ? data : []);
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
    localStorage.setItem("assil-admin", "true");
    fetchPerfumes();
  };

  const handleLogout = async () => {
    setLocalAdmin(false);
    localStorage.removeItem("assil-admin");
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
        <CollectionSection perfumes={perfumes} onOrder={openOrder} />
        <AboutSection />
        <ContactSection onScrollTo={scrollTo} />
      </main>

      <Footer />

      <OrderDialog
        open={orderOpen}
        onClose={() => setOrderOpen(false)}
        perfume={orderPerfume}
        initialSize={orderSize}
      />

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
