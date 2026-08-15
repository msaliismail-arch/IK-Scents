/**
 * Lecture d'une offre écrite en toutes lettres.
 *
 * ─── Ce que ce module fait, et surtout ce qu'il ne fait pas ────────────────
 *
 * Il TRADUIT une phrase en règle. Il ne DÉCIDE rien. Le résultat est proposé
 * à l'admin, qui le voit écrit noir sur blanc avant d'enregistrer.
 *
 * Cette distinction est tout le sujet : une règle d'argent devinée et
 * appliquée en silence est une porte ouverte aux ventes à perte. « 2 » dans
 * « à partir de 2 flacons » et « 2 » dans « −2 % » ne sont pas le même
 * chiffre, et aucune analyse de texte n'est infaillible. L'admin relit donc
 * toujours ce qui a été compris.
 *
 * ─── Pourquoi sans intelligence artificielle ───────────────────────────────
 *
 * Le vocabulaire d'une boutique de décants est minuscule : des montants, des
 * quantités, des contenances, une livraison, un pourcentage. Une analyse par
 * mots-clés le couvre entièrement, fonctionne hors ligne, ne coûte rien et
 * donne toujours le même résultat pour la même phrase. Un modèle de langage
 * apporterait de la souplesse et, avec elle, de l'imprévisibilité — sur des
 * remises, c'est un mauvais échange.
 *
 * ─── Langues ──────────────────────────────────────────────────────────────
 *
 * Français, arabe et darija en lettres latines, mélangés librement : c'est
 * ainsi qu'on écrit une note au Maroc.
 */

export type ParsedOffer = {
  conditionType: "minSubtotal" | "minQuantity" | "minSize";
  conditionValue: string;
  conditionSize: string;
  rewardType: "freeDelivery" | "percentOff" | "amountOff";
  rewardValue: string;
  /** Ce que le module n'a pas su déterminer et a dû supposer. */
  warnings: string[];
};

/** Chiffres arabes-indiens → chiffres latins, pour lire « ٣٠٠ » comme « 300 ». */
function latinDigits(text: string): string {
  return text.replace(/[٠-٩۰-۹]/g, (d) => {
    const code = d.charCodeAt(0);
    const base = code >= 0x06f0 ? 0x06f0 : 0x0660;
    return String(code - base);
  });
}

const has = (text: string, words: string[]) =>
  words.some((w) => text.includes(w));

/** Vocabulaire de la livraison, dans les trois façons de l'écrire. */
const DELIVERY = ["livraison", "توصيل", "livrison", "tawsil", "livrai"];
const FREE = ["gratuit", "offert", "مجان", "majjan", "gratis", "free"];
const MONEY = ["mad", "dh", "dirham", "درهم", "dhs"];
const COUNT = [
  "article",
  "produit",
  "flacon",
  "parfum",
  "منتوج",
  "منتج",
  "عطر",
  "قارورة",
  "pièce",
  "piece",
];

/**
 * Repère une contenance : « 10 ml », « 10ml », « 5 ML ».
 * Renvoie le libellé normalisé et la position du nombre qui la précède, pour
 * ne pas confondre ce nombre avec une quantité ou un montant.
 */
function findSize(text: string): { label: string; index: number } | null {
  const m = /(\d+(?:[.,]\d+)?)\s*(ml|مل)\b/i.exec(text);
  if (!m) return null;
  return { label: `${m[1]} ml`, index: m.index };
}

/** Tous les nombres du texte, avec leur position. */
function numbers(text: string): { value: number; index: number }[] {
  const out: { value: number; index: number }[] = [];
  const re = /\d+(?:[.,]\d+)?/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    const value = Number.parseFloat(m[0].replace(",", "."));
    if (Number.isFinite(value)) out.push({ value, index: m.index });
  }
  return out;
}

/**
 * Traduit une phrase en règle.
 *
 * Découpe d'abord sur le mot qui sépare la condition de la récompense
 * (« alors », « → », « راه »…). Sans séparateur, la phrase entière sert aux
 * deux analyses : « livraison offerte à partir de 300 dh » se comprend
 * parfaitement sans conjonction.
 */
export function parseOffer(input: string): ParsedOffer {
  const raw = latinDigits(String(input ?? "")).toLowerCase();
  const warnings: string[] = [];

  const cut = raw.search(
    /(→|=>|->|\balors\b|\bdonc\b|\bراه\b|\brah\b|\bkat?wali\b|\bkaytwal+i\b)/
  );
  const condPart = cut > -1 ? raw.slice(0, cut) : raw;
  const rewardPart = cut > -1 ? raw.slice(cut) : raw;

  // ── La récompense ────────────────────────────────────────────────────────
  let rewardType: ParsedOffer["rewardType"] = "freeDelivery";
  let rewardValue = "0";

  const percent = /(\d+(?:[.,]\d+)?)\s*%/.exec(rewardPart);

  if (has(rewardPart, DELIVERY) && has(rewardPart, FREE)) {
    rewardType = "freeDelivery";
  } else if (percent) {
    rewardType = "percentOff";
    rewardValue = String(Math.round(Number.parseFloat(percent[1].replace(",", "."))));
  } else if (cut > -1 && has(rewardPart, MONEY)) {
    // Un montant après le séparateur est une remise en dirhams.
    const n = numbers(rewardPart)[0];
    if (n) {
      rewardType = "amountOff";
      rewardValue = String(Math.round(n.value));
    }
  } else if (has(raw, DELIVERY)) {
    rewardType = "freeDelivery";
  } else {
    warnings.push(
      "La récompense n'est pas claire : livraison offerte a été supposée."
    );
  }

  // ── La condition ─────────────────────────────────────────────────────────
  let conditionType: ParsedOffer["conditionType"] = "minSubtotal";
  let conditionValue = "";
  let conditionSize = "";

  const size = findSize(condPart);
  const nums = numbers(condPart);

  if (size) {
    // « 2 flacons de 10 ml » : le nombre qui compte est celui AVANT la
    // contenance, pas le 10 de « 10 ml ».
    conditionType = "minSize";
    conditionSize = size.label;
    const before = nums.filter((n) => n.index < size.index);
    conditionValue = String(Math.round(before.length ? before[before.length - 1].value : 1));
    if (!before.length) {
      warnings.push("Aucune quantité trouvée avant le format : 1 a été supposé.");
    }
  } else if (has(condPart, MONEY)) {
    conditionType = "minSubtotal";
    const n = nums[0];
    conditionValue = n ? String(Math.round(n.value)) : "";
  } else if (has(condPart, COUNT)) {
    conditionType = "minQuantity";
    const n = nums[0];
    conditionValue = n ? String(Math.round(n.value)) : "";
  } else {
    const n = nums[0];
    conditionValue = n ? String(Math.round(n.value)) : "";
    // Un nombre nu et élevé est presque toujours un montant ; un petit nombre,
    // une quantité. Le seuil de 20 sépare les deux dans une boutique de
    // décants, où l'on n'achète pas 50 flacons mais où 50 MAD existe.
    conditionType = n && n.value >= 20 ? "minSubtotal" : "minQuantity";
    warnings.push(
      "Le type de condition a été deviné : vérifiez qu'il s'agit bien du bon."
    );
  }

  if (!conditionValue) {
    warnings.push("Aucun chiffre n'a été trouvé dans la condition.");
  }

  return {
    conditionType,
    conditionValue,
    conditionSize,
    rewardType,
    rewardValue,
    warnings,
  };
}

/**
 * Réécrit une règle en une phrase française.
 * C'est ce que l'admin relit avant d'enregistrer : si la phrase ne dit pas ce
 * qu'il voulait, il corrige avant que l'offre ne touche un seul client.
 */
export function describeOffer(o: {
  conditionType: string;
  conditionValue: string;
  conditionSize?: string;
  rewardType: string;
  rewardValue: string;
}): string {
  const v = o.conditionValue || "?";

  const condition =
    o.conditionType === "minSize"
      ? `le panier contient au moins ${v} × ${o.conditionSize || "?"}`
      : o.conditionType === "minQuantity"
        ? `le panier contient au moins ${v} article${Number(v) > 1 ? "s" : ""}`
        : `le sous-total atteint ${v} MAD`;

  const reward =
    o.rewardType === "percentOff"
      ? `${o.rewardValue || "?"} % de remise`
      : o.rewardType === "amountOff"
        ? `${o.rewardValue || "?"} MAD de remise`
        : "la livraison est offerte";

  return `Si ${condition}, alors ${reward}.`;
}
