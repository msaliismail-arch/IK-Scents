/**
 * Nettoyage des annonces.
 *
 * Une annonce est du texte libre saisi par l'admin et affiché sur toutes les
 * pages : c'est exactement le genre de champ par lequel une URL piégée
 * (`javascript:…`) se glisse dans un site. D'où la validation stricte du lien.
 */

/** Longueurs maximales — au-delà, l'annonce déborde de son bandeau. */
export const TITLE_MAX = 120;
export const BODY_MAX = 400;
export const LINK_LABEL_MAX = 40;
const URL_MAX = 300;

/**
 * Valide le lien d'une annonce.
 * Accepte un chemin interne ("/#collection") ou une adresse http(s).
 * Tout le reste — `javascript:`, `data:`, texte quelconque — devient "".
 */
export function normalizeAnnouncementUrl(value: unknown): string {
  const raw = String(value ?? "").trim();
  if (!raw) return "";

  // Lien interne : commence par "/" mais pas par "//" (qui serait un lien
  // protocole-relatif vers un domaine externe).
  if (raw.startsWith("/") && !raw.startsWith("//")) return raw.slice(0, URL_MAX);

  try {
    const url = new URL(raw);
    if (url.protocol !== "http:" && url.protocol !== "https:") return "";
    if (!url.hostname.includes(".")) return "";
    return url.toString().slice(0, URL_MAX);
  } catch {
    return "";
  }
}

const clean = (value: unknown, max: number) =>
  String(value ?? "").trim().slice(0, max);

export type AnnouncementInput = {
  title: string;
  body: string;
  url: string;
  linkLabel: string;
  titleAr: string;
  bodyAr: string;
  linkLabelAr: string;
  active: boolean;
  position: number;
};

/** Met un corps de requête en forme, prêt pour la base. */
export function normalizeAnnouncement(body: {
  title?: unknown;
  body?: unknown;
  url?: unknown;
  linkLabel?: unknown;
  titleAr?: unknown;
  bodyAr?: unknown;
  linkLabelAr?: unknown;
  active?: unknown;
  position?: unknown;
}): AnnouncementInput {
  const url = normalizeAnnouncementUrl(body.url);
  const pos = Number.parseInt(String(body.position ?? "0"), 10);

  return {
    title: clean(body.title, TITLE_MAX),
    body: clean(body.body, BODY_MAX),
    url,
    // Un libellé de bouton sans lien n'a rien à ouvrir : on le laisse tomber.
    linkLabel: url ? clean(body.linkLabel, LINK_LABEL_MAX) : "",
    // Les champs arabes suivent exactement les mêmes limites : une annonce
    // trop longue déborde du bandeau quelle que soit sa langue.
    titleAr: clean(body.titleAr, TITLE_MAX),
    bodyAr: clean(body.bodyAr, BODY_MAX),
    linkLabelAr: url ? clean(body.linkLabelAr, LINK_LABEL_MAX) : "",
    active: body.active === undefined ? true : Boolean(body.active),
    position: Number.isFinite(pos) ? Math.max(0, Math.min(pos, 999)) : 0,
  };
}
