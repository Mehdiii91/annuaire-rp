"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push("/admin");
    } else {
      const data = await res.json();
      setError(data.error || "Erreur");
    }
  }

  return (
    <main className="min-h-screen bg-gray-950 flex items-center justify-center p-4 text-gray-100">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-gray-900 border border-gray-700 rounded-xl p-6 shadow-xl"
      >
        <h1 className="text-xl font-bold mb-4 text-center">
          Panel Admin – Connexion
        </h1>

        <label className="block text-sm font-medium mb-2">
          Mot de passe admin
        </label>
        <input
          type="password"
          className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-gray-100"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="********"
        />

        {error && (
          <p className="text-red-400 text-sm mt-2">{error}</p>
        )}

        <button
          type="submit"
          className="mt-4 w-full bg-blue-600 hover:bg-blue-500 font-semibold rounded-lg py-2 text-sm"
        >
          Se connecter
        </button>
      </form>
    </main>
  );
}
