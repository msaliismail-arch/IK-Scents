export const BRAND = "ASSIL";
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
