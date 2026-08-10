import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/guard";

/**
 * GET /api/slides — visuels actifs du carrousel, dans l'ordre d'affichage.
 * `?all=true` renvoie aussi les visuels désactivés : réservé à l'admin.
 *
 * Le nom du parfum lié est joint à la réponse : il sert de texte alternatif
 * à l'image et évite au client un second aller-retour par visuel.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    let all = false;
    if (searchParams.get("all") === "true") {
      const denied = await requireAdmin();
      if (denied) return denied;
      all = true;
    }

    const slides = await db.slide.findMany({
      where: all ? {} : { active: true },
      orderBy: [{ position: "asc" }, { createdAt: "asc" }],
      include: { perfume: { select: { id: true, name: true } } },
    });

    return NextResponse.json(
      slides.map((s) => ({
        id: s.id,
        image: s.image,
        active: s.active,
        position: s.position,
        perfumeId: s.perfumeId,
        perfumeName: s.perfume?.name ?? "",
      }))
    );
  } catch (error) {
    console.error("Error fetching slides:", error);
    // Un carrousel indisponible ne doit jamais empêcher la page de s'afficher.
    return NextResponse.json([]);
  }
}

// POST /api/slides — ajout d'un visuel (admin)
export async function POST(request: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const body = await request.json();
    const image = String(body.image ?? "").trim();

    if (!image) {
      return NextResponse.json(
        { error: "Une image est requise" },
        { status: 400 }
      );
    }

    const perfumeId = String(body.perfumeId ?? "").trim() || null;

    // Le nouveau visuel se place à la fin plutôt qu'en tête : ajouter une photo
    // ne doit pas bousculer un ordre déjà réglé.
    const last = await db.slide.findFirst({
      orderBy: { position: "desc" },
      select: { position: true },
    });

    const created = await db.slide.create({
      data: {
        image,
        perfumeId,
        active: body.active === undefined ? true : Boolean(body.active),
        position: (last?.position ?? -1) + 1,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("Error creating slide:", error);
    return NextResponse.json({ error: "Ajout impossible" }, { status: 500 });
  }
}
