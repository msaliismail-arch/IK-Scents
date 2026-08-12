import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  DEFAULT_SETTINGS,
  computeDelivery,
  parseDeliveryCities,
} from "@/lib/delivery";
import type { Settings } from "@/lib/types";
import { requireAdmin } from "@/lib/guard";
import { resolveAvailability } from "@/lib/availability";
import { priceOf } from "@/lib/pricing";
import { notifyNewOrder } from "@/lib/notify";

/**
 * Les frais de livraison sont TOUJOURS recalculés côté serveur à partir des
 * réglages admin — jamais repris du navigateur, qui peut être modifié.
 */
async function loadSettings(): Promise<Settings> {
  try {
    const row = await db.settings.findUnique({ where: { id: "main" } });
    if (!row) return DEFAULT_SETTINGS;
    return {
      deliveryPrice: row.deliveryPrice ?? "0",
      freeDeliveryFrom: row.freeDeliveryFrom ?? "",
      deliveryCities: parseDeliveryCities(row.deliveryCitiesJson),
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

// GET /api/orders - Liste des commandes (admin)
export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const orders = await db.order.findMany({
      orderBy: { createdAt: "desc" },
      include: { items: true },
    });
    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

type IncomingLine = {
  perfumeId?: string;
  sizeLabel?: string;
  quantity?: unknown;
};

/**
 * POST /api/orders — enregistre une commande, d'une ou plusieurs lignes.
 *
 * ─── Ce que le navigateur n'a pas le droit de décider ──────────────────────
 *
 * Rien de ce qui touche à l'argent. Le prix de chaque ligne est relu en base,
 * promotion comprise ; la disponibilité est revérifiée ; les frais de
 * livraison sont recalculés depuis les réglages admin. Le panier envoyé ne
 * sert qu'à dire QUOI et COMBIEN — jamais À QUEL PRIX. Sans cette règle,
 * n'importe qui commanderait un flacon à 1 MAD en modifiant la requête.
 *
 * ─── Une commande, une livraison ───────────────────────────────────────────
 *
 * Les frais sont calculés sur le sous-total de tout le panier, une seule fois.
 * C'est le sens même d'un panier : un seul colis, une seule livraison.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerName, phone, address, city, note } = body;

    if (!customerName || !phone || !address) {
      return NextResponse.json(
        { error: "Nom, téléphone et adresse sont requis" },
        { status: 400 }
      );
    }

    const lines: IncomingLine[] = Array.isArray(body.items) ? body.items : [];
    if (lines.length === 0) {
      return NextResponse.json({ error: "Votre panier est vide." }, { status: 400 });
    }

    // Garde-fou : un panier de 50 lignes distinctes n'existe pas dans une
    // boutique de décants, c'est une requête forgée.
    if (lines.length > 30) {
      return NextResponse.json(
        { error: "Trop d'articles dans le panier." },
        { status: 400 }
      );
    }

    const items: {
      perfumeId: string | null;
      perfumeName: string;
      sizeLabel: string;
      price: string;
      quantity: number;
      brand: string;
      serialNumber: string;
      officialUrl: string;
    }[] = [];

    let subtotal = 0;

    for (const line of lines) {
      const perfumeId = String(line?.perfumeId ?? "").trim();
      const wantedSize = String(line?.sizeLabel ?? "").trim();

      const qty = Number.parseInt(String(line?.quantity ?? "1"), 10);
      const quantity = Number.isFinite(qty) && qty > 0 ? Math.min(qty, 99) : 1;

      if (!perfumeId || !wantedSize) {
        return NextResponse.json(
          { error: "Un article du panier est incomplet." },
          { status: 400 }
        );
      }

      const ref = await db.perfume.findUnique({
        where: { id: perfumeId },
        select: {
          name: true,
          availability: true,
          published: true,
          brand: true,
          serialNumber: true,
          officialUrl: true,
          sizes: { select: { label: true, price: true, promoPrice: true } },
        },
      });

      if (!ref) {
        return NextResponse.json(
          { error: "Un parfum de votre panier n'existe plus." },
          { status: 404 }
        );
      }

      if (!ref.published || !resolveAvailability(ref.availability).orderable) {
        return NextResponse.json(
          { error: `« ${ref.name} » n'est plus disponible à la commande.` },
          { status: 409 }
        );
      }

      const size = ref.sizes.find(
        (s) => s.label.trim().toLowerCase() === wantedSize.toLowerCase()
      );

      if (!size) {
        return NextResponse.json(
          { error: `Le format choisi pour « ${ref.name} » n'existe plus.` },
          { status: 400 }
        );
      }

      const unitPrice = priceOf(size).final;
      subtotal += unitPrice * quantity;

      items.push({
        perfumeId,
        perfumeName: ref.name,
        sizeLabel: size.label,
        price: String(unitPrice),
        quantity,
        brand: ref.brand ?? "",
        serialNumber: ref.serialNumber ?? "",
        officialUrl: ref.officialUrl ?? "",
      });
    }

    const settings = await loadSettings();
    const delivery = computeDelivery(
      settings,
      subtotal,
      city ? String(city) : ""
    );

    const order = await db.order.create({
      data: {
        customerName: String(customerName).trim(),
        phone: String(phone).trim(),
        address: String(address).trim(),
        city: city ? String(city).trim() : null,
        deliveryPrice: String(delivery.price),
        note: note ? String(note).trim() : null,
        status: "new",
        items: { create: items },
      },
      include: { items: true },
    });

    // Alerte au gérant. `await` volontaire : sur une plateforme sans serveur,
    // l'exécution s'arrête dès la réponse renvoyée — une promesse laissée en
    // suspens serait tuée avant d'avoir atteint Telegram. Le module a son
    // propre délai maximal et n'échoue jamais, la commande est donc déjà
    // acquise quoi qu'il arrive ici.
    await notifyNewOrder({
      customerName: order.customerName,
      phone: order.phone,
      address: order.address,
      city: order.city,
      note: order.note,
      deliveryPrice: delivery.price,
      items: items.map((i) => ({
        perfumeName: i.perfumeName,
        sizeLabel: i.sizeLabel,
        quantity: i.quantity,
        unitPrice: Number(i.price),
      })),
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
