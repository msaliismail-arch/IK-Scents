import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/perfumes - List all perfumes (published only for non-admins)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const all = searchParams.get("all") === "true";

    const perfumes = await db.perfume.findMany({
      where: all ? {} : { published: true },
      orderBy: { createdAt: "desc" },
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

// POST /api/perfumes - Create a new perfume
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, image, price5ml, price10ml, published } = body;

    if (!name || !description || !image || !price5ml || !price10ml) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const perfume = await db.perfume.create({
      data: {
        name,
        description,
        image,
        price5ml,
        price10ml,
        published: published ?? false,
      },
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
