import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Lis le cookie "admin" en mode compatible Next 16 / Vercel build.
 * On gère le cas où cookies() peut être sync ou async selon le contexte.
 */
function readAdminCookieSafe() {
  // On récupère le résultat de cookies()
  const maybePromise = cookies() as any;

  // Si c'est une Promise (cas build/vercel), on ne peut pas l'attendre ici
  // donc on considère "pas admin" par défaut pendant le build.
  if (typeof maybePromise?.then === "function") {
    return undefined;
  }

  // Ici it's fine: we are at runtime request, cookies() a rendu un objet
  const jar = maybePromise;
  return jar.get ? jar.get("admin") : undefined;
}

/**
 * true si admin=1, sinon false
 */
export function isAdminFromCookies(): boolean {
  const adminCookie = readAdminCookieSafe();
  return adminCookie?.value === "1";
}

/**
 * À appeler au début d'une page admin côté serveur runtime (request time).
 * Si pas admin => redirect("/login")
 */
export function protectAdminPage() {
  if (!isAdminFromCookies()) {
    redirect("/login");
  }
}
