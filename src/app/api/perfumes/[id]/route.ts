import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/perfumes/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const perfume = await db.perfume.findUnique({
      where: { id },
    });

    if (!perfume) {
      return NextResponse.json(
        { error: "Perfume not found" },
        { status: 404 }
      );
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
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, description, image, price5ml, price10ml, published } = body;

    const perfume = await db.perfume.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(image !== undefined && { image }),
        ...(price5ml !== undefined && { price5ml }),
        ...(price10ml !== undefined && { price10ml }),
        ...(published !== undefined && { published }),
      },
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
  try {
    const { id } = await params;
    await db.perfume.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Perfume deleted successfully" });
  } catch (error) {
    console.error("Error deleting perfume:", error);
    return NextResponse.json(
      { error: "Failed to delete perfume" },
      { status: 500 }
    );
  }
}
