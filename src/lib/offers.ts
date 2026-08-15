import type { DeliveryResult } from "@/lib/delivery";

/**
 * Moteur d'offres.
 *
 * ─── Un seul endroit pour la règle ─────────────────────────────────────────
 *
 * Ce module est utilisé par le panier (pour afficher) ET par l'API de commande
 * (pour facturer). Deux implémentations finiraient par diverger, et le client
 * verrait un prix différent de celui qu'on lui demande — la pire forme de bug
 * dans une boutique.
 *
 * ─── Une offre, pas deux ───────────────────────────────────────────────────
 *
 * Quand plusieurs offres sont éligibles, on retient celle qui fait gagner le
 * plus au client, et elle seule. Le cumul semble généreux mais produit des
 * ventes à perte invisibles : une remise de 15 % empilée sur une livraison
 * offerte et un prix promo peut passer sous le prix d'achat sans que rien ne
 * l'annonce.
 */

export const CONDITION_TYPES = [
  { value: "minSubtotal", label: "Le sous-total atteint (MAD)" },
  { value: "minQuantity", label: "Nombre d'articles au total" },
  { value: "minSize", label: "Nombre d'articles d'un format précis" },
] as const;

export const REWARD_TYPES = [
  { value: "freeDelivery", label: "Livraison offerte" },
  { value: "percentOff", label: "Remise en % sur le sous-total" },
  { value: "amountOff", label: "Remise en MAD sur le sous-total" },
] as const;

export type Offer = {
  id?: string;
  label: string;
  labelAr?: string;
  conditionType: string;
  conditionValue: string;
  conditionSize?: string;
  rewardType: string;
  rewardValue: string;
  active: boolean;
  position?: number;
};

/** Ligne de panier vue par le moteur — le strict nécessaire. */
export type OfferLine = {
  sizeLabel: string;
  price: number;
  quantity: number;
};

const num = (v: unknown) => {
  const n = Number.parseFloat(String(v ?? "").replace(",", "."));
  return Number.isFinite(n) ? n : 0;
};

/** Comparaison de formats tolérante : « 10ml », « 10 ML » et « 10 ml » sont le même. */
const sameSize = (a: string, b: string) =>
  a.trim().toLowerCase().replace(/\s+/g, "") ===
  b.trim().toLowerCase().replace(/\s+/g, "");

/** L'offre est-elle déclenchée par ce panier ? */
function isEligible(offer: Offer, lines: OfferLine[], subtotal: number): boolean {
  const threshold = num(offer.conditionValue);
  if (threshold <= 0) return false;

  switch (offer.conditionType) {
    case "minQuantity":
      return lines.reduce((n, l) => n + l.quantity, 0) >= threshold;

    case "minSize": {
      const wanted = (offer.conditionSize ?? "").trim();
      // Une offre « par format » sans format renseigné ne veut rien dire :
      // l'appliquer à tout le panier serait une mauvaise surprise.
      if (!wanted) return false;
      const count = lines
        .filter((l) => sameSize(l.sizeLabel, wanted))
        .reduce((n, l) => n + l.quantity, 0);
      return count >= threshold;
    }

    case "minSubtotal":
    default:
      return subtotal >= threshold;
  }
}

export type AppliedOffer = {
  label: string;
  labelAr: string;
  /** Remise appliquée au sous-total, en MAD. */
  discount: number;
  /** L'offre rend-elle la livraison gratuite ? */
  freeDelivery: boolean;
  /** Ce que le client économise au total — sert à départager les offres. */
  saving: number;
};

/**
 * Choisit l'offre la plus avantageuse et calcule son effet.
 *
 * `deliveryPrice` est le montant qui SERAIT facturé sans offre : il sert à
 * mesurer ce qu'une livraison offerte fait réellement gagner. Une livraison
 * déjà gratuite ne fait rien gagner — l'offre correspondante ne sera donc
 * jamais retenue face à une vraie remise.
 */
export function bestOffer(
  offers: Offer[],
  lines: OfferLine[],
  subtotal: number,
  deliveryPrice: number
): AppliedOffer | null {
  let best: AppliedOffer | null = null;

  for (const offer of offers) {
    if (!offer.active) continue;
    if (!isEligible(offer, lines, subtotal)) continue;

    let discount = 0;
    let freeDelivery = false;

    switch (offer.rewardType) {
      case "percentOff": {
        // Borné à 90 % : au-delà, c'est une faute de frappe, et une erreur de
        // saisie ne doit pas se transformer en vente à un dirham.
        const pct = Math.min(90, Math.max(0, num(offer.rewardValue)));
        discount = Math.round((subtotal * pct) / 100);
        break;
      }
      case "amountOff":
        // Jamais plus que le sous-total : une commande ne peut pas être négative.
        discount = Math.min(subtotal, Math.max(0, Math.round(num(offer.rewardValue))));
        break;
      case "freeDelivery":
      default:
        freeDelivery = true;
        break;
    }

    const saving = discount + (freeDelivery ? deliveryPrice : 0);
    if (saving <= 0) continue;

    if (!best || saving > best.saving) {
      best = {
        label: offer.label,
        labelAr: offer.labelAr ?? "",
        discount,
        freeDelivery,
        saving,
      };
    }
  }

  return best;
}

export type CartTotals = {
  subtotal: number;
  /** Remise apportée par l'offre retenue. */
  discount: number;
  delivery: number;
  total: number;
  offer: AppliedOffer | null;
};

/**
 * Totaux d'un panier, offres comprises.
 *
 * L'ordre compte : les frais de livraison sont d'abord calculés normalement
 * (seuil de gratuité, exception par ville), PUIS l'offre s'applique. Une offre
 * « livraison offerte » sur une livraison déjà gratuite n'apporte rien, et
 * c'est ce que dit le calcul.
 */
export function cartTotals(
  offers: Offer[],
  lines: OfferLine[],
  delivery: DeliveryResult
): CartTotals {
  const subtotal = lines.reduce((n, l) => n + l.price * l.quantity, 0);
  const offer = bestOffer(offers, lines, subtotal, delivery.price);

  const discount = offer?.discount ?? 0;
  const deliveryDue = offer?.freeDelivery ? 0 : delivery.price;

  return {
    subtotal,
    discount,
    delivery: deliveryDue,
    total: Math.max(0, subtotal - discount) + deliveryDue,
    offer,
  };
}
