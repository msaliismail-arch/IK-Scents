import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/guard";
import { CONDITION_TYPES, REWARD_TYPES } from "@/lib/offers";

const CONDITIONS = CONDITION_TYPES.map((c) => c.value) as readonly string[];
const REWARDS = REWARD_TYPES.map((r) => r.value) as readonly string[];

/**
 * Met une offre en forme avant enregistrement.
 * Un type inconnu retombe sur la valeur par défaut plutôt que d'être stocké
 * tel quel : une offre au type fantaisiste ne se déclencherait jamais, sans
 * que rien ne l'explique côté admin.
 */
function normalize(body: Record<string, unknown>) {
  const conditionType = CONDITIONS.includes(String(body.conditionType))
    ? String(body.conditionType)
    : "minSubtotal";
  const rewardType = REWARDS.includes(String(body.rewardType))
    ? String(body.rewardType)
    : "freeDelivery";

  const pos = Number.parseInt(String(body.position ?? "0"), 10);

  return {
    label: String(body.label ?? "").trim().slice(0, 80),
    labelAr: String(body.labelAr ?? "").trim().slice(0, 80),
    conditionType,
    conditionValue: String(body.conditionValue ?? "0").trim(),
    // Le format ne sert qu'à la condition « minSize » : le garder ailleurs
    // laisserait une valeur trompeuse en base.
    conditionSize:
      conditionType === "minSize"
        ? String(body.conditionSize ?? "").trim().slice(0, 40)
        : "",
    rewardType,
    rewardValue:
      rewardType === "freeDelivery"
        ? "0"
        : String(body.rewardValue ?? "0").trim(),
    active: body.active === undefined ? true : Boolean(body.active),
    position: Number.isFinite(pos) ? Math.max(0, Math.min(pos, 999)) : 0,
  };
}

/**
 * GET /api/offers — offres actives.
 * `?all=true` renvoie aussi les offres suspendues : réservé à l'admin.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    let all = false;
    if (searchParams.get("all") === "true") {
      const denied = await requireAdmin();
      if (denied) return denied;
      all = true;
    }

    const offers = await db.offer.findMany({
      where: all ? {} : { active: true },
      orderBy: [{ position: "asc" }, { createdAt: "asc" }],
    });

    return NextResponse.json(offers);
  } catch (error) {
    console.error("Error fetching offers:", error);
    // Sans offre, le panier reste juste : prix normaux, livraison normale.
    return NextResponse.json([]);
  }
}

// POST /api/offers — création (admin)
export async function POST(request: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const data = normalize(await request.json());

    if (!data.label) {
      return NextResponse.json(
        { error: "Donnez un nom à l'offre — il est montré au client." },
        { status: 400 }
      );
    }

    const created = await db.offer.create({ data });
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("Error creating offer:", error);
    return NextResponse.json({ error: "Création impossible" }, { status: 500 });
  }
}
