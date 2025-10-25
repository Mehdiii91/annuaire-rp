import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// util pour récupérer l'id proprement même sur Vercel
function extractIdFromUrl(req: Request) {
  const url = new URL(req.url);
  const parts = url.pathname.split("/").filter(Boolean); // ["api","groups","123"]
  const rawId = parts[parts.length - 1];
  const idNum = Number(rawId);
  if (!rawId || Number.isNaN(idNum)) {
    return { ok: false, rawId };
  }
  return { ok: true, id: idNum };
}

// GET /api/groups/:id
export async function GET(req: Request) {
  try {
    const parsed = extractIdFromUrl(req);
    if (!parsed.ok) {
      return NextResponse.json(
        { error: "invalid group id", got: parsed.rawId },
        { status: 400 }
      );
    }

    const group = await prisma.group.findUnique({
      where: { id: parsed.id },
      select: {
        id: true,
        name: true,
        category: true,
        members: {
          orderBy: [{ role: "asc" }, { fullName: "asc" }],
          select: {
            id: true,
            fullName: true,
            role: true,
            characterId: true,
          },
        },
      },
    });

    if (!group) {
      return NextResponse.json(
        { error: "group not found", id: parsed.id },
        { status: 404 }
      );
    }

    return NextResponse.json(group, { status: 200 });
  } catch (err: any) {
    console.error("GET /api/groups/[id] failed:", err);
    return NextResponse.json(
      { error: "server error", details: String(err) },
      { status: 500 }
    );
  }
}

// DELETE /api/groups/:id
export async function DELETE(req: Request) {
  try {
    const parsed = extractIdFromUrl(req);
    if (!parsed.ok) {
      return NextResponse.json(
        { error: "invalid group id", got: parsed.rawId },
        { status: 400 }
      );
    }

    // supprime d'abord les membres (au cas où relation cascade ne se déclenche pas)
    await prisma.member.deleteMany({
      where: { groupId: parsed.id },
    });

    await prisma.group.delete({
      where: { id: parsed.id },
    });

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err: any) {
    console.error("DELETE /api/groups/[id] failed:", err);
    return NextResponse.json(
      { error: "server error", details: String(err) },
      { status: 500 }
    );
  }
}
