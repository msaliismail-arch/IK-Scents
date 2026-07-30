import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/guard";
import { resolveAvailability } from "@/lib/availability";
import {
  normalizeGender,
  normalizeDiscount,
  normalizeDiscountUntil,
} from "@/lib/pricing";
import { checkAuthenticity } from "@/lib/perfume-validation";

type SizeInput = { label?: string; price?: string };

function cleanSizes(sizes: unknown): { label: string; price: string; position: number }[] {
  if (!Array.isArray(sizes)) return [];
  return sizes
    .map((s: SizeInput, i: number) => ({
      label: (s?.label ?? "").toString().trim(),
      price: (s?.price ?? "").toString().trim(),
      position: i,
    }))
    .filter((s) => s.label !== "" && s.price !== "");
}

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
      discount,
      discountUntil,
      isPack,
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
        ...(discount !== undefined && {
          discount: String(normalizeDiscount(discount)),
        }),
        ...(discountUntil !== undefined && {
          discountUntil: normalizeDiscountUntil(discountUntil),
        }),
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
