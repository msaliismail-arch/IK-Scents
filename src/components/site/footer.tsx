import Link from "next/link";
import { Instagram } from "lucide-react";
import { Logo } from "./logo";
import { BRAND, INSTAGRAM_URL } from "@/lib/site";

export function Footer() {
  return (
    <footer className="bg-[#faf8f4] border-t border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <Logo size={36} />

          <div className="flex gap-6 text-neutral-400 text-sm font-light text-center">
            <span>Authenticité garantie</span>
            <span>·</span>
            <span>Made with ♥ in Morocco</span>
          </div>

          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-400 hover:text-[#a88a4e] hover:border-[#dcc9a0] transition-all duration-300"
            aria-label="Instagram"
          >
            <Instagram className="w-4 h-4" />
          </a>
        </div>

        <div className="mt-8 pt-6 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-center">
          <p className="text-neutral-400 text-xs font-light tracking-wider">
            © 2026 {BRAND}. Tous droits réservés.
          </p>
          <Link
            href="/admin"
            className="text-neutral-300 text-xs hover:text-[#a88a4e] transition-colors tracking-wider uppercase"
          >
            Espace Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
