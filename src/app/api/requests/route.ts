import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/guard";

const GENDERS = ["homme", "femme", "unisexe"];
const FORMATS = ["10ml", "20ml"];

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

    if (!name || !phone) {
      return NextResponse.json(
        { error: "Le nom du parfum et le téléphone sont requis" },
        { status: 400 }
      );
    }

    const gender = clean(body.gender, 20).toLowerCase();
    const format = clean(body.format, 20).toLowerCase().replace(/\s/g, "");

    const created = await db.perfumeRequest.create({
      data: {
        name,
        brand: clean(body.brand),
        gender: GENDERS.includes(gender) ? gender : "",
        format: FORMATS.includes(format) ? format : "",
        phone,
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
