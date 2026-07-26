import { NextResponse } from "next/server";

/**
 * ⚠️ Route désactivée.
 *
 * Elle vérifiait email + mot de passe et répondait sans limite de tentatives :
 * c'était un oracle de mots de passe utilisable pour du bruteforce, en doublon
 * de ce que NextAuth fait déjà.
 *
 * L'authentification passe désormais uniquement par NextAuth
 * (`signIn("credentials", ...)` → /api/auth/[...nextauth]).
 *
 * Ce fichier peut être supprimé sans risque.
 */
export async function POST() {
  return NextResponse.json({ error: "Route désactivée." }, { status: 410 });
}
