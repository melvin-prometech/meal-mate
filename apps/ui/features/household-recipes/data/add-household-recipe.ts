"use server";

import type { CreateHouseholdRecipeDto, HouseholdRecipeResponseDto } from "@meal-mate/schemas";
import { authenticatedClient } from "@/lib/authenticated-client";

export async function addHouseholdRecipe(
  householdId: string,
  data: CreateHouseholdRecipeDto,
): Promise<HouseholdRecipeResponseDto> {
  const response = await authenticatedClient.fetch(`/household-recipes/${encodeURIComponent(householdId)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error(`Failed to add household recipe (${response.status}).`);
  return (await response.json()) as HouseholdRecipeResponseDto;
}
