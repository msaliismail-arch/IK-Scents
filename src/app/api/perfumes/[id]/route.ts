import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/guard";
import { resolveAvailability } from "@/lib/availability";
import { normalizeGender } from "@/lib/pricing";
import { checkAuthenticity } from "@/lib/perfume-validation";
// Même mise en forme des formats qu'à la création : deux copies finiraient
// par diverger, et un prix promo accepté ici mais refusé là serait invisible.
import { cleanSizes } from "@/lib/sizes";

// GET /api/perfumes/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const perfume = await db.perfume.findUnique({
      where: { id },
      include: { sizes: { orderBy: { position: "asc" } } },
    });

    if (!perfume) {
      return NextResponse.json({ error: "Perfume not found" }, { status: 404 });
    }

    return NextResponse.json(perfume);
  } catch (error) {
    console.error("Error fetching perfume:", error);
    return NextResponse.json(
      { error: "Failed to fetch perfume" },
      { status: 500 }
    );
  }
}

// PUT /api/perfumes/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const { id } = await params;
    const body = await request.json();
    const {
      name,
      description,
      image,
      published,
      brand,
      family,
      notes,
      availability,
      gender,
      isPack,
      nameAr,
      descriptionAr,
      familyAr,
      notesAr,
    } = body;
    const hasSizes = Array.isArray(body.sizes);
    const sizes = cleanSizes(body.sizes);

    // Les champs d'authenticité ne sont revalidés que s'ils sont envoyés :
    // une mise à jour partielle (publier / dépublier) ne doit rien effacer.
    const touchesAuth =
      body.serialNumber !== undefined ||
      body.batchCode !== undefined ||
      body.officialUrl !== undefined;

    let authData: {
      serialNumber?: string | null;
      batchCode?: string;
      officialUrl?: string;
    } = {};
    if (touchesAuth) {
      const auth = await checkAuthenticity(body, id);
      if (!auth.ok) return auth.response;
      authData = auth.data;
    }

    const perfume = await db.perfume.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(image !== undefined && { image }),
        ...(brand !== undefined && {
          brand: String(brand).trim().slice(0, 80),
        }),
        ...authData,
        ...(family !== undefined && { family: String(family).trim() }),
        ...(notes !== undefined && { notes: String(notes).trim() }),
        ...(availability !== undefined && {
          availability: resolveAvailability(availability).value,
        }),
        ...(gender !== undefined && { gender: normalizeGender(gender) }),
        ...(nameAr !== undefined && { nameAr: String(nameAr).trim() }),
        ...(descriptionAr !== undefined && {
          descriptionAr: String(descriptionAr).trim(),
        }),
        ...(familyAr !== undefined && { familyAr: String(familyAr).trim() }),
        ...(notesAr !== undefined && { notesAr: String(notesAr).trim() }),
        ...(isPack !== undefined && { isPack: Boolean(isPack) }),
        ...(published !== undefined && { published }),
        ...(hasSizes && {
          sizes: {
            deleteMany: {},
            create: sizes,
          },
        }),
      },
      include: { sizes: { orderBy: { position: "asc" } } },
    });

    return NextResponse.json(perfume);
  } catch (error) {
    console.error("Error updating perfume:", error);
    return NextResponse.json(
      { error: "Failed to update perfume" },
      { status: 500 }
    );
  }
}

// DELETE /api/perfumes/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const { id } = await params;
    await db.perfume.delete({ where: { id } });
    return NextResponse.json({ message: "Perfume deleted successfully" });
  } catch (error) {
    console.error("Error deleting perfume:", error);
    return NextResponse.json(
      { error: "Failed to delete perfume" },
      { status: 500 }
    );
  }
}
