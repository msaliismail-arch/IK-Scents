"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { BRAND } from "@/lib/site";

const links = [
  { href: "/#about", label: "Le Concept" },
  { href: "/#collection", label: "Nos Essences" },
  { href: "/#experience", label: "Personnalisation" },
  { href: "/#collection", label: "Boutique" },
  { href: "/#contact", label: "Contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Empêche le scroll de l'arrière-plan quand le menu mobile est ouvert
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-out ${
        scrolled
          ? "py-3 bg-background/92 backdrop-blur-md border-b border-champagne"
          : "py-5 bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 flex items-center justify-between gap-6">
        <Link
          href="/"
          className="font-serif text-xl sm:text-2xl font-light tracking-[0.42em] text-foreground shrink-0"
        >
          {BRAND}
        </Link>

        <div className="hidden lg:flex items-center gap-8 xl:gap-10">
          {links.map((l, i) => (
            <Link
              key={`${l.label}-${i}`}
              href={l.href}
              className="relative text-[10px] text-foreground/65 hover:text-foreground transition-colors duration-500 tracking-[0.26em] uppercase font-medium after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-0 after:bg-foreground after:transition-all after:duration-500 hover:after:w-full"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/#collection"
            className="hidden sm:inline-flex btn-gold px-6 py-3 text-[10px] font-medium tracking-[0.22em] uppercase transition-colors duration-500"
          >
            Commander
          </Link>

          <button
            className="lg:hidden w-10 h-10 flex items-center justify-center text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Menu mobile — plein écran, éditorial */}
      <div
        className={`lg:hidden fixed inset-0 bg-background transition-opacity duration-500 ${
          mobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex items-center justify-between px-5 sm:px-8 h-[76px]">
          <span className="font-serif text-xl tracking-[0.42em] text-foreground">
            {BRAND}
          </span>
          <button
            className="w-10 h-10 flex items-center justify-center text-foreground"
            onClick={() => setMobileOpen(false)}
            aria-label="Fermer le menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-7 pt-6 flex flex-col">
          {links.map((l, i) => (
            <Link
              key={`m-${l.label}-${i}`}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              className="font-serif text-3xl uppercase tracking-[0.05em] font-light text-foreground/85 hover:text-foreground py-3.5 border-b border-champagne transition-colors"
            >
              {l.label}
            </Link>
          ))}

          <Link
            href="/#collection"
            onClick={() => setMobileOpen(false)}
            className="btn-gold mt-9 w-full text-center px-6 py-4 text-[11px] font-medium tracking-[0.24em] uppercase"
          >
            Commander
          </Link>
        </div>
      </div>
    </nav>
  );
}
