import type { RecipeResponseDto } from "@meal-mate/schemas";
import { RecipeCard } from "@/features/recipes/components/recipe-card";

type RecipeListProps = {
  recipes: RecipeResponseDto[];
  favoriteRecipeIds?: Set<string>;
  allAreFavorites?: boolean;
};

export function RecipeList({ recipes, favoriteRecipeIds = new Set(), allAreFavorites = false }: RecipeListProps) {
  return (
    <div className="flex flex-wrap items-start gap-6">
      {recipes.map((recipe) => (
        <div key={recipe.id} className="w-full max-w-sm">
          <RecipeCard
            recipe={recipe}
            isFavorite={allAreFavorites || favoriteRecipeIds.has(recipe.id)}
            removeFromListWhenUnfavorited={allAreFavorites}
          />
        </div>
      ))}
    </div>
  );
}
