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
 * Lit un montant saisi à la main.
 * Accepte la virgule décimale et les espaces ; renvoie 0 si rien d'utilisable.
 */
export function toAmount(value: unknown): number {
  const raw = String(value ?? "")
    .trim()
    .replace(",", ".")
    .replace(/[^\d.]/g, "");
  const n = Number.parseFloat(raw);
  return Number.isFinite(n) && n > 0 ? Math.round(n) : 0;
}

/**
 * Prix normalisé, prêt à être enregistré. "" si la saisie ne donne rien —
 * c'est ce qui distingue « pas de promotion » de « promotion à 0 MAD ».
 */
export function normalizePromoPrice(value: unknown): string {
  const n = toAmount(value);
  return n > 0 ? String(n) : "";
}

export type PriceView = {
  /** prix catalogue */
  original: number;
  /** prix réellement payé */
  final: number;
  hasDiscount: boolean;
};

/**
 * Prix affiché et prix payé pour un format donné.
 *
 * Un prix promotionnel supérieur ou égal au prix catalogue est ignoré : ce
 * n'est pas une promotion, c'est une faute de frappe, et l'afficher barré
 * ferait passer une hausse pour une remise.
 */
export function priceOf(size: {
  price?: string | number | null;
  promoPrice?: string | null;
}): PriceView {
  const original = toAmount(size?.price);
  const promo = toAmount(size?.promoPrice);

  if (promo <= 0 || original <= 0 || promo >= original) {
    return { original, final: original, hasDiscount: false };
  }

  return { original, final: promo, hasDiscount: true };
}
