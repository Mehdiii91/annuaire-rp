"use client";

import { useState } from "react";

type GroupLite = {
  id: number;
  name: string;
  category: "GANG" | "ORGA";
};

export default function HomeClient({ initial }: { initial: GroupLite[] }) {
  const [filter, setFilter] = useState<"ALL" | "GANG" | "ORGA">("ALL");

  const filtered = initial.filter((g) => {
    if (filter === "ALL") return true;
    return g.category === filter;
  });

  return (
    <section className="p-10 max-w-5xl mx-auto space-y-10 text-white">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">
          📜 Annuaire des Groupes RP
        </h1>

        <div className="flex justify-center gap-2 text-xs">
          <button
            onClick={() => setFilter("ALL")}
            className={`px-3 py-1 rounded-lg border ${
              filter === "ALL"
                ? "bg-gray-200 text-black border-gray-200"
                : "bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
            }`}
          >
            Tous
          </button>
          <button
            onClick={() => setFilter("GANG")}
            className={`px-3 py-1 rounded-lg border ${
              filter === "GANG"
                ? "bg-yellow-500 text-black border-yellow-500"
                : "bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
            }`}
          >
            Gangs
          </button>
          <button
            onClick={() => setFilter("ORGA")}
            className={`px-3 py-1 rounded-lg border ${
              filter === "ORGA"
                ? "bg-blue-500 text-white border-blue-500"
                : "bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
            }`}
          >
            Orgas
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-gray-500 text-sm">
          Aucun résultat pour ce filtre.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {filtered.map((g) => (
            <a
              key={g.id}
              href={`/groups/${g.id}`}
              className="block bg-gray-800 hover:bg-gray-700 rounded-xl p-6 shadow-md transition"
            >
              <div className="flex items-start justify-between">
                <h3 className="text-lg font-semibold text-white">
                  {g.name}
                </h3>

                {g.category === "GANG" ? (
                  <span className="ml-2 inline-block text-[10px] font-semibold px-2 py-1 rounded border bg-yellow-500/10 text-yellow-400 border-yellow-500/40">
                    Gang
                  </span>
                ) : (
                  <span className="ml-2 inline-block text-[10px] font-semibold px-2 py-1 rounded border bg-blue-500/10 text-blue-400 border-blue-500/40">
                    Orga
                  </span>
                )}
              </div>

              <p className="text-gray-400 mt-2 text-sm">
                Voir les membres →
              </p>
            </a>
          ))}
        </div>
      )}
    </section>
  );
}
