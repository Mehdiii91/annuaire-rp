import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Lis le cookie "admin" depuis le contexte serveur Next.js
 * Retourne true si admin=1, sinon false
 */
export function isAdminFromCookies(): boolean {
  // cookies() marche côté Server Component et côté route handler en prod Vercel
  const store = cookies();
  const adminCookie = store.get("admin"); // { name: "admin", value: "1", ... } | undefined

  return adminCookie?.value === "1";
}

/**
 * À appeler au début d'une page /admin côté serveur.
 * Si pas admin -> redirect("/login")
 */
export function protectAdminPage() {
  const ok = isAdminFromCookies();
  if (!ok) {
    redirect("/login");
  }
}
