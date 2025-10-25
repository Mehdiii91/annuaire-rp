import { prisma } from "@/lib/prisma";
import TopNav from "@/components/TopNav";
import AdminClient from "./AdminClient";

export default async function AdminPage() {
  // on va chercher tous les groupes + leurs membres pour remplir l'UI
  const groups = await prisma.group.findMany({
    orderBy: { name: "asc" },
    include: {
      members: {
        orderBy: [{ role: "asc" }, { fullName: "asc" }],
      },
    },
  });

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <TopNav />

      <section className="p-10 max-w-5xl mx-auto">
        <AdminClient initialGroups={groups} />
      </section>
    </main>
  );
}
