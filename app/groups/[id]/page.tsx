import TopNav from "@/components/TopNav";
import GroupClient from "./GroupClient";

export default async function GroupPage() {
  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <TopNav />

      <section className="p-10 max-w-5xl mx-auto">
        <GroupClient />
      </section>
    </main>
  );
}
