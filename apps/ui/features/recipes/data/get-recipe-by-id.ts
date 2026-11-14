import type { RecipeResponseDto } from "@meal-mate/schemas";
import { apiClient } from "@/lib/api-client";

export async function getRecipeById(recipeId: string): Promise<RecipeResponseDto> {
  const response = await apiClient.fetch(`/recipes/${encodeURIComponent(recipeId)}`);
  if (!response.ok) throw new Error(`Failed to fetch recipe (${response.status}).`);
  return (await response.json()) as RecipeResponseDto;
}
