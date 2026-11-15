"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import type { RecipeResponseDto } from "@meal-mate/schemas";
import { RecipeCard } from "@/features/recipes/components/recipe-card";
import { toggleFavoriteRecipe } from "@/features/favorites/data/toggle-favorite-recipe";
import { getFavoriteRecipes } from "@/features/favorites/data/get-favorite-recipes";
import { useUser } from "@/features/users/components/user-provider";

type RecipeListProps = {
  recipes: RecipeResponseDto[];
  favoritesOnly?: boolean;
  emptyState?: ReactNode;
};

export function RecipeList({ recipes, favoritesOnly = false, emptyState }: RecipeListProps) {
  const { id: userId } = useUser();
  const pathname = usePathname();
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(() => new Set());
  const [favoritesLoaded, setFavoritesLoaded] = useState(false);
  const [favoriteRecipes, setFavoriteRecipes] = useState<RecipeResponseDto[]>([]);
  const [favoritesVersion, setFavoritesVersion] = useState(0);

  useEffect(() => {
    let cancelled = false;
    getFavoriteRecipes(userId).then((favorites) => {
      if (cancelled) return;
      setFavoriteIds(new Set(favorites.map((recipe) => recipe.id)));
      setFavoriteRecipes(favorites);
      setFavoritesLoaded(true);
    });
    return () => { cancelled = true; };
  }, [pathname, userId, favoritesOnly, favoritesVersion]);

  if (!favoritesLoaded) return <div className="min-h-72 flex-1" />;

  async function handleToggleFavorite(recipeId: string) {
    const wasFavorite = favoriteIds.has(recipeId);
    await toggleFavoriteRecipe(userId, recipeId, wasFavorite);

    setFavoriteIds((current) => {
      const next = new Set(current);
      if (wasFavorite) next.delete(recipeId);
      else next.add(recipeId);
      return next;
    });

  }

  const visibleRecipes = favoritesOnly ? favoriteRecipes : recipes;

  if (favoritesOnly && visibleRecipes.length === 0) return <>{emptyState}</>;

  return (
    <div className="flex flex-wrap items-start gap-6">
      {visibleRecipes.map((recipe) => (
        <div key={recipe.id} className="w-full max-w-sm">
          <RecipeCard
            recipe={recipe}
            isFavorite={favoriteIds.has(recipe.id)}
            onToggleFavorite={() => void handleToggleFavorite(recipe.id)}
            onDeleted={() => {
              setFavoritesLoaded(false);
              setFavoritesVersion((version) => version + 1);
            }}
          />
        </div>
      ))}
    </div>
  );
}
