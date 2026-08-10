import Link from "next/link";
import { Instagram, MessageCircle, Package, Droplet, Truck } from "lucide-react";
import { Brandmark } from "@/components/site/brandmark";
import { BRAND, INSTAGRAM_URL, WHATSAPP_URL } from "@/lib/site";

const NAV = [
  { href: "/#about", label: "Le Concept" },
  { href: "/#collection", label: "Nos Décants" },
  { href: "/#collection", label: "Boutique" },
  { href: "/#contact", label: "Contact" },
];

const ENGAGEMENTS = [
  { icon: Package, label: "Parfums originaux" },
  { icon: Droplet, label: "De 5 ml au flacon complet" },
  { icon: Truck, label: "Livraison partout au Maroc" },
];

export function Footer() {
  return (
    <footer className="bg-[#171717] text-[#f7f4ee]">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-12 pt-20 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10">
          {/* Marque */}
          <div className="lg:col-span-5">
            <Brandmark size={52} variant="dark" />
            <p className="mt-7 font-serif text-xl font-light leading-snug text-[#f7f4ee]/80 max-w-xs">
              Une signature olfactive accessible.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 border border-[#f7f4ee]/25 px-5 py-3 text-[11px] font-semibold tracking-[0.2em] uppercase text-[#f7f4ee]/80 hover:border-[#f7f4ee] hover:text-[#f7f4ee] transition-colors duration-500"
              >
                <Instagram className="w-4 h-4" />
                Instagram
              </a>

              {WHATSAPP_URL && (
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 border border-[#f7f4ee]/25 px-5 py-3 text-[11px] font-semibold tracking-[0.2em] uppercase text-[#f7f4ee]/80 hover:border-[#f7f4ee] hover:text-[#f7f4ee] transition-colors duration-500"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp
                </a>
              )}
            </div>
          </div>

          {/* Navigation */}
          <div className="lg:col-span-3">
            <h4 className="text-[10px] font-semibold tracking-[0.34em] uppercase text-[#d8cbb8] mb-6">
              Navigation
            </h4>
            {/* Au doigt, une ligne de texte de 20 px de haut est une cible
                trop fine. Les liens deviennent des blocs de 44 px sur écran
                tactile ; à la souris, l'espacement d'origine est conservé. */}
            <ul className="text-[14px] font-light">
              {NAV.map((l, i) => (
                <li key={i}>
                  <Link
                    href={l.href}
                    className="inline-flex items-center py-2 pointer-coarse:min-h-[44px] text-[#f7f4ee]/75 hover:text-[#f7f4ee] transition-colors duration-500"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Engagements */}
          <div className="lg:col-span-4">
            <h4 className="text-[10px] font-semibold tracking-[0.34em] uppercase text-[#d8cbb8] mb-6">
              Nos engagements
            </h4>
            <ul className="space-y-4 text-[14px] font-light text-[#f7f4ee]/75">
              {ENGAGEMENTS.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-start gap-3">
                  <Icon className="w-4 h-4 mt-0.5 shrink-0 text-[#d8cbb8]" />
                  {label}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-7 border-t border-[#f7f4ee]/15 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[#f7f4ee]/40 text-[11px] tracking-[0.12em]">
            © 2026 {BRAND}. Tous droits réservés.
          </p>
          <div className="flex items-center gap-5">
            <p className="text-[#f7f4ee]/40 text-[11px] tracking-[0.12em]">
              Oujda, Maroc
            </p>
            <Link
              href="/admin"
              className="inline-flex items-center px-2 -mr-2 pointer-coarse:min-h-[44px] text-[#f7f4ee]/30 hover:text-[#f7f4ee]/70 transition-colors text-[11px] tracking-[0.12em]"
            >
              Espace Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
