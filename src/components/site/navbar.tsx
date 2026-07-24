"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Instagram } from "lucide-react";
import { Logo } from "./logo";
import { INSTAGRAM_URL } from "@/lib/site";

const links = [
  { href: "/", label: "Accueil" },
  { href: "/#collection", label: "Collection" },
  { href: "/#about", label: "À Propos" },
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/85 backdrop-blur-xl border-b border-neutral-200 py-2.5 shadow-sm"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <Link href="/" className="cursor-pointer">
          <Logo />
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm text-neutral-600 hover:text-[#a88a4e] transition-colors duration-300 tracking-wider uppercase font-light"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 rounded-full border border-[#dcc9a0] flex items-center justify-center text-[#a88a4e] hover:bg-[#f6efe1] transition-all duration-300"
            aria-label="Instagram"
          >
            <Instagram className="w-4 h-4" />
          </a>
          <button
            className="md:hidden w-9 h-9 flex items-center justify-center text-[#a88a4e]"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-white border border-neutral-200 mt-2 mx-4 rounded-xl overflow-hidden shadow-lg">
          <div className="p-4 flex flex-col gap-2">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="text-left text-neutral-700 hover:text-[#a88a4e] transition-colors py-2 px-3 rounded-lg hover:bg-[#f6efe1] tracking-wider uppercase text-sm font-light"
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
