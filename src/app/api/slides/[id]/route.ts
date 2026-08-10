import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/guard";

/**
 * PUT /api/slides/[id] — modification (admin).
 *
 * Chaque champ n'est écrit que s'il est présent dans le corps de la requête.
 * Sans ça, la bascule « visible / masqué » de la liste — qui n'envoie que
 * `active` — remettrait l'image et le parfum à vide.
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const { id } = await params;
    const body = await request.json();

    const data: {
      image?: string;
      perfumeId?: string | null;
      active?: boolean;
      position?: number;
    } = {};

    if (body.image !== undefined) {
      const image = String(body.image).trim();
      if (!image) {
        return NextResponse.json(
          { error: "Une image est requise" },
          { status: 400 }
        );
      }
      data.image = image;
    }

    if (body.perfumeId !== undefined) {
      data.perfumeId = String(body.perfumeId ?? "").trim() || null;
    }

    if (body.active !== undefined) data.active = Boolean(body.active);

    if (body.position !== undefined) {
      const n = Number(body.position);
      if (Number.isFinite(n)) data.position = Math.trunc(n);
    }

    const updated = await db.slide.update({ where: { id }, data });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating slide:", error);
    return NextResponse.json(
      { error: "Modification impossible" },
      { status: 500 }
    );
  }
}

// DELETE /api/slides/[id] — suppression (admin)
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const { id } = await params;
    await db.slide.delete({ where: { id } });
    return NextResponse.json({ message: "Visuel supprimé" });
  } catch (error) {
    console.error("Error deleting slide:", error);
    return NextResponse.json(
      { error: "Suppression impossible" },
      { status: 500 }
    );
  }
}
