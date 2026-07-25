import Link from "next/link";
import { Instagram } from "lucide-react";
import { BRAND, INSTAGRAM_URL } from "@/lib/site";

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <span className="font-serif text-2xl tracking-[0.25em]">{BRAND}</span>
            <p className="mt-4 text-background/60 text-sm font-light leading-relaxed max-w-xs">
              Parfums originaux, authenticité garantie. Livraison partout au
              Maroc, paiement à la livraison.
            </p>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 text-[11px] tracking-[0.16em] uppercase text-background/70 hover:text-[#c9a96e] transition-colors"
            >
              <Instagram className="w-4 h-4" />
              @assill.parfums
            </a>
          </div>

          <div>
            <h4 className="text-[10px] tracking-[0.3em] uppercase text-background/50 mb-5">
              Boutique
            </h4>
            <ul className="space-y-3 text-sm font-light">
              <li>
                <Link href="/#collection" className="text-background/75 hover:text-[#c9a96e] transition-colors">
                  Nos Essences
                </Link>
              </li>
              <li>
                <Link href="/#experience" className="text-background/75 hover:text-[#c9a96e] transition-colors">
                  Personnalisation
                </Link>
              </li>
              <li>
                <Link href="/#about" className="text-background/75 hover:text-[#c9a96e] transition-colors">
                  Le Concept
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] tracking-[0.3em] uppercase text-background/50 mb-5">
              Informations
            </h4>
            <ul className="space-y-3 text-sm font-light">
              <li>
                <Link href="/#contact" className="text-background/75 hover:text-[#c9a96e] transition-colors">
                  Contact
                </Link>
              </li>
              <li className="text-background/50">Livraison 48h — Maroc</li>
              <li className="text-background/50">Paiement à la livraison</li>
              <li>
                <Link href="/admin" className="text-background/40 hover:text-[#c9a96e] transition-colors text-xs">
                  Espace Admin
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-7 border-t border-background/15 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-background/40 text-[11px] tracking-[0.1em]">
            © 2026 {BRAND}. Tous droits réservés.
          </p>
          <p className="text-background/40 text-[11px] tracking-[0.1em]">
            Oujda, Maroc
          </p>
        </div>
      </div>
    </footer>
  );
}
