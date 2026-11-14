import type { HouseholdRecipeWithRecipeResponseDto } from "@meal-mate/schemas";
import { apiClient } from "@/lib/api-client";

export async function getHouseholdRecipes(householdId: string): Promise<HouseholdRecipeWithRecipeResponseDto[]> {
  const response = await apiClient.fetch(`/household-recipes/${encodeURIComponent(householdId)}`);
  if (!response.ok) throw new Error(`Failed to fetch household recipes (${response.status}).`);
  return (await response.json()) as HouseholdRecipeWithRecipeResponseDto[];
}
