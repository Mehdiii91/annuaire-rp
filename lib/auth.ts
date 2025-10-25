import { headers } from "next/headers";

export function isAdmin() {
  // on récupère les cookies depuis les headers de la requête API
  const hdrs = headers();
  // ⚠️ ici faire hdrs.get() est autorisé dans un handler API (contrairement au composant react serveur)
  const rawCookie = hdrs.get("cookie") || "";
  return rawCookie.split(";").some((part) => part.trim() === "admin=1");
}
