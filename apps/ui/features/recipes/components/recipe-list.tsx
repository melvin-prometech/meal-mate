"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { RecipeResponseDto } from "@meal-mate/schemas";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RecipeCard } from "@/features/recipes/components/recipe-card";
import { RecipeCardActions } from "@/features/recipes/components/recipe-card-actions";
import { toggleFavoriteRecipe } from "@/features/favorites/data/toggle-favorite-recipe";
import { getFavoriteRecipes } from "@/features/favorites/data/get-favorite-recipes";

type RecipeListProps = {
  recipes: RecipeResponseDto[];
  favoritesOnly?: boolean;
  emptyState?: ReactNode;
};

export function RecipeList({ recipes, favoritesOnly = false, emptyState }: RecipeListProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(() => new Set());
  const [favoritesLoaded, setFavoritesLoaded] = useState(false);
  const [favoriteRecipes, setFavoriteRecipes] = useState<RecipeResponseDto[]>([]);
  const [favoritesVersion, setFavoritesVersion] = useState(0);

  useEffect(() => {
    let cancelled = false;
    getFavoriteRecipes().then((favorites) => {
      if (cancelled) return;
      setFavoriteIds(new Set(favorites.map((recipe) => recipe.id)));
      setFavoriteRecipes(favorites);
      setFavoritesLoaded(true);
    });
    return () => { cancelled = true; };
  }, [pathname, favoritesOnly, favoritesVersion]);

  if (!favoritesLoaded) return <div className="min-h-72 flex-1" />;

  async function handleToggleFavorite(recipeId: string) {
    const wasFavorite = favoriteIds.has(recipeId);
    await toggleFavoriteRecipe(recipeId, wasFavorite);

    setFavoriteIds((current) => {
      const next = new Set(current);
      if (wasFavorite) next.delete(recipeId);
      else next.add(recipeId);
      return next;
    });
    if (favoritesOnly && wasFavorite) {
      setFavoriteRecipes((current) => current.filter((recipe) => recipe.id !== recipeId));
    }
    router.refresh();
  }

  const visibleRecipes = favoritesOnly ? favoriteRecipes : recipes;

  if (favoritesOnly && visibleRecipes.length === 0) return <>{emptyState}</>;

  return (
    <div className="flex flex-wrap items-start gap-6">
      {visibleRecipes.map((recipe) => (
        <div key={recipe.id} className="w-full max-w-sm">
          <RecipeCard
            recipe={recipe}
            actions={
              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label={favoriteIds.has(recipe.id) ? `Remove ${recipe.title} from favorites` : `Add ${recipe.title} to favorites`}
                  aria-pressed={favoriteIds.has(recipe.id)}
                  onClick={() => void handleToggleFavorite(recipe.id)}
                >
                  <Heart aria-hidden="true" className={favoriteIds.has(recipe.id) ? "size-6 fill-current text-red-600" : "size-6 text-foreground"} />
                </Button>
                <RecipeCardActions
                  recipeId={recipe.id}
                  recipeTitle={recipe.title}
                  onDeleted={() => {
                    setFavoritesLoaded(false);
                    setFavoritesVersion((version) => version + 1);
                  }}
                />
              </div>
            }
          />
        </div>
      ))}
    </div>
  );
}
