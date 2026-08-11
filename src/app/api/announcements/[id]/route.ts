import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/guard";
import { normalizeAnnouncement } from "@/lib/announcement";

// PUT /api/announcements/[id] — modification (admin)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const { id } = await params;
    const body = await request.json();

    // Bascule rapide depuis la liste : on ne touche qu'à `active` et on laisse
    // le reste intact, sinon un simple clic effacerait le texte.
    if (
      body.active !== undefined &&
      body.title === undefined &&
      body.body === undefined &&
      body.url === undefined &&
      body.titleAr === undefined &&
      body.bodyAr === undefined
    ) {
      const toggled = await db.announcement.update({
        where: { id },
        data: { active: Boolean(body.active) },
      });
      return NextResponse.json(toggled);
    }

    const data = normalizeAnnouncement(body);
    if (!data.title) {
      return NextResponse.json(
        { error: "Le titre de l'annonce est requis" },
        { status: 400 }
      );
    }

    const updated = await db.announcement.update({ where: { id }, data });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating announcement:", error);
    return NextResponse.json(
      { error: "Modification impossible" },
      { status: 500 }
    );
  }
}

// DELETE /api/announcements/[id] — suppression (admin)
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const { id } = await params;
    await db.announcement.delete({ where: { id } });
    return NextResponse.json({ message: "Annonce supprimée" });
  } catch (error) {
    console.error("Error deleting announcement:", error);
    return NextResponse.json(
      { error: "Suppression impossible" },
      { status: 500 }
    );
  }
}
