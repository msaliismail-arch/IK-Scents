/**
 * Alertes Telegram.
 *
 * ─── Pourquoi Telegram et pas WhatsApp ─────────────────────────────────────
 *
 * WhatsApp n'autorise pas un serveur à envoyer un message sans passer par la
 * plateforme Business de Meta : compte vérifié, second numéro dédié à l'API et
 * modèles de message validés à l'avance. Telegram donne le même résultat —
 * une notification sur le téléphone dès qu'une commande arrive — avec un jeton
 * obtenu en cinq minutes auprès de @BotFather.
 *
 * ─── Règle absolue ─────────────────────────────────────────────────────────
 *
 * Une notification qui échoue ne doit JAMAIS faire échouer une commande. Le
 * client a rempli le formulaire, la commande est en base : qu'une alerte se
 * perde est un désagrément pour le gérant, pas une raison de renvoyer une
 * erreur à l'acheteur. Toutes les fonctions d'ici avalent donc leurs erreurs
 * et se contentent de les tracer dans les journaux.
 *
 * ─── Configuration ─────────────────────────────────────────────────────────
 *
 * Deux variables d'environnement. Tant qu'elles sont absentes, le module ne
 * fait rien du tout et le site fonctionne exactement comme avant.
 *
 *   TELEGRAM_BOT_TOKEN  jeton donné par @BotFather
 *   TELEGRAM_CHAT_ID    identifiant de la conversation qui reçoit les alertes
 */

/** Coupe une valeur trop longue : Telegram refuse au-delà de 4096 caractères. */
function clamp(value: unknown, max = 200): string {
  const s = String(value ?? "").trim();
  return s.length > max ? `${s.slice(0, max - 1)}…` : s;
}

/**
 * Échappe les caractères réservés du HTML.
 * Un nom de client contenant « < » casserait le message envoyé en mode HTML —
 * et le client choisit ce qu'il tape.
 */
function esc(value: unknown): string {
  return clamp(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

async function send(text: string): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  // Non configuré : ce n'est pas une erreur, c'est un choix.
  if (!token || !chatId) return;

  try {
    const res = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: "HTML",
          disable_web_page_preview: true,
        }),
        // Sans délai maximal, un Telegram lent retiendrait la réponse envoyée
        // au client bien après que sa commande a été enregistrée.
        signal: AbortSignal.timeout(6000),
      }
    );

    if (!res.ok) {
      console.error("Telegram refuse la notification:", res.status, await res.text());
    }
  } catch (error) {
    console.error("Notification Telegram impossible:", error);
  }
}

type OrderAlert = {
  customerName: string;
  phone: string;
  address: string;
  city?: string | null;
  deliveryPrice: number;
  note?: string | null;
  items: {
    perfumeName: string;
    sizeLabel: string;
    quantity: number;
    unitPrice: number;
  }[];
};

/**
 * Alerte « nouvelle commande ».
 *
 * Une commande peut contenir plusieurs parfums : chaque ligne est détaillée,
 * puis le total est calculé ici à partir des montants déjà validés côté
 * serveur. C'est le chiffre que le gérant veut lire en premier, et le
 * recalculer de tête sur un téléphone n'a aucun intérêt.
 */
export async function notifyNewOrder(order: OrderAlert): Promise<void> {
  const subtotal = order.items.reduce(
    (sum, i) => sum + i.unitPrice * i.quantity,
    0
  );
  const total = subtotal + order.deliveryPrice;

  const lines = [
    "🛍️ <b>Nouvelle commande</b>",
    "",
    ...order.items.map(
      (i) =>
        `• <b>${esc(i.perfumeName)}</b> — ${esc(i.sizeLabel)} × ${i.quantity} · ${
          i.unitPrice * i.quantity
        } MAD`
    ),
    "",
    `Sous-total ${subtotal} MAD · Livraison ${
      order.deliveryPrice > 0 ? `${order.deliveryPrice} MAD` : "offerte"
    }`,
    `<b>Total ${total} MAD</b> (paiement à la livraison)`,
    "",
    `👤 ${esc(order.customerName)}`,
    // Le numéro reste cliquable dans Telegram : un appui suffit pour appeler.
    `📞 ${esc(order.phone)}`,
    `📍 ${esc(order.address)}${order.city ? `, ${esc(order.city)}` : ""}`,
  ];

  if (order.note) lines.push("", `📝 ${esc(order.note)}`);

  await send(lines.join("\n"));
}

type RequestAlert = {
  name: string;
  gender?: string;
  format?: string;
  quantity?: number;
  customerName?: string;
  phone: string;
  city?: string;
};

/**
 * Alerte « demande de parfum » — un client cherche un parfum absent du
 * catalogue. Ce n'est pas une vente, mais c'est ce qui dit quoi acheter
 * ensuite : autant le savoir tout de suite.
 */
export async function notifyNewRequest(req: RequestAlert): Promise<void> {
  const lines = [
    "🔎 <b>Demande de parfum</b>",
    "",
    `<b>${esc(req.name)}</b>`,
    [
      req.gender ? esc(req.gender) : "",
      req.format ? esc(req.format) : "",
      req.quantity && req.quantity > 1 ? `× ${req.quantity}` : "",
    ]
      .filter(Boolean)
      .join(" · "),
    "",
    `👤 ${esc(req.customerName || "—")}`,
    `📞 ${esc(req.phone)}`,
  ];

  if (req.city) lines.push(`📍 ${esc(req.city)}`);

  await send(lines.filter((l) => l !== "").join("\n"));
}
