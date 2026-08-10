/**
 * Nom de la marque, source unique.
 *
 * Tout ce qui affiche le nom — logo, titre de l'onglet, textes, page de
 * vérification — le lit ici. Le changer sur cette ligne suffit : rien n'est
 * réécrit en dur ailleurs, précisément pour qu'une correction d'orthographe
 * n'oblige pas à repasser sur dix fichiers.
 */
export const BRAND = "ASSILL";
export const INSTAGRAM_URL = "https://www.instagram.com/assill.parfums/";

/**
 * Numéro WhatsApp au format international, sans "+" ni espaces.
 * Exemple pour le Maroc : "2126XXXXXXXX".
 * Laisser vide masque simplement le lien WhatsApp — rien ne casse.
 */
export const WHATSAPP_NUMBER = "";

export const WHATSAPP_URL = WHATSAPP_NUMBER
  ? `https://wa.me/${WHATSAPP_NUMBER}`
  : "";

export const resolveImg = (url: string) =>
  url && url.startsWith("/uploads/") ? `/api${url}` : url;
