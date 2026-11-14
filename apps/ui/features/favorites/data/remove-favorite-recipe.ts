import { apiClient } from "@/lib/api-client";

export async function removeFavoriteRecipe(userId: string, recipeId: string): Promise<void> {
  const response = await apiClient.fetch(
    `/users/${encodeURIComponent(userId)}/favorite-recipes/${encodeURIComponent(recipeId)}`,
    { method: "DELETE" },
  );
  if (!response.ok) throw new Error(`Failed to remove favorite recipe (${response.status}).`);
}
