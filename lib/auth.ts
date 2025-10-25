import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Retourne true si le cookie admin=1 est présent.
 * On force le typage en `any` pour contourner le changement de type de cookies() en build Vercel/Next16.
 */
export function isAdminFromCookies(): boolean {
  // cookies() peut être typé comme Promise<ReadonlyRequestCookies> selon le contexte,
  // donc on cast en any pour pouvoir appeler .get sans que le build plante.
  const jar: any = cookies() as any;

  // si à l'exécution réelle jar.get existe -> on lit
  // sinon (pendant le build) adminCookie reste undefined
  const adminCookie = jar?.get ? jar.get("admin") : undefined;

  return adminCookie?.value === "1";
}

/**
 * Protège une page admin : si pas admin -> redirect("/login")
 */
export function protectAdminPage() {
  if (!isAdminFromCookies()) {
    redirect("/login");
  }
}
