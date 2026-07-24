import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/orders - List all orders (admin)
export async function GET() {
  try {
    const orders = await db.order.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

// POST /api/orders - Create an order (public order form)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      customerName,
      phone,
      address,
      city,
      perfumeId,
      perfumeName,
      sizeLabel,
      price,
      quantity,
      note,
    } = body;

    if (!customerName || !phone || !address || !perfumeName || !sizeLabel) {
      return NextResponse.json(
        { error: "Nom, téléphone, adresse et produit sont requis" },
        { status: 400 }
      );
    }

    const qty = Number.parseInt(quantity, 10);

    const order = await db.order.create({
      data: {
        customerName: String(customerName).trim(),
        phone: String(phone).trim(),
        address: String(address).trim(),
        city: city ? String(city).trim() : null,
        perfumeId: perfumeId ?? null,
        perfumeName: String(perfumeName).trim(),
        sizeLabel: String(sizeLabel).trim(),
        price: price ? String(price).trim() : "",
        quantity: Number.isFinite(qty) && qty > 0 ? qty : 1,
        note: note ? String(note).trim() : null,
        status: "new",
      },
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
