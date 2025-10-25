"use client";

import { useState } from "react";

type Member = {
  id: number;
  fullName: string;
  role: "LEAD" | "MEMBRE";
  characterId: string;
  groupId: number;
};

type Group = {
  id: number;
  name: string;
  category: "GANG" | "ORGA";
  members: Member[];
};

function sortMembers(a: Member, b: Member) {
  // LEAD en premier
  if (a.role === "LEAD" && b.role !== "LEAD") return -1;
  if (b.role === "LEAD" && a.role !== "LEAD") return 1;
  // puis tri alphabétique
  return a.fullName.localeCompare(b.fullName);
}

export default function AdminClient({
  initialGroups,
}: {
  initialGroups: Group[];
}) {
  // état global des groupes
  const [groups, setGroups] = useState<Group[]>(initialGroups);

  // groupe sélectionné
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(
    initialGroups.length > 0 ? initialGroups[0].id : null
  );

  // création de groupe
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupCategory, setNewGroupCategory] = useState<"GANG" | "ORGA">(
    "GANG"
  );

  // ajout membre
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<"LEAD" | "MEMBRE">("MEMBRE");
  const [characterId, setCharacterId] = useState("");

  // groupe actif
  const activeGroup = groups.find((g) => g.id === selectedGroupId) || null;

  // créer un groupe
  async function createGroup(e: React.FormEvent) {
    e.preventDefault();
    if (!newGroupName.trim()) return;

    const res = await fetch("/api/groups", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newGroupName,
        category: newGroupCategory,
      }),
    });

    if (res.ok) {
      const created: Group = await res.json();

      const updated = [...groups, created].sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      setGroups(updated);
      setSelectedGroupId(created.id);

      // reset
      setNewGroupName("");
      setNewGroupCategory("GANG");
    } else {
      const txt = await res.text();
      console.error("Erreur création groupe:", res.status, txt);
    }
  }

  // supprimer groupe
  async function deleteGroup() {
    if (!activeGroup) return;
    const sure = window.confirm(
      `Tu veux vraiment supprimer "${activeGroup.name}" ? (et tous ses membres)`
    );
    if (!sure) return;

    const res = await fetch(`/api/groups/${activeGroup.id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      const remaining = groups.filter((g) => g.id !== activeGroup.id);
      setGroups(remaining);
      setSelectedGroupId(remaining.length ? remaining[0].id : null);
    } else {
      const txt = await res.text();
      console.error("Erreur suppression groupe:", res.status, txt);
    }
  }

  // ajouter membre
  async function addMember(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedGroupId) return;

    const res = await fetch("/api/members", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        groupId: selectedGroupId,
        fullName,
        role,
        characterId,
      }),
    });

    if (res.ok) {
      const createdMember: Member = await res.json();

      setGroups(
        groups.map((g) => {
          if (g.id === selectedGroupId) {
            return {
              ...g,
              members: [...g.members, createdMember].sort(sortMembers),
            };
          }
          return g;
        })
      );

      // reset form
      setFullName("");
      setRole("MEMBRE");
      setCharacterId("");
    } else {
      const txt = await res.text();
      console.error("Erreur ajout membre:", res.status, txt);
    }
  }

  // supprimer membre
  async function deleteMember(memberId: number) {
    const res = await fetch(`/api/members/${memberId}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setGroups(
        groups.map((g) => {
          if (g.id === selectedGroupId) {
            return {
              ...g,
              members: g.members.filter((m) => m.id !== memberId),
            };
          }
          return g;
        })
      );
    } else {
      const txt = await res.text();
      console.error("Erreur suppression membre:", res.status, txt);
    }
  }

  return (
    <div className="text-white space-y-10">
      {/* haut de page = sélection / résumé groupe */}
      <section className="bg-gray-800 rounded-xl shadow border border-gray-700 p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex-1 space-y-3">
            <div className="text-xs uppercase tracking-wide text-gray-400">
              Groupe sélectionné
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
              <select
                className="rounded-lg bg-gray-900 text-white px-3 py-2 text-sm border border-gray-700 outline-none min-w-[180px]"
                value={selectedGroupId ?? ""}
                onChange={(e) => {
                  const val = e.target.value;
                  setSelectedGroupId(val ? Number(val) : null);
                }}
              >
                {groups.length === 0 ? (
                  <option value="">Aucun groupe</option>
                ) : (
                  groups.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name}{" "}
                      {g.category === "GANG" ? "(Gang)" : "(Orga)"}
                    </option>
                  ))
                )}
              </select>

              {activeGroup && (
                <span
                  className={`inline-block text-[10px] font-semibold px-2 py-1 rounded border ${
                    activeGroup.category === "GANG"
                      ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/40"
                      : "bg-blue-500/10 text-blue-400 border-blue-500/40"
                  }`}
                >
                  {activeGroup.category === "GANG" ? "Gang" : "Orga"}
                </span>
              )}
            </div>

            {activeGroup && (
              <div className="text-xs text-gray-400">
                {activeGroup.members.length} membre
                {activeGroup.members.length > 1 ? "s" : ""}
              </div>
            )}
          </div>

          <div className="flex-none">
            {activeGroup && (
              <button
                onClick={deleteGroup}
                className="bg-red-600 hover:bg-red-500 text-white text-xs font-medium px-3 py-2 rounded-lg border border-red-400/30 shadow"
              >
                Supprimer ce groupe
              </button>
            )}
          </div>
        </div>
      </section>

      {/* grid 2 colonnes : create group / members gestion */}
      <section className="grid gap-6 md:grid-cols-2">
        {/* créer un nouveau groupe */}
        <div className="bg-gray-800 rounded-xl shadow border border-gray-700 p-6 space-y-4">
          <div className="text-sm font-semibold text-white">
            Créer un nouveau groupe
          </div>

          <form onSubmit={createGroup} className="space-y-4 text-sm">
            <div className="space-y-1">
              <label className="block text-xs text-gray-400">
                Nom du groupe
              </label>
              <input
                className="w-full rounded-lg bg-gray-900 text-white px-3 py-2 border border-gray-700 outline-none"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                placeholder="ex: LSPD, Ballas, EMS..."
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs text-gray-400">
                Catégorie
              </label>
              <select
                className="w-full rounded-lg bg-gray-900 text-white px-3 py-2 border border-gray-700 outline-none"
                value={newGroupCategory}
                onChange={(e) =>
                  setNewGroupCategory(e.target.value as "GANG" | "ORGA")
                }
              >
                <option value="GANG">Gang</option>
                <option value="ORGA">Orga</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-500 text-white font-medium rounded-lg py-2 text-sm"
            >
              Créer le groupe
            </button>
          </form>
        </div>

        {/* membres du groupe */}
        <div className="bg-gray-800 rounded-xl shadow border border-gray-700 p-6 space-y-6">
          <div className="text-sm font-semibold text-white">
            Membres du groupe
          </div>

          {!activeGroup ? (
            <p className="text-gray-400 text-xs">
              Sélectionne un groupe à gauche.
            </p>
          ) : (
            <>
              {activeGroup.members.length === 0 ? (
                <p className="text-gray-400 text-xs">
                  Aucun membre pour ce groupe.
                </p>
              ) : (
                <div className="max-h-64 overflow-y-auto rounded-lg border border-gray-700 bg-gray-900">
                  <table className="w-full text-xs text-gray-200">
                    <thead className="bg-gray-700 text-left text-[10px] uppercase text-gray-300 sticky top-0">
                      <tr>
                        <th className="px-3 py-2">Nom RP</th>
                        <th className="px-3 py-2">Rôle</th>
                        <th className="px-3 py-2">ID Perso</th>
                        <th className="px-3 py-2 w-12"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeGroup.members.map((m) => (
                        <tr
                          key={m.id}
                          className="border-t border-gray-700"
                        >
                          <td className="px-3 py-2">{m.fullName}</td>
                          <td className="px-3 py-2">
                            {m.role === "LEAD" ? (
                              <span className="inline-block rounded-full border border-yellow-500/40 bg-yellow-500/10 px-2 py-0.5 text-[10px] font-semibold text-yellow-400">
                                Lead
                              </span>
                            ) : (
                              <span className="inline-block rounded-full border border-blue-500/40 bg-blue-500/10 px-2 py-0.5 text-[10px] font-semibold text-blue-400">
                                Membre
                              </span>
                            )}
                          </td>
                          <td className="px-3 py-2 font-mono text-[11px] text-gray-300">
                            {m.characterId}
                          </td>
                          <td className="px-3 py-2 text-right">
                            <button
                              onClick={() => deleteMember(m.id)}
                              className="text-red-400 hover:text-red-300 text-[11px] font-medium"
                            >
                              Suppr
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* ajouter membre */}
              <div className="border-t border-gray-700 pt-4 text-sm">
                <div className="font-semibold text-white text-xs mb-2">
                  Ajouter un membre
                </div>

                <form
                  onSubmit={addMember}
                  className="grid gap-3 sm:grid-cols-2 text-xs"
                >
                  <div className="space-y-1 sm:col-span-2">
                    <label className="block text-[10px] text-gray-400">
                      Nom RP
                    </label>
                    <input
                      className="w-full rounded-lg bg-gray-900 text-white px-3 py-2 border border-gray-700 outline-none text-sm"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Prénom Nom"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] text-gray-400">
                      Rôle
                    </label>
                    <select
                      className="w-full rounded-lg bg-gray-900 text-white px-3 py-2 border border-gray-700 outline-none text-sm"
                      value={role}
                      onChange={(e) =>
                        setRole(e.target.value as "LEAD" | "MEMBRE")
                      }
                    >
                      <option value="LEAD">Lead</option>
                      <option value="MEMBRE">Membre</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] text-gray-400">
                      ID Perso
                    </label>
                    <input
                      className="w-full rounded-lg bg-gray-900 text-white px-3 py-2 border border-gray-700 outline-none text-sm"
                      value={characterId}
                      onChange={(e) => setCharacterId(e.target.value)}
                      placeholder="ex: 18294"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg py-2 text-sm"
                    >
                      Ajouter
                    </button>
                  </div>
                </form>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
