import { FavoritesContent } from "@/features/favorites/components/favorites-content";

export default function FavoritesPage() {
  return (
    <main className="mx-auto flex min-h-svh w-full max-w-8xl flex-col px-6 py-8 sm:px-10">
      <header className="mb-8 border-b border-border pb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Favorites</h1>
      </header>
      <FavoritesContent />
    </main>
  );
}
