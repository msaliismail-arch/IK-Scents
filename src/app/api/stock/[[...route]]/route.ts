/**
 * ─────────────────────────────────────────────────────────────────────────
 *  ASSILL — Pont entre le site et le logiciel de gestion de stock
 *  Fichier à placer dans :  src/app/api/stock/[[...route]]/route.ts
 * ─────────────────────────────────────────────────────────────────────────
 *
 *  GET  /api/stock/orders          → les commandes que le logiciel n'a pas
 *                                    encore encaissées (status = "new")
 *  POST /api/stock/orders/close    → { id, status } : marque une commande
 *                                    traitée une fois encaissée
 *  POST /api/stock/stock           → le logiciel publie son stock ; les
 *                                    parfums épuisés passent en « rupture »
 *                                    et ne sont plus commandables
 *
 *  Sécurité : en-tête  x-assil-token  =  process.env.ASSIL_STOCK_TOKEN
 *  (à ajouter dans Vercel → Settings → Environment Variables)
 */

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { priceOf, toAmount } from "@/lib/pricing";

export const dynamic = "force-dynamic";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type,x-assil-token",
  "Cache-Control": "no-store",
};

const json = (data: unknown, status = 200) =>
  new NextResponse(JSON.stringify(data), {
    status,
    headers: { ...CORS, "Content-Type": "application/json" },
  });

/** Le jeton doit être défini ET correspondre. Pas de jeton = pas d'accès. */
function authorized(req: NextRequest) {
  const expected = process.env.ASSIL_STOCK_TOKEN;
  if (!expected) return false;
  return req.headers.get("x-assil-token") === expected;
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS });
}

/* ───────────────────────────── LECTURE ───────────────────────────── */

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ route?: string[] }> }
) {
  if (!authorized(req)) return json({ error: "Non autorisé" }, 401);

  const { route } = await params;
  const section = route?.[0] ?? "";

  /* ── Le catalogue du site, pour que le logiciel de stock le rattrape ──
     Quand un parfum est ajouté sur le site, il n'existe pas encore côté
     stock. Le logiciel lit cette route et crée une fiche à compléter :
     le gérant n'a plus qu'à saisir le prix d'achat et la quantité. */
  if (section === "perfumes") {
    const perfumes = await db.perfume.findMany({
      where: { published: true },
      orderBy: { name: "asc" },
      include: { sizes: { orderBy: { position: "asc" } } },
      take: 500,
    });

    return json({
      perfumes: perfumes.map((p) => ({
        id: p.id,
        name: p.name,
        brand: p.brand,
        family: p.family,
        notes: p.notes,
        gender: p.gender,
        isPack: p.isPack,
        availability: p.availability,
        serialNumber: p.serialNumber ?? "",
        createdAt: p.createdAt.toISOString(),
        /* Les formats vendus, avec le prix réellement payé par le client. */
        sizes: p.sizes.map((s) => {
          const view = priceOf(s);
          return { label: s.label, price: view.final, listPrice: view.original };
        }),
      })),
    });
  }

  if (section !== "orders") return json({ error: "Introuvable" }, 404);

  const since = req.nextUrl.searchParams.get("since");

  const orders = await db.order.findMany({
    where: {
      status: "new",
      ...(since ? { createdAt: { gt: new Date(since) } } : {}),
    },
    orderBy: { createdAt: "desc" },
    include: { items: true },
    take: 100,
  });

  /* Format attendu par le logiciel de stock. */
  const payload = orders.map((o) => {
    const items = o.items.map((i) => ({
      ref: "",                       // rapprochement par nom côté logiciel
      name: i.perfumeName,
      format: i.sizeLabel,           // « 5 ml », « 10 ml », « Flacon 100 ml »…
      qty: i.quantity,
      unitPrice: toAmount(i.price),
    }));

    const produits = items.reduce((a, i) => a + i.unitPrice * i.qty, 0);
    const remise = toAmount(o.offerDiscount);
    const livraison = toAmount(o.deliveryPrice);

    return {
      id: o.id,
      date: o.createdAt.toISOString(),
      client: {
        name: o.customerName,
        phone: o.phone,
        city: o.city ?? "",
        address: o.address,
      },
      message: [o.note, o.offerLabel ? `Offre : ${o.offerLabel}` : ""]
        .filter(Boolean)
        .join(" · "),
      items,
      shipping: livraison,
      total: Math.max(0, produits - remise) + livraison,
    };
  });

  return json({ orders: payload });
}

/* ───────────────────────────── ÉCRITURE ───────────────────────────── */

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ route?: string[] }> }
) {
  if (!authorized(req)) return json({ error: "Non autorisé" }, 401);

  const { route } = await params;
  const section = route?.[0] ?? "";
  const body = await req.json().catch(() => ({}));

  /* 1) Une commande vient d'être encaissée dans le logiciel */
  if (section === "orders" && route?.[1] === "close") {
    const id = String(body.id ?? "");
    if (!id) return json({ error: "id manquant" }, 400);

    const status = body.status === "rejected" ? "cancelled" : "done";
    await db.order.update({ where: { id }, data: { status } }).catch(() => null);
    return json({ ok: true, id, status });
  }

  /* 2) Le logiciel publie son stock → on met à jour la disponibilité */
  if (section === "stock") {
    const products: {
      name?: string;
      ref?: string;
      inStock?: boolean;
    }[] = Array.isArray(body?.products) ? body.products : [];

    if (products.length === 0) return json({ ok: true, updated: 0 });

    const known = await db.perfume.findMany({
      select: { id: true, name: true, availability: true },
    });

    const norm = (s: string) => s.trim().toLowerCase();
    let updated = 0;

    for (const p of products) {
      const name = norm(String(p.name ?? ""));
      if (!name) continue;

      const match = known.find((k) => norm(k.name) === name);
      if (!match) continue;

      const wanted = p.inStock ? "disponible" : "rupture";

      /* « bientot » est un choix manuel du gérant : on ne l'écrase pas. */
      if (match.availability === "bientot") continue;
      if (match.availability === wanted) continue;

      await db.perfume.update({
        where: { id: match.id },
        data: { availability: wanted },
      });
      updated++;
    }

    return json({ ok: true, updated, received: products.length });
  }

  return json({ error: "Introuvable" }, 404);
}
