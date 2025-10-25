import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
// import { isAdmin } from "@/lib/auth";

export async function DELETE(req: Request) {
  // if (!isAdmin()) {
  //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  // }

  try {
    // exemple d'URL: http://localhost:3000/api/members/1
    const url = new URL(req.url);
    const parts = url.pathname.split("/"); // ["", "api", "members", "1"]
    const rawId = parts[parts.length - 1]; // "1"
    const memberId = Number(rawId);

    if (!rawId || Number.isNaN(memberId) || memberId <= 0) {
      return NextResponse.json(
        { error: "Invalid or missing memberId", got: rawId },
        { status: 400 }
      );
    }

    await prisma.member.delete({
      where: { id: memberId },
    });

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err: any) {
    console.error("DELETE /api/members/[id] error:", err);
    return NextResponse.json(
      { error: "server error", details: String(err) },
      { status: 500 }
    );
  }
}
