"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  DEFAULT_LANG,
  LANG_DIR,
  dict,
  normalizeLang,
  type Dict,
  type Lang,
} from "@/lib/i18n";

const STORAGE_KEY = "assill-langue";

type LanguageValue = {
  lang: Lang;
  /** Sens de lecture de la langue courante. */
  dir: "ltr" | "rtl";
  /** Textes de la langue courante. */
  t: Dict;
  setLang: (next: Lang) => void;
};

const LanguageContext = createContext<LanguageValue | null>(null);

/**
 * Langue du site.
 *
 * ─── Pourquoi côté navigateur et pas dans l'URL ────────────────────────────
 *
 * Toutes les pages publiques sont déjà rendues côté client. Passer par des
 * adresses /fr et /ar imposerait de dupliquer l'arborescence et de gérer des
 * redirections, pour un site qui tient en trois pages. Le choix est donc gardé
 * dans le navigateur et appliqué au montage.
 *
 * Contrepartie assumée : Google indexe la version française. Le jour où le
 * référencement en arabe deviendra un enjeu, il faudra passer aux adresses par
 * langue — ce fichier restera le seul point à reprendre.
 *
 * ─── Premier rendu ─────────────────────────────────────────────────────────
 *
 * La langue enregistrée n'est lisible qu'une fois le composant monté : lire
 * `localStorage` pendant le rendu initial donnerait un HTML différent de celui
 * du serveur, et React refuserait l'hydratation. On démarre donc toujours en
 * français, puis on bascule immédiatement si un autre choix a été mémorisé.
 */
export function LanguageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [lang, setLangState] = useState<Lang>(DEFAULT_LANG);

  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem(STORAGE_KEY);
    } catch {
      // Navigation privée ou stockage refusé : le français fait très bien.
    }

    // Aucun choix mémorisé : on suit la langue du navigateur. Un visiteur dont
    // le téléphone est en arabe n'a alors rien à faire.
    const guess =
      saved ??
      (typeof navigator !== "undefined" &&
      navigator.language?.toLowerCase().startsWith("ar")
        ? "ar"
        : DEFAULT_LANG);

    setLangState(normalizeLang(guess));
  }, []);

  // `lang` et `dir` vivent sur <html>, que React ne rend pas ici : on les pose
  // directement. `dir` est ce qui retourne toute la mise en page en arabe.
  useEffect(() => {
    const root = document.documentElement;
    root.lang = lang;
    root.dir = LANG_DIR[lang];
  }, [lang]);

  const setLang = useCallback((next: Lang) => {
    const value = normalizeLang(next);
    setLangState(value);
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // Sans stockage, le choix vaut pour la visite en cours — acceptable.
    }
  }, []);

  return (
    <LanguageContext.Provider
      value={{ lang, dir: LANG_DIR[lang], t: dict(lang), setLang }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

/**
 * Accès à la langue courante et à ses textes.
 * Hors du fournisseur — un test isolé, par exemple — on retombe sur le
 * français plutôt que de lever une erreur : un composant d'affichage ne doit
 * pas casser une page pour une question de langue.
 */
export function useLang(): LanguageValue {
  const ctx = useContext(LanguageContext);
  if (ctx) return ctx;
  return {
    lang: DEFAULT_LANG,
    dir: LANG_DIR[DEFAULT_LANG],
    t: dict(DEFAULT_LANG),
    setLang: () => {},
  };
}
