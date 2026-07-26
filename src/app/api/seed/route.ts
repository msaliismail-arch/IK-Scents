import { NextResponse } from "next/server";

/**
 * ⚠️ Route désactivée.
 *
 * Elle créait le compte administrateur avec un mot de passe par défaut codé en
 * dur, et elle était appelée publiquement depuis la page d'accueil : n'importe
 * qui pouvait la déclencher.
 *
 * Le compte admin se crée et se modifie maintenant hors ligne :
 *
 *   npm run set-admin
 *
 * (identifiants lus dans .env — voir .env.example)
 *
 * Ce fichier peut être supprimé sans risque.
 */
export async function POST() {
  return NextResponse.json(
    { error: "Route désactivée. Utilisez `npm run set-admin`." },
    { status: 410 }
  );
}
