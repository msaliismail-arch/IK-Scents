"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Brandmark } from "@/components/site/brandmark";

const links = [
  { href: "/#about", label: "Le Concept" },
  { href: "/#collection", label: "Nos Essences" },
  { href: "/#collection", label: "Boutique" },
  { href: "/#contact", label: "Contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
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
      className={`fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#e6ded0] transition-shadow duration-500 ${
        scrolled ? "shadow-[0_1px_20px_rgba(23,23,23,0.06)]" : ""
      }`}
    >
      <div className="max-w-[1500px] mx-auto pl-4 pr-4 sm:pl-6 sm:pr-8 lg:pl-8 lg:pr-12">
        <div className="h-[76px] lg:h-[92px] flex items-center justify-between gap-6">
          {/* Logo — premier élément, à l'extrême gauche */}
          <Link
            href="/"
            aria-label="ASSIL — accueil"
            className="shrink-0 mr-4 lg:mr-14 transition-opacity duration-300 hover:opacity-75"
          >
            <Brandmark size={40} className="lg:hidden" />
            <Brandmark size={54} className="hidden lg:inline-flex" />
          </Link>

          {/* Navigation + CTA, groupés à droite */}
          <div className="flex items-center gap-8 xl:gap-12 ml-auto">
            <div className="hidden lg:flex items-center gap-9 xl:gap-11">
              {links.map((l, i) => (
                <Link
                  key={`${l.label}-${i}`}
                  href={l.href}
                  className="relative text-[12px] font-semibold text-[#171717] tracking-[0.18em] uppercase transition-opacity duration-300 hover:opacity-60 after:absolute after:-bottom-2 after:left-0 after:h-[1.5px] after:w-0 after:bg-[#171717] after:transition-all after:duration-500 hover:after:w-full"
                >
                  {l.label}
                </Link>
              ))}
            </div>

            <Link
              href="/#collection"
              className="hidden sm:inline-flex items-center bg-[#171717] text-white px-8 py-4 text-[12px] font-bold tracking-[0.2em] uppercase transition-colors duration-500 hover:bg-[#3a3a3a]"
            >
              Commander
            </Link>

            <button
              className="lg:hidden w-11 h-11 -mr-2 flex items-center justify-center text-[#171717]"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Menu mobile — plein écran, éditorial */}
      <div
        className={`lg:hidden fixed inset-0 bg-white transition-opacity duration-500 ${
          mobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="h-[76px] px-4 flex items-center justify-between border-b border-[#e6ded0]">
          <Brandmark size={40} />
          <button
            className="w-11 h-11 flex items-center justify-center text-[#171717]"
            onClick={() => setMobileOpen(false)}
            aria-label="Fermer le menu"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="px-6 pt-6 flex flex-col">
          {links.map((l, i) => (
            <Link
              key={`m-${l.label}-${i}`}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              className="font-serif text-[2rem] uppercase tracking-[0.04em] font-light text-[#171717] py-4 border-b border-[#e6ded0]"
            >
              {l.label}
            </Link>
          ))}

          <Link
            href="/#collection"
            onClick={() => setMobileOpen(false)}
            className="mt-9 w-full text-center bg-[#171717] text-white px-6 py-5 text-[12px] font-bold tracking-[0.22em] uppercase"
          >
            Commander
          </Link>
        </div>
      </div>
    </nav>
  );
}
