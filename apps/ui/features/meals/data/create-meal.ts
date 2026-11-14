import type { CreateMealDto, MealResponseDto } from "@meal-mate/schemas";
import { apiClient } from "@/lib/api-client";

export async function createMeal(householdId: string, data: CreateMealDto): Promise<MealResponseDto> {
  const response = await apiClient.fetch(`/households/${encodeURIComponent(householdId)}/meals`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error(`Failed to create meal (${response.status}).`);
  return (await response.json()) as MealResponseDto;
}
