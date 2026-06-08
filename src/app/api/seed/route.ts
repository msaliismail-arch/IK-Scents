import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

export async function POST() {
  try {
    // Check if admin users already exist
    const existingAdmin = await db.user.findUnique({
      where: { email: "admin@ikscents.com" },
    });

    if (existingAdmin) {
      return NextResponse.json(
        { message: "Admin users already seeded" },
        { status: 200 }
      );
    }

    const hashedPassword = await bcrypt.hash("IKAdmin2024!", 10);
    const lucHashedPassword = await bcrypt.hash("LucAdmin2024!", 10);

    // Create main admin
    await db.user.create({
      data: {
        email: "admin@ikscents.com",
        name: "Admin Principal",
        password: hashedPassword,
        role: "admin",
      },
    });

    // Create Luc admin
    await db.user.create({
      data: {
        email: "luc@ikscents.com",
        name: "Luc",
        password: lucHashedPassword,
        role: "admin",
      },
    });

    return NextResponse.json(
      { message: "Admin users created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { error: "Failed to seed admin users" },
      { status: 500 }
    );
  }
}
