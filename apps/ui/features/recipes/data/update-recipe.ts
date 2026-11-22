"use server";

import type { CreateRecipeResponseDto, UpdateRecipeDto } from "@meal-mate/schemas";
import { authenticatedClient } from "@/lib/authenticated-client";

export async function updateRecipe(recipeId: string, data: UpdateRecipeDto): Promise<CreateRecipeResponseDto> {
  const response = await authenticatedClient.fetch(`/recipes/${encodeURIComponent(recipeId)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error(`Failed to update recipe (${response.status}).`);
  return (await response.json()) as CreateRecipeResponseDto;
}
