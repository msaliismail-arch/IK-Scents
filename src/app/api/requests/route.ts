import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/guard";

const GENDERS = ["homme", "femme", "unisexe"];

const clean = (v: unknown, max = 120) =>
  String(v ?? "")
    .trim()
    .slice(0, max);

// GET /api/requests — liste des demandes (admin)
export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const requests = await db.perfumeRequest.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(requests);
  } catch (error) {
    console.error("Error fetching perfume requests:", error);
    return NextResponse.json(
      { error: "Failed to fetch requests" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/requests — un client indique le parfum qu'il recherche.
 * Ouvert au public : c'est un formulaire de la page d'accueil.
 * Aucun prix, aucune commande — uniquement un signal de demande.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const name = clean(body.name);
    const phone = clean(body.phone, 30);
    const customerName = clean(body.customerName);

    if (!name || !phone || !customerName) {
      return NextResponse.json(
        { error: "Le parfum, votre nom et votre téléphone sont requis" },
        { status: 400 }
      );
    }

    const gender = clean(body.gender, 20).toLowerCase();
    // Le format vient des décants définis par l'admin : on le stocke tel quel
    // plutôt que de le comparer à une liste figée dans le code.
    const format = clean(body.format, 30);

    // Quantité bornée : le champ vient du navigateur, donc rien n'empêche
    // d'envoyer 99999. On garde une valeur qui a un sens commercial.
    const parsedQty = Number.parseInt(String(body.quantity ?? "1"), 10);
    const quantity =
      Number.isFinite(parsedQty) && parsedQty > 0 ? Math.min(parsedQty, 99) : 1;

    const created = await db.perfumeRequest.create({
      data: {
        name,
        gender: GENDERS.includes(gender) ? gender : "",
        format,
        quantity,
        customerName,
        phone,
        address: clean(body.address, 250),
        city: clean(body.city, 80),
        postalCode: clean(body.postalCode, 20),
        status: "new",
      },
    });

    return NextResponse.json({ id: created.id }, { status: 201 });
  } catch (error) {
    console.error("Error creating perfume request:", error);
    return NextResponse.json(
      { error: "Failed to create request" },
      { status: 500 }
    );
  }
}
