import { prisma } from "@/lib/prisma";
import AdminClient from "./AdminClient";
import TopNav from "@/components/TopNav";
import { protectAdminPage } from "@/lib/auth";

export default async function AdminPage() {
  // bloque l'accès si pas admin
  protectAdminPage();

  // récupère les groupes + membres
  const groups = await prisma.group.findMany({
    orderBy: { name: "asc" },
    include: {
      members: {
        orderBy: [{ role: "asc" }, { fullName: "asc" }],
      },
    },
  });

  return (
    <main className="min-h-screen bg-gray-950 text-white p-6 space-y-8">
      <TopNav />

      <section className="max-w-5xl mx-auto space-y-8">
        <header className="space-y-2 text-white">
          <h1 className="text-2xl font-bold">Panel Admin</h1>
          <p className="text-sm text-gray-400">
            Gère les groupes, les membres, les catégories.
          </p>
        </header>

        <AdminClient initialGroups={groups} />
      </section>
    </main>
  );
}
