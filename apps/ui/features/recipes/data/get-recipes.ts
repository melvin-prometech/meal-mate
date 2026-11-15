"use server";

import type { RecipeResponseDto } from "@meal-mate/schemas";
import { authenticatedClient } from "@/lib/authenticated-client";

export async function getRecipes(): Promise<RecipeResponseDto[]> {
  const response = await authenticatedClient.fetch("/recipes", { cache: "no-store" });

  if (!response.ok) {
    throw new Error(`Failed to fetch recipes (${response.status}).`);
  }

  return (await response.json()) as RecipeResponseDto[];
}
