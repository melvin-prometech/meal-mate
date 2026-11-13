import type { RecipeResponseDto } from "@meal-mate/schemas";
import { RecipeCard } from "@/features/recipes/recipe-card";

type RecipeListProps = {
  recipes: RecipeResponseDto[];
};

export function RecipeList({ recipes }: RecipeListProps) {
  return (
    <div className="flex flex-wrap gap-6">
      {recipes.map((recipe) => (
        <div key={recipe.id} className="min-w-0 flex-[1_1_18rem]">
          <RecipeCard recipe={recipe} />
        </div>
      ))}
    </div>
  );
}
