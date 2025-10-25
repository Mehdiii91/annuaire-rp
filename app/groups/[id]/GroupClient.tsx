"use client";

import { useEffect, useState } from "react";

type Member = {
  id: number;
  fullName: string;
  role: "LEAD" | "MEMBRE";
  characterId: string;
};

type GroupData = {
  id: number;
  name: string;
  members: Member[];
};

export default function GroupClient() {
  const [loading, setLoading] = useState(true);
  const [group, setGroup] = useState<GroupData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Récupère l'ID depuis l'URL du navigateur côté client
  useEffect(() => {
    const path = window.location.pathname; // ex "/groups/2"
    const parts = path.split("/").filter(Boolean); // ["groups","2"]
    const last = parts[parts.length - 1]; // "2"
    const idNum = Number(last);

    if (!last || Number.isNaN(idNum)) {
      setError(`ID de groupe invalide (${String(last)})`);
      setLoading(false);
      return;
    }

    // On va chercher les infos du groupe via notre API
    fetch(`/api/groups/${idNum}`)
      .then(async (res) => {
        if (!res.ok) {
          const txt = await res.text();
          throw new Error(`Erreur API (${res.status}) ${txt}`);
        }
        return res.json();
      })
      .then((data: GroupData) => {
        setGroup(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="text-gray-400 text-center">Chargement...</div>
    );
  }

  if (error) {
    return (
      <div className="text-red-400 text-center text-sm whitespace-pre-line">
        {error}
      </div>
    );
  }

  if (!group) {
    return (
      <div className="text-gray-400 text-center">Groupe introuvable.</div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-center">👥 {group.name}</h1>

      {group.members.length === 0 ? (
        <p className="text-gray-400 text-center">
          Aucun membre enregistré.
        </p>
      ) : (
        <table className="w-full bg-gray-800 rounded-xl overflow-hidden shadow-lg">
          <thead className="bg-gray-700">
            <tr>
              <th className="py-3 px-4 text-left">Nom RP</th>
              <th className="py-3 px-4 text-left">Rôle</th>
              <th className="py-3 px-4 text-left">ID Perso</th>
            </tr>
          </thead>
          <tbody>
            {group.members.map((m) => (
              <tr
                key={m.id}
                className="border-t border-gray-700 hover:bg-gray-750"
              >
                <td className="py-2 px-4">{m.fullName}</td>
                <td className="py-2 px-4">
                  {m.role === "LEAD" ? (
                    <span className="inline-block rounded-full border border-yellow-500/40 bg-yellow-500/10 px-2 py-0.5 text-[11px] font-semibold text-yellow-400">
                      Lead
                    </span>
                  ) : (
                    <span className="inline-block rounded-full border border-blue-500/40 bg-blue-500/10 px-2 py-0.5 text-[11px] font-semibold text-blue-400">
                      Membre
                    </span>
                  )}
                </td>
                <td className="py-2 px-4 font-mono text-xs text-gray-300">
                  {m.characterId}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
