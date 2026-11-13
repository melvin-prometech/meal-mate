import type { RecipeResponseDto } from "@meal-mate/schemas";
import { RecipeCard } from "@/features/recipes/recipe-card";

type RecipeListProps = {
  recipes: RecipeResponseDto[];
};

export function RecipeList({ recipes }: RecipeListProps) {
  return (
    <div className="flex flex-wrap items-start gap-6">
      {recipes.map((recipe) => (
        <div key={recipe.id} className="w-full max-w-sm">
          <RecipeCard recipe={recipe} />
        </div>
      ))}
    </div>
  );
}
