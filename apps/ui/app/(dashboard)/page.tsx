import { getRecipes } from "@/features/recipes/data/get-recipes";
import { RecipesContent } from "@/features/recipes/components/recipes-content";
import { requireAuth } from "@/features/auth/auth";
import { getFavoriteRecipes } from "@/features/favorites/data/get-favorite-recipes";

export default async function RecipesPage() {
  const [{ user }, recipes] = await Promise.all([requireAuth(), getRecipes()]);
  const favoriteRecipes = await getFavoriteRecipes(user.id);

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-8xl flex-col px-6 py-8 sm:px-10">
      <header className="mb-8 border-b border-border pb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Recipes</h1>
      </header>
      <RecipesContent
        recipes={recipes}
        favoriteRecipeIds={favoriteRecipes.map((recipe) => recipe.id)}
      />
    </main>
  );
}
