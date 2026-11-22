"use server";

import { addFavoriteRecipe } from "@/features/favorites/data/add-favorite-recipe";
import { removeFavoriteRecipe } from "@/features/favorites/data/remove-favorite-recipe";

export async function toggleFavoriteRecipe(
  recipeId: string,
  isFavorite: boolean,
): Promise<void> {
  if (isFavorite) {
    await removeFavoriteRecipe(recipeId);
    return;
  }

  await addFavoriteRecipe({ recipeId });
}
