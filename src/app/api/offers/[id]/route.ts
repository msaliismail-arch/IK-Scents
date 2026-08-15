import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/guard";
import { CONDITION_TYPES, REWARD_TYPES } from "@/lib/offers";

const CONDITIONS = CONDITION_TYPES.map((c) => c.value) as readonly string[];
const REWARDS = REWARD_TYPES.map((r) => r.value) as readonly string[];

/**
 * PUT /api/offers/[id] — modification (admin).
 *
 * Chaque champ n'est écrit que s'il est présent : la bascule « active /
 * suspendue » de la liste n'envoie que `active`, et ne doit pas remettre la
 * règle à zéro.
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const { id } = await params;
    const body = await request.json();

    const data: Record<string, unknown> = {};

    if (body.label !== undefined) {
      const label = String(body.label).trim().slice(0, 80);
      if (!label) {
        return NextResponse.json(
          { error: "Donnez un nom à l'offre — il est montré au client." },
          { status: 400 }
        );
      }
      data.label = label;
    }

    if (body.labelAr !== undefined) {
      data.labelAr = String(body.labelAr).trim().slice(0, 80);
    }

    if (body.conditionType !== undefined) {
      const type = String(body.conditionType);
      data.conditionType = CONDITIONS.includes(type) ? type : "minSubtotal";
      // Le format ne concerne que « minSize » : changer de condition l'efface.
      if (data.conditionType !== "minSize") data.conditionSize = "";
    }

    if (body.conditionValue !== undefined) {
      data.conditionValue = String(body.conditionValue).trim();
    }

    if (body.conditionSize !== undefined && data.conditionSize === undefined) {
      data.conditionSize = String(body.conditionSize).trim().slice(0, 40);
    }

    if (body.rewardType !== undefined) {
      const type = String(body.rewardType);
      data.rewardType = REWARDS.includes(type) ? type : "freeDelivery";
      if (data.rewardType === "freeDelivery") data.rewardValue = "0";
    }

    if (body.rewardValue !== undefined && data.rewardValue === undefined) {
      data.rewardValue = String(body.rewardValue).trim();
    }

    if (body.active !== undefined) data.active = Boolean(body.active);

    if (body.position !== undefined) {
      const pos = Number.parseInt(String(body.position), 10);
      if (Number.isFinite(pos)) data.position = Math.max(0, Math.min(pos, 999));
    }

    const updated = await db.offer.update({ where: { id }, data });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating offer:", error);
    return NextResponse.json(
      { error: "Modification impossible" },
      { status: 500 }
    );
  }
}

// DELETE /api/offers/[id] — suppression (admin)
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const { id } = await params;
    await db.offer.delete({ where: { id } });
    return NextResponse.json({ message: "Offre supprimée" });
  } catch (error) {
    console.error("Error deleting offer:", error);
    return NextResponse.json(
      { error: "Suppression impossible" },
      { status: 500 }
    );
  }
}
