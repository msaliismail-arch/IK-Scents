import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { normalizeSerial } from "@/lib/authenticity";

/**
 * GET /api/verify/[serial] — consultation publique d'un numéro de série.
 *
 * C'est la cible du QR code. Elle est volontairement publique : n'importe qui
 * doit pouvoir vérifier un flacon, y compris avant d'avoir acheté.
 *
 * Sécurité : la sélection des champs est explicite et fermée. Aucune donnée
 * client, aucune commande, aucun prix ne peut fuir par cette route, même si le
 * modèle Perfume gagne des champs plus tard.
 *
 * Les brouillons (`published: false`) ne répondent pas : un parfum pas encore
 * en ligne n'a pas à être consultable via une URL devinée.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ serial: string }> }
) {
  try {
    const { serial } = await params;
    const normalized = normalizeSerial(decodeURIComponent(serial));

    if (!normalized) {
      return NextResponse.json(
        { found: false, error: "Numéro de série absent" },
        { status: 400 }
      );
    }

    const perfume = await db.perfume.findUnique({
      where: { serialNumber: normalized },
      select: {
        id: true,
        name: true,
        brand: true,
        image: true,
        family: true,
        notes: true,
        gender: true,
        serialNumber: true,
        batchCode: true,
        officialUrl: true,
        published: true,
        createdAt: true,
      },
    });

    if (!perfume || !perfume.published) {
      // Même réponse dans les deux cas : ne pas révéler l'existence d'un
      // brouillon à quelqu'un qui essaierait des numéros au hasard.
      return NextResponse.json(
        { found: false, serial: normalized },
        { status: 404 }
      );
    }

    const { published: _published, ...safe } = perfume;
    void _published;

    return NextResponse.json({ found: true, perfume: safe });
  } catch (error) {
    console.error("Error verifying serial number:", error);
    return NextResponse.json(
      { found: false, error: "Vérification indisponible" },
      { status: 500 }
    );
  }
}
