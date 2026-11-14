import type { HouseholdResponseDto } from "@meal-mate/schemas";
import { apiClient } from "@/lib/api-client";

export async function getHouseholds(): Promise<HouseholdResponseDto[]> {
  const response = await apiClient.fetch("/households");
  if (!response.ok) throw new Error(`Failed to fetch households (${response.status}).`);
  return (await response.json()) as HouseholdResponseDto[];
}
