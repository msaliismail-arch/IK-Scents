import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { DEFAULT_SETTINGS, parseDeliveryCities } from "@/lib/delivery";
import type { Settings } from "@/lib/types";
import { requireAdmin } from "@/lib/guard";

const SETTINGS_ID = "main";

type SettingsRow = {
  deliveryPrice: string;
  freeDeliveryFrom: string;
  deliveryCitiesJson: string;
  announcement?: string | null;
  announcementUrl?: string | null;
  announcementActive?: boolean | null;
};

const toSettings = (row: SettingsRow): Settings => ({
  deliveryPrice: row.deliveryPrice ?? "0",
  freeDeliveryFrom: row.freeDeliveryFrom ?? "",
  deliveryCities: parseDeliveryCities(row.deliveryCitiesJson),
  announcement: row.announcement ?? "",
  announcementUrl: row.announcementUrl ?? "",
  announcementActive: Boolean(row.announcementActive),
});

/**
 * Le bandeau est du texte libre affiché sur tout le site : seule une URL
 * http(s) y est admise, jamais un `javascript:`.
 */
const cleanAnnouncementUrl = (v: unknown) => {
  const raw = String(v ?? "").trim();
  if (!raw) return "";
  try {
    const url = new URL(raw, "https://placeholder.invalid");
    if (raw.startsWith("/")) return raw.slice(0, 300); // lien interne
    if (url.protocol !== "http:" && url.protocol !== "https:") return "";
    return url.toString().slice(0, 300);
  } catch {
    return "";
  }
};

/** Nettoie une valeur monétaire saisie à la main ("30 dh", "30,5" → "30.5"). */
const cleanAmount = (v: unknown) => {
  const raw = String(v ?? "").trim().replace(",", ".");
  if (raw === "") return "";
  const n = Number.parseFloat(raw.replace(/[^\d.]/g, ""));
  return Number.isFinite(n) && n >= 0 ? String(n) : "";
};

// GET /api/settings — lecture publique (utilisée par la page de commande)
export async function GET() {
  try {
    const row = await db.settings.findUnique({ where: { id: SETTINGS_ID } });
    if (!row) return NextResponse.json(DEFAULT_SETTINGS);
    return NextResponse.json(toSettings(row));
  } catch (error) {
    console.error("Error fetching settings:", error);
    // Un réglage manquant ne doit jamais empêcher de commander
    return NextResponse.json(DEFAULT_SETTINGS);
  }
}

// PUT /api/settings — mise à jour depuis l'espace admin
export async function PUT(request: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const body = await request.json();

    const deliveryPrice = cleanAmount(body.deliveryPrice) || "0";
    const freeDeliveryFrom = cleanAmount(body.freeDeliveryFrom);
    const cities = parseDeliveryCities(body.deliveryCities).map((c) => ({
      city: c.city,
      price: cleanAmount(c.price) || "0",
    }));

    const announcement = String(body.announcement ?? "").trim().slice(0, 200);
    const announcementUrl = cleanAnnouncementUrl(body.announcementUrl);

    const data = {
      deliveryPrice,
      freeDeliveryFrom,
      deliveryCitiesJson: JSON.stringify(cities),
      announcement,
      announcementUrl,
      // Un bandeau vide n'a rien à afficher : on force l'interrupteur à false
      // plutôt que de laisser une bande vide en haut du site.
      announcementActive: Boolean(body.announcementActive) && announcement !== "",
    };

    const row = await db.settings.upsert({
      where: { id: SETTINGS_ID },
      update: data,
      create: { id: SETTINGS_ID, ...data },
    });

    return NextResponse.json(toSettings(row));
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
