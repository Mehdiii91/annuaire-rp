import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  // déjà en place chez toi normalement via la version précédente :
  // on lit l'id depuis l'URL manuellement (comme on l'a fait pour members delete)
  const url = new URL(req.url);
  const parts = url.pathname.split("/").filter(Boolean); // ["api","groups","123"]
  const rawId = parts[parts.length - 1];
  const groupId = Number(rawId);

  if (!rawId || Number.isNaN(groupId)) {
    return NextResponse.json(
      { error: "invalid group id", got: rawId },
      { status: 400 }
    );
  }

  const group = await prisma.group.findUnique({
    where: { id: groupId },
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
          groupId: true,
        },
      },
    },
  });

  if (!group) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  return NextResponse.json(group);
}

// DELETE /api/groups/:id
export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const parts = url.pathname.split("/").filter(Boolean); // ["api","groups","123"]
    const rawId = parts[parts.length - 1];
    const groupId = Number(rawId);

    if (!rawId || Number.isNaN(groupId)) {
      return NextResponse.json(
        { error: "invalid group id", got: rawId },
        { status: 400 }
      );
    }

    // d'abord supprimer les membres liés
    await prisma.member.deleteMany({
      where: { groupId },
    });

    // ensuite supprimer le groupe
    await prisma.group.delete({
      where: { id: groupId },
    });

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err: any) {
    console.error("DELETE /api/groups/[id] error:", err);
    return NextResponse.json(
      { error: "server error", details: String(err) },
      { status: 500 }
    );
  }
}
