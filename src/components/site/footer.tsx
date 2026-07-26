import Link from "next/link";
import { Instagram, ShieldCheck, Truck, Wallet } from "lucide-react";
import { BRAND, INSTAGRAM_URL } from "@/lib/site";

const TIKTOK_URL = "https://www.tiktok.com/@assill.parfums";

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-12 pt-20 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10">
          {/* Marque */}
          <div className="lg:col-span-5">
            <span className="font-serif text-3xl font-light tracking-[0.42em]">
              {BRAND}
            </span>
            <p className="mt-6 font-serif text-xl font-light leading-snug text-background/75 max-w-xs">
              Une signature olfactive pensée pour vous.
            </p>

            <div className="mt-9 flex items-center gap-3">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-background/25 px-4 py-2.5 text-[10px] tracking-[0.22em] uppercase text-background/75 hover:border-background hover:text-background transition-colors duration-500"
              >
                <Instagram className="w-3.5 h-3.5" />
                Instagram
              </a>
              <a
                href={TIKTOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-background/25 px-4 py-2.5 text-[10px] tracking-[0.22em] uppercase text-background/75 hover:border-background hover:text-background transition-colors duration-500"
              >
                TikTok
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div className="lg:col-span-3">
            <h4 className="text-[10px] tracking-[0.34em] uppercase text-background/45 mb-6">
              Navigation
            </h4>
            <ul className="space-y-3.5 text-[13px] font-light">
              {[
                { href: "/#about", label: "Le Concept" },
                { href: "/#collection", label: "Nos Essences" },
                { href: "/#experience", label: "Personnalisation" },
                { href: "/#collection", label: "Boutique" },
                { href: "/#contact", label: "Contact" },
              ].map((l, i) => (
                <li key={i}>
                  <Link
                    href={l.href}
                    className="text-background/70 hover:text-background transition-colors duration-500"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Garanties */}
          <div className="lg:col-span-4">
            <h4 className="text-[10px] tracking-[0.34em] uppercase text-background/45 mb-6">
              Nos engagements
            </h4>
            <ul className="space-y-4 text-[13px] font-light text-background/70">
              <li className="flex items-start gap-3">
                <Truck className="w-4 h-4 mt-0.5 shrink-0 text-[#d8cbb8]" />
                Livraison partout au Maroc
              </li>
              <li className="flex items-start gap-3">
                <Wallet className="w-4 h-4 mt-0.5 shrink-0 text-[#d8cbb8]" />
                Paiement à la livraison
              </li>
              <li className="flex items-start gap-3">
                <ShieldCheck className="w-4 h-4 mt-0.5 shrink-0 text-[#d8cbb8]" />
                Produits originaux
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-7 border-t border-background/15 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-background/40 text-[11px] tracking-[0.12em]">
            © 2026 {BRAND}. Tous droits réservés.
          </p>
          <div className="flex items-center gap-6">
            <p className="text-background/40 text-[11px] tracking-[0.12em]">
              Oujda, Maroc
            </p>
            <Link
              href="/admin"
              className="text-background/30 hover:text-background/70 transition-colors text-[11px] tracking-[0.12em]"
            >
              Espace Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
