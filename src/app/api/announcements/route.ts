import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/guard";
import { normalizeAnnouncement } from "@/lib/announcement";

/**
 * GET /api/announcements — annonces actives, dans l'ordre d'affichage.
 * `?all=true` renvoie aussi les annonces désactivées : réservé à l'admin.
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

    const announcements = await db.announcement.findMany({
      where: all ? {} : { active: true },
      orderBy: [{ position: "asc" }, { createdAt: "desc" }],
    });

    return NextResponse.json(announcements);
  } catch (error) {
    console.error("Error fetching announcements:", error);
    // Une annonce indisponible ne doit jamais casser la page d'accueil.
    return NextResponse.json([]);
  }
}

// POST /api/announcements — création (admin)
export async function POST(request: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const data = normalizeAnnouncement(await request.json());

    if (!data.title) {
      return NextResponse.json(
        { error: "Le titre de l'annonce est requis" },
        { status: 400 }
      );
    }

    const created = await db.announcement.create({ data });
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("Error creating announcement:", error);
    return NextResponse.json(
      { error: "Création impossible" },
      { status: 500 }
    );
  }
}
