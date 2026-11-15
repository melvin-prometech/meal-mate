import type { CreateFavoriteRecipeDto } from "@meal-mate/schemas";
import { authenticatedClient } from "@/lib/authenticated-client";

export async function addFavoriteRecipe(
  userId: string,
  data: CreateFavoriteRecipeDto,
): Promise<void> {
  const response = await authenticatedClient.fetch(`/users/${encodeURIComponent(userId)}/favorite-recipes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error(`Failed to add favorite recipe (${response.status}).`);
}
