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
 * 0633386334 s'écrit donc "212633386334" : le 0 initial est remplacé par
 * l'indicatif du Maroc, sinon wa.me ne reconnaît pas le numéro.
 * Laisser vide masque simplement le lien WhatsApp — rien ne casse.
 */
export const WHATSAPP_NUMBER = "212633386334";

/** Le même numéro tel qu'on l'écrit au Maroc, pour l'afficher au visiteur. */
export const PHONE_DISPLAY = "06 33 38 63 34";

export const WHATSAPP_URL = WHATSAPP_NUMBER
  ? `https://wa.me/${WHATSAPP_NUMBER}`
  : "";

export const resolveImg = (url: string) =>
  url && url.startsWith("/uploads/") ? `/api${url}` : url;
