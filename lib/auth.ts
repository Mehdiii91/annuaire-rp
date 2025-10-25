import { headers } from "next/headers";

export async function isAdmin() {
  // ⚙️ headers() est asynchrone, donc on attend sa résolution
  const hdrs = await headers();

  // ✅ ici on peut utiliser .get() car hdrs est bien un Headers et plus une Promise
  const rawCookie = hdrs.get("cookie") || "";

  // 🧠 vérifie si le cookie contient "admin=1"
  const isAdmin = rawCookie.split(";").some((part) => part.trim() === "admin=1");

  return isAdmin;
}
