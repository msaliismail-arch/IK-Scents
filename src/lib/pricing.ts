/**
 * Genre et remise d'un parfum.
 *
 * Le prix remisé est recalculé partout à partir des mêmes fonctions — page
 * d'accueil, page de commande et API. Un client ne doit jamais voir un prix
 * différent de celui qu'il paie.
 */

export const GENDERS = [
  { value: "homme", label: "Homme" },
  { value: "femme", label: "Femme" },
  { value: "unisexe", label: "Unisexe" },
] as const;

const GENDER_VALUES = GENDERS.map((g) => g.value) as readonly string[];

/** Retourne le libellé affichable, ou "" si le genre n'est pas précisé. */
export function genderLabel(value: string | null | undefined) {
  const key = String(value ?? "").trim().toLowerCase();
  return GENDERS.find((g) => g.value === key)?.label ?? "";
}

/** Normalise une valeur de genre, chaîne vide si inconnue. */
export function normalizeGender(value: unknown) {
  const key = String(value ?? "").trim().toLowerCase();
  return GENDER_VALUES.includes(key) ? key : "";
}

/**
 * Remise en pourcentage, bornée entre 0 et 90.
 * Au-delà de 90 % il s'agit presque toujours d'une faute de frappe — et une
 * erreur de saisie ne doit pas se transformer en vente à perte.
 */
export function normalizeDiscount(value: unknown) {
  const raw = String(value ?? "").trim().replace(",", ".");
  const n = Number.parseFloat(raw.replace(/[^\d.]/g, ""));
  if (!Number.isFinite(n) || n <= 0) return 0;
  return Math.min(90, Math.round(n));
}

/** Arrondi au dirham : on n'affiche jamais de centimes sur un prix en MAD. */
const round = (n: number) => Math.round(n);

/**
 * La promotion est-elle encore valable ?
 * Sans date de fin, elle court indéfiniment. Avec une date passée, le prix
 * revient au tarif normal tout seul — c'est ce qui évite d'oublier une
 * liquidation ouverte pendant des mois.
 */
export function isDiscountActive(until: unknown): boolean {
  if (!until) return true;
  const end = new Date(String(until));
  if (Number.isNaN(end.getTime())) return true;
  // La date choisie est incluse : la promo court jusqu'à la fin de ce jour.
  end.setHours(23, 59, 59, 999);
  return end.getTime() >= Date.now();
}

/**
 * Date de fin lisible, ou "" si la promo n'a pas d'échéance.
 * `locale` permet d'afficher « 20 août 2026 » ou « ٢٠ غشت ٢٠٢٦ » selon la
 * langue choisie par le visiteur.
 */
export function discountEndLabel(until: unknown, locale = "fr-FR"): string {
  if (!until) return "";
  const end = new Date(String(until));
  if (Number.isNaN(end.getTime())) return "";
  return end.toLocaleDateString(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** Convertit une saisie "AAAA-MM-JJ" en Date, ou null si vide/invalide. */
export function normalizeDiscountUntil(value: unknown): Date | null {
  const raw = String(value ?? "").trim();
  if (!raw) return null;
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return null;
  d.setHours(23, 59, 59, 999);
  return d;
}

export type PriceView = {
  /** prix catalogue */
  original: number;
  /** prix réellement payé */
  final: number;
  percent: number;
  hasDiscount: boolean;
};

export function priceWithDiscount(
  price: string | number | null | undefined,
  discount: unknown,
  discountUntil?: unknown
): PriceView {
  const raw = Number.parseFloat(String(price ?? "").replace(",", "."));
  const original = Number.isFinite(raw) ? raw : 0;
  const percent = normalizeDiscount(discount);

  if (percent <= 0 || original <= 0 || !isDiscountActive(discountUntil)) {
    return { original, final: original, percent: 0, hasDiscount: false };
  }

  return {
    original,
    final: round(original * (1 - percent / 100)),
    percent,
    hasDiscount: true,
  };
}
