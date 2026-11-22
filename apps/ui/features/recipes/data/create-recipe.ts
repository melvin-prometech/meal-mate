"use server";

import type { CreateRecipeDto, CreateRecipeResponseDto } from "@meal-mate/schemas";
import { authenticatedClient } from "@/lib/authenticated-client";

export async function createRecipe(data: CreateRecipeDto): Promise<CreateRecipeResponseDto> {
  const response = await authenticatedClient.fetch("/recipes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error(`Failed to create recipe (${response.status}).`);
  return (await response.json()) as CreateRecipeResponseDto;
}
