"use server";

import { authenticatedClient } from "@/lib/authenticated-client";

export async function deleteMeal(householdId: string, mealId: string): Promise<void> {
  const response = await authenticatedClient.fetch(
    `/households/${encodeURIComponent(householdId)}/meals/${encodeURIComponent(mealId)}`,
    { method: "DELETE" },
  );
  if (!response.ok) throw new Error(`Failed to delete meal (${response.status}).`);
}
