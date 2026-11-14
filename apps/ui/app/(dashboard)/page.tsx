import { BookOpen } from "lucide-react";
import { getRecipes } from "@/features/recipes/data/get-recipes";
import { RecipeList } from "@/features/recipes/components/recipe-list";

export default async function RecipesPage() {
  const recipes = await getRecipes();

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-8xl flex-col px-6 py-8 sm:px-10">
      <header className="mb-8 border-b border-border pb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Recipes</h1>
      </header>
      {recipes.length > 0 ? (
        <RecipeList recipes={recipes} />
      ) : (
        <section className="flex min-h-72 flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-border px-6 text-center">
          <span className="mb-4 flex size-11 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <BookOpen className="size-5" strokeWidth={1.7} />
          </span>
          <h2 className="text-sm font-medium">No recipes found</h2>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Browse household recipes from page.
          </p>
        </section>
      )}
    </main>
  );
}
