export interface Size {
  id?: string;
  label: string;
  price: string;
  position?: number;
}

export interface Perfume {
  id: string;
  name: string;
  description: string;
  image: string;
  /** Famille olfactive saisie par l'admin, ex. "Boisé oriental". */
  family?: string;
  /** Notes principales, ex. "Bergamote · Rose · Ambre". */
  notes?: string;
  /** État du stock. Voir AVAILABILITY dans lib/availability.ts. */
  availability?: string;
  published: boolean;
  sizes: Size[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Parfum recherché par un client (« Votre parfum préféré »).
 * Ce n'est pas une commande : c'est un signal de demande pour le stock.
 */
export interface PerfumeRequest {
  id: string;
  name: string;
  brand: string;
  gender: string;
  format: string;
  phone: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  city?: string | null;
  perfumeId?: string | null;
  perfumeName: string;
  sizeLabel: string;
  price: string;
  quantity: number;
  /** Frais de livraison appliqués à cette commande, en MAD */
  deliveryPrice?: string;
  note?: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

/** Exception de prix de livraison pour une ville précise. */
export interface DeliveryCity {
  city: string;
  price: string;
}

/** Réglages du site, modifiables depuis l'espace admin. */
export interface Settings {
  /** Prix appliqué partout au Maroc. "0" = livraison gratuite. */
  deliveryPrice: string;
  /** Livraison offerte à partir de ce montant. "" = désactivé. */
  freeDeliveryFrom: string;
  /** Villes qui ne suivent pas le prix par défaut. */
  deliveryCities: DeliveryCity[];
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
}
