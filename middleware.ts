import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Ce middleware tourne AVANT d'arriver sur certaines routes
export function middleware(req: NextRequest) {
  // On vise /admin uniquement
  if (req.nextUrl.pathname.startsWith("/admin")) {
    const adminCookie = req.cookies.get("admin")?.value;

    // pas loggé -> on redirige vers /login
    if (adminCookie !== "1") {
      const loginUrl = new URL("/login", req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // sinon on laisse passer
  return NextResponse.next();
}

// dire à Next sur quelles routes appliquer le middleware
export const config = {
  matcher: ["/admin/:path*"],
};
