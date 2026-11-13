import type { RecipeResponseDto } from "@meal-mate/schemas";
import { apiClient } from "@/lib/api-client";

export async function getRecipes(): Promise<RecipeResponseDto[]> {
  const response = await apiClient.fetch("/recipes");

  if (!response.ok) {
    throw new Error(`Failed to fetch recipes (${response.status}).`);
  }

  return (await response.json()) as RecipeResponseDto[];
}
