export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const preferredRegion = "auto";
export const revalidate = 0;
export const fetchCache = "force-no-store";


import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/groups
export async function GET() {
  try {
    const groups = await prisma.group.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        category: true,
        members: {
          select: { id: true }, // si un jour tu veux compter les membres
        },
      },
    });

    return NextResponse.json(groups);
  } catch (err: any) {
    console.error("GET /api/groups error:", err);
    return NextResponse.json(
      { error: "server error", details: String(err) },
      { status: 500 }
    );
  }
}

// POST /api/groups
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, category } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: "Missing group name" },
        { status: 400 }
      );
    }

    if (category !== "GANG" && category !== "ORGA") {
      return NextResponse.json(
        { error: "Invalid category", got: category },
        { status: 400 }
      );
    }

    const group = await prisma.group.create({
      data: {
        name: name.trim(),
        category,
      },
      select: {
        id: true,
        name: true,
        category: true,
        members: {
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

    return NextResponse.json(group, { status: 201 });
  } catch (err: any) {
    console.error("POST /api/groups error:", err);
    return NextResponse.json(
      { error: "server error", details: String(err) },
      { status: 500 }
    );
  }
}
