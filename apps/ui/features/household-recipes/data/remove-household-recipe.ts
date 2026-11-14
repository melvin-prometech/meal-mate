"use server";

import { authenticatedClient } from "@/lib/authenticated-client";

export async function removeHouseholdRecipe(householdId: string, recipeId: string): Promise<void> {
  const response = await authenticatedClient.fetch(
    `/household-recipes/${encodeURIComponent(householdId)}/${encodeURIComponent(recipeId)}`,
    { method: "DELETE" },
  );
  if (!response.ok) throw new Error(`Failed to remove household recipe (${response.status}).`);
}
