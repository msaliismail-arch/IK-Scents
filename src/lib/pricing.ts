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
  discount: unknown
): PriceView {
  const raw = Number.parseFloat(String(price ?? "").replace(",", "."));
  const original = Number.isFinite(raw) ? raw : 0;
  const percent = normalizeDiscount(discount);

  if (percent <= 0 || original <= 0) {
    return { original, final: original, percent: 0, hasDiscount: false };
  }

  return {
    original,
    final: round(original * (1 - percent / 100)),
    percent,
    hasDiscount: true,
  };
}
