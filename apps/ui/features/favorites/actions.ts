"use server";

import { addFavoriteRecipe } from "@/features/favorites/data/add-favorite-recipe";
import { removeFavoriteRecipe } from "@/features/favorites/data/remove-favorite-recipe";

export async function addFavoriteRecipeAction(userId: string, recipeId: string): Promise<void> {
  await addFavoriteRecipe(userId, { recipeId });
}

export async function removeFavoriteRecipeAction(userId: string, recipeId: string): Promise<void> {
  await removeFavoriteRecipe(userId, recipeId);
}
