"use server";

import { addFavoriteRecipe } from "@/features/favorites/data/add-favorite-recipe";
import { removeFavoriteRecipe } from "@/features/favorites/data/remove-favorite-recipe";

export async function toggleFavoriteRecipe(
  userId: string,
  recipeId: string,
  isFavorite: boolean,
): Promise<void> {
  if (isFavorite) {
    await removeFavoriteRecipe(userId, recipeId);
    return;
  }

  await addFavoriteRecipe(userId, { recipeId });
}