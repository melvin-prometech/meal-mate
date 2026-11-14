import type { MealResponseDto, UpdateMealDto } from "@meal-mate/schemas";
import { apiClient } from "@/lib/api-client";

export async function updateMeal(
  householdId: string,
  mealId: string,
  data: UpdateMealDto,
): Promise<MealResponseDto> {
  const response = await apiClient.fetch(
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
