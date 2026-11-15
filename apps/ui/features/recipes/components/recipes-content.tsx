import { BookOpen } from "lucide-react";
import type { RecipeResponseDto } from "@meal-mate/schemas";
import { RecipeList } from "@/features/recipes/components/recipe-list";

export function RecipesContent({ recipes }: { recipes: RecipeResponseDto[] }) {
  return recipes.length > 0 ? (
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
  );
}
