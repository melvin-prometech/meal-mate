import { getRecipes } from "@/features/recipes/data/get-recipes";
import { RecipesContent } from "@/features/recipes/components/recipes-content";
import { CreateRecipeDialog } from "@/features/recipes/components/create-recipe-dialog";

export default async function RecipesPage() {
  const recipes = await getRecipes();

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-8xl flex-col px-6 py-8 sm:px-10">
      <header className="mb-8 flex items-center justify-between border-b border-border pb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Recipes</h1>
        <CreateRecipeDialog />
      </header>
      <RecipesContent recipes={recipes} />
    </main>
  );
}
