import { apiClient } from "@/lib/api-client";

export async function removeHouseholdRecipe(householdId: string, recipeId: string): Promise<void> {
  const response = await apiClient.fetch(
    `/household-recipes/${encodeURIComponent(householdId)}/${encodeURIComponent(recipeId)}`,
    { method: "DELETE" },
  );
  if (!response.ok) throw new Error(`Failed to remove household recipe (${response.status}).`);
}
