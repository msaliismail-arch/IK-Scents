import { normalizePromoPrice } from "@/lib/pricing";

/**
 * Mise en forme des formats d'un parfum (5 ml, 10 ml…) avant enregistrement.
 *
 * Vit ici et non dans une route : un fichier `route.ts` ne peut exporter que
 * les gestionnaires HTTP — Next refuse toute autre export à la compilation.
 * La création et la modification d'un parfum partagent donc cette fonction,
 * ce qui garantit qu'un prix promo accepté à la création l'est aussi à
 * l'édition.
 */
type SizeInput = { label?: string; price?: string; promoPrice?: string };

export function cleanSizes(
  sizes: unknown
): { label: string; price: string; promoPrice: string; position: number }[] {
  if (!Array.isArray(sizes)) return [];
  return sizes
    .map((s: SizeInput, i: number) => ({
      label: (s?.label ?? "").toString().trim(),
      price: (s?.price ?? "").toString().trim(),
      // "" pour toute saisie inexploitable — c'est ce qui distingue
      // « pas de promotion » de « promotion à 0 MAD ».
      promoPrice: normalizePromoPrice(s?.promoPrice),
      position: i,
    }))
    // Un format sans libellé ou sans prix est une ligne commencée puis
    // abandonnée par l'admin : elle n'a rien à faire en base.
    .filter((s) => s.label !== "" && s.price !== "");
}
