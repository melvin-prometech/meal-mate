import { Suspense } from "react";
import { requireAuth } from "@/features/auth/auth";
import { getFavoriteRecipes } from "@/features/favorites/data/get-favorite-recipes";
import { FavoritesContent } from "@/features/favorites/components/favorites-content";

export default function FavoritesPage() {
  return (
    <main className="mx-auto flex min-h-svh w-full max-w-8xl flex-col px-6 py-8 sm:px-10">
      <header className="mb-8 border-b border-border pb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Favorites</h1>
      </header>
      <Suspense fallback={<div className="min-h-72 flex-1" />}>
        <FavoritesData />
      </Suspense>
    </main>
  );
}

async function FavoritesData() {
  const { user } = await requireAuth();
  const recipes = await getFavoriteRecipes(user.id);

  return <FavoritesContent recipes={recipes} />;
}
