/**
 * État de stock d'un parfum.
 *
 * Trois états seulement : un client doit savoir en une seconde s'il peut
 * commander. Annoncer « disponible » un flacon qu'on n'a pas est la façon la
 * plus rapide de perdre la confiance qu'ASSIL vend — le bouton Commander est
 * donc désactivé dès que le stock n'est pas réel.
 */
export const AVAILABILITY = {
  disponible: {
    value: "disponible",
    label: "Disponible",
    /** texte affiché sur la fiche produit */
    badge: "En stock",
    /** le client peut-il commander ? */
    orderable: true,
    /** libellé du bouton */
    cta: "Commander",
  },
  bientot: {
    value: "bientot",
    label: "Bientôt disponible",
    badge: "Bientôt disponible",
    orderable: false,
    cta: "Me prévenir",
  },
  rupture: {
    value: "rupture",
    label: "Épuisé",
    badge: "Épuisé",
    orderable: false,
    cta: "Me prévenir",
  },
} as const;

export type AvailabilityKey = keyof typeof AVAILABILITY;

export const AVAILABILITY_OPTIONS = Object.values(AVAILABILITY);

export const DEFAULT_AVAILABILITY: AvailabilityKey = "disponible";

/** Ramène n'importe quelle valeur à un état connu. Jamais d'écran cassé. */
export function resolveAvailability(value: string | null | undefined) {
  const key = String(value ?? "").trim().toLowerCase();
  return (
    AVAILABILITY[key as AvailabilityKey] ?? AVAILABILITY[DEFAULT_AVAILABILITY]
  );
}
