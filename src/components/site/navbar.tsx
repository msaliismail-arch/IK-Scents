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
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 bg-background border-b border-border transition-all duration-300 ${
        scrolled ? "py-3 shadow-sm" : "py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <Link
          href="/"
          className="font-serif text-2xl sm:text-3xl font-bold tracking-[0.25em] text-foreground"
        >
          {BRAND}
        </Link>

        <div className="hidden lg:flex items-center gap-9">
          {links.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className="text-[13px] text-foreground/70 hover:text-gold transition-colors duration-300 tracking-[0.15em] uppercase font-light"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <button
          className="lg:hidden w-9 h-9 flex items-center justify-center text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="lg:hidden bg-card border border-border mt-3 mx-4 rounded-xl overflow-hidden shadow-lg">
          <div className="p-4 flex flex-col gap-1">
            {links.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="text-left text-foreground/80 hover:text-gold transition-colors py-2.5 px-3 rounded-lg hover:bg-gold-soft tracking-[0.15em] uppercase text-sm font-light"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
