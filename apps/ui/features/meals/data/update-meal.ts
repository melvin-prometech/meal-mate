"use server";

import type { MealResponseDto, UpdateMealDto } from "@meal-mate/schemas";
import { authenticatedClient } from "@/lib/authenticated-client";

export async function updateMeal(
  householdId: string,
  mealId: string,
  data: UpdateMealDto,
): Promise<MealResponseDto> {
  const response = await authenticatedClient.fetch(
    `/households/${encodeURIComponent(householdId)}/meals/${encodeURIComponent(mealId)}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    },
  );
  if (!response.ok) throw new Error(`Failed to update meal (${response.status}).`);
  return (await response.json()) as MealResponseDto;
}
