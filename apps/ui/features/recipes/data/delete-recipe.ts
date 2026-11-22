"use server";

import { authenticatedClient } from "@/lib/authenticated-client";

export async function deleteRecipe(recipeId: string): Promise<void> {
  const response = await authenticatedClient.fetch(`/recipes/${encodeURIComponent(recipeId)}`, { method: "DELETE" });
  if (!response.ok) throw new Error(`Failed to delete recipe (${response.status}).`);
}
