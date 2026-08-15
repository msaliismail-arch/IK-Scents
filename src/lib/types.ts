export interface Size {
  id?: string;
  label: string;
  price: string;
  /** Prix promotionnel en MAD. "" = pas de promotion sur ce format. */
  promoPrice?: string;
  position?: number;
}

export interface Perfume {
  id: string;
  name: string;
  description: string;
  image: string;
  /** Marque, ex. "Lancôme". */
  brand?: string;
  /**
   * Numéro de série réel du flacon d'origine, saisi à la main par l'admin.
   * Jamais généré. Unique en base. `null` = non renseigné.
   */
  serialNumber?: string | null;
  /** Code de lot imprimé sous le flacon, vérifiable sur CheckFresh. */
  batchCode?: string;
  /** Page officielle du produit chez la marque (http/https). */
  officialUrl?: string;
  /** Famille olfactive saisie par l'admin, ex. "Boisé oriental". */
  family?: string;
  /** Notes principales, ex. "Bergamote · Rose · Ambre". */
  notes?: string;
  /** État du stock. Voir AVAILABILITY dans lib/availability.ts. */
  availability?: string;
  /** "homme" | "femme" | "unisexe" | "" */
  gender?: string;
  /** Version arabe. Vide = le texte français est affiché dans les deux langues. */
  nameAr?: string;
  descriptionAr?: string;
  familyAr?: string;
  notesAr?: string;
  /** true = coffret / lot, affiché dans « Nos packs » */
  isPack?: boolean;
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
  /** Nom du parfum recherché */
  name: string;
  /** Ancien champ, plus demandé au client */
  brand?: string;
  gender: string;
  format: string;
  /** Nombre d'exemplaires souhaités. */
  quantity?: number;
  /** Coordonnées du client */
  customerName?: string;
  phone: string;
  address?: string;
  city?: string;
  postalCode?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

/** Une ligne de commande : un parfum, un format, une quantité. */
export interface OrderItem {
  id?: string;
  perfumeId?: string | null;
  perfumeName: string;
  sizeLabel: string;
  /** Prix unitaire facturé, promotion déjà appliquée. */
  price: string;
  quantity: number;
  /** Copie figée des infos d'authenticité au moment de la commande. */
  brand?: string;
  serialNumber?: string;
  officialUrl?: string;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  city?: string | null;
  items: OrderItem[];
  /** Frais de livraison de la commande entière, en MAD. */
  deliveryPrice?: string;
  /** Offre appliquée au moment de la commande. "" = aucune. */
  offerLabel?: string;
  /** Remise apportée par l'offre, en MAD. */
  offerDiscount?: string;
  note?: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

/** Une ligne du panier, côté navigateur. */
export interface CartLine {
  perfumeId: string;
  perfumeName: string;
  /** Nom arabe, pour afficher le panier dans la langue courante. */
  perfumeNameAr?: string;
  image: string;
  sizeLabel: string;
  /** Prix unitaire affiché au client, promotion déjà appliquée. */
  price: number;
  quantity: number;
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

/**
 * Annonce publiée par l'admin.
 * Affichée dans la section « Annonces » de l'accueil ; la première active
 * alimente aussi le bandeau en haut du site.
 */
export interface Announcement {
  id: string;
  title: string;
  body?: string;
  /** Lien interne ("/#collection") ou externe ("https://…"). "" = aucun. */
  url?: string;
  /** Texte du bouton. Vide avec une URL renseignée = libellé par défaut. */
  linkLabel?: string;
  /** Version arabe. Vide = le texte français est affiché dans les deux langues. */
  titleAr?: string;
  bodyAr?: string;
  linkLabelAr?: string;
  active: boolean;
  position?: number;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Visuel du carrousel, tout en haut de la page d'accueil.
 * `perfumeName` est joint par l'API : il sert de texte alternatif à l'image.
 */
export interface Slide {
  id: string;
  image: string;
  /** Parfum vers lequel mène le clic. null = visuel non cliquable. */
  perfumeId?: string | null;
  perfumeName?: string;
  active: boolean;
  position?: number;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
}
