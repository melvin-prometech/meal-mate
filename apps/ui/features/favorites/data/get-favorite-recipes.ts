import type { RecipeResponseDto } from "@meal-mate/schemas";
import { apiClient } from "@/lib/api-client";

export async function getFavoriteRecipes(userId: string): Promise<RecipeResponseDto[]> {
  const response = await apiClient.fetch(
    `/users/${encodeURIComponent(userId)}/favorite-recipes`,
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch favorite recipes (${response.status}).`);
  }

  return (await response.json()) as RecipeResponseDto[];
}
