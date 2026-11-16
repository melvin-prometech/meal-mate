import { authenticatedClient } from "@/lib/authenticated-client";

export async function removeFavoriteRecipe(
  recipeId: string,
): Promise<void> {
  const response = await authenticatedClient.fetch(
    `/users/me/favorite-recipes/${encodeURIComponent(recipeId)}`,
    { method: "DELETE" },
  );
  if (!response.ok) throw new Error(`Failed to remove favorite recipe (${response.status}).`);
}
