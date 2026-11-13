import { apiClient } from "@/lib/api-client";

export async function deleteMeal(householdId: string, mealId: string): Promise<void> {
  const response = await apiClient.fetch(
    `/households/${encodeURIComponent(householdId)}/meals/${encodeURIComponent(mealId)}`,
    { method: "DELETE" },
  );
  if (!response.ok) throw new Error(`Failed to delete meal (${response.status}).`);
}
