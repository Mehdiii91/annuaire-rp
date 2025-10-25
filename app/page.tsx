import { prisma } from "@/lib/prisma";
import TopNav from "@/components/TopNav";
import HomeClient from "@/HomeClient";

export default async function Home() {
  const groups = await prisma.group.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      category: true,
    },
  });

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <TopNav />
      <HomeClient initial={groups} />
    </main>
  );
}
