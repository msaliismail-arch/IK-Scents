import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

// Admin credentials (overridable via env). CHANGE THE PASSWORD after first login.
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@assil.ma";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Assil@2026";
const ADMIN_NAME = process.env.ADMIN_NAME || "Admin ASSIL";

export async function POST() {
  try {
    const existingAdmin = await db.user.findUnique({
      where: { email: ADMIN_EMAIL },
    });

    if (existingAdmin) {
      return NextResponse.json(
        { message: "Admin already seeded" },
        { status: 200 }
      );
    }

    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

    await db.user.create({
      data: {
        email: ADMIN_EMAIL,
        name: ADMIN_NAME,
        password: hashedPassword,
        role: "admin",
      },
    });

    return NextResponse.json(
      { message: "Admin ASSIL created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { error: "Failed to seed admin" },
      { status: 500 }
    );
  }
}
