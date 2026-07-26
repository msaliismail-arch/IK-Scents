import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/guard";

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

// GET /api/perfumes - List perfumes (published only unless ?all=true)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // ?all=true expose aussi les brouillons : réservé à l'admin connecté.
    let all = false;
    if (searchParams.get("all") === "true") {
      const denied = await requireAdmin();
      if (denied) return denied;
      all = true;
    }

    const perfumes = await db.perfume.findMany({
      where: all ? {} : { published: true },
      orderBy: { createdAt: "desc" },
      include: { sizes: { orderBy: { position: "asc" } } },
    });

    return NextResponse.json(perfumes);
  } catch (error) {
    console.error("Error fetching perfumes:", error);
    return NextResponse.json(
      { error: "Failed to fetch perfumes" },
      { status: 500 }
    );
  }
}

// POST /api/perfumes - Create a perfume with dynamic sizes
export async function POST(request: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const body = await request.json();
    const { name, description, image, published, family, notes } = body;
    const sizes = cleanSizes(body.sizes);

    if (!name || !description || !image || sizes.length === 0) {
      return NextResponse.json(
        { error: "Nom, description, image et au moins une taille sont requis" },
        { status: 400 }
      );
    }

    const perfume = await db.perfume.create({
      data: {
        name,
        description,
        image,
        family: String(family ?? "").trim(),
        notes: String(notes ?? "").trim(),
        published: published ?? false,
        sizes: { create: sizes },
      },
      include: { sizes: { orderBy: { position: "asc" } } },
    });

    return NextResponse.json(perfume, { status: 201 });
  } catch (error) {
    console.error("Error creating perfume:", error);
    return NextResponse.json(
      { error: "Failed to create perfume" },
      { status: 500 }
    );
  }
}
