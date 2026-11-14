"use server";

import type { RecipeResponseDto } from "@meal-mate/schemas";
import { authenticatedClient } from "@/lib/authenticated-client";

export async function getFavoriteRecipes(userId: string): Promise<RecipeResponseDto[]> {
  const response = await authenticatedClient.fetch(
    `/users/${encodeURIComponent(userId)}/favorite-recipes`,
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch favorite recipes (${response.status}).`);
  }

  return (await response.json()) as RecipeResponseDto[];
}
