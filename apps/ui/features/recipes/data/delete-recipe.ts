import { apiClient } from "@/lib/api-client";

export async function deleteRecipe(recipeId: string): Promise<void> {
  const response = await apiClient.fetch(`/recipes/${encodeURIComponent(recipeId)}`, { method: "DELETE" });
  if (!response.ok) throw new Error(`Failed to delete recipe (${response.status}).`);
}
