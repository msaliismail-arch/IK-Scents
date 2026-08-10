"use client";

import { Globe } from "lucide-react";
import { useLang } from "@/components/site/language-provider";
import { LANGS, LANG_LABELS } from "@/lib/i18n";

/**
 * Sélecteur de langue — « FR » et « عربية » côte à côte.
 *
 * Deux boutons visibles plutôt qu'une liste déroulante : avec deux langues,
 * un menu demande deux gestes et cache l'option qu'on cherche. Ici le choix se
 * lit et se fait d'un seul appui.
 *
 * Chaque langue est écrite dans sa propre graphie. Un francophone reconnaît
 * « FR », un arabophone reconnaît « عربية » — personne n'a besoin de
 * comprendre l'autre langue pour trouver la sienne. Pas de drapeaux non plus :
 * le drapeau marocain ne dit pas « arabe », il dit « Maroc », et les deux
 * langues se parlent au Maroc.
 */
export function LanguageToggle({
  className = "",
  variant = "light",
}: {
  className?: string;
  /** "dark" : posé sur fond sombre (menu mobile en négatif, pied de page). */
  variant?: "light" | "dark";
}) {
  const { lang, setLang, t } = useLang();

  const dark = variant === "dark";
  const border = dark ? "border-[#f7f4ee]/25" : "border-[#e6ded0]";
  const idle = dark
    ? "text-[#f7f4ee]/60 hover:text-[#f7f4ee]"
    : "text-[#6b6255] hover:text-[#171717]";
  const active = dark
    ? "bg-[#f7f4ee] text-[#171717]"
    : "bg-[#171717] text-white";

  return (
    <div
      role="group"
      aria-label={t.nav.language}
      className={`inline-flex items-center border ${border} ${className}`}
    >
      <Globe
        aria-hidden="true"
        className={`w-3.5 h-3.5 shrink-0 mx-2 ${
          dark ? "text-[#f7f4ee]/50" : "text-[#8a7a63]"
        }`}
      />
      {LANGS.map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => setLang(code)}
          // `aria-pressed` plutôt qu'une simple couleur : un lecteur d'écran
          // annonce alors laquelle des deux langues est active.
          aria-pressed={lang === code}
          lang={code}
          className={`px-2.5 py-1.5 pointer-coarse:min-h-[44px] inline-flex items-center text-[12px] font-semibold tracking-[0.08em] transition-colors duration-300 ${
            lang === code ? active : idle
          }`}
        >
          {LANG_LABELS[code]}
        </button>
      ))}
    </div>
  );
}
