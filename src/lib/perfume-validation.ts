import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  normalizeSerial,
  normalizeBatchCode,
  normalizeOfficialUrl,
} from "@/lib/authenticity";

/**
 * Validation serveur des champs d'authenticité d'un parfum.
 *
 * Ce module vit à part de `lib/authenticity.ts` : celui-ci est importé par des
 * composants client, et il ne doit jamais entraîner Prisma dans le bundle du
 * navigateur.
 *
 * Deux règles, mais elles portent tout le dispositif :
 *  — un numéro de série ne peut appartenir qu'à un seul parfum ;
 *  — une URL officielle doit être une vraie adresse http(s).
 *
 * `excludeId` sert à la modification : un parfum garde évidemment le droit de
 * conserver son propre numéro.
 */
export type AuthFields = {
  serialNumber: string | null;
  batchCode: string;
  officialUrl: string;
};

export async function checkAuthenticity(
  body: { serialNumber?: unknown; batchCode?: unknown; officialUrl?: unknown },
  excludeId?: string
): Promise<{ ok: true; data: AuthFields } | { ok: false; response: NextResponse }> {
  const serialNumber = normalizeSerial(body.serialNumber);
  const batchCode = normalizeBatchCode(body.batchCode);
  const rawUrl = String(body.officialUrl ?? "").trim();
  const officialUrl = normalizeOfficialUrl(rawUrl);

  if (rawUrl && !officialUrl) {
    return {
      ok: false,
      response: NextResponse.json(
        {
          error:
            "L'URL officielle est invalide. Elle doit commencer par http:// ou https://",
          field: "officialUrl",
        },
        { status: 400 }
      ),
    };
  }

  if (serialNumber) {
    const existing = await db.perfume.findUnique({
      where: { serialNumber },
      select: { id: true, name: true },
    });
    if (existing && existing.id !== excludeId) {
      return {
        ok: false,
        response: NextResponse.json(
          {
            error: `Ce numéro de série est déjà utilisé par « ${existing.name} ». Un numéro de série ne peut appartenir qu'à un seul flacon.`,
            field: "serialNumber",
          },
          { status: 409 }
        ),
      };
    }
  }

  // Chaîne vide impossible en base : la contrainte d'unicité la refuserait dès
  // le deuxième parfum sans numéro. NULL, lui, peut se répéter.
  return {
    ok: true,
    data: { serialNumber: serialNumber || null, batchCode, officialUrl },
  };
}
