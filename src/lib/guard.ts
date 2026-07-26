import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

/**
 * Garde d'accès pour les routes réservées à l'administration.
 *
 * Usage dans une route :
 *   const denied = await requireAdmin();
 *   if (denied) return denied;
 *
 * Retourne `null` si la session est valide, sinon une réponse 401 prête à
 * renvoyer. On ne précise jamais *pourquoi* l'accès est refusé.
 */
export async function requireAdmin(): Promise<NextResponse | null> {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string } | undefined)?.role;

  if (!session?.user || role !== "admin") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  return null;
}
