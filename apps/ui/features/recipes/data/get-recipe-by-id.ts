"use server";

import type { RecipeResponseDto } from "@meal-mate/schemas";
import { authenticatedClient } from "@/lib/authenticated-client";

export async function getRecipeById(recipeId: string): Promise<RecipeResponseDto> {
  const response = await authenticatedClient.fetch(`/recipes/${encodeURIComponent(recipeId)}`);
  if (!response.ok) throw new Error(`Failed to fetch recipe (${response.status}).`);
  return (await response.json()) as RecipeResponseDto;
}
