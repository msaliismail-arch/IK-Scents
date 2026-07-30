import type { DeliveryCity, Settings } from "@/lib/types";

export const DEFAULT_SETTINGS: Settings = {
  deliveryPrice: "0",
  freeDeliveryFrom: "",
  deliveryCities: [],
};

const num = (v: string | number | null | undefined) => {
  const n = Number.parseFloat(String(v ?? "").replace(",", "."));
  return Number.isFinite(n) ? n : 0;
};

/** Normalise la casse et les accents pour comparer deux noms de ville. */
export const normalizeCity = (city: string) =>
  city
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

/** Parse le JSON des exceptions par ville en ignorant tout ce qui est invalide. */
export function parseDeliveryCities(raw: unknown): DeliveryCity[] {
  let value = raw;
  if (typeof raw === "string") {
    try {
      value = JSON.parse(raw || "[]");
    } catch {
      return [];
    }
  }
  if (!Array.isArray(value)) return [];

  return value
    .filter(
      (r): r is { city: unknown; price: unknown } =>
        !!r && typeof r === "object"
    )
    .map((r) => ({
      city: String(r.city ?? "").trim(),
      price: String(r.price ?? "").trim(),
    }))
    .filter((r) => r.city !== "");
}

export type DeliveryResult = {
  /** Frais de livraison retenus, en MAD */
  price: number;
  /** true si la livraison est offerte (0 MAD) */
  free: boolean;
  /** Pourquoi ce montant — utile pour l'affichage */
  reason: "default" | "city" | "threshold" | "free";
  /** Montant restant à atteindre pour la livraison offerte (0 si non applicable) */
  missingForFree: number;
};

/**
 * Calcule les frais de livraison d'une commande.
 * Ordre des règles :
 *   1. le sous-total atteint le seuil de gratuité  → 0 MAD
 *   2. la ville a une exception                    → prix de la ville
 *   3. sinon                                       → prix par défaut
 */
export function computeDelivery(
  settings: Settings,
  subtotal: number,
  city: string
): DeliveryResult {
  const threshold = num(settings.freeDeliveryFrom);
  const hasThreshold = settings.freeDeliveryFrom.trim() !== "" && threshold > 0;

  if (hasThreshold && subtotal >= threshold) {
    return { price: 0, free: true, reason: "threshold", missingForFree: 0 };
  }

  const key = normalizeCity(city);
  const match = key
    ? settings.deliveryCities.find((c) => normalizeCity(c.city) === key)
    : undefined;

  const price = match ? num(match.price) : num(settings.deliveryPrice);
  const missingForFree =
    hasThreshold && subtotal > 0 ? Math.max(0, threshold - subtotal) : 0;

  return {
    price,
    free: price <= 0,
    reason: price <= 0 ? "free" : match ? "city" : "default",
    missingForFree,
  };
}
