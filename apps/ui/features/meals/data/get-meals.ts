"use server";

import type { FindMealsDto, MealResponseDto } from "@meal-mate/schemas";
import { authenticatedClient } from "@/lib/authenticated-client";

export async function getMeals(
  householdId: string,
  range: FindMealsDto,
): Promise<MealResponseDto[]> {
  const params = new URLSearchParams();
  if (range.from) params.set("from", range.from);
  if (range.to) params.set("to", range.to);
  const query = params.size ? `?${params.toString()}` : "";
  const response = await authenticatedClient.fetch(
    `/households/${encodeURIComponent(householdId)}/meals${query}`,
  );
  if (!response.ok) throw new Error(`Failed to fetch meals (${response.status}).`);
  return (await response.json()) as MealResponseDto[];
}
