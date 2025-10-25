import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { password } = body;

  if (!password) {
    return NextResponse.json({ error: "Missing password" }, { status: 400 });
  }

  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Wrong password" }, { status: 401 });
  }

  // Auth OK -> set cookie admin=1
  const res = NextResponse.json({ ok: true });

  res.cookies.set("admin", "1", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });

  return res;
}
