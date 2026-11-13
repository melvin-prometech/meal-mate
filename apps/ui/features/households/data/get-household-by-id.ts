import type { HouseholdResponseDto } from "@meal-mate/schemas";
import { apiClient } from "@/lib/api-client";

export async function getHouseholdById(householdId: string): Promise<HouseholdResponseDto> {
  const response = await apiClient.fetch(`/households/${encodeURIComponent(householdId)}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch household (${response.status}).`);
  }

  return (await response.json()) as HouseholdResponseDto;
}
