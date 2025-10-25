export default function TopNav() {
  return (
    <header className="bg-gray-900 border-b border-gray-800 text-white">
      <div className="max-w-5xl mx-auto flex items-center justify-between p-4 text-sm">
        <a href="/" className="font-semibold text-white">
          Annuaire RP
        </a>

        <nav className="flex gap-4 text-gray-300">
          <a
            href="/"
            className="hover:text-white transition"
          >
            Accueil
          </a>

          <a
            href="/login"
            className="hover:text-white transition"
          >
            Admin / Connexion
          </a>
        </nav>
      </div>
    </header>
  );
}
