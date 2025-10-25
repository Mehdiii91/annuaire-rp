export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const preferredRegion = "auto";


import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
// import { isAdmin } from "@/lib/auth";

export async function POST(req: Request) {
  // sécurité désactivée côté API pour l’instant, le /admin est déjà protégé via middleware
  // if (!isAdmin()) {
  //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  // }

  try {
    const body = await req.json();
    const { groupId, fullName, role, characterId } = body;

    if (!groupId || !fullName || !role || !characterId) {
      return NextResponse.json(
        { error: "Missing fields", got: body },
        { status: 400 }
      );
    }

    const newMember = await prisma.member.create({
      data: {
        groupId: Number(groupId),
        fullName,
        role,
        characterId,
      },
    });

    return NextResponse.json(newMember, { status: 201 });
  } catch (err: any) {
    console.error("POST /api/members error:", err);
    return NextResponse.json(
        { error: "server error", details: String(err) },
        { status: 500 }
    );
  }
}
