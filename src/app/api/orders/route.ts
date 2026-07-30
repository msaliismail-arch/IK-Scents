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
import { priceWithDiscount } from "@/lib/pricing";

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
      // Sans rapport avec la livraison, mais Settings les exige : les reprendre
      // évite de faire diverger ce type de sa source en base.
      announcement: row.announcement ?? "",
      announcementUrl: row.announcementUrl ?? "",
      announcementActive: Boolean(row.announcementActive),
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

// GET /api/orders - List all orders (admin)
export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const orders = await db.order.findMany({
      orderBy: { createdAt: "desc" },
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

// POST /api/orders - Create an order (public order form)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      customerName,
      phone,
      address,
      city,
      perfumeId,
      perfumeName,
      sizeLabel,
      price,
      quantity,
      note,
    } = body;

    if (!customerName || !phone || !address || !perfumeName || !sizeLabel) {
      return NextResponse.json(
        { error: "Nom, téléphone, adresse et produit sont requis" },
        { status: 400 }
      );
    }

    const qty = Number.parseInt(quantity, 10);
    const safeQty = Number.isFinite(qty) && qty > 0 ? qty : 1;

    // Le prix facturé vient TOUJOURS de la base, jamais du navigateur : sinon
    // n'importe qui pourrait commander à 1 MAD. La remise est appliquée ici,
    // donc le client paie exactement ce que le site lui a affiché.
    let unitPrice = Number.parseFloat(String(price ?? "").replace(",", "."));
    if (!Number.isFinite(unitPrice) || unitPrice < 0) unitPrice = 0;

    // Informations d'authenticité recopiées depuis le parfum. Rien n'est
    // généré ici : si le flacon n'a pas de numéro, la commande n'en aura pas.
    let authSnapshot = { brand: "", serialNumber: "", officialUrl: "" };

    if (perfumeId) {
      const ref = await db.perfume.findUnique({
        where: { id: String(perfumeId) },
        select: {
          availability: true,
          published: true,
          discount: true,
          discountUntil: true,
          brand: true,
          serialNumber: true,
          officialUrl: true,
          sizes: { select: { label: true, price: true } },
        },
      });

      if (!ref) {
        return NextResponse.json(
          { error: "Parfum introuvable." },
          { status: 404 }
        );
      }

      if (!ref.published || !resolveAvailability(ref.availability).orderable) {
        return NextResponse.json(
          { error: "Ce parfum n'est pas disponible à la commande." },
          { status: 409 }
        );
      }

      const wanted = String(sizeLabel).trim().toLowerCase();
      const size = ref.sizes.find(
        (s) => s.label.trim().toLowerCase() === wanted
      );

      if (!size) {
        return NextResponse.json(
          { error: "Ce format n'est pas proposé pour ce parfum." },
          { status: 400 }
        );
      }

      unitPrice = priceWithDiscount(
        size.price,
        ref.discount,
        ref.discountUntil
      ).final;

      authSnapshot = {
        brand: ref.brand ?? "",
        serialNumber: ref.serialNumber ?? "",
        officialUrl: ref.officialUrl ?? "",
      };
    }

    const subtotal = unitPrice * safeQty;

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
        perfumeId: perfumeId ?? null,
        perfumeName: String(perfumeName).trim(),
        sizeLabel: String(sizeLabel).trim(),
        price: String(unitPrice),
        ...authSnapshot,
        quantity: safeQty,
        deliveryPrice: String(delivery.price),
        note: note ? String(note).trim() : null,
        status: "new",
      },
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
