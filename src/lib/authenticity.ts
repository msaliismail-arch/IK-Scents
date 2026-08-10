/**
 * Authenticité & provenance.
 *
 * ─── Ce que ce module fait, et surtout ce qu'il ne fait pas ─────────────────
 *
 * ASSIL vend des DÉCANTS : le parfum est transvasé depuis un flacon de marque
 * acheté original. Le numéro de série et le code de lot appartiennent donc au
 * FLACON SOURCE, pas au petit flacon reçu par le client. C'est exactement ce
 * qu'on affiche, et c'est pour ça que la formulation parle de « provenance »
 * et jamais de « certificat ».
 *
 * Aucun numéro n'est inventé ici. Il n'existe AUCUNE fonction de génération :
 * tout vient de ce que l'admin a relevé à la main sur le flacon.
 *
 * Aucune marque (Dior, Lancôme, Prada…) ne propose de service public
 * permettant de vérifier un numéro de série. Le QR code ne prétend donc rien
 * certifier : il pointe vers la page de vérification ASSIL, qui affiche les
 * informations du flacon source et renvoie le client vers deux contrôles
 * indépendants qu'il peut faire lui-même — le décodeur de code de lot, et la
 * page officielle de la marque.
 */

import { BRAND } from "@/lib/site";

/** Longueur maximale acceptée pour un numéro de série. */
const SERIAL_MAX = 60;
/** Longueur maximale d'un code de lot (les vrais font 3 à 12 caractères). */
const BATCH_MAX = 20;

/**
 * Met un numéro de série sous forme canonique : majuscules, espaces internes
 * réduits, caractères exotiques retirés. Deux saisies du même numéro doivent
 * donner la même chaîne, sinon la contrainte d'unicité ne sert à rien.
 * Retourne "" si rien d'exploitable — l'appelant stockera alors `null`.
 */
export function normalizeSerial(value: unknown): string {
  return String(value ?? "")
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9\-/.\s]/g, "")
    .replace(/\s+/g, " ")
    .slice(0, SERIAL_MAX)
    .trim();
}

/** Même principe pour le code de lot, mais sans espaces : ils n'en ont pas. */
export function normalizeBatchCode(value: unknown): string {
  return String(value ?? "")
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, BATCH_MAX);
}

/**
 * Valide une URL officielle. Seuls http et https sont acceptés : `javascript:`
 * ou `data:` dans un lien affiché au public ouvrirait une porte à l'injection.
 * Retourne "" si l'URL est invalide — l'appelant refusera l'enregistrement.
 */
export function normalizeOfficialUrl(value: unknown): string {
  const raw = String(value ?? "").trim();
  if (!raw) return "";
  try {
    const url = new URL(raw);
    if (url.protocol !== "http:" && url.protocol !== "https:") return "";
    if (!url.hostname.includes(".")) return "";
    return url.toString().slice(0, 500);
  } catch {
    return "";
  }
}

/** `true` si la chaîne est une URL officielle exploitable. */
export const isValidOfficialUrl = (value: unknown): boolean =>
  normalizeOfficialUrl(value) !== "";

/**
 * Domaine public du site, utilisé pour construire le contenu du QR code.
 * Le QR est scanné par un téléphone qui n'a aucun contexte : il lui faut une
 * URL absolue. On la prend dans l'environnement pour ne pas coder en dur un
 * domaine qui changera.
 */
export function siteOrigin(): string {
  const fromEnv =
    process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXTAUTH_URL || "";
  if (fromEnv) return fromEnv.trim().replace(/\/+$/, "");
  // Côté navigateur, l'origine courante est toujours la bonne réponse.
  if (typeof window !== "undefined") return window.location.origin;
  return "";
}

/**
 * Adresse encodée dans le QR code : la fiche de vérification ASSIL du numéro
 * de série. Le QR « correspond » donc bien au numéro — il en est dérivé.
 */
export function verifyUrl(serial: string, origin?: string): string {
  const s = normalizeSerial(serial);
  if (!s) return "";
  const base = (origin ?? siteOrigin()).replace(/\/+$/, "");
  return `${base}/verifier/${encodeURIComponent(s)}`;
}

/**
 * Décodeur public de code de lot. C'est la seule vérification réellement
 * indépendante qu'on puisse proposer au client : elle donne la date de
 * fabrication du flacon. Un code qui ne se décode pas est un signal fort.
 */
export function batchCheckUrl(batchCode: string): string {
  const b = normalizeBatchCode(batchCode);
  return b ? `https://checkfresh.com/?code=${encodeURIComponent(b)}` : "";
}

/** Informations d'authenticité prêtes à l'affichage. */
export type AuthenticityView = {
  /** Au moins un élément à montrer ? Sinon on masque toute la section. */
  has: boolean;
  serial: string;
  batchCode: string;
  officialUrl: string;
  /** Contenu du QR code. Vide = pas de QR. */
  qrTarget: string;
  batchUrl: string;
};

/**
 * Rassemble les informations d'authenticité d'un parfum.
 *
 * Le QR n'est produit que si un numéro de série existe : sans numéro, il n'y a
 * rien à vérifier et un QR décoratif ne ferait qu'induire le client en erreur.
 */
export function authenticityOf(
  perfume: {
    serialNumber?: string | null;
    batchCode?: string | null;
    officialUrl?: string | null;
  },
  origin?: string
): AuthenticityView {
  const serial = normalizeSerial(perfume.serialNumber);
  const batchCode = normalizeBatchCode(perfume.batchCode);
  const officialUrl = normalizeOfficialUrl(perfume.officialUrl);

  return {
    has: Boolean(serial || batchCode || officialUrl),
    serial,
    batchCode,
    officialUrl,
    qrTarget: serial ? verifyUrl(serial, origin) : "",
    batchUrl: batchCheckUrl(batchCode),
  };
}

/**
 * Phrase de non-affiliation. Affichée partout où une marque tierce est citée :
 * c'est ce qui distingue « voici d'où vient ce décant » de « cette marque
 * garantit ce produit », et c'est la première protection juridique du site.
 */
export const NON_AFFILIATION = `${BRAND} n'est affilié à aucune des marques citées. Les liens renvoient vers les sites officiels afin que vous puissiez comparer le produit par vous-même.`;
