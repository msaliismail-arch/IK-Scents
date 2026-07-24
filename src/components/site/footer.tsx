import Link from "next/link";
import { Instagram } from "lucide-react";
import { Logo } from "./logo";
import { LeafBranch } from "./botanical";
import { BRAND, INSTAGRAM_URL } from "@/lib/site";

export function Footer() {
  return (
    <footer className="relative bg-surface-alt border-t border-border overflow-hidden">
      <LeafBranch className="absolute -top-4 right-6 w-16 h-40 text-[#9a8266] opacity-15 pointer-events-none hidden md:block" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <Logo size={36} />

          <div className="flex gap-6 text-muted-foreground text-sm font-light text-center">
            <span>Authenticité garantie</span>
            <span>·</span>
            <span>Made with ♥ in Morocco</span>
          </div>

          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 rounded-full border border-gold-soft flex items-center justify-center text-muted-foreground hover:text-gold hover:bg-gold-soft transition-all duration-300"
            aria-label="Instagram"
          >
            <Instagram className="w-4 h-4" />
          </a>
        </div>

        <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-2 text-center">
          <p className="text-muted-foreground text-xs font-light tracking-wider">
            © 2026 {BRAND}. Tous droits réservés.
          </p>
          <Link
            href="/admin"
            className="text-muted-foreground/70 text-xs hover:text-gold transition-colors tracking-wider uppercase"
          >
            Espace Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
